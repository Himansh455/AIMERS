import React, { useState } from 'react';
import type { LabResult, LabStatus, ProvenanceType } from '../../types/clinical';
import { StatusBadge } from '../common/StatusBadge';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import {
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface LabResultsViewProps {
  labs: LabResult[];
  filteredLabs: LabResult[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: LabStatus | 'ALL';
  setFilterStatus: (s: LabStatus | 'ALL') => void;
  filterProvenance: ProvenanceType | 'ALL';
  setFilterProvenance: (p: ProvenanceType | 'ALL') => void;
  onInspectLab: (lab: LabResult) => void;
  onVerifyLab: (id: string) => void;
}

export const LabResultsView: React.FC<LabResultsViewProps> = ({
  labs,
  filteredLabs,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterProvenance,
  setFilterProvenance,
  onInspectLab,
  onVerifyLab,
}) => {
  const [showComparisonMode, setShowComparisonMode] = useState(false);

  const testGroups: { [key: string]: LabResult[] } = {};
  labs.forEach((lab) => {
    if (!testGroups[lab.testName]) {
      testGroups[lab.testName] = [];
    }
    testGroups[lab.testName].push(lab);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#242126]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D8CC] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#2B1E2F]">Structured Medical Record</h2>
          <p className="text-xs text-[#6F6870] mt-1">
            Structured laboratory test findings with explicit source reference-range classification and traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparisonMode(!showComparisonMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              showComparisonMode
                ? 'bg-[#2B1E2F] text-white border-[#2B1E2F]'
                : 'bg-white text-[#242126] border-[#E0D8CC] hover:bg-[#F7F4EE]'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{showComparisonMode ? 'Exit Comparison Mode' : 'Compare Historical Reports'}</span>
          </button>
        </div>
      </div>

      {!showComparisonMode && (
        <div className="bg-[#FCFAF6] border border-[#E0D8CC] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#6F6870]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test name or report..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E0D8CC] rounded-xl text-xs focus:ring-2 focus:ring-[#C08A3E] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1.5 text-[#6F6870]">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'ALL' || value === 'LOW' || value === 'NORMAL' || value === 'HIGH' || value === 'UNDETERMINED') {
                  setFilterStatus(value);
                }
              }}
              className="bg-white border border-[#E0D8CC] p-2 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#C08A3E]"
            >
              <option value="ALL">All Statuses</option>
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="UNDETERMINED">Cannot determine from source</option>
            </select>

            <div className="flex items-center gap-1.5 text-[#6F6870] ml-2">
              <span>Provenance:</span>
            </div>
            <select
              value={filterProvenance}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'ALL' || value === 'PATIENT_PROVIDED' || value === 'AI_EXTRACTED' || value === 'HUMAN_VERIFIED' || value === 'CONFLICTING' || value === 'MISSING') {
                  setFilterProvenance(value);
                }
              }}
              className="bg-white border border-[#E0D8CC] p-2 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#C08A3E]"
            >
              <option value="ALL">All Origins</option>
              <option value="PATIENT_PROVIDED">Patient-provided</option>
              <option value="AI_EXTRACTED">AI-extracted</option>
              <option value="AI_GENERATED">AI-generated</option>
              <option value="HUMAN_VERIFIED">Human-verified</option>
            </select>
          </div>
        </div>
      )}

      {!showComparisonMode ? (
        <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F4EE] border-b border-[#E0D8CC] text-[#2B1E2F]">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Test Name</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Result Value</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Units</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Report Reference Range</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Source Document</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Provenance</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D8CC] bg-white">
                {filteredLabs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-[#F7F4EE] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#2B1E2F] text-sm">{lab.testName}</div>
                      <div className="text-[11px] text-[#6F6870]">{lab.category || 'General'}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-sm text-[#242126]">
                      {lab.value}
                    </td>

                    <td className="py-4 px-4 font-mono text-[#6F6870]">
                      {lab.unit}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {lab.referenceRange ? (
                        <span className="text-[#242126]">{lab.referenceRange}</span>
                      ) : (
                        <span className="text-[#6F6870] italic">Reference range not provided</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={lab.status} size="sm" />
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-[#2B1E2F] truncate max-w-[150px]" title={lab.sourceReportName}>
                        {lab.sourceReportName}
                      </div>
                      <div className="text-[11px] text-[#6F6870]">{lab.sourceDate}</div>
                    </td>

                    <td className="py-4 px-4">
                      <ProvenanceBadge provenance={lab.provenance} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => onInspectLab(lab)}
                        className="px-3 py-1.5 bg-[#F7F4EE] hover:bg-[#2B1E2F] hover:text-white text-[#2B1E2F] rounded-lg font-semibold transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>

                      {lab.provenance === 'AI_EXTRACTED' && (
                        <button
                          onClick={() => onVerifyLab(lab.id)}
                          className="px-2.5 py-1.5 bg-[#EBF3ED] hover:bg-[#728B78] hover:text-white text-[#4F7359] border border-[#C3D9C9] rounded-lg font-semibold transition-colors inline-flex items-center gap-1 text-xs"
                          title="Verify extraction as human confirmed"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLabs.length === 0 && (
            <div className="p-12 text-center text-sm text-[#6F6870]">
              No laboratory results matched the selected filters.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E0D8CC] pb-3">
            <h3 className="text-base font-bold text-[#2B1E2F]">Historical Report Comparison</h3>
            <p className="text-xs text-[#6F6870]">
              Direct side-by-side comparison of lab values documented across historical report dates. No diagnostic inferences applied.
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(testGroups).map((testName) => {
              const group = testGroups[testName];
              if (group.length === 1) {
                const item = group[0];
                return (
                  <div key={testName} className="bg-white border border-[#E0D8CC] p-4 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#2B1E2F] text-sm">{testName}</span>
                      <span className="text-[#6F6870] ml-2">Single Report: {item.sourceDate}</span>
                    </div>
                    <div className="font-mono font-bold text-[#242126]">
                      {item.value} {item.unit}
                    </div>
                  </div>
                );
              }

              const sorted = [...group].sort((a, b) => new Date(a.sourceDate).getTime() - new Date(b.sourceDate).getTime());
              const prev = sorted[0];
              const curr = sorted[sorted.length - 1];

              const prevVal = parseFloat(prev.value);
              const currVal = parseFloat(curr.value);
              const isDiff = !isNaN(prevVal) && !isNaN(currVal);

              return (
                <div key={testName} className="bg-white border border-[#E0D8CC] p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-[#2B1E2F]">
                    <span>{testName}</span>
                    <span className="font-mono text-[#6F6870]">{curr.unit}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-[#F7F4EE] p-3 rounded-lg text-center items-center">
                    <div>
                      <span className="text-[10px] text-[#6F6870] uppercase block">Previous ({prev.sourceDate})</span>
                      <span className="font-mono font-bold text-[#242126]">{prev.value}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#6F6870] uppercase">Reported Trend</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-[#2B1E2F] mt-0.5">
                        {isDiff ? (
                          currVal > prevVal ? (
                            <span className="text-[#C76D5B] flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> +{(currVal - prevVal).toFixed(2)}</span>
                          ) : currVal < prevVal ? (
                            <span className="text-[#728B78] flex items-center gap-0.5"><TrendingDown className="w-3.5 h-3.5" /> -{(prevVal - currVal).toFixed(2)}</span>
                          ) : (
                            <span className="text-[#6F6870] flex items-center gap-0.5"><Minus className="w-3.5 h-3.5" /> No change</span>
                          )
                        ) : (
                          <span>Comparable</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6F6870] uppercase block">Current ({curr.sourceDate})</span>
                      <span className="font-mono font-bold text-[#242126]">{curr.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
