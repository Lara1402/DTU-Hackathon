/**
 * Code Generators for MoodUI Studio
 * Compiles the live AST into:
 * 1. Standalone production-grade HTML & CSS
 * 2. Fully functional modular React Component
 * 3. JSON AST Schema
 */

export function generateStandaloneHtml(components = [], palette = {}, projectName = 'MoodUI Project') {
  const p = {
    primary: palette.primary || '#3b82f6',
    secondary: palette.secondary || '#60a5fa',
    accent: palette.accent || '#93c5fd',
    background: palette.background || '#0f172a',
    surface: palette.surface || '#1e293b',
    text: palette.text || '#f8fafc',
    textMuted: palette.textMuted || '#94a3b8',
    border: palette.border || '#334155',
    radius: palette.radius || '10px'
  };

  const bodyHtml = components.map(c => renderComponentToHtml(c)).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} — Generated with MoodUI Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --primary: ${p.primary};
      --secondary: ${p.secondary};
      --accent: ${p.accent};
      --bg: ${p.background};
      --surface: ${p.surface};
      --text: ${p.text};
      --text-muted: ${p.textMuted};
      --border: ${p.border};
      --radius: ${p.radius};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Navbar */
    .mood-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 32px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
    }
    .mood-brand {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    .mood-brand-role {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-left: 8px;
    }
    .mood-nav-links {
      display: flex;
      gap: 28px;
      list-style: none;
      align-items: center;
    }
    .mood-nav-links a {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s ease;
    }
    .mood-nav-links a:hover {
      color: var(--primary);
    }

    /* Buttons */
    .mood-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
    }
    .mood-btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }
    .mood-btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .mood-btn-secondary {
      background: var(--surface);
      color: var(--text);
      border-color: var(--border);
    }
    .mood-btn-secondary:hover {
      border-color: var(--primary);
      transform: translateY(-1px);
    }

    /* Hero */
    .mood-hero {
      padding: 80px 24px;
    }
    .mood-hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 48px;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .mood-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid var(--border);
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 20px;
    }
    .mood-hero h1 {
      font-size: 3.25rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 20px;
    }
    .mood-hero p {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .mood-hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .mood-hero-media img {
      width: 100%;
      height: 420px;
      object-fit: cover;
      border-radius: calc(var(--radius) * 1.5);
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    /* Features */
    .mood-features {
      padding: 72px 24px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .mood-section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 52px;
    }
    .mood-section-header h2 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .mood-section-header p {
      color: var(--text-muted);
      font-size: 1.05rem;
    }
    .mood-feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .mood-feature-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .mood-feature-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
    }
    .mood-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .mood-feature-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .mood-feature-card p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    /* Cards Grid */
    .mood-cards-section {
      padding: 72px 24px;
    }
    .mood-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .mood-card-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .mood-card-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .mood-card-content {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .mood-card-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary);
      margin-bottom: 8px;
    }
    .mood-card-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .mood-card-content p {
      color: var(--text-muted);
      font-size: 0.95rem;
      flex: 1;
      margin-bottom: 20px;
    }

    /* Testimonials */
    .mood-testimonials {
      padding: 72px 24px;
      background: var(--surface);
      border-top: 1px solid var(--border);
    }
    .mood-testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .mood-testimonial-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px;
    }
    .mood-testimonial-quote {
      font-size: 1.05rem;
      line-height: 1.7;
      margin-bottom: 24px;
      font-style: italic;
    }
    .mood-testimonial-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .mood-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
    }

    /* CTA Section */
    .mood-cta {
      padding: 80px 24px;
      text-align: center;
      background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
      border-top: 1px solid var(--border);
    }
    .mood-cta-content {
      max-width: 680px;
      margin: 0 auto;
    }
    .mood-cta h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 16px;
    }
    .mood-cta p {
      color: var(--text-muted);
      font-size: 1.15rem;
      margin-bottom: 32px;
    }

    /* Form */
    .mood-form-section {
      padding: 72px 24px;
    }
    .mood-form-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 36px;
    }
    .mood-form-group {
      margin-bottom: 20px;
    }
    .mood-form-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .mood-form-group input,
    .mood-form-group textarea {
      width: 100%;
      padding: 12px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.2s ease;
    }
    .mood-form-group input:focus,
    .mood-form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Footer */
    .mood-footer {
      padding: 36px 32px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .mood-footer-links {
      display: flex;
      gap: 24px;
      list-style: none;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .mood-navbar {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }
      .mood-nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }
      .mood-hero-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .mood-hero h1 {
        font-size: 2.25rem;
      }
      .mood-footer {
        flex-direction: column;
        text-align: center;
      }
    }
  </style>
