import React from 'react';
import type { PatientProfile } from '../../types/clinical';
import { PrivacyBadge } from './PrivacyBadge';
import { Activity, Upload, Download } from 'lucide-react';

interface HeaderProps {
  patient: PatientProfile;
  onOpenUpload: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ patient, onOpenUpload, onExport }) => {
  return (
    <header className="bg-[#2B1E2F] text-white border-b border-[#3E2D44] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C76D5B] text-white flex items-center justify-center font-bold shadow-inner">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#F7F4EE]">MEDLENS</h1>
              <span className="bg-[#728B78]/30 border border-[#728B78]/50 text-[#C3D9C9] text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                v2.4 Clinical Review
              </span>
            </div>
            <p className="text-xs text-[#D9CEC1] hidden sm:block">AI-Powered Clinical Information Intelligence</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-[#3E2D44]/60 border border-[#523B59] px-3.5 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#728B78] text-white font-semibold text-xs flex items-center justify-center">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-[#F7F4EE] flex items-center gap-1.5">
              <span>{patient.name}</span>
              <span className="text-[#D9CEC1] font-mono">({patient.mrn})</span>
            </div>
            <div className="text-[#D9CEC1]">
              {patient.age}y {patient.sex} • DOB: {patient.dob}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <PrivacyBadge />
          </div>

          <button
            onClick={onOpenUpload}
            className="bg-[#C76D5B] hover:bg-[#B35C4B] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C76D5B]"
            aria-label="Upload medical report document"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Report</span>
          </button>

          <button
            onClick={onExport}
            className="bg-[#3E2D44] hover:bg-[#523B59] text-[#F7F4EE] border border-[#523B59] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Export structured clinical record to PDF or print"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Record</span>
          </button>
        </div>
      </div>
    </header>
  );
};
