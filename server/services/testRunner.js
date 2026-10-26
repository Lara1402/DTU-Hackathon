/**
 * Automated Test Runner & Diagnostic Suite for MoodUI Studio
 * Runs rigorous structural, accessibility, responsive, and visual checks on UI AST.
 */

// Helper to calculate contrast ratio between two hex colors
function getLuminance(hex) {
  if (!hex || typeof hex !== 'string') return 0.5;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function calculateContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function runDiagnostics(components, palette = {}) {
  const issues = [];
  const passedChecks = [];

  if (!Array.isArray(components) || components.length === 0) {
    return {
      success: false,
      summary: 'No components in tree to inspect',
      issues: [{
        id: 'empty-tree',
        type: 'structural',
        severity: 'high',
        title: 'Empty Canvas',
        description: 'The project contains zero components. Generate or add components first.',
        componentId: null,
        suggestedFix: 'Generate a design or load a template.'
      }],
      passedChecks: []
    };
  }

  // 1. Structure check: Navbar & Footer
  const hasNavbar = components.some(c => c.type === 'navbar');
  const hasFooter = components.some(c => c.type === 'footer');
  const hasHeroOrContent = components.some(c => ['hero', 'features', 'card-grid', 'cta'].includes(c.type));

  if (!hasNavbar) {
    issues.push({
      id: 'missing-navbar',
      type: 'structural',
      severity: 'low',
      title: 'Missing Navigation Header',
      description: 'The page does not include a navigation bar. Users may struggle to find links.',
      componentId: null,
      suggestedFix: 'Add a sticky or standard navbar component to the top of the page.'
    });
  } else {
    passedChecks.push({ name: 'Navigation Header Present', status: 'pass' });
  }

  if (!hasFooter) {
    issues.push({
      id: 'missing-footer',
      type: 'structural',
      severity: 'low',
      title: 'Missing Footer',
      description: 'The page lacks a footer containing copyright, social links, or policy disclosures.',
      componentId: null,
      suggestedFix: 'Add a footer component with copyright information.'
    });
  } else {
    passedChecks.push({ name: 'Page Footer Present', status: 'pass' });
  }

  if (hasHeroOrContent) {
    passedChecks.push({ name: 'Primary Content Sections Detected', status: 'pass' });
  }

  // Recursive inspect for all components
  function inspectNode(node) {
    const props = node.props || {};
    const style = node.style || {};

    // 2. Mobile Responsive Overflow Check
    if (style.width && typeof style.width === 'string' && style.width.endsWith('px')) {
      const pxVal = parseInt(style.width, 10);
      if (pxVal > 360) {
        issues.push({
          id: `overflow-${node.id}`,
          type: 'responsive',
          severity: 'high',
          title: `Fixed Width Overflow in ${node.type} (${node.id})`,
          description: `Component has hardcoded width: ${style.width}, exceeding mobile viewport (360px). This causes horizontal scrolling.`,
          componentId: node.id,
          suggestedFix: `Change style.width to "100%" and use maxWidth: "${style.width}" instead.`
        });
      }
    }

    if (style.minWidth && typeof style.minWidth === 'string' && style.minWidth.endsWith('px')) {
      const pxVal = parseInt(style.minWidth, 10);
      if (pxVal > 360) {
        issues.push({
          id: `minwidth-overflow-${node.id}`,
          type: 'responsive',
          severity: 'high',
          title: `Fixed minWidth Overflow in ${node.type} (${node.id})`,
          description: `Component has minWidth: ${style.minWidth}, exceeding standard mobile screens.`,
          componentId: node.id,
          suggestedFix: `Remove hardcoded minWidth or set it to max-content with max-width: 100%.`
        });
      }
    }

    // 3. Accessibility: Button Labels
    if (node.type === 'button') {
      const label = props.label || props.text || '';
      if (!label.trim()) {
        issues.push({
          id: `a11y-btn-${node.id}`,
          type: 'accessibility',
          severity: 'high',
          title: `Empty Button Label (${node.id})`,
          description: 'Button element has no readable text or accessible label for screen readers.',
          componentId: node.id,
          suggestedFix: 'Add non-empty label prop or descriptive aria-label.'
        });
      }
    }

    // 4. Accessibility: Image Alt Text
    if (node.type === 'image' || (node.type === 'hero' && props.imageUrl)) {
      const alt = props.alt || props.imageAlt;
      if (!alt || !alt.trim()) {
        issues.push({
          id: `a11y-img-${node.id}`,
          type: 'accessibility',
          severity: 'medium',
          title: `Missing Image Alt Text in ${node.type} (${node.id})`,
          description: 'Image missing descriptive alt attribute, violating WCAG 2.1 AA accessibility standards.',
          componentId: node.id,
          suggestedFix: 'Provide descriptive alt text summarizing the image content.'
        });
      }
    }

    // 5. Broken / Placeholder Image Check
    if (props.imageUrl || props.src) {
      const src = props.imageUrl || props.src;
      if (src.includes('via.placeholder.com') || src.trim() === '' || src === '#') {
        issues.push({
          id: `img-src-${node.id}`,
          type: 'visual',
          severity: 'medium',
          title: `Unresolved Placeholder Image in ${node.type} (${node.id})`,
          description: 'Image uses an unstyled or broken placeholder source.',
          componentId: node.id,
          suggestedFix: 'Replace with high-quality Unsplash image or valid asset URL.'
        });
      }
    }

    // 6. Form validation check
    if (node.type === 'form') {
      const fields = props.fields || [];
      if (fields.length === 0) {
        issues.push({
          id: `form-empty-${node.id}`,
          type: 'functional',
          severity: 'medium',
          title: `Form with No Input Fields (${node.id})`,
          description: 'Form component has no input fields defined.',
          componentId: node.id,
          suggestedFix: 'Add at least one input field (name, email, or message).'
        });
      } else {
        const missingLabels = fields.filter(f => !f.label || !f.name);
        if (missingLabels.length > 0) {
          issues.push({
            id: `form-labels-${node.id}`,
            type: 'accessibility',
            severity: 'medium',
            title: `Form Inputs Missing Labels/Names (${node.id})`,
            description: `${missingLabels.length} input field(s) lack proper labels or name attributes.`,
            componentId: node.id,
            suggestedFix: 'Assign descriptive label and unique name to all form inputs.'
          });
        }
      }
    }

    // 7. Navbar Links check
    if (node.type === 'navbar') {
      const links = props.links || [];
      const emptyHrefs = links.filter(l => !l.href || l.href === '');
      if (emptyHrefs.length > 0) {
        issues.push({
          id: `nav-empty-href-${node.id}`,
          type: 'navigation',
          severity: 'low',
          title: `Navigation Links Missing Destination (${node.id})`,
          description: 'One or more navigation links have empty or missing href targets.',
          componentId: node.id,
          suggestedFix: 'Update links to valid anchor tags (e.g. #about, #features) or URLs.'
        });
      }
    }

    // 8. Color Contrast Check (when custom inline colors are applied)
    if (style.color && style.backgroundColor) {
      const ratio = calculateContrastRatio(style.color, style.backgroundColor);
      if (ratio < 4.5) {
        issues.push({
          id: `contrast-${node.id}`,
          type: 'contrast',
          severity: 'medium',
          title: `Low Contrast Ratio in ${node.type} (${node.id})`,
          description: `Contrast ratio is ${ratio.toFixed(2)}:1 (minimum recommended WCAG AA is 4.5:1).`,
          componentId: node.id,
          suggestedFix: 'Increase lightness difference between text color and background color.'
        });
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(inspectNode);
    }
  }

  components.forEach(inspectNode);

  if (!issues.some(i => i.type === 'responsive')) {
    passedChecks.push({ name: 'Mobile Viewport Responsiveness', status: 'pass' });
  }
  if (!issues.some(i => i.type === 'accessibility')) {
    passedChecks.push({ name: 'WCAG Accessibility & Alt Labels', status: 'pass' });
  }
  if (!issues.some(i => i.type === 'contrast')) {
    passedChecks.push({ name: 'Color Contrast Ratios (AA Compliant)', status: 'pass' });
  }
  if (!issues.some(i => i.type === 'visual')) {
    passedChecks.push({ name: 'Asset & Image Resolution', status: 'pass' });
  }
  if (!issues.some(i => i.type === 'functional')) {
    passedChecks.push({ name: 'Form Inputs & Interactive Targets', status: 'pass' });
  }

  return {
    success: true,
    totalIssues: issues.length,
    passedChecksCount: passedChecks.length,
    issues,
    passedChecks,
    timestamp: new Date().toISOString()
  };
}
