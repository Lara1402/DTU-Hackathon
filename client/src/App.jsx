import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { useProject } from './state/useProjectStore.js';
import { PRESET_PALETTES, getPaletteById } from './state/palettes.js';
import { STARTER_TEMPLATES } from './state/starterTemplates.js';

import LoginPage from './components/Auth/LoginPage.jsx';
import SignupPage from './components/Auth/SignupPage.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

import TopNav from './components/TopNav.jsx';
import LeftPanel from './components/LeftPanel/LeftPanel.jsx';
import LiveCanvas from './components/Canvas/LiveCanvas.jsx';
import RightPanel from './components/RightPanel/RightPanel.jsx';

import ExportModal from './components/Modals/ExportModal.jsx';
import SettingsModal from './components/Modals/SettingsModal.jsx';
import VersionModal from './components/Modals/VersionModal.jsx';
import NewProjectModal from './components/Modals/NewProjectModal.jsx';

function MainStudioApp() {
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const store = useProject(user, token);

  // Active view: 'dashboard' | 'studio' | 'login' | 'signup'
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Clear demo data / old un-namespaced localStorage keys on startup
  useEffect(() => {
    try {
      localStorage.removeItem('moodui_studio_current_project');
    } catch (_) {}
  }, []);

  // Keyboard Shortcuts (Undo, Redo, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          store.redo();
        } else {
          store.undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        store.redo();
      } else if (e.key === 'Escape') {
        store.setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  // Loading state while restoring session
  if (authLoading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: '#090a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8fafc',
        gap: '16px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Restoring MoodUI Studio session...</span>
      </div>
    );
  }

  // Route Guard: Logged-out users only see Login or Signup
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <SignupPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToSignup={() => setAuthView('signup')} />;
  }

  // Authenticated: Dashboard View
  if (currentView === 'dashboard') {
    return (
      <Dashboard
        onOpenProject={(project) => {
          store.loadProject(project);
          setCurrentView('studio');
        }}
        onCreateNewProject={async (templateKey) => {
          let initialComponents = [];
          let initialPalette = PRESET_PALETTES[2];
          let projName = 'Untitled Project';

          if (templateKey && templateKey !== 'blank') {
            const tpl = STARTER_TEMPLATES[templateKey];
            if (tpl) {
              initialComponents = tpl.components;
              initialPalette = getPaletteById(tpl.paletteName) || PRESET_PALETTES[2];
              projName = tpl.name;
            }
          }

          // Create on backend
          try {
            const res = await fetch('/api/projects', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                name: projName,
                palette: initialPalette,
                components: initialComponents,
                versions: []
              })
            });
            if (res.ok) {
              const data = await res.json();
              store.loadProject(data.project);
            } else {
              store.createNewProject(projName, initialComponents);
            }
          } catch (e) {
            store.createNewProject(projName, initialComponents);
          }

          setCurrentView('studio');
        }}
      />
    );
  }

  // Authenticated: Main Studio Workspace
  const handleSendMessage = async ({ text, attachments, moodBoard }) => {
    setIsProcessing(true);

    // Add user message to conversation
    store.addMessage({
      sender: 'user',
      text,
      attachments
    });

    const isFirstGeneration = store.components.length === 0;
    const endpoint = isFirstGeneration ? '/api/design' : '/api/refine';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(store.settings.apiKey ? { 'X-API-Key': store.settings.apiKey } : {})
        },
        body: JSON.stringify({
          prompt: text,
          components: store.components,
          palette: store.palette,
          moodBoard,
          selectedId: store.selectedId,
          model: store.settings.model
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.components) {
        store.updateComponents(result.components, `AI: ${text}`);

        if (result.palette) {
          const pal = typeof result.palette === 'string'
            ? (getPaletteById(result.palette) || store.palette)
            : result.palette;
          store.setPalette(pal);
        }

        store.addMessage({
          sender: 'assistant',
          text: result.message || 'Updated the interface according to your instructions.',
          model: result.model || 'Gemma 4'
        });

        // Run automated checks on newly generated design
        handleRunDiagnostics(result.components);
      } else {
        throw new Error(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Error during AI operation:', err);
      store.addMessage({
        sender: 'assistant',
        text: `Error processing request: ${err.message}. Please check your backend status or API credentials in Settings.`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunDiagnostics = async (comps = store.components) => {
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: comps,
          palette: store.palette
        })
      });
      if (res.ok) {
        const report = await res.json();
        store.setDiagnosticsReport(report);
      }
    } catch (e) {
      console.warn('Failed to run diagnostics via API:', e);
    }
  };

  const handleDiagnose = async (issueDescription, errorContext) => {
    store.setIsDiagnosing(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(store.settings.apiKey ? { 'X-API-Key': store.settings.apiKey } : {})
        },
        body: JSON.stringify({
          issueDescription,
          components: store.components,
          selectedId: store.selectedId,
          errorContext
        })
      });

      if (!res.ok) {
        throw new Error(`Diagnostic request failed: ${res.statusText}`);
      }

      const diagnosis = await res.json();
      store.setActiveRepair(diagnosis);
      store.setActiveTab('debug');
    } catch (err) {
      console.error('Diagnosis failed:', err);
      alert('Failed to diagnose issue: ' + err.message);
    } finally {
      store.setIsDiagnosing(false);
    }
  };

  const handleApplyRepair = async (repair) => {
    try {
      const res = await fetch('/api/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: store.components,
          repairPatch: repair.proposedRepair
        })
      });

      if (res.ok) {
        const data = await res.json();
        store.applyRepair(repair);
        handleRunDiagnostics(data.components);
      } else {
        store.applyRepair(repair);
      }
    } catch (e) {
      store.applyRepair(repair);
    }
  };

  const handleSelectTemplate = (templateKey) => {
    if (templateKey === 'blank') {
      store.updateComponents([], 'Blank Canvas');
      store.setSelectedId(null);
      return;
    }

    const tpl = STARTER_TEMPLATES[templateKey];
    if (tpl) {
      store.updateComponents(tpl.components, `Template: ${tpl.name}`);
      const pal = getPaletteById(tpl.paletteName) || PRESET_PALETTES[2];
      store.setPalette(pal);
      store.setProjectName(tpl.name);
      store.setSelectedId(null);
    }
  };

  return (
    <div className="studio-app">
      {/* Top Navigation */}
      <TopNav
        projectName={store.projectName}
        onRenameProject={store.setProjectName}
        undo={store.undo}
        redo={store.redo}
        canUndo={store.past.length > 0}
        canRedo={store.future.length > 0}
        viewport={store.viewport}
        onChangeViewport={store.setViewport}
        zoom={store.zoom}
        onChangeZoom={store.setZoom}
        saveStatus={store.saveStatus}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onNavigateToDashboard={() => setCurrentView('dashboard')}
        user={user}
        onLogout={logout}
      />

      {/* Main Workspace (3-Panel Grid) */}
      <main className="studio-main-workspace">
        {/* Left: AI & Multimodal Inputs */}
        <LeftPanel
          messages={store.messages}
          onSendMessage={handleSendMessage}
          moodBoard={store.moodBoard}
          onAddMoodBoardItem={store.addMoodBoardItem}
          onRemoveMoodBoardItem={store.removeMoodBoardItem}
          isProcessing={isProcessing}
          selectedComponent={store.selectedComponent}
        />

        {/* Center: Live Rendered Canvas */}
        <LiveCanvas
          components={store.components}
          palette={store.palette}
          selectedId={store.selectedId}
          onSelectComponent={store.setSelectedId}
          onUpdateComponent={store.updateComponent}
          onDeleteComponent={store.deleteComponent}
          onDuplicateComponent={store.duplicateComponent}
          onMoveComponent={store.moveComponent}
          viewport={store.viewport}
          zoom={store.zoom}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          isGenerating={isProcessing}
        />

        {/* Right: Design, Properties, Debug, Code Tabs */}
        <RightPanel
          activeTab={store.activeTab}
          onSelectTab={store.setActiveTab}
          palette={store.palette}
          onSelectPalette={store.setPalette}
          onUpdateCustomColor={store.updateCustomColor}
          components={store.components}
          selectedComponent={store.selectedComponent}
          selectedId={store.selectedId}
          onUpdateComponent={store.updateComponent}
          onDuplicateComponent={store.duplicateComponent}
          onDeleteComponent={store.deleteComponent}
          onMoveComponent={store.moveComponent}
          canMoveUp={store.selectedId ? store.components.findIndex(c => c.id === store.selectedId) > 0 : false}
          canMoveDown={store.selectedId ? store.components.findIndex(c => c.id === store.selectedId) < store.components.length - 1 : false}
          activeRepair={store.activeRepair}
          onDiagnose={handleDiagnose}
          onApplyRepair={handleApplyRepair}
          onRejectRepair={() => store.setActiveRepair(null)}
          onUndoRepair={store.undoLastRepair}
          hasLastRepair={store.hasLastRepair}
          diagnosticsReport={store.diagnosticsReport}
          onRunDiagnostics={() => handleRunDiagnostics(store.components)}
          isDiagnosing={store.isDiagnosing}
          projectName={store.projectName}
        />
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        components={store.components}
        palette={store.palette}
        projectName={store.projectName}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={store.settings}
        onSaveSettings={store.setSettings}
      />

      <VersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={store.versions}
        onSaveSnapshot={store.saveSnapshot}
        onRestoreVersion={store.restoreVersion}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStudioApp />
    </AuthProvider>
  );
}
