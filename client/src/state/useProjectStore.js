/**
 * Global Project Store for MoodUI Studio
 * Handles AST manipulation, undo/redo, theme palette, direct visual editing,
 * version snapshots, diagnostics, and persistent local drafts.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PRESET_PALETTES, getPaletteById } from './palettes.js';

const STORAGE_KEY = 'moodui_studio_current_project';

const INITIAL_PORTFOLIO = [
  {
    id: 'nav-1',
    type: 'navbar',
    props: {
      brand: 'Alex Rivers',
      brandRole: 'Full-Stack Developer',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Projects', href: '#projects' },
        { label: 'Experience', href: '#experience' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaLabel: 'Get in Touch',
      ctaHref: '#contact',
      isSticky: true
    },
    style: { padding: '16px 32px' }
  },
  {
    id: 'hero-1',
    type: 'hero',
    props: {
      badge: 'Available for New Opportunities',
      title: 'Building digital experiences with modern web technologies',
      subtitle: 'Hi, I am Alex. I craft resilient frontend interfaces, scalable Node services, and delight users with micro-interactions and performance-first design.',
      primaryBtnText: 'View Projects',
      primaryBtnHref: '#projects',
      secondaryBtnText: 'Download CV',
      secondaryBtnHref: '#cv',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Alex Rivers portrait'
    },
    style: { padding: '80px 24px' }
  },
  {
    id: 'features-1',
    type: 'features',
    props: {
      badge: 'Core Expertise',
      title: 'What I bring to the table',
      subtitle: 'From pixel-perfect interactive UI to robust backend services and DevOps automation.',
      items: [
        {
          icon: 'Code2',
          title: 'Frontend Architecture',
          description: 'Modern React, TypeScript, state management, and accessible component libraries.'
        },
        {
          icon: 'Cpu',
          title: 'AI & LLM Integration',
          description: 'Integrating Google Gemma, Gemini models, agent workflows, and prompt engineering.'
        },
        {
          icon: 'Sparkles',
          title: 'Design Systems & Tokens',
          description: 'Creating cohesive tokens, theme switches, and responsive layouts that look stunning.'
        }
      ]
    },
    style: { padding: '64px 24px' }
  },
  {
    id: 'projects-1',
    type: 'card-grid',
    props: {
      badge: 'Featured Works',
      title: 'Recent Projects',
      subtitle: 'A selection of products and tools engineered from concept to launch.',
      columns: 3,
      cards: [
        {
          id: 'card-p1',
          title: 'Pulse Analytics',
          badge: 'Next.js & TypeScript',
          description: 'Real-time telemetry dashboard visualizing user interactions with sub-100ms latency.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          linkText: 'View Demo',
          linkHref: '#'
        },
        {
          id: 'card-p2',
          title: 'Aura Design System',
          badge: 'React & Tokens',
          description: 'Accessible UI kit with container queries, dynamic theme tokens, and 40+ components.',
          imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
          linkText: 'GitHub Repo',
          linkHref: '#'
        },
        {
          id: 'card-p3',
          title: 'Cipher Cloud Agent',
          badge: 'Gemma & Python',
          description: 'Intelligent security monitor diagnosing misconfigurations and generating automated fixes.',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
          linkText: 'Case Study',
          linkHref: '#'
        }
      ]
    },
    style: { padding: '64px 24px' }
  },
  {
    id: 'footer-1',
    type: 'footer',
    props: {
      brand: 'Alex Rivers',
      copyright: '© 2026 Alex Rivers. Built with MoodUI Studio.',
      links: [
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'Twitter', href: 'https://twitter.com' }
      ]
    },
    style: { padding: '32px 24px' }
  }
];

export function useProject() {
  // Load initial from localStorage if available
  const getInitialState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.components) && parsed.components.length > 0) {
          return {
            name: parsed.name || 'Developer Portfolio',
            palette: parsed.palette || PRESET_PALETTES[2],
            components: parsed.components,
            versions: parsed.versions || []
          };
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return {
      name: 'Developer Portfolio',
      palette: PRESET_PALETTES[2], // Dark professional
      components: INITIAL_PORTFOLIO,
      versions: [
        {
          id: 'v-init',
          name: 'Initial Starter State',
          timestamp: new Date().toISOString(),
          components: INITIAL_PORTFOLIO
        }
      ]
    };
  };

  const initial = getInitialState();

  const [projectName, setProjectName] = useState(initial.name);
  const [palette, setPaletteState] = useState(initial.palette);
  const [components, setComponentsState] = useState(initial.components);
  const [versions, setVersions] = useState(initial.versions);

  // Selection & UI controls
  const [selectedId, setSelectedId] = useState(null);
  const [viewport, setViewport] = useState('desktop'); // desktop | tablet | mobile
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('design'); // design | properties | debug | code
  const [saveStatus, setSaveStatus] = useState('saved');

  // History stack for Undo / Redo
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Multimodal conversation & moodboard
  const [messages, setMessages] = useState([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: 'Welcome to MoodUI Studio! Describe your interface idea, upload design references or a mood board, or pick a color palette to begin.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [moodBoard, setMoodBoard] = useState([
    {
      id: 'mb-1',
      title: 'Modern Minimal Architecture',
      notes: 'Clean lines, dark background, electric blue accents',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  // Debugging & Repairs
  const [activeRepair, setActiveRepair] = useState(null);
  const [lastAppliedRepair, setLastAppliedRepair] = useState(null);
  const [diagnosticsReport, setDiagnosticsReport] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'gemma-2-9b-it',
    localMode: false
  });

  // Debounced auto-save to localStorage
  const saveTimeoutRef = useRef(null);

  const persist = useCallback((name, pal, comps, vers) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            name,
            palette: pal,
            components: comps,
            versions: vers,
            updatedAt: new Date().toISOString()
          })
        );
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
        setSaveStatus('unsaved');
      }
    }, 500);
  }, []);

  // Update components with undo history tracking
  const updateComponents = useCallback((newComponents, actionLabel = 'Edit') => {
    setPast(prev => [...prev.slice(-20), components]);
    setFuture([]);
    setComponentsState(newComponents);
    persist(projectName, palette, newComponents, versions);
  }, [components, projectName, palette, versions, persist]);

  // Direct element prop / style updates
  const updateComponent = useCallback((id, updates) => {
    setComponentsState(prev => {
      const next = prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            props: updates.props ? { ...c.props, ...updates.props } : c.props,
            style: updates.style ? { ...c.style, ...updates.style } : c.style
          };
        }
        return c;
      });
      setPast(history => [...history.slice(-20), prev]);
      setFuture([]);
      persist(projectName, palette, next, versions);
      return next;
    });
  }, [projectName, palette, versions, persist]);

  // Delete component
  const deleteComponent = useCallback((id) => {
    setComponentsState(prev => {
      const next = prev.filter(c => c.id !== id);
      setPast(history => [...history.slice(-20), prev]);
      setFuture([]);
      if (selectedId === id) setSelectedId(null);
      persist(projectName, palette, next, versions);
      return next;
    });
  }, [selectedId, projectName, palette, versions, persist]);

  // Duplicate component
  const duplicateComponent = useCallback((id) => {
    setComponentsState(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const original = prev[idx];
      const clone = {
        ...JSON.parse(JSON.stringify(original)),
        id: `${original.type}-${Date.now().toString(36)}`
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      setPast(history => [...history.slice(-20), prev]);
      setFuture([]);
      setSelectedId(clone.id);
      persist(projectName, palette, next, versions);
      return next;
    });
  }, [projectName, palette, versions, persist]);

  // Reorder component
  const moveComponent = useCallback((id, direction) => {
    setComponentsState(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);

      setPast(history => [...history.slice(-20), prev]);
      setFuture([]);
      persist(projectName, palette, next, versions);
      return next;
    });
  }, [projectName, palette, versions, persist]);

  // Palette change (no AI call needed)
  const setPalette = useCallback((newPalette) => {
    setPaletteState(newPalette);
    persist(projectName, newPalette, components, versions);
  }, [projectName, components, versions, persist]);

  // Custom color updater
  const updateCustomColor = useCallback((key, value) => {
    setPaletteState(prev => {
      const updated = { ...prev, [key]: value, name: 'Custom Palette' };
      persist(projectName, updated, components, versions);
      return updated;
    });
  }, [projectName, components, versions, persist]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture(f => [components, ...f]);
    setPast(newPast);
    setComponentsState(previous);
    persist(projectName, palette, previous, versions);
  }, [past, components, projectName, palette, versions, persist]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(p => [...p, components]);
    setFuture(newFuture);
    setComponentsState(next);
    persist(projectName, palette, next, versions);
  }, [future, components, projectName, palette, versions, persist]);

  // Named version snapshots
  const saveSnapshot = useCallback((name) => {
    const newVersion = {
      id: `v-${Date.now().toString(36)}`,
      name: name || `Snapshot ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      components: JSON.parse(JSON.stringify(components)),
      palette: JSON.parse(JSON.stringify(palette))
    };
    const nextVersions = [newVersion, ...versions];
    setVersions(nextVersions);
    persist(projectName, palette, components, nextVersions);
  }, [components, palette, versions, projectName, persist]);

  const restoreVersion = useCallback((versionId) => {
    const ver = versions.find(v => v.id === versionId);
    if (!ver) return;
    setPast(p => [...p, components]);
    setFuture([]);
    setComponentsState(ver.components);
    if (ver.palette) setPaletteState(ver.palette);
    persist(projectName, ver.palette || palette, ver.components, versions);
  }, [versions, components, projectName, palette, persist]);

  // Conversation messaging
  const addMessage = useCallback((msg) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...msg
      }
    ]);
  }, []);

  // Mood board management
  const addMoodBoardItem = useCallback((item) => {
    setMoodBoard(prev => [
      ...prev,
      {
        id: `mb-${Date.now()}`,
        title: item.title || 'Inspiration Reference',
        notes: item.notes || '',
        url: item.url
      }
    ]);
  }, []);

  const removeMoodBoardItem = useCallback((id) => {
    setMoodBoard(prev => prev.filter(m => m.id !== id));
  }, []);

  // Apply repair
  const applyRepair = useCallback((repair) => {
    if (!repair || !repair.proposedRepair) return;
    const patch = repair.proposedRepair;
    const target = components.find(c => c.id === patch.targetId);
    if (!target) return;

    setLastAppliedRepair({
      before: JSON.parse(JSON.stringify(components)),
      patch
    });

    const next = components.map(c => {
      if (c.id === patch.targetId) {
        return {
          ...c,
          style: patch.operation === 'update-style' ? { ...c.style, ...patch.after } : c.style,
          props: patch.operation === 'update-props' ? { ...c.props, ...patch.after } : c.props
        };
      }
      return c;
    });

    updateComponents(next, `Bug Fix: ${patch.summary}`);
    setActiveRepair(null);
  }, [components, updateComponents]);

  const undoLastRepair = useCallback(() => {
    if (!lastAppliedRepair) return;
    updateComponents(lastAppliedRepair.before, 'Undo Repair');
    setLastAppliedRepair(null);
  }, [lastAppliedRepair, updateComponents]);

  // Load starter templates
  const loadTemplate = useCallback((templateData) => {
    setPast(p => [...p, components]);
    setFuture([]);
    setComponentsState(templateData.components);
    const pal = getPaletteById(templateData.paletteName) || PRESET_PALETTES[2];
    setPaletteState(pal);
    setProjectName(templateData.name);
    setSelectedId(null);
    persist(templateData.name, pal, templateData.components, versions);
  }, [components, versions, persist]);

  return {
    projectName,
    setProjectName: (name) => {
      setProjectName(name);
      persist(name, palette, components, versions);
    },
    palette,
    setPalette,
    updateCustomColor,
    components,
    updateComponents,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    moveComponent,
    selectedId,
    setSelectedId,
    selectedComponent: components.find(c => c.id === selectedId) || null,
    viewport,
    setViewport,
    zoom,
    setZoom,
    activeTab,
    setActiveTab,
    saveStatus,
    past,
    future,
    undo,
    redo,
    versions,
    saveSnapshot,
    restoreVersion,
    messages,
    addMessage,
    moodBoard,
    addMoodBoardItem,
    removeMoodBoardItem,
    activeRepair,
    setActiveRepair,
    applyRepair,
    undoLastRepair,
    hasLastRepair: Boolean(lastAppliedRepair),
    diagnosticsReport,
    setDiagnosticsReport,
    isDiagnosing,
    setIsDiagnosing,
    settings,
    setSettings,
    loadTemplate
  };
}
