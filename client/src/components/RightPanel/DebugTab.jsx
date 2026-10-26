import React, { useState } from 'react';
import { 
  Bug, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Wrench, 
  Undo, 
  X, 
  Check, 
  ShieldAlert, 
  ArrowRight,
  Activity,
  FileCheck
} from 'lucide-react';

const COMMON_ISSUES = [
  "The page overflows horizontally on mobile screens",
  "The call-to-action button is unresponsive and missing destination",
  "Low contrast ratio between text and background",
  "Images lack descriptive alt text for accessibility",
  "Contact form has incomplete input field labels"
];

export default function DebugTab({
  components,
  palette,
  selectedId,
  activeRepair,
  onDiagnose,
  onApplyRepair,
  onRejectRepair,
  onUndoRepair,
  hasLastRepair,
  diagnosticsReport,
  onRunDiagnostics,
  isDiagnosing
}) {
  const [issueDescription, setIssueDescription] = useState('');
  const [errorContext, setErrorContext] = useState('');

  const handleDiagnoseSubmit = (e) => {
    e?.preventDefault();
    if (!issueDescription.trim()) return;
    onDiagnose(issueDescription.trim(), errorContext.trim());
  };

  return (
    <div className="studio-tab-content">
      {/* 1. Automated Diagnostic Suite */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--studio-accent-emerald)" />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Automated Check Suite
            </h3>
          </div>
          <button
            type="button"
            className="studio-btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={onRunDiagnostics}
          >
            <Play size={12} />
            <span>Run Checks</span>
          </button>
        </div>

        {diagnosticsReport ? (
          <div className="studio-debug-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--studio-accent-emerald)', fontWeight: 700 }}>
                  ✓ {diagnosticsReport.passedChecksCount} Passed
                </span>
                <span style={{ fontSize: '0.8rem', color: diagnosticsReport.totalIssues > 0 ? 'var(--studio-accent-rose)' : 'var(--studio-text-muted)', fontWeight: 700 }}>
                  ⚠ {diagnosticsReport.totalIssues} Issue{diagnosticsReport.totalIssues === 1 ? '' : 's'}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--studio-text-dim)' }}>
                {new Date(diagnosticsReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Issues list */}
            {diagnosticsReport.issues.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {diagnosticsReport.issues.map((iss) => (
                  <div
                    key={iss.id}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(244, 63, 94, 0.08)',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      borderRadius: 'var(--studio-radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fca5a5' }}>
                        {iss.title}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: iss.severity === 'high' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                        color: iss.severity === 'high' ? '#f87171' : '#fbbf24'
                      }}>
                        {iss.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--studio-text-muted)', lineHeight: 1.4 }}>
                      {iss.description}
                    </p>
                    <button
                      type="button"
                      className="studio-suggestion-chip"
                      style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                      onClick={() => setIssueDescription(`Fix issue: ${iss.title} in component ${iss.componentId || ''}`)}
                    >
                      Diagnose & Repair →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--studio-accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>All automated checks passed cleanly! Responsive and accessible.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="studio-debug-card" style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--studio-text-muted)' }}>
              Click "Run Checks" to audit mobile responsiveness, contrast ratios, missing image alts, and button destinations.
            </p>
          </div>
        )}
      </div>

      {/* 2. Issue Reporter & AI Diagnosis */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Bug size={16} color="var(--studio-accent-rose)" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Report Issue / Bug
          </h3>
        </div>

        {/* Common bug presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {COMMON_ISSUES.map((common, idx) => (
            <button
              key={idx}
              type="button"
              className="studio-suggestion-chip"
              onClick={() => setIssueDescription(common)}
            >
              {common}
            </button>
          ))}
        </div>

        <form onSubmit={handleDiagnoseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="studio-prop-group">
            <label className="studio-prop-label">Describe the Problem</label>
            <textarea
              className="studio-prop-input"
              rows={3}
              placeholder="e.g. The button in the hero section doesn't navigate anywhere, or the layout overflows on mobile..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="studio-btn-primary"
            style={{ justifyContent: 'center' }}
            disabled={!issueDescription.trim() || isDiagnosing}
          >
            <Wrench size={14} />
            <span>{isDiagnosing ? 'Diagnosing with Gemma...' : 'Diagnose & Propose Repair'}</span>
          </button>
        </form>
      </div>

      {/* 3. Proposed Repair Diff & Actions */}
      {activeRepair && (
        <div className="studio-debug-card" style={{ borderColor: 'var(--studio-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--studio-primary)' }}>
              Proposed Repair Plan
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8'
            }}>
              {activeRepair.severity || 'Medium'}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--studio-text)', marginBottom: '8px' }}>
            <strong>Suspected Cause:</strong> {activeRepair.suspectedCause}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--studio-text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
            {activeRepair.explanation}
          </div>

          {/* Diff Viewer */}
          {activeRepair.proposedRepair && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--studio-text-muted)', marginBottom: '6px' }}>
                AST Modification Diff (Target: {activeRepair.proposedRepair.targetId}):
              </div>
              <div className="studio-diff-container">
                <span className="studio-diff-line-removed">
                  - Before: {JSON.stringify(activeRepair.proposedRepair.before, null, 2)}
                </span>
                <span className="studio-diff-line-added">
                  + After:  {JSON.stringify(activeRepair.proposedRepair.after, null, 2)}
                </span>
              </div>
            </div>
          )}

          {/* Apply / Reject Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="studio-btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => onApplyRepair(activeRepair)}
            >
              <Check size={14} />
              <span>Apply Fix</span>
            </button>
            <button
              type="button"
              className="studio-btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onRejectRepair}
            >
              <X size={14} />
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}

      {/* Undo Last Repair Action */}
      {hasLastRepair && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="studio-btn-secondary"
            onClick={onUndoRepair}
          >
            <Undo size={14} />
            <span>Undo Last Repair</span>
          </button>
        </div>
      )}
    </div>
  );
}
