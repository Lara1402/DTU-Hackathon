import React from 'react';
import { PRESET_PALETTES } from '../../state/palettes.js';
import { Palette, Type, Sliders, Sparkles } from 'lucide-react';

const FONT_OPTIONS = [
  { label: 'Plus Jakarta Sans (Modern Clean)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Inter (High Legibility)', value: "'Inter', sans-serif" },
  { label: 'Outfit (Geometric Premium)', value: "'Outfit', sans-serif" },
  { label: 'JetBrains Mono (Developer)', value: "'JetBrains Mono', monospace" }
];

export default function DesignTab({ palette, onSelectPalette, onUpdateCustomColor }) {
  return (
    <div className="studio-tab-content">
      {/* 1. Preset Palettes Studio */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Palette size={16} color="var(--studio-primary)" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Color Palettes (12 Presets)
          </h3>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--studio-text-dim)', marginBottom: '14px' }}>
          Instantly switches CSS design tokens across the live preview without calling AI.
        </p>

        <div className="studio-palette-grid">
          {PRESET_PALETTES.map((preset) => {
            const isActive = preset.id === palette.id;
            return (
              <div
                key={preset.id}
                className={`studio-palette-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectPalette(preset)}
              >
                <div className="studio-palette-swatches">
                  <span className="studio-swatch-chip" style={{ background: preset.primary }} />
                  <span className="studio-swatch-chip" style={{ background: preset.secondary }} />
                  <span className="studio-swatch-chip" style={{ background: preset.accent }} />
                  <span className="studio-swatch-chip" style={{ background: preset.surface }} />
                  <span className="studio-swatch-chip" style={{ background: preset.background }} />
                </div>
                <div className="studio-palette-card-name">{preset.name}</div>
                <div className="studio-palette-card-desc">{preset.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Adjustments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sliders size={16} color="var(--studio-primary)" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Custom Theme Tokens
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { key: 'primary', label: 'Primary Brand' },
            { key: 'secondary', label: 'Secondary Tone' },
            { key: 'accent', label: 'Accent Highlight' },
            { key: 'background', label: 'Page Background' },
            { key: 'surface', label: 'Card Surface' },
            { key: 'text', label: 'Body Text' },
            { key: 'border', label: 'Border Line' }
          ].map(({ key, label }) => (
            <div key={key} className="studio-color-picker-row">
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--studio-text)' }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="studio-color-hex-text">{palette[key] || '#000000'}</span>
                <input
                  type="color"
                  className="studio-color-input"
                  value={palette[key] || '#000000'}
                  onChange={(e) => onUpdateCustomColor(key, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Global Geometry Tokens */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Type size={16} color="var(--studio-primary)" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Corner Radius Tokens
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['0px', '6px', '10px', '16px', '24px'].map((radiusVal) => (
            <button
              key={radiusVal}
              type="button"
              className={`studio-btn-secondary ${palette.radius === radiusVal ? 'active' : ''}`}
              style={{
                flex: 1,
                padding: '8px 0',
                justifyContent: 'center',
                borderColor: palette.radius === radiusVal ? 'var(--studio-primary)' : 'var(--studio-border)'
              }}
              onClick={() => onUpdateCustomColor('radius', radiusVal)}
            >
              {radiusVal}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
