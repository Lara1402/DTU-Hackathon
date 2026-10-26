import React, { useState } from 'react';
import { History, X, RotateCcw, Plus, Calendar, Clock, Layers } from 'lucide-react';

export default function VersionModal({
  isOpen,
  onClose,
  versions = [],
  onSaveSnapshot,
  onRestoreVersion
}) {
  const [snapshotName, setSnapshotName] = useState('');

  if (!isOpen) return null;

  const handleCreateSnapshot = (e) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;
    onSaveSnapshot(snapshotName.trim());
    setSnapshotName('');
  };

  const handleRestore = (versionId) => {
    if (window.confirm('Restore this snapshot? Your current canvas will be updated to this version.')) {
      onRestoreVersion(versionId);
      onClose();
    }
  };

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="studio-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--studio-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Version Snapshots & History</h3>
          </div>
          <button className="studio-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="studio-modal-body">
          {/* Create new snapshot */}
          <form onSubmit={handleCreateSnapshot} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="studio-prop-input"
              style={{ flex: 1 }}
              placeholder="Name this snapshot (e.g. Revised Hero Section, Fixed Mobile Overflow)..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
            />
            <button
              type="submit"
              className="studio-btn-primary"
              disabled={!snapshotName.trim()}
            >
              <Plus size={14} />
              <span>Save Snapshot</span>
            </button>
          </form>

          {/* List of snapshots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {versions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--studio-text-muted)' }}>
                No versions saved yet. Enter a name above to create your first snapshot.
              </div>
            ) : (
              versions.map((ver, idx) => (
                <div
                  key={ver.id || idx}
                  style={{
                    background: 'var(--studio-surface)',
                    border: '1px solid var(--studio-border)',
                    borderRadius: 'var(--studio-radius-sm)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--studio-text)' }}>
                      {ver.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--studio-text-dim)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{ver.components?.length || 0} components</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="studio-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    onClick={() => handleRestore(ver.id)}
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                </div>
              ))
            )}
          </div>
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
