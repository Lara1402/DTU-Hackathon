import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');
    setStatus(null);

    try {
      const res = await forgotPassword(email.trim());
      setStatus(res);
    } catch (err) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="studio-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={18} color="var(--studio-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Reset Password</h3>
          </div>
          <button className="studio-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="studio-modal-body">
          {status ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '16px',
                borderRadius: 'var(--studio-radius-sm)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--studio-accent-emerald)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                display: 'flex',
                gap: '10px'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>Password Reset Initiated</div>
                  <div>{status.message}</div>
                </div>
              </div>

              {status.mockToken && (
                <div style={{
                  background: 'var(--studio-surface)',
                  border: '1px solid var(--studio-border)',
                  borderRadius: 'var(--studio-radius-sm)',
                  padding: '12px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--studio-text)', marginBottom: '4px' }}>
                    Local Recovery Reset Token:
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--studio-primary)',
                    wordBreak: 'break-all',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '4px'
                  }}>
                    {status.mockToken}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--studio-text-muted)', lineHeight: 1.5 }}>
                Enter the email address associated with your MoodUI Studio account and we will generate recovery instructions.
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--studio-radius-sm)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="studio-prop-group">
                <label className="studio-prop-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="studio-prop-input"
                    style={{ width: '100%', paddingLeft: '36px' }}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={16} color="var(--studio-text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="studio-btn-primary"
                style={{ justifyContent: 'center', marginTop: '6px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Send Recovery Instructions'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="studio-modal-footer">
          <button className="studio-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