</head>
<body>

${bodyHtml}

<script>
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
</script>
</body>
</html>`;
}

function renderComponentToHtml(node) {
  const props = node.props || {};

  switch (node.type) {
    case 'navbar':
      return `<header class="mood-navbar" id="${node.id}">
  <div style="display: flex; align-items: center;">
    <a href="#" class="mood-brand">${props.brand || 'MoodUI Studio'}</a>
    ${props.brandRole ? `<span class="mood-brand-role">${props.brandRole}</span>` : ''}
  </div>
  <nav>
    <ul class="mood-nav-links">
      ${(props.links || []).map(l => `<li><a href="${l.href || '#'}">${l.label}</a></li>`).join('\n      ')}
    </ul>
  </nav>
  ${props.ctaLabel ? `<a href="${props.ctaHref || '#'}" class="mood-btn mood-btn-primary">${props.ctaLabel}</a>` : ''}
</header>`;

    case 'hero':
      return `<section class="mood-hero" id="${node.id}">
  <div class="mood-hero-grid">
    <div>
      ${props.badge ? `<div class="mood-badge"><i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> ${props.badge}</div>` : ''}
      <h1>${props.title || 'Empower your workflow with intelligent UI'}</h1>
      <p>${props.subtitle || 'Build, refine, and debug interfaces seamlessly.'}</p>
      <div class="mood-hero-actions">
        ${props.primaryBtnText ? `<a href="${props.primaryBtnHref || '#'}" class="mood-btn mood-btn-primary">${props.primaryBtnText}</a>` : ''}
        ${props.secondaryBtnText ? `<a href="${props.secondaryBtnHref || '#'}" class="mood-btn mood-btn-secondary">${props.secondaryBtnText}</a>` : ''}
      </div>
    </div>
    ${props.imageUrl ? `<div class="mood-hero-media"><img src="${props.imageUrl}" alt="${props.imageAlt || 'Hero visual'}" /></div>` : ''}
  </div>
</section>`;

    case 'features':
      return `<section class="mood-features" id="${node.id}">
  <div class="mood-section-header">
    ${props.badge ? `<div class="mood-badge">${props.badge}</div>` : ''}
    <h2>${props.title || 'Core Capabilities'}</h2>
    <p>${props.subtitle || 'Carefully crafted features to power your workflow.'}</p>
  </div>
  <div class="mood-feature-grid">
    ${(props.items || []).map(item => `
    <div class="mood-feature-card">
      <div class="mood-icon-wrapper"><i data-lucide="check-circle" style="width: 24px; height: 24px;"></i></div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>`).join('')}
  </div>
