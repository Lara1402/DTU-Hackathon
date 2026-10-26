import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ForgotPasswordModal from './ForgotPasswordModal.jsx';

export default function LoginPage({ onNavigateToSignup }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe
      });
      // On success, AuthContext state changes and App router will navigate to dashboard automatically
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 10%, #171b2d 0%, #090a0f 70%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(17, 20, 28, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--studio-border)',
        borderRadius: 'var(--studio-radius-lg)',
        boxShadow: 'var(--studio-shadow-lg)',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
            marginBottom: '16px'
          }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            MoodUI Studio
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--studio-text-muted)' }}>
            Imagine. Build. Refine. Debug.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--studio-radius-sm)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="studio-prop-group">
            <label className="studio-prop-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="studio-prop-input"
                style={{ width: '100%', paddingLeft: '38px' }}
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Mail size={16} color="var(--studio-text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="studio-prop-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="studio-prop-label">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--studio-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="studio-prop-input"
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <Lock size={16} color="var(--studio-text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--studio-text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--studio-text-muted)' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--studio-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
              Keep me signed in for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="studio-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--studio-text-muted)',
          paddingTop: '16px',
          borderTop: '1px solid var(--studio-border)'
        }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--studio-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Create an Account
          </button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}
