/**
 * Color Palettes & Design Tokens for MoodUI Studio
 * 12 Curated Presets with instant CSS custom property reactivity.
 */

export const PRESET_PALETTES = [
  {
    id: 'minimal-neutral',
    name: 'Minimal Neutral',
    description: 'Clean, understated grayscale with soft stone accents',
    primary: '#18181b',
    secondary: '#71717a',
    accent: '#27272a',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#09090b',
    textMuted: '#71717a',
    border: '#e4e4e7',
    radius: '8px'
  },
  {
    id: 'light-clean',
    name: 'Light and Clean',
    description: 'Crisp airy aesthetic with subtle sky blue highlights',
    primary: '#0284c7',
    secondary: '#0ea5e9',
    accent: '#38bdf8',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    radius: '10px'
  },
  {
    id: 'dark-professional',
    name: 'Dark Professional',
    description: 'Deep slate background with vibrant electric blue accents',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: '#334155',
    radius: '10px'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Intense indigo night tones with vivid cyan highlights',
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#38bdf8',
    background: '#030712',
    surface: '#111827',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    border: '#1f2937',
    radius: '12px'
  },
  {
    id: 'purple-gradient',
    name: 'Purple Gradient',
    description: 'Dynamic neon violet and fuchsia cyber aesthetic',
    primary: '#8b5cf6',
    secondary: '#d946ef',
    accent: '#ec4899',
    background: '#090514',
    surface: '#170f2f',
    text: '#faf5ff',
    textMuted: '#c084fc',
    border: '#2e1c59',
    radius: '14px'
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Deep sea navy paired with turquoise and seafoam',
    primary: '#0d9488',
    secondary: '#0284c7',
    accent: '#14b8a6',
    background: '#041724',
    surface: '#08253a',
    text: '#f0fdfa',
    textMuted: '#99f6e4',
    border: '#0e3956',
    radius: '10px'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Organic botanical moss and emerald earth tones',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#061a12',
    surface: '#0d281e',
    text: '#ecfdf5',
    textMuted: '#a7f3d0',
    border: '#163e30',
    radius: '12px'
  },
  {
    id: 'warm-earthy',
    name: 'Warm Earthy',
    description: 'Rich terracotta, ochre, and warm clay warmth',
    primary: '#ea580c',
    secondary: '#d97706',
    accent: '#f97316',
    background: '#1a120b',
    surface: '#2b1c11',
    text: '#fff7ed',
    textMuted: '#fed7aa',
    border: '#432c1b',
    radius: '8px'
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    description: 'Soft lavender, peach, and mint for playful serenity',
    primary: '#a78bfa',
    secondary: '#f472b6',
    accent: '#38bdf8',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#3b0764',
    textMuted: '#7e22ce',
    border: '#f3e8ff',
    radius: '16px'
  },
  {
    id: 'vibrant-playful',
    name: 'Vibrant and Playful',
    description: 'High-energy coral, sunshine yellow, and bold cobalt',
    primary: '#f43f5e',
    secondary: '#fbbf24',
    accent: '#06b6d4',
    background: '#0c0a09',
    surface: '#1c1917',
    text: '#fafaf9',
    textMuted: '#d6d3d1',
    border: '#292524',
    radius: '16px'
  },
  {
    id: 'monochrome',
    name: 'Monochrome Studio',
    description: 'Pure brutalist black, stark white, and refined graphite',
    primary: '#ffffff',
    secondary: '#a1a1aa',
    accent: '#e4e4e7',
    background: '#000000',
    surface: '#121212',
    text: '#ffffff',
    textMuted: '#71717a',
    border: '#27272a',
    radius: '4px'
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'WCAG AAA maximum visibility with bold yellow accents',
    primary: '#facc15',
    secondary: '#38bdf8',
    accent: '#4ade80',
    background: '#000000',
    surface: '#0a0a0a',
    text: '#ffffff',
    textMuted: '#e5e5e5',
    border: '#525252',
    radius: '6px'
  }
];

export function getPaletteById(id) {
  return PRESET_PALETTES.find(p => p.id === id) || PRESET_PALETTES[2];
}

export function paletteToCssVars(palette) {
  return {
    '--theme-primary': palette.primary,
    '--theme-secondary': palette.secondary,
    '--theme-accent': palette.accent,
    '--theme-background': palette.background,
    '--theme-surface': palette.surface,
    '--theme-text': palette.text,
    '--theme-text-muted': palette.textMuted || '#94a3b8',
    '--theme-border': palette.border,
    '--theme-radius': palette.radius || '8px'
  };
}
