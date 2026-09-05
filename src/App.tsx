import { useClinicalStore } from './hooks/useClinicalStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SourceInspectorDrawer } from './components/common/SourceInspectorDrawer';

import { OverviewView } from './components/views/OverviewView';
import { PatientInfoView } from './components/views/PatientInfoView';
import { ReportsView } from './components/views/ReportsView';
import { LabResultsView } from './components/views/LabResultsView';
import { ConflictsView } from './components/views/ConflictsView';
import { TimelineView } from './components/views/TimelineView';
import { AISummaryView } from './components/views/AISummaryView';

import { exportStructuredClinicalRecordToPrint } from './utils/exportReport';
import type { ActiveTab } from './hooks/useClinicalStore';

const TAB_LABELS: Record<ActiveTab, string> = {
  overview: 'Overview',
  patient: 'Patient Information',
  reports: 'Source Reports',
  labs: 'Lab Results',
  conflicts: 'Conflict Detector',
  timeline: 'Audit Timeline',
  summary: 'AI Summary',
};



export function App() {
  const {
    patient,
    reports,
    conflicts,
    timeline,
    aiSummary,
    activeTab,
    setActiveTab,
    selectedLabResultForSource,
    setSelectedLabResultForSource,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterProvenance,
    setFilterProvenance,
    allLabResults,
    filteredLabResults,
    updatePatientInfo,
    addPatientMedication,
    addPatientAllergy,
    addPatientCondition,
    addReport,
    verifyLabResult,
    resolveConflict,
    refreshAISummary,
  } = useClinicalStore();

  const handleExport = () => {
    exportStructuredClinicalRecordToPrint(
      patient,
      reports,
      allLabResults,
      conflicts,
      aiSummary
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#242126] flex flex-col font-sans selection:bg-[#C76D5B] selection:text-white">
      {/* ARIA live region — announces navigation changes to screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="page-announcer"
      >
        {TAB_LABELS[activeTab] ? `Navigated to: ${TAB_LABELS[activeTab]}` : ''}
      </div>

      <Header
        patient={patient}
        onOpenUpload={() => setActiveTab('reports')}
        onExport={handleExport}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reportCount={reports.length}
          labCount={allLabResults.length}
          conflictCount={conflicts.filter((c) => c.status === 'UNRESOLVED').length}
        />

        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
          aria-label={`${TAB_LABELS[activeTab] ?? 'Content'} panel`}
        >
          {activeTab === 'overview' && (
            <OverviewView
              patient={patient}
              reports={reports}
              labs={allLabResults}
              conflicts={conflicts}
              aiSummary={aiSummary}
              setActiveTab={setActiveTab}
              onInspectLab={(lab) => setSelectedLabResultForSource(lab)}
              onOpenUpload={() => setActiveTab('reports')}
            />
          )}

          {activeTab === 'patient' && (
            <PatientInfoView
              patient={patient}
              onUpdatePatient={updatePatientInfo}
              onAddMedication={addPatientMedication}
              onAddAllergy={addPatientAllergy}
              onAddCondition={addPatientCondition}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              reports={reports}
              onAddReport={addReport}
            />
          )}

          {activeTab === 'labs' && (
            <LabResultsView
              labs={allLabResults}
              filteredLabs={filteredLabResults}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterProvenance={filterProvenance}
              setFilterProvenance={setFilterProvenance}
              onInspectLab={(lab) => setSelectedLabResultForSource(lab)}
              onVerifyLab={(id) => verifyLabResult(id)}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictsView
              conflicts={conflicts}
              onResolveConflict={resolveConflict}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView timeline={timeline} />
          )}

          {activeTab === 'summary' && (
            <AISummaryView
              aiSummary={aiSummary}
              onRefreshSummary={refreshAISummary}
            />
          )}
        </main>
      </div>

      <SourceInspectorDrawer
        labResult={selectedLabResultForSource}
        onClose={() => setSelectedLabResultForSource(null)}
        onVerify={(id) => verifyLabResult(id)}
      />
    </div>
  );
}

export default App;
