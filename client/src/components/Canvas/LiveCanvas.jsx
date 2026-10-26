import React from 'react';
import ComponentRenderer from './ComponentRenderer.jsx';
import { paletteToCssVars } from '../../state/palettes.js';
import { Smartphone, Tablet, Monitor, RefreshCw, ZoomIn, ZoomOut, PlusCircle } from 'lucide-react';

export default function LiveCanvas({
  components,
  palette,
  selectedId,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponent,
  viewport,
  zoom,
  onOpenNewProjectModal,
  isGenerating
}) {
  const cssVars = paletteToCssVars(palette);

  const handleCanvasClick = (e) => {
    // If clicking outside any selectable component, deselect
    if (e.target.closest('.studio-component-selectable') === null) {
      onSelectComponent(null);
    }
  };

  return (
    <div className="studio-center-canvas">
      {/* Canvas Top Status & Toolbar */}
      <div className="studio-canvas-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--studio-text)' }}>Canvas Viewport:</span>
          <span style={{ textTransform: 'capitalize' }}>{viewport}</span>
          <span>•</span>
          <span>{components.length} component{components.length === 1 ? '' : 's'}</span>
          <span>•</span>
          <span>Theme: {palette.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {selectedId && (
            <span style={{ color: 'var(--studio-primary)', fontWeight: 600 }}>
              Selected: #{selectedId}
            </span>
          )}
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div 
        className="studio-canvas-scroll-container" 
        onClick={handleCanvasClick}
      >
        <div
          className={`studio-viewport-frame ${viewport}`}
          style={{
            ...cssVars,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center'
          }}
        >
          {isGenerating && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 10, 15, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
                Gemma 4 is synthesizing your UI specification...
              </div>
              <div style={{ color: 'var(--studio-text-muted)', fontSize: '0.85rem' }}>
                Validating component AST and responsive design tokens
              </div>
            </div>
          )}

          {components.length === 0 ? (
            <div style={{
              padding: '120px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--studio-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlusCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Canvas is Ready</h3>
              <p style={{ maxWidth: '440px', color: 'var(--studio-text-muted)', fontSize: '0.95rem' }}>
                Enter an interface prompt in the left AI panel, pick inspiration references, or start with one of our curated templates.
              </p>
              <button
                className="studio-btn-primary"
                onClick={onOpenNewProjectModal}
              >
                Choose a Starter Template
              </button>
            </div>
          ) : (
            components.map((comp, index) => (
              <ComponentRenderer
                key={comp.id}
                component={comp}
                isSelected={comp.id === selectedId}
                onSelect={onSelectComponent}
                onDuplicate={onDuplicateComponent}
                onDelete={onDeleteComponent}
                onMoveUp={(id) => onMoveComponent(id, 'up')}
                onMoveDown={(id) => onMoveComponent(id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < components.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
