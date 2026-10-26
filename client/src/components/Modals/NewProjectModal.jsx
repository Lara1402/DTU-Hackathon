import React from 'react';
import { X, Sparkles, Code2, GraduationCap, Zap, PlusCircle } from 'lucide-react';

const STARTER_PREVIEWS = [
  {
    key: 'portfolio',
    title: 'Developer Portfolio',
    description: 'Personal brand showcase, projects grid, recommendations, and contact form in dark professional aesthetic.',
    icon: Code2,
    badge: 'Popular for Engineers',
    palette: 'dark-professional'
  },
  {
    key: 'learning',
    title: 'EdTech Learning Platform',
    description: 'Online academy with hero registration, curriculum feature cards, course catalog, and pricing tiers in ocean blue.',
    icon: GraduationCap,
    badge: 'Education & Courses',
    palette: 'ocean-blue'
  },
  {
    key: 'saas',
    title: 'Modern SaaS Platform',
    description: 'High-converting product landing page with telemetry highlights, features grid, and neon purple gradients.',
    icon: Zap,
    badge: 'High Conversion',
    palette: 'purple-gradient'
  },
  {
    key: 'blank',
    title: 'Blank Canvas',
    description: 'Start with an empty workspace and build from scratch using natural-language AI prompts or visual components.',
    icon: PlusCircle,
    badge: 'Custom',
    palette: 'minimal-neutral'
  }
];

export default function NewProjectModal({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="studio-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--studio-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Start a New Project</h3>
          </div>
          <button className="studio-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="studio-modal-body">
          <p style={{ fontSize: '0.82rem', color: 'var(--studio-text-muted)' }}>
            Choose a starting layout template or begin with a clean slate. You can customize all colors, components, and content.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {STARTER_PREVIEWS.map((tpl) => {
              const IconComp = tpl.icon;
              return (
                <div
                  key={tpl.key}
                  style={{
                    background: 'var(--studio-surface)',
                    border: '1px solid var(--studio-border)',
                    borderRadius: 'var(--studio-radius-md)',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--studio-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--studio-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => {
                    onSelectTemplate(tpl.key);
                    onClose();
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--studio-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={18} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--studio-primary)' }}>
                      {tpl.badge}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{tpl.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--studio-text-dim)', lineHeight: 1.4, flex: 1 }}>
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="studio-modal-footer">
          <button className="studio-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
