import React from 'react';
import { 
  Sparkles, 
  Undo2, 
  Redo2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Settings, 
  History, 
  Plus, 
  Check, 
  Loader2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function TopNav({
  projectName,
  onRenameProject,
  undo,
  redo,
  canUndo,
  canRedo,
  viewport,
  onChangeViewport,
  zoom,
  onChangeZoom,
  saveStatus,
  onOpenExportModal,
  onOpenSettingsModal,
  onOpenVersionModal,
  onOpenNewProjectModal,
  aiStatus
}) {
  return (
    <header className="studio-top-nav">
      {/* Brand & Project Name */}
      <div className="studio-brand-group">
        <div className="studio-logo-icon">
          <Sparkles size={18} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="studio-brand-title">MoodUI Studio</span>
            <span className="studio-brand-tagline">Imagine. Build. Refine. Debug.</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--studio-border)', margin: '0 4px' }} />

        <input
          type="text"
          className="studio-project-name-input"
          value={projectName}
          onChange={(e) => onRenameProject(e.target.value)}
          title="Click to rename project"
        />

        <button
          className="studio-icon-btn"
          title="Create New Project"
          onClick={onOpenNewProjectModal}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Center Controls: Undo/Redo & Viewport Switcher */}
      <div className="studio-nav-center">
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="studio-icon-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Undo recent action (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="studio-icon-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Redo recent action (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--studio-border)', margin: '0 6px' }} />

        {/* Viewport switch: Desktop, Tablet, Mobile */}
        <div className="studio-segmented-control">
          <button
            className={`studio-segmented-btn ${viewport === 'desktop' ? 'active' : ''}`}
            onClick={() => onChangeViewport('desktop')}
            title="Desktop Viewport (1200px)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            className={`studio-segmented-btn ${viewport === 'tablet' ? 'active' : ''}`}
            onClick={() => onChangeViewport('tablet')}
            title="Tablet Viewport (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            className={`studio-segmented-btn ${viewport === 'mobile' ? 'active' : ''}`}
            onClick={() => onChangeViewport('mobile')}
            title="Mobile Viewport (375px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
          <button
            className="studio-icon-btn"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onChangeZoom(Math.max(0.5, zoom - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: '0.78rem', color: 'var(--studio-text-muted)', minWidth: '42px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="studio-icon-btn"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onChangeZoom(Math.min(1.5, zoom + 0.1))}
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Right Actions: Save Status, Version History, Export, Settings */}
      <div className="studio-nav-actions">
        {saveStatus === 'saving' ? (
          <div className="studio-status-chip saving">
            <Loader2 size={12} className="animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="studio-status-chip">
            <Check size={12} />
            <span>Saved Locally</span>
          </div>
        )}

        <button
          className="studio-btn-secondary"
          onClick={onOpenVersionModal}
          title="View Version History & Snapshots"
        >
          <History size={15} />
          <span>History</span>
        </button>

        <button
          className="studio-btn-primary"
          onClick={onOpenExportModal}
          title="Export Standalone HTML/CSS or React Project ZIP"
        >
          <Download size={15} />
          <span>Export</span>
        </button>

        <button
          className="studio-icon-btn"
          onClick={onOpenSettingsModal}
          title="Studio & Gemma Model Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
