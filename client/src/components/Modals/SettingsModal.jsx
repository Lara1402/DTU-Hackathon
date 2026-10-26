import React, { useState } from 'react';
import { Settings, X, Check, Server, Key, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'gemma-2-9b-it');
  const [localMode, setLocalMode] = useState(settings.localMode || false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({
          ok: true,
          message: `Backend Connected! AI Mode: ${data.aiConfigured ? 'Gemma / Google AI Configured' : 'Local High-Fidelity Synthesis'}`
        });
      } else {
        setHealthStatus({ ok: false, message: `Server returned HTTP ${res.status}` });
      }
    } catch (e) {
      setHealthStatus({ ok: false, message: `Connection failed: ${e.message}` });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      apiKey,
      model,
      localMode
    });
    onClose();
  };

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="studio-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--studio-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Studio & AI Configuration</h3>
          </div>
          <button className="studio-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="studio-modal-body">
          {/* Server Connection Check */}
          <div style={{
            background: 'var(--studio-surface)',
            border: '1px solid var(--studio-border)',
            borderRadius: 'var(--studio-radius-sm)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={18} color="var(--studio-accent-emerald)" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Backend API Service</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--studio-text-dim)' }}>http://localhost:3001/api</div>
              </div>
            </div>
            <button
              type="button"
              className="studio-btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={handleTestConnection}
              disabled={isCheckingHealth}
            >
              {isCheckingHealth ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {healthStatus && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--studio-radius-sm)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: healthStatus.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${healthStatus.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              color: healthStatus.ok ? 'var(--studio-accent-emerald)' : '#fca5a5'
            }}>
              {healthStatus.ok ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
              <span>{healthStatus.message}</span>
            </div>
          )}

          {/* Model Selector */}
          <div className="studio-prop-group">
            <label className="studio-prop-label">Primary AI Model</label>
            <select
              className="studio-prop-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gemma-2-9b-it">Google Gemma 4 (gemma-2-9b-it)</option>
              <option value="gemma-2-27b-it">Google Gemma 4 (gemma-2-27b-it)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>

          {/* Local Mode Toggle */}
          <div style={{
            background: 'var(--studio-surface)',
            border: '1px solid var(--studio-border)',
            borderRadius: 'var(--studio-radius-sm)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Local High-Fidelity Engine Mode</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--studio-text-dim)', maxWidth: '380px' }}>
                When enabled or when API credentials are unset, MoodUI runs entirely offline with local AST rule synthesis and automated diagnostics.
              </div>
            </div>
            <input
              type="checkbox"
              checked={localMode}
              onChange={(e) => setLocalMode(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--studio-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="studio-modal-footer">
          <button className="studio-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="studio-btn-primary" onClick={handleSave}>
            <Check size={14} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
