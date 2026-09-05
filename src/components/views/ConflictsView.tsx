import React from 'react';
import type { ConflictItem } from '../../types/clinical';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConflictsViewProps {
  conflicts: ConflictItem[];
  onResolveConflict: (conflictId: string, resolution: 'RESOLVED_SOURCE_A' | 'RESOLVED_SOURCE_B') => void;
}

export const ConflictsView: React.FC<ConflictsViewProps> = ({ conflicts, onResolveConflict }) => {
  const unresolved = conflicts.filter((c) => c.status === 'UNRESOLVED');
  const resolved = conflicts.filter((c) => c.status !== 'UNRESOLVED');

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#242126]">
      <div className="border-b border-[#E0D8CC] pb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-[#C08A3E]" />
          <h2 className="text-2xl font-bold text-[#2B1E2F]">Conflict Resolution Center</h2>
        </div>
        <p className="text-xs text-[#6F6870] mt-1">
          Detects discrepancies across patient-provided records and uploaded report extractions. Human decision required.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#2B1E2F] flex items-center justify-between">
          <span>Pending Discrepancies Requiring Review ({unresolved.length})</span>
          <span className="text-xs font-mono font-normal text-[#6F6870]">Source Provenance Conflict</span>
        </h3>

        {unresolved.length > 0 ? (
          <div className="space-y-6">
            {unresolved.map((conflict) => (
              <div
                key={conflict.id}
                className="bg-[#FCFAF6] border-2 border-[#C08A3E] rounded-2xl p-6 shadow-md space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C08A3E] font-bold">
                      {conflict.category} Conflict
                    </span>
                    <h4 className="text-lg font-bold text-[#2B1E2F] mt-0.5">{conflict.field}</h4>
                  </div>
                  <span className="bg-[#FDF3E7] text-[#C08A3E] border border-[#F4D9B4] px-3 py-1 rounded-full text-xs font-bold">
                    Action Required
                  </span>
                </div>

                <p className="text-xs text-[#6F6870] leading-relaxed">
                  The available clinical sources contain contradicting information. Review both sources below and select which record to preserve as confirmed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2B1E2F]">{conflict.sourceA.title}</span>
                        <ProvenanceBadge provenance={conflict.sourceA.provenance} size="sm" />
                      </div>
                      <div className="font-mono text-sm font-bold text-[#2B1E2F] bg-[#F7F4EE] p-3 rounded-lg border border-[#E0D8CC]">
                        "{conflict.sourceA.value}"
                      </div>
                      {conflict.sourceA.date && (
                        <div className="text-[11px] text-[#6F6870]">Recorded: {conflict.sourceA.date}</div>
                      )}
                    </div>

                    <button
                      onClick={() => onResolveConflict(conflict.id, 'RESOLVED_SOURCE_A')}
                      className="w-full bg-[#728B78] hover:bg-[#5C7361] text-white py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#728B78]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Keep Patient Intake Record
                    </button>
                  </div>

                  <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2B1E2F]">{conflict.sourceB.title}</span>
                        <ProvenanceBadge provenance={conflict.sourceB.provenance} size="sm" />
                      </div>
                      <div className="font-mono text-sm font-bold text-[#2B1E2F] bg-[#F7F4EE] p-3 rounded-lg border border-[#E0D8CC]">
                        "{conflict.sourceB.value}"
                      </div>
                      {conflict.sourceB.date && (
                        <div className="text-[11px] text-[#6F6870]">Report Date: {conflict.sourceB.date}</div>
                      )}
                    </div>

                    <button
                      onClick={() => onResolveConflict(conflict.id, 'RESOLVED_SOURCE_B')}
                      className="w-full bg-[#2B1E2F] hover:bg-[#3E2D44] text-white py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C08A3E]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Keep Source Report Record
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#FCFAF6] border border-[#E0D8CC] p-8 rounded-2xl text-center text-xs text-[#6F6870]">
            <CheckCircle2 className="w-8 h-8 text-[#728B78] mx-auto mb-2" />
            <span>All source conflicts resolved. No active discrepancies detected.</span>
          </div>
        )}
      </div>

      {resolved.length > 0 && (
        <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-[#2B1E2F] text-sm">Resolved Inconsistency Audit Log</h3>
          <div className="space-y-2">
            {resolved.map((res) => (
              <div key={res.id} className="bg-white border border-[#E0D8CC] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-[#2B1E2F]">{res.field}</strong>
                  <div className="text-[#6F6870] mt-0.5">
                    Resolved in favor of: {res.status === 'RESOLVED_SOURCE_A' ? res.sourceA.title : res.sourceB.title}
                  </div>
                </div>
                <span className="bg-[#EBF3ED] text-[#4F7359] border border-[#C3D9C9] px-2.5 py-1 rounded font-semibold text-[11px]">
                  Resolved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
