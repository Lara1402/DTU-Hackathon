import React, { useState } from 'react';
import { 
  generateStandaloneHtml, 
  generateReactCode, 
  generateAstJson 
} from '../../utils/codeGenerators.js';
import { Copy, Check, Download, FileCode, Code, Braces } from 'lucide-react';

export default function CodeTab({ components, palette, projectName }) {
  const [format, setFormat] = useState('html'); // 'html' | 'react' | 'json'
  const [copied, setCopied] = useState(false);

  let codeContent = '';
  if (format === 'html') {
    codeContent = generateStandaloneHtml(components, palette, projectName);
  } else if (format === 'react') {
    codeContent = generateReactCode(components, palette, projectName);
  } else {
    codeContent = generateAstJson(components, palette, projectName);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="studio-tab-content">
      {/* Format Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="studio-segmented-control">
          <button
            type="button"
            className={`studio-segmented-btn ${format === 'html' ? 'active' : ''}`}
            onClick={() => setFormat('html')}
          >
            <FileCode size={13} />
            <span>HTML & CSS</span>
          </button>
          <button
            type="button"
            className={`studio-segmented-btn ${format === 'react' ? 'active' : ''}`}
            onClick={() => setFormat('react')}
          >
            <Code size={13} />
            <span>React JSX</span>
          </button>
          <button
            type="button"
            className={`studio-segmented-btn ${format === 'json' ? 'active' : ''}`}
            onClick={() => setFormat('json')}
          >
            <Braces size={13} />
            <span>AST Schema</span>
          </button>
        </div>

        <button
          type="button"
          className="studio-btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          onClick={handleCopy}
        >
          {copied ? <Check size={14} color="var(--studio-accent-emerald)" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div style={{
        background: '#07090e',
        border: '1px solid var(--studio-border)',
        borderRadius: 'var(--studio-radius-sm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid var(--studio-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--studio-text-dim)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>{format === 'html' ? 'index.html' : format === 'react' ? 'App.jsx' : 'schema.json'}</span>
          <span>{codeContent.split('\n').length} lines</span>
        </div>

        <pre style={{
          padding: '16px',
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: 1.55,
          color: '#cbd5e1',
          overflowX: 'auto',
          maxHeight: '520px'
        }}>
          <code>{codeContent}</code>
        </pre>
      </div>
    </div>
  );
}
