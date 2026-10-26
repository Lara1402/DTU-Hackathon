import React from 'react';
import { MousePointerClick, Copy, Trash2, ArrowUp, ArrowDown, Sliders, Type, Layout } from 'lucide-react';

export default function PropertiesTab({
  selectedComponent,
  onUpdateComponent,
  onDuplicateComponent,
  onDeleteComponent,
  onMoveComponent,
  canMoveUp,
  canMoveDown
}) {
  if (!selectedComponent) {
    return (
      <div className="studio-tab-content" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          color: 'var(--studio-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <MousePointerClick size={28} />
        </div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>No Component Selected</h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--studio-text-muted)', lineHeight: 1.5, maxWidth: '280px' }}>
          Click on any component inside the live canvas to inspect and edit its properties, typography, colors, and layout directly.
        </p>
      </div>
    );
  }

  const { id, type, props = {}, style = {} } = selectedComponent;

  const handlePropChange = (key, val) => {
    onUpdateComponent(id, { props: { [key]: val } });
  };

  const handleStyleChange = (key, val) => {
    onUpdateComponent(id, { style: { [key]: val } });
  };

  return (
    <div className="studio-tab-content">
      {/* Component Header & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--studio-border)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--studio-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Component #{id}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'capitalize' }}>
            {type} Section
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="studio-icon-btn"
            title="Duplicate Component"
            onClick={() => onDuplicateComponent(id)}
          >
            <Copy size={14} />
          </button>
          <button
            className="studio-icon-btn"
            title="Delete Component"
            onClick={() => onDeleteComponent(id)}
          >
            <Trash2 size={14} color="var(--studio-accent-rose)" />
          </button>
        </div>
      </div>

      {/* Reorder Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="studio-btn-secondary"
          style={{ flex: 1, justifyContent: 'center' }}
          disabled={!canMoveUp}
          onClick={() => onMoveComponent(id, 'up')}
        >
          <ArrowUp size={14} />
          <span>Move Up</span>
        </button>
        <button
          className="studio-btn-secondary"
          style={{ flex: 1, justifyContent: 'center' }}
          disabled={!canMoveDown}
          onClick={() => onMoveComponent(id, 'down')}
        >
          <ArrowDown size={14} />
          <span>Move Down</span>
        </button>
      </div>

      {/* Content Properties */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Type size={15} color="var(--studio-primary)" />
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Content & Labels
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {props.brand !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Brand Name</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.brand || ''}
                onChange={(e) => handlePropChange('brand', e.target.value)}
              />
            </div>
          )}

          {props.badge !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Badge Label</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.badge || ''}
                onChange={(e) => handlePropChange('badge', e.target.value)}
              />
            </div>
          )}

          {props.title !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Headline / Title</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
              />
            </div>
          )}

          {props.subtitle !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Subtitle Description</label>
              <textarea
                className="studio-prop-input"
                rows={3}
                value={props.subtitle || ''}
                onChange={(e) => handlePropChange('subtitle', e.target.value)}
              />
            </div>
          )}

          {props.primaryBtnText !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Primary Button Label</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.primaryBtnText || ''}
                onChange={(e) => handlePropChange('primaryBtnText', e.target.value)}
              />
            </div>
          )}

          {props.primaryBtnHref !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Primary Button Destination (href)</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.primaryBtnHref || ''}
                onChange={(e) => handlePropChange('primaryBtnHref', e.target.value)}
              />
            </div>
          )}

          {props.imageUrl !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Image URL</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.imageUrl || ''}
                onChange={(e) => handlePropChange('imageUrl', e.target.value)}
              />
            </div>
          )}

          {props.imageAlt !== undefined && (
            <div className="studio-prop-group">
              <label className="studio-prop-label">Image Alt Text (Accessibility)</label>
              <input
                type="text"
                className="studio-prop-input"
                value={props.imageAlt || ''}
                onChange={(e) => handlePropChange('imageAlt', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Styling & Layout Properties */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Layout size={15} color="var(--studio-primary)" />
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Styling & Spacing
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="studio-prop-group">
            <label className="studio-prop-label">Padding Spacing</label>
            <select
              className="studio-prop-select"
              value={style.padding || '80px 24px'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
            >
              <option value="40px 16px">Compact (40px)</option>
              <option value="64px 24px">Comfortable (64px)</option>
              <option value="80px 24px">Standard (80px)</option>
              <option value="110px 24px">Spacious (110px)</option>
            </select>
          </div>

          <div className="studio-prop-group">
            <label className="studio-prop-label">Text Alignment</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  type="button"
                  className={`studio-btn-secondary ${style.textAlign === align ? 'active' : ''}`}
                  style={{
                    flex: 1,
                    textTransform: 'capitalize',
                    justifyContent: 'center',
                    padding: '6px 0',
                    borderColor: style.textAlign === align ? 'var(--studio-primary)' : 'var(--studio-border)'
                  }}
                  onClick={() => handleStyleChange('textAlign', align)}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