</section>`;

    case 'card-grid':
      return `<section class="mood-cards-section" id="${node.id}">
  <div class="mood-section-header">
    ${props.badge ? `<div class="mood-badge">${props.badge}</div>` : ''}
    <h2>${props.title || 'Featured Showcase'}</h2>
    <p>${props.subtitle || 'Explore our latest releases and highlights.'}</p>
  </div>
  <div class="mood-cards-grid">
    ${(props.cards || []).map(card => `
    <div class="mood-card-item">
      ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.title}" class="mood-card-img" />` : ''}
      <div class="mood-card-content">
        ${card.badge ? `<div class="mood-card-badge">${card.badge}</div>` : ''}
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        ${card.linkText ? `<a href="${card.linkHref || '#'}" class="mood-btn mood-btn-secondary" style="margin-top: auto;">${card.linkText}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>
</section>`;

    case 'testimonials':
      return `<section class="mood-testimonials" id="${node.id}">
  <div class="mood-section-header">
    ${props.badge ? `<div class="mood-badge">${props.badge}</div>` : ''}
    <h2>${props.title || 'What People Say'}</h2>
  </div>
  <div class="mood-testimonials-grid">
    ${(props.items || []).map(item => `
    <div class="mood-testimonial-card">
      <p class="mood-testimonial-quote">“${item.quote}”</p>
      <div class="mood-testimonial-author">
        ${item.avatarUrl ? `<img src="${item.avatarUrl}" alt="${item.author}" class="mood-avatar" />` : ''}
        <div>
          <div style="font-weight: 700;">${item.author}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${item.role}</div>
        </div>
      </div>
    </div>`).join('')}
  </div>
</section>`;

    case 'cta':
      return `<section class="mood-cta" id="${node.id}">
  <div class="mood-cta-content">
    ${props.badge ? `<div class="mood-badge">${props.badge}</div>` : ''}
    <h2>${props.title || 'Ready to Get Started?'}</h2>
    <p>${props.subtitle || 'Join thousands building with modern web workflows.'}</p>
    ${props.btnText ? `<a href="${props.btnHref || '#'}" class="mood-btn mood-btn-primary" style="font-size: 1.05rem; padding: 14px 32px;">${props.btnText}</a>` : ''}
  </div>
</section>`;

    case 'form':
      return `<section class="mood-form-section" id="${node.id}">
  <div class="mood-form-wrapper">
    <div style="margin-bottom: 24px;">
      ${props.badge ? `<div class="mood-badge">${props.badge}</div>` : ''}
      <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 8px;">${props.title || 'Contact Us'}</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${props.subtitle || 'We would love to hear from you.'}</p>
    </div>
    <form onsubmit="event.preventDefault(); alert('Form submitted!');">
      ${(props.fields || []).map(f => `
      <div class="mood-form-group">
        <label for="${f.name}">${f.label}</label>
        ${f.type === 'textarea' 
          ? `<textarea id="${f.name}" name="${f.name}" placeholder="${f.placeholder || ''}" rows="4" ${f.required ? 'required' : ''}></textarea>`
          : `<input id="${f.name}" type="${f.type || 'text'}" name="${f.name}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} />`
        }
      </div>`).join('')}
      <button type="submit" class="mood-btn mood-btn-primary" style="width: 100%; margin-top: 12px;">
        ${props.submitLabel || 'Submit'}
      </button>
    </form>
  </div>
</section>`;

    case 'footer':
      return `<footer class="mood-footer" id="${node.id}">
  <div>
    <div style="font-weight: 700; color: var(--text);">${props.brand || 'MoodUI Studio'}</div>
    <div>${props.copyright || '© 2026. All rights reserved.'}</div>
  </div>
  <ul class="mood-footer-links">
    ${(props.links || []).map(l => `<li><a href="${l.href || '#'}">${l.label}</a></li>`).join('')}
  </ul>
</footer>`;

    default:
      return `<div id="${node.id}" style="padding: 24px; border: 1px dashed var(--border);">Component (${node.type})</div>`;
  }
}

export function generateReactCode(components = [], palette = {}, projectName = 'MoodUI App') {
  return `import React, { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';

// Design Theme Tokens
const theme = {
  primary: '${palette.primary || '#3b82f6'}',
  secondary: '${palette.secondary || '#60a5fa'}',
  accent: '${palette.accent || '#93c5fd'}',
  background: '${palette.background || '#0f172a'}',
  surface: '${palette.surface || '#1e293b'}',
  text: '${palette.text || '#f8fafc'}',
  textMuted: '${palette.textMuted || '#94a3b8'}',
  border: '${palette.border || '#334155'}',
  radius: '${palette.radius || '10px'}'
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Thank you! Your message has been received.');
  };

  return (
    <div style={{
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Generated Component Tree */}
      ${components.map(c => generateReactComponentSnippet(c)).join('\n\n      ')}
    </div>
  );
}
`;
}

