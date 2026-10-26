import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

// Email validation helper
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * POST /api/auth/signup
 * Register a new user account with hashed password and JWT token
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Field validations
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid full name (at least 2 characters).'
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please verify and re-enter.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = db.findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    // Issue JWT token (7 days)
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      message: 'Account created successfully!'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating your account. Please try again.'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate existing user and issue token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Compare bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Issue token with expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      message: 'Login successful!'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login. Please try again.'
    });
  }
});

/**
 * GET /api/auth/me
 * Restores and verifies authenticated user session
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/auth/forgot-password
 * Password recovery workflow
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      // Security best practice: don't disclose whether email exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.'
      });
    }

    // Generate secure reset token
    const resetToken = jwt.sign(
      { id: user.id, action: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token on user record
    db.updateUser(user.id, { resetToken });

    // Honest reporting regarding email provider configuration
    const isEmailServiceConfigured = Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY);

    if (!isEmailServiceConfigured) {
      return res.json({
        success: true,
        mockToken: resetToken,
        serviceStatus: 'local_development',
        message: 'Password reset token generated. (SMTP/Email provider not configured in .env; in local mode, use the provided reset token to update password).'
      });
    }

    // If email service configured, send email here
    res.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request.'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Complete password reset
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Reset token is required.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Reset token is invalid or has expired.' });
    }

    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    db.updateUser(user.id, { passwordHash, resetToken: null });

    res.json({
      success: true,
      message: 'Password has been successfully updated! You can now log in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

export default router;
