import React, { useState, useEffect } from 'react';
import { useProject } from './state/useProjectStore.js';
import { PRESET_PALETTES, getPaletteById } from './state/palettes.js';
import { STARTER_TEMPLATES } from './state/starterTemplates.js';

import TopNav from './components/TopNav.jsx';
import LeftPanel from './components/LeftPanel/LeftPanel.jsx';
import LiveCanvas from './components/Canvas/LiveCanvas.jsx';
import RightPanel from './components/RightPanel/RightPanel.jsx';

import ExportModal from './components/Modals/ExportModal.jsx';
import SettingsModal from './components/Modals/SettingsModal.jsx';
import VersionModal from './components/Modals/VersionModal.jsx';
import NewProjectModal from './components/Modals/NewProjectModal.jsx';

export default function App() {
  const store = useProject();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Global Keyboard Shortcuts (Undo, Redo, Esc)
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

  // Handle Send Message (Generation or Refinement)
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
        headers: { 'Content-Type': 'application/json' },
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

  // Run Automated Diagnostic Suite
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
      console.warn('Failed to run diagnostics via API, running locally:', e);
    }
  };

  // Diagnose specific reported issue
  const handleDiagnose = async (issueDescription, errorContext) => {
    store.setIsDiagnosing(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Apply proposed repair
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
        // Verify fix
        handleRunDiagnostics(data.components);
      } else {
        // Fallback local apply
        store.applyRepair(repair);
      }
    } catch (e) {
      store.applyRepair(repair);
    }
  };

  // Handle template selection from New Project Modal
  const handleSelectTemplate = (templateKey) => {
    if (templateKey === 'blank') {
      store.updateComponents([], 'Blank Canvas');
      store.setProjectName('Untitled Project');
      store.setSelectedId(null);
      return;
    }

    const tpl = STARTER_TEMPLATES[templateKey];
    if (tpl) {
      store.loadTemplate(tpl);
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
