import React, { useState } from 'react';
import { 
  exportReactProjectZip, 
  downloadStandaloneHtmlFile 
} from '../../utils/exportZip.js';
import { 
  generateStandaloneHtml, 
  generateReactCode 
} from '../../utils/codeGenerators.js';
import { X, Download, FileCode, Code, Check, PackageCheck } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, components, palette, projectName }) {
  const [copiedType, setCopiedType] = useState(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  if (!isOpen) return null;

  const handleDownloadHtml = () => {
    downloadStandaloneHtmlFile(components, palette, projectName);
  };

  const handleDownloadReactZip = async () => {
    try {
      setIsExportingZip(true);
      await exportReactProjectZip(components, palette, projectName);
    } catch (err) {
      console.error('Failed to export zip:', err);
      alert('Failed to generate zip file: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCopyHtml = () => {
    const html = generateStandaloneHtml(components, palette, projectName);
    navigator.clipboard.writeText(html);
    setCopiedType('html');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyReact = () => {
    const code = generateReactCode(components, palette, projectName);
    navigator.clipboard.writeText(code);
    setCopiedType('react');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="studio-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} color="var(--studio-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Export Project</h3>
          </div>
          <button className="studio-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="studio-modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--studio-text-muted)', lineHeight: 1.5 }}>
            Export your current design as production-ready code. No lock-in — run locally or deploy to any hosting provider.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Option 1: Standalone HTML & CSS */}
            <div style={{
              background: 'var(--studio-surface)',
              border: '1px solid var(--studio-border)',
              borderRadius: 'var(--studio-radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileCode size={22} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Standalone HTML + CSS</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--studio-text-dim)', lineHeight: 1.4, flex: 1 }}>
                Single self-contained `.html` file with embedded responsive CSS variables and Lucide icons. Opens in any browser.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="studio-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleDownloadHtml}
                >
                  <Download size={13} />
                  <span>Download .html</span>
                </button>
                <button
                  type="button"
                  className="studio-btn-secondary"
                  onClick={handleCopyHtml}
                  title="Copy HTML to clipboard"
                >
                  {copiedType === 'html' ? <Check size={14} color="var(--studio-accent-emerald)" /> : 'Copy'}
                </button>
              </div>
            </div>

            {/* Option 2: Full React Project ZIP */}
            <div style={{
              background: 'var(--studio-surface)',
              border: '1px solid var(--studio-border)',
              borderRadius: 'var(--studio-radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PackageCheck size={22} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>React + Vite Project (ZIP)</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--studio-text-dim)', lineHeight: 1.4, flex: 1 }}>
                Complete runnable project bundle including `package.json`, `index.html`, `src/App.jsx`, Lucide icons, and setup instructions.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="studio-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleDownloadReactZip}
                  disabled={isExportingZip}
                >
                  <Download size={13} />
                  <span>{isExportingZip ? 'Packaging...' : 'Download .zip'}</span>
                </button>
                <button
                  type="button"
                  className="studio-btn-secondary"
                  onClick={handleCopyReact}
                  title="Copy React JSX to clipboard"
                >
                  {copiedType === 'react' ? <Check size={14} color="var(--studio-accent-emerald)" /> : 'Copy'}
                </button>
              </div>
            </div>
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