function generateReactComponentSnippet(node) {
  const props = node.props || {};

  switch (node.type) {
    case 'navbar':
      return `{/* Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: \`1px solid \${theme.border}\`,
        backgroundColor: theme.background,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>${props.brand || 'MoodUI'}</span>
          ${props.brandRole ? `<span style={{ fontSize: '0.8rem', color: theme.textMuted }}>${props.brandRole}</span>` : ''}
        </div>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          ${(props.links || []).map(l => `<a href="${l.href || '#'}" style={{ color: theme.textMuted, textDecoration: 'none' }}>${l.label}</a>`).join('\n          ')}
        </nav>
        ${props.ctaLabel ? `<a href="${props.ctaHref || '#'}" style={{
          padding: '10px 20px',
          backgroundColor: theme.primary,
          color: '#fff',
          borderRadius: theme.radius,
          textDecoration: 'none',
          fontWeight: 600
        }}>${props.ctaLabel}</a>` : ''}
      </header>`;

    case 'hero':
      return `{/* Hero Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            ${props.badge ? `<div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: \`1px solid \${theme.border}\`,
              fontSize: '0.85rem',
              color: theme.primary,
              marginBottom: '16px'
            }}><Sparkles size={14} /> ${props.badge}</div>` : ''}
            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
              ${props.title || 'Modern Digital Experience'}
            </h1>
            <p style={{ fontSize: '1.15rem', color: theme.textMuted, lineHeight: 1.6, marginBottom: '32px' }}>
              ${props.subtitle || 'Built with modern web technologies and verified design tokens.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              ${props.primaryBtnText ? `<a href="${props.primaryBtnHref || '#'}" style={{
                padding: '12px 28px',
                backgroundColor: theme.primary,
                color: '#fff',
                borderRadius: theme.radius,
                fontWeight: 600,
                textDecoration: 'none'
              }}>${props.primaryBtnText}</a>` : ''}
              ${props.secondaryBtnText ? `<a href="${props.secondaryBtnHref || '#'}" style={{
                padding: '12px 28px',
                backgroundColor: theme.surface,
                color: theme.text,
                border: \`1px solid \${theme.border}\`,
                borderRadius: theme.radius,
                fontWeight: 600,
                textDecoration: 'none'
              }}>${props.secondaryBtnText}</a>` : ''}
            </div>
          </div>
          ${props.imageUrl ? `<img src="${props.imageUrl}" alt="${props.imageAlt || 'Hero'}" style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: theme.radius,
            border: \`1px solid \${theme.border}\`
          }} />` : ''}
        </div>
      </section>`;

    case 'features':
      return `{/* Features Section */}
      <section style={{ padding: '72px 24px', backgroundColor: theme.surface, borderTop: \`1px solid \${theme.border}\` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '16px' }}>${props.title || 'Features'}</h2>
          <p style={{ color: theme.textMuted, marginBottom: '48px' }}>${props.subtitle || ''}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            ${(props.items || []).map(item => `
            <div style={{
              padding: '28px',
              backgroundColor: theme.background,
              border: \`1px solid \${theme.border}\`,
              borderRadius: theme.radius,
              textAlign: 'left'
            }}>
              <CheckCircle size={28} color={theme.primary} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>${item.title}</h3>
              <p style={{ color: theme.textMuted, fontSize: '0.95rem' }}>${item.description}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`;

    case 'footer':
      return `{/* Footer */}
      <footer style={{
        padding: '36px 32px',
        borderTop: \`1px solid \${theme.border}\`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>${props.copyright || '© 2026. Built with MoodUI Studio.'}</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          ${(props.links || []).map(l => `<a href="${l.href || '#'}" style={{ color: theme.textMuted, textDecoration: 'none' }}>${l.label}</a>`).join('\n          ')}
        </div>
      </footer>`;

    default:
      return `<div style={{ padding: '24px' }}>Component: ${node.type}</div>`;
  }
}

export function generateAstJson(components = [], palette = {}, projectName = 'MoodUI Project') {
  return JSON.stringify({
    projectName,
    generatedAt: new Date().toISOString(),
    palette,
    components
  }, null, 2);
}
