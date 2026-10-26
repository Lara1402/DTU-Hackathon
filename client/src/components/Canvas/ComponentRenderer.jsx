import React from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  Code2, 
  Cpu, 
  Layers, 
  GraduationCap, 
  Terminal, 
  Users, 
  Zap, 
  ShieldCheck, 
  FileCode,
  ArrowRight,
  ExternalLink,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// Dynamic icon mapper for feature icons
const ICON_MAP = {
  Code2,
  Cpu,
  Sparkles,
  Layers,
  GraduationCap,
  Terminal,
  Users,
  Zap,
  ShieldCheck,
  FileCode
};

export default function ComponentRenderer({ 
  component, 
  isSelected, 
  onSelect, 
  onDuplicate, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  canMoveUp,
  canMoveDown 
}) {
  const props = component.props || {};
  const style = component.style || {};

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const renderActionBar = () => {
    if (!isSelected) return null;
    return (
      <div className="studio-floating-actions-bar" onClick={(e) => e.stopPropagation()}>
        <button 
          className="studio-mini-action-btn" 
          title="Move Up" 
          disabled={!canMoveUp} 
          onClick={() => onMoveUp(component.id)}
        >
          <ChevronUp size={14} />
        </button>
        <button 
          className="studio-mini-action-btn" 
          title="Move Down" 
          disabled={!canMoveDown} 
          onClick={() => onMoveDown(component.id)}
        >
          <ChevronDown size={14} />
        </button>
        <button 
          className="studio-mini-action-btn" 
          title="Duplicate Component" 
          onClick={() => onDuplicate(component.id)}
        >
          <Copy size={13} />
        </button>
        <button 
          className="studio-mini-action-btn delete" 
          title="Delete Component" 
          onClick={() => onDelete(component.id)}
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  };

  const renderSelectionBadge = () => {
    if (!isSelected) return null;
    return (
      <div className="studio-selection-badge">
        <Sparkles size={11} />
        {component.type} #{component.id}
      </div>
    );
  };

  const wrapElement = (content, defaultStyles = {}) => {
    return (
      <div
        id={component.id}
        className={`studio-component-selectable ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        style={{
          position: 'relative',
          ...defaultStyles,
          ...style
        }}
      >
        {renderSelectionBadge()}
        {renderActionBar()}
        {content}
      </div>
    );
  };

  switch (component.type) {
    case 'navbar':
      return wrapElement(
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: style.padding || '16px 32px',
          borderBottom: '1px solid var(--theme-border)',
          backgroundColor: style.backgroundColor || 'var(--theme-background)',
          position: props.isSticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 30,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--theme-text)' }}>
              {props.brand || 'MoodUI Brand'}
            </span>
            {props.brandRole && (
              <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', fontWeight: 500 }}>
                {props.brandRole}
              </span>
            )}
          </div>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {(props.links || []).map((link, idx) => (
              <a
                key={idx}
                href={link.href || '#'}
                onClick={(e) => e.preventDefault()}
                style={{
                  color: 'var(--theme-text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 500
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {props.ctaLabel && (
            <button
              style={{
                padding: '9px 20px',
                backgroundColor: 'var(--theme-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--theme-radius)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {props.ctaLabel}
            </button>
          )}
        </header>
      );

    case 'hero':
      return wrapElement(
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: style.padding || '80px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: props.imageUrl ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: style.textAlign || 'left' }}>
              {props.badge && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid var(--theme-border)',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--theme-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '20px'
                }}>
                  <Sparkles size={13} />
                  {props.badge}
                </div>
              )}
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: style.color || 'var(--theme-text)',
                marginBottom: '20px'
              }}>
                {props.title || 'Imagine. Build. Refine. Debug.'}
              </h1>
              <p style={{
                fontSize: '1.15rem',
                color: 'var(--theme-text-muted)',
                lineHeight: 1.65,
                marginBottom: '32px'
              }}>
                {props.subtitle || 'Create robust interfaces with seamless multimodal guidance and continuous debugging.'}
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {props.primaryBtnText && (
                  <button style={{
                    padding: '13px 28px',
                    backgroundColor: 'var(--theme-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--theme-radius)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}>
                    {props.primaryBtnText}
                    <ArrowRight size={16} />
                  </button>
                )}
                {props.secondaryBtnText && (
                  <button style={{
                    padding: '13px 26px',
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}>
                    {props.secondaryBtnText}
                  </button>
                )}
              </div>
            </div>

            {props.imageUrl && (
              <div>
                <img
                  src={props.imageUrl}
                  alt={props.imageAlt || 'Hero visualization'}
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    borderRadius: 'calc(var(--theme-radius) * 1.5)',
                    border: '1px solid var(--theme-border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );

    case 'features':
      return wrapElement(
        <div style={{
          backgroundColor: style.backgroundColor || 'var(--theme-surface)',
          padding: style.padding || '72px 24px',
          borderTop: '1px solid var(--theme-border)',
          borderBottom: '1px solid var(--theme-border)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              {props.badge && (
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--theme-primary)',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  {props.badge}
                </div>
              )}
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '12px' }}>
                {props.title || 'Platform Capabilities'}
              </h2>
              <p style={{ color: 'var(--theme-text-muted)', fontSize: '1.05rem' }}>
                {props.subtitle}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px'
            }}>
              {(props.items || []).map((item, idx) => {
                const IconComponent = ICON_MAP[item.icon] || CheckCircle;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--theme-background)',
                      border: '1px solid var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      padding: '30px',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--theme-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                      <IconComponent size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

    case 'card-grid':
      return wrapElement(
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: style.padding || '72px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            {props.badge && (
              <div style={{
                display: 'inline-block',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--theme-primary)',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}>
                {props.badge}
              </div>
            )}
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '12px' }}>
              {props.title || 'Featured Grid'}
            </h2>
            <p style={{ color: 'var(--theme-text-muted)', fontSize: '1.05rem' }}>
              {props.subtitle}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
            gap: '32px'
          }}>
            {(props.cards || []).map((card, idx) => (
              <div
                key={card.id || idx}
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {card.badge && (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--theme-primary)',
                      textTransform: 'uppercase',
                      marginBottom: '8px'
                    }}>
                      {card.badge}
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.92rem', marginBottom: '20px', flex: 1 }}>
                    {card.description}
                  </p>
                  {card.linkText && (
                    <a
                      href={card.linkHref || '#'}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        color: 'var(--theme-primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: 'auto'
                      }}
                    >
                      {card.linkText}
                      <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonials':
      return wrapElement(
        <div style={{
          backgroundColor: style.backgroundColor || 'var(--theme-surface)',
          padding: style.padding || '72px 24px',
          borderTop: '1px solid var(--theme-border)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{props.title || 'Client Testimonials'}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              {(props.items || []).map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--theme-background)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    padding: '32px'
                  }}
                >
                  <p style={{ fontStyle: 'italic', color: 'var(--theme-text)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    “{t.quote}”
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {t.avatarUrl && (
                      <img
                        src={t.avatarUrl}
                        alt={t.author}
                        style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.author}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'cta':
      return wrapElement(
        <div style={{
          padding: style.padding || '80px 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--theme-surface) 0%, var(--theme-background) 100%)',
          borderTop: '1px solid var(--theme-border)'
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {props.badge && (
              <div style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--theme-primary)',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                {props.badge}
              </div>
            )}
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              {props.title || 'Start Building Today'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--theme-text-muted)', marginBottom: '32px' }}>
              {props.subtitle || 'Experience the future of intelligent UI development.'}
            </p>
            {props.btnText && (
              <button style={{
                padding: '14px 36px',
                backgroundColor: 'var(--theme-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--theme-radius)',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              }}>
                {props.btnText}
              </button>
            )}
          </div>
        </div>
      );

    case 'form':
      return wrapElement(
        <div style={{ maxWidth: style.maxWidth || '640px', margin: style.margin || '0 auto', padding: style.padding || '72px 24px' }}>
          <div style={{
            backgroundColor: 'var(--theme-surface)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--theme-radius)',
            padding: '36px'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              {props.title || 'Get in Touch'}
            </h2>
            <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              {props.subtitle}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              {(props.fields || []).map((f, idx) => (
                <div key={idx} style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      placeholder={f.placeholder}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'var(--theme-background)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: 'var(--theme-radius)',
                        color: 'var(--theme-text)',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'var(--theme-background)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: 'var(--theme-radius)',
                        color: 'var(--theme-text)',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--theme-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--theme-radius)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                {props.submitLabel || 'Submit'}
              </button>
            </form>
          </div>
        </div>
      );

    case 'footer':
      return wrapElement(
        <footer style={{
          padding: style.padding || '32px 32px',
          borderTop: '1px solid var(--theme-border)',
          backgroundColor: style.backgroundColor || 'var(--theme-background)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.9rem',
          color: 'var(--theme-text-muted)'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--theme-text)' }}>{props.brand || 'MoodUI Studio'}</div>
            <div>{props.copyright || '© 2026. All rights reserved.'}</div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {(props.links || []).map((l, idx) => (
              <a
                key={idx}
                href={l.href || '#'}
                onClick={(e) => e.preventDefault()}
                style={{ color: 'var(--theme-text-muted)', textDecoration: 'none' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </footer>
      );

    default:
      return wrapElement(
        <div style={{ padding: '24px', border: '1px dashed var(--theme-border)', textAlign: 'center' }}>
          Unknown component type: <strong>{component.type}</strong>
        </div>
      );
  }
}
