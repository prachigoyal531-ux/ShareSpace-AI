import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory } from '../types';
import {
  PlusCircle,
  X,
  FileCheck2,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AddResourcePage: React.FC = () => {
  const { addResource, currentUser, setCurrentPage } = useApp();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ResourceCategory>('Laboratories');
  const [department, setDepartment] = useState<string>('Robotics & Mechanical Engineering');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specInput, setSpecInput] = useState<string>('');
  const [specifications, setSpecifications] = useState<string[]>([
    'Dual high-resolution displays',
    'Standard AC power distribution & Gigabit ethernet'
  ]);
  const [ruleInput, setRuleInput] = useState<string>('');
  const [rules, setRules] = useState<string[]>([
    'Mandatory safety glasses required at all times',
    'Return equipment in cleaned state 15 minutes before expiration'
  ]);
  const [eligibilityInput, setEligibilityInput] = useState<string>('');
  const [eligibilityRequirements, setEligibilityRequirements] = useState<string[]>([
    'Lab Safety Induction Level 2'
  ]);
  const [maxDuration, setMaxDuration] = useState<number>(4);
  const [weeklyLimit, setWeeklyLimit] = useState<number>(12);
  const [requiresApproval, setRequiresApproval] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleAddSpec = () => {
    if (specInput.trim()) {
      setSpecifications([...specifications, specInput.trim()]);
      setSpecInput('');
    }
  };

  const handleAddRule = () => {
    if (ruleInput.trim()) {
      setRules([...rules, ruleInput.trim()]);
      setRuleInput('');
    }
  };

  const handleAddEligibility = () => {
    if (eligibilityInput.trim()) {
      setEligibilityRequirements([...eligibilityRequirements, eligibilityInput.trim()]);
      setEligibilityInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !description.trim()) return;

    addResource({
      name,
      category,
      department,
      location,
      ownerName: currentUser.name,
      ownerEmail: currentUser.email,
      status: 'Available',
      description,
      specifications: specifications.length > 0 ? specifications : ['Standard university specifications apply'],
      rules: rules.length > 0 ? rules : ['Adhere to student code of conduct'],
      eligibilityRequirements: eligibilityRequirements.length > 0 ? eligibilityRequirements : ['Standard enrolled student ID'],
      maxBookingDurationHours: Number(maxDuration),
      leadTimeHours: 2,
      requiresApproval,
      fairUseWeeklyLimitHours: Number(weeklyLimit),
      imageCategory: category
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Resource Registered Successfully!</h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          <strong>{name}</strong> has been added to the campus shared inventory under {category}. Students can now
          discover and book it.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => {
              setIsSuccess(false);
              setName('');
              setLocation('');
              setDescription('');
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Add Another Resource
          </button>
          <button
            onClick={() => setCurrentPage('explore')}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add & Register College Resource</h1>
        <p className="text-xs text-slate-500">
          Publish underused university laboratories, specialized compute, or audiovisual gear to the sharing platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
        {/* Core Metadata */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-700" />
            <span>General Asset Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resource Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Bio-Imaging Confocal Microscope Suite"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resource Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ResourceCategory)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Laboratories">Laboratories</option>
                <option value="Laptops">Laptops</option>
                <option value="Cameras">Cameras</option>
                <option value="Projectors">Projectors</option>
                <option value="3D Printers">3D Printers</option>
                <option value="Seminar Rooms">Seminar Rooms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Mechanical & Aerospace Engineering"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Physical Campus Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Aryabhata Block Room 315, Sitapura Campus"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description & Purpose</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain what this space or gear offers, ideal project scopes, and research capabilities..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Specifications & Rules */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-sky-700" />
            <span>Specifications & Usage Rules</span>
          </h2>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Technical Specifications</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={specInput}
                onChange={e => setSpecInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                placeholder="Add specification feature..."
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {specifications.map((s, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => setSpecifications(specifications.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Safety & Handling Rules</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={ruleInput}
                onChange={e => setRuleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                placeholder="Add usage rule..."
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rules.map((r, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => setRules(rules.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Eligibility & Fair Use Quotas */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>Eligibility Requirements & Fair Usage Policy</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Eligibility Requirements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={eligibilityInput}
                onChange={e => setEligibilityInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddEligibility())}
                placeholder="e.g. Lab Safety Induction Level 2, Minimum GPA 3.0..."
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddEligibility}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {eligibilityRequirements.map((e, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span>{e}</span>
                  <button
                    type="button"
                    onClick={() => setEligibilityRequirements(eligibilityRequirements.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Single Booking (Hours)</label>
              <input
                type="number"
                min={1}
                max={72}
                value={maxDuration}
                onChange={e => setMaxDuration(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fair Use Weekly Limit (Hours)</label>
              <input
                type="number"
                min={1}
                max={168}
                value={weeklyLimit}
                onChange={e => setWeeklyLimit(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={e => setRequiresApproval(e.target.checked)}
                  className="rounded text-sky-700 focus:ring-sky-500"
                />
                <span>Requires Owner Approval</span>
              </label>
              <p className="text-[11px] text-slate-400">If unchecked, slots are instantly confirmed.</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage('explore')}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2.5 px-6 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl transition-colors shadow-xs"
          >
            Register Asset & Publish to Platform
          </button>
        </div>
      </form>
    </div>
  );
};
