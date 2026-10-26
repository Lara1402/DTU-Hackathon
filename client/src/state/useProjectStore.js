/**
 * User-Scoped Project Store for MoodUI Studio
 * Clean, fresh state without any pre-existing demo content.
 * Isolates local and remote storage per authenticated user.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PRESET_PALETTES, getPaletteById } from './palettes.js';

export function useProject(user = null, token = null) {
  const userId = user?.id || 'guest';
  const STORAGE_KEY = `moodui_user_${userId}_active_project`;

  // Start with clean slate: empty components, no demo projects
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [palette, setPaletteState] = useState(PRESET_PALETTES[2]); // Dark Professional
  const [components, setComponentsState] = useState([]); // CLEAN BLANK CANVAS!
  const [versions, setVersions] = useState([]);

  // Selection & UI controls
  const [selectedId, setSelectedId] = useState(null);
  const [viewport, setViewport] = useState('desktop');
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('design');
  const [saveStatus, setSaveStatus] = useState('saved');

  // History stack for Undo / Redo
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Clean conversational stream & mood board (NO demo data)
  const [messages, setMessages] = useState([]);
  const [moodBoard, setMoodBoard] = useState([]);

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

  // Debounced auto-save to user-namespaced local storage and backend
  const saveTimeoutRef = useRef(null);

  const persist = useCallback((id, name, pal, comps, vers) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      // 1. User-isolated LocalStorage
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            id,
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

      // 2. Synchronize to Backend if user is authenticated and project exists
      if (token && id) {
        try {
          await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              name,
              palette: pal,
              components: comps,
              versions: vers
            })
          });
        } catch (e) {
          console.warn('Backend sync deferred:', e);
        }
      }
    }, 600);
  }, [STORAGE_KEY, token]);

  // Load a specific project into the workspace
  const loadProject = useCallback((project) => {
    setProjectId(project.id);
    setProjectName(project.name || 'Untitled Project');
    setPaletteState(project.palette || PRESET_PALETTES[2]);
    setComponentsState(Array.isArray(project.components) ? project.components : []);
    setVersions(Array.isArray(project.versions) ? project.versions : []);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setMessages([]);
    setMoodBoard([]);
    setActiveRepair(null);
    setDiagnosticsReport(null);
    setSaveStatus('saved');
  }, []);

  // Create clean new project
  const createNewProject = useCallback((name = 'Untitled Project', initialComponents = []) => {
    const newId = `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    setProjectId(newId);
    setProjectName(name);
    setPaletteState(PRESET_PALETTES[2]);
    setComponentsState(initialComponents);
    setVersions([]);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setMessages([]);
    setMoodBoard([]);
    setActiveRepair(null);
    setDiagnosticsReport(null);
    setSaveStatus('saved');
    persist(newId, name, PRESET_PALETTES[2], initialComponents, []);
    return newId;
  }, [persist]);

  // Update components with history tracking
  const updateComponents = useCallback((newComponents, actionLabel = 'Edit') => {
    setPast(prev => [...prev.slice(-20), components]);
    setFuture([]);
    setComponentsState(newComponents);
    persist(projectId, projectName, palette, newComponents, versions);
  }, [components, projectId, projectName, palette, versions, persist]);

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
      persist(projectId, projectName, palette, next, versions);
      return next;
    });
  }, [projectId, projectName, palette, versions, persist]);

  // Delete component
  const deleteComponent = useCallback((id) => {
    setComponentsState(prev => {
      const next = prev.filter(c => c.id !== id);
      setPast(history => [...history.slice(-20), prev]);
      setFuture([]);
      if (selectedId === id) setSelectedId(null);
      persist(projectId, projectName, palette, next, versions);
      return next;
    });
  }, [selectedId, projectId, projectName, palette, versions, persist]);

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
      persist(projectId, projectName, palette, next, versions);
      return next;
    });
  }, [projectId, projectName, palette, versions, persist]);

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
      persist(projectId, projectName, palette, next, versions);
      return next;
    });
  }, [projectId, projectName, palette, versions, persist]);

  // Palette change (no AI request needed)
  const setPalette = useCallback((newPalette) => {
    setPaletteState(newPalette);
    persist(projectId, projectName, newPalette, components, versions);
  }, [projectId, projectName, components, versions, persist]);

  // Custom color updater
  const updateCustomColor = useCallback((key, value) => {
    setPaletteState(prev => {
      const updated = { ...prev, [key]: value, name: 'Custom Palette' };
      persist(projectId, projectName, updated, components, versions);
      return updated;
    });
  }, [projectId, projectName, components, versions, persist]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture(f => [components, ...f]);
    setPast(newPast);
    setComponentsState(previous);
    persist(projectId, projectName, palette, previous, versions);
  }, [past, components, projectId, projectName, palette, versions, persist]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(p => [...p, components]);
    setFuture(newFuture);
    setComponentsState(next);
    persist(projectId, projectName, palette, next, versions);
  }, [future, components, projectId, projectName, palette, versions, persist]);

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
    persist(projectId, projectName, palette, components, nextVersions);
  }, [components, palette, versions, projectId, projectName, persist]);

  const restoreVersion = useCallback((versionId) => {
    const ver = versions.find(v => v.id === versionId);
    if (!ver) return;
    setPast(p => [...p, components]);
    setFuture([]);
    setComponentsState(ver.components);
    if (ver.palette) setPaletteState(ver.palette);
    persist(projectId, projectName, ver.palette || palette, ver.components, versions);
  }, [versions, components, projectId, projectName, palette, persist]);

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

  // Mood board references
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

  return {
    projectId,
    projectName,
    setProjectName: (name) => {
      setProjectName(name);
      persist(projectId, name, palette, components, versions);
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
    loadProject,
    createNewProject
  };
}
