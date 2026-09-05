import React, { useState } from 'react';
import type { PatientProfile, PatientMedication, PatientAllergy, PatientCondition } from '../../types/clinical';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { User, Plus, Edit2, Save, AlertCircle } from 'lucide-react';

interface PatientInfoViewProps {
  patient: PatientProfile;
  onUpdatePatient: (updated: Partial<PatientProfile>) => void;
  onAddMedication: (med: Omit<PatientMedication, 'id'>) => void;
  onAddAllergy: (allergy: Omit<PatientAllergy, 'id'>) => void;
  onAddCondition: (cond: Omit<PatientCondition, 'id'>) => void;
}

export const PatientInfoView: React.FC<PatientInfoViewProps> = ({
  patient,
  onUpdatePatient,
  onAddMedication,
  onAddAllergy,
  onAddCondition,
}) => {
  const [isEditingBase, setIsEditingBase] = useState(false);
  const [baseForm, setBaseForm] = useState({
    name: patient.name,
    age: patient.age,
    sex: patient.sex,
    dob: patient.dob,
  });

  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

  const [showAddAlg, setShowAddAlg] = useState(false);
  const [newAlg, setNewAlg] = useState({ allergen: '', reaction: '', severity: 'MODERATE' as const });

  const [showAddCond, setShowAddCond] = useState(false);
  const [newCond, setNewCond] = useState({ name: '', status: 'ACTIVE' as const });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSaveBase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseForm.name.trim()) {
      setValidationError('Patient name cannot be empty.');
      return;
    }
    if (baseForm.age <= 0 || baseForm.age > 120) {
      setValidationError('Please enter a valid age between 1 and 120.');
      return;
    }

    setValidationError(null);
    onUpdatePatient(baseForm);
    setIsEditingBase(false);
  };

  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name.trim()) return;
    onAddMedication({
      name: newMed.name,
      dosage: newMed.dosage || 'Unspecified',
      frequency: newMed.frequency || 'Daily',
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Entered during patient intake session',
    });
    setNewMed({ name: '', dosage: '', frequency: '' });
    setShowAddMed(false);
  };

  const handleSaveAlg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlg.allergen.trim()) return;
    onAddAllergy({
      allergen: newAlg.allergen,
      reaction: newAlg.reaction || 'Unspecified reaction',
      severity: newAlg.severity,
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Entered during patient intake session',
    });
    setNewAlg({ allergen: '', reaction: '', severity: 'MODERATE' });
    setShowAddAlg(false);
  };

  const handleSaveCond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCond.name.trim()) return;
    onAddCondition({
      name: newCond.name,
      status: newCond.status,
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Entered during patient intake session',
    });
    setNewCond({ name: '', status: 'ACTIVE' });
    setShowAddCond(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#242126]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D8CC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#2B1E2F]">Patient Information Intake</h2>
            <ProvenanceBadge provenance="PATIENT_PROVIDED" />
          </div>
          <p className="text-xs text-[#6F6870] mt-1">
            Patient-reported clinical history, demographic details, symptoms, and active medications.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="bg-[#FDF1F0] border border-[#F2C7C2] text-[#A54E43] p-4 rounded-xl text-xs flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2B1E2F]" />
            <h3 className="text-base font-bold text-[#2B1E2F]">Demographic Profile</h3>
          </div>
          {!isEditingBase ? (
            <button
              onClick={() => setIsEditingBase(true)}
              className="text-xs font-semibold text-[#2B1E2F] hover:bg-[#F7F4EE] px-3 py-1.5 rounded-lg border border-[#E0D8CC] transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSaveBase}
              className="text-xs font-semibold text-white bg-[#728B78] hover:bg-[#5C7361] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          )}
        </div>

        {!isEditingBase ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870] block">Full Name</span>
              <span className="font-bold text-[#2B1E2F] text-base">{patient.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870] block">MRN</span>
              <span className="font-mono font-medium text-[#242126]">{patient.mrn}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870] block">Age & Sex</span>
              <span className="font-medium text-[#242126]">{patient.age} years / {patient.sex}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870] block">Date of Birth</span>
              <span className="font-medium text-[#242126]">{patient.dob}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveBase} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#6F6870] mb-1">Full Name</label>
              <input
                type="text"
                value={baseForm.name}
                onChange={(e) => setBaseForm({ ...baseForm, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-lg focus:ring-2 focus:ring-[#C08A3E]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6F6870] mb-1">Age (Years)</label>
              <input
                type="number"
                value={baseForm.age}
                onChange={(e) => setBaseForm({ ...baseForm, age: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-lg focus:ring-2 focus:ring-[#C08A3E]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6F6870] mb-1">Sex</label>
              <select
                value={baseForm.sex}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'Female' || value === 'Male' || value === 'Other') {
                    setBaseForm({ ...baseForm, sex: value });
                  }
                }}
                className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-lg focus:ring-2 focus:ring-[#C08A3E]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#6F6870] mb-1">Date of Birth</label>
              <input
                type="text"
                value={baseForm.dob}
                onChange={(e) => setBaseForm({ ...baseForm, dob: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-lg focus:ring-2 focus:ring-[#C08A3E]"
              />
            </div>
          </form>
        )}
      </div>

      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#2B1E2F]">Reported Symptoms (Intake History)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patient.symptoms.map((sym) => (
            <div key={sym.id} className="bg-white border border-[#E0D8CC] p-4 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2B1E2F] text-sm">{sym.description}</div>
              <div className="text-[#6F6870]">OnsetDate: {sym.onsetDate || 'Not specified'} • Severity: {sym.severity}</div>
              {sym.notes && <div className="text-[#6F6870] italic pt-1">{sym.notes}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
          <h3 className="text-base font-bold text-[#2B1E2F]">Active Medications</h3>
          <button
            onClick={() => setShowAddMed(!showAddMed)}
            className="text-xs font-semibold text-white bg-[#2B1E2F] hover:bg-[#3E2D44] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Medication
          </button>
        </div>

        {showAddMed && (
          <form onSubmit={handleSaveMed} className="bg-[#F7F4EE] border border-[#E0D8CC] p-4 rounded-xl space-y-3 text-xs">
            <div className="font-semibold text-[#2B1E2F]">New Patient-Provided Medication</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Medication Name (e.g. Metformin)"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                className="p-2 bg-white border border-[#E0D8CC] rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Dosage (e.g. 500 mg)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="p-2 bg-white border border-[#E0D8CC] rounded-lg"
              />
              <input
                type="text"
                placeholder="Frequency (e.g. Twice daily)"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="p-2 bg-white border border-[#E0D8CC] rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddMed(false)}
                className="px-3 py-1.5 text-[#6F6870] hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#728B78] text-white font-semibold rounded-lg"
              >
                Add Entry
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patient.medications.map((med) => (
            <div key={med.id} className="bg-white border border-[#E0D8CC] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B1E2F] text-sm">{med.name} {med.dosage}</span>
                <ProvenanceBadge provenance={med.source} size="sm" />
              </div>
              <div className="text-[#6F6870]">Frequency: {med.frequency}</div>
              <div className="text-[#6F6870] text-[11px] bg-[#F7F4EE] p-2 rounded border border-[#E0D8CC]">
                {med.sourceDetail}
              </div>
              {med.notes && <div className="text-[#C08A3E] font-medium pt-1">{med.notes}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
            <h3 className="text-base font-bold text-[#2B1E2F]">Allergies</h3>
            <button
              onClick={() => setShowAddAlg(!showAddAlg)}
              className="text-xs font-semibold text-[#2B1E2F] hover:bg-[#F7F4EE] px-2.5 py-1 rounded-lg border border-[#E0D8CC] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {showAddAlg && (
            <form onSubmit={handleSaveAlg} className="bg-[#F7F4EE] p-3 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                placeholder="Allergen Name (e.g. Penicillin)"
                value={newAlg.allergen}
                onChange={(e) => setNewAlg({ ...newAlg, allergen: e.target.value })}
                className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Reaction (e.g. Hives, Anaphylaxis)"
                value={newAlg.reaction}
                onChange={(e) => setNewAlg({ ...newAlg, reaction: e.target.value })}
                className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-3 py-1 bg-[#728B78] text-white rounded font-semibold">Save</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {patient.allergies.map((alg) => (
              <div key={alg.id} className="bg-white border border-[#F2C7C2] p-3.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#A54E43] text-sm">{alg.allergen}</span>
                  <span className="text-[10px] uppercase font-bold text-[#A54E43] bg-[#FDF1F0] px-2 py-0.5 rounded border border-[#F2C7C2]">
                    {alg.severity}
                  </span>
                </div>
                <div className="text-[#242126]">Reaction: {alg.reaction}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
            <h3 className="text-base font-bold text-[#2B1E2F]">Existing Conditions</h3>
            <button
              onClick={() => setShowAddCond(!showAddCond)}
              className="text-xs font-semibold text-[#2B1E2F] hover:bg-[#F7F4EE] px-2.5 py-1 rounded-lg border border-[#E0D8CC] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {showAddCond && (
            <form onSubmit={handleSaveCond} className="bg-[#F7F4EE] p-3 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                placeholder="Condition Name (e.g. Asthma)"
                value={newCond.name}
                onChange={(e) => setNewCond({ ...newCond, name: e.target.value })}
                className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-3 py-1 bg-[#728B78] text-white rounded font-semibold">Save</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {patient.conditions.map((cond) => (
              <div key={cond.id} className="bg-white border border-[#E0D8CC] p-3.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B1E2F] text-sm">{cond.name}</span>
                  <span className="text-[10px] uppercase font-bold text-[#728B78] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#C3D9C9]">
                    {cond.status}
                  </span>
                </div>
                <div className="text-[#6F6870]">Diagnosed: {cond.diagnosedDate || 'Historical'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
