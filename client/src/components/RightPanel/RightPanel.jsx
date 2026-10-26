import React from 'react';
import DesignTab from './DesignTab.jsx';
import PropertiesTab from './PropertiesTab.jsx';
import DebugTab from './DebugTab.jsx';
import CodeTab from './CodeTab.jsx';
import { Palette, Sliders, Bug, Code } from 'lucide-react';

export default function RightPanel({
  activeTab,
  onSelectTab,
  palette,
  onSelectPalette,
  onUpdateCustomColor,
  components,
  selectedComponent,
  selectedId,
  onUpdateComponent,
  onDuplicateComponent,
  onDeleteComponent,
  onMoveComponent,
  canMoveUp,
  canMoveDown,
  activeRepair,
  onDiagnose,
  onApplyRepair,
  onRejectRepair,
  onUndoRepair,
  hasLastRepair,
  diagnosticsReport,
  onRunDiagnostics,
  isDiagnosing,
  projectName
}) {
  return (
    <aside className="studio-right-panel">
      {/* Tab Navigation Header */}
      <div className="studio-tab-header">
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => onSelectTab('design')}
        >
          <Palette size={14} />
          <span>Design</span>
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => onSelectTab('properties')}
        >
          <Sliders size={14} />
          <span>Properties</span>
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === 'debug' ? 'active' : ''}`}
          onClick={() => onSelectTab('debug')}
        >
          <Bug size={14} />
          <span>Debug</span>
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => onSelectTab('code')}
        >
          <Code size={14} />
          <span>Code</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'design' && (
        <DesignTab
          palette={palette}
          onSelectPalette={onSelectPalette}
          onUpdateCustomColor={onUpdateCustomColor}
        />
      )}

      {activeTab === 'properties' && (
        <PropertiesTab
          selectedComponent={selectedComponent}
          onUpdateComponent={onUpdateComponent}
          onDuplicateComponent={onDuplicateComponent}
          onDeleteComponent={onDeleteComponent}
          onMoveComponent={onMoveComponent}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {activeTab === 'debug' && (
        <DebugTab
          components={components}
          palette={palette}
          selectedId={selectedId}
          activeRepair={activeRepair}
          onDiagnose={onDiagnose}
          onApplyRepair={onApplyRepair}
          onRejectRepair={onRejectRepair}
          onUndoRepair={onUndoRepair}
          hasLastRepair={hasLastRepair}
          diagnosticsReport={diagnosticsReport}
          onRunDiagnostics={onRunDiagnostics}
          isDiagnosing={isDiagnosing}
        />
      )}

      {activeTab === 'code' && (
        <CodeTab
          components={components}
          palette={palette}
          projectName={projectName}
        />
      )}
    </aside>
  );
}
