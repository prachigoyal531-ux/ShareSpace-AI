import React from 'react';
import { Resource } from '../../types';
import { useApp } from '../../context/AppContext';
import { ResourceIllustration } from './ResourceIllustration';
import { MapPin, Clock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  resource: Resource;
}

export const ResourceCard: React.FC<Props> = ({ resource }) => {
  const { navigateToResource, setBookingModalResource, currentUser, role, currentPage } = useApp();

  // Check student eligibility
  const missingPrereqs = role === 'student'
    ? resource.eligibilityRequirements.filter(
        req => !currentUser.verifiedCertifications.some(cert => req.toLowerCase().includes(cert.toLowerCase()) || cert.toLowerCase().includes(req.toLowerCase()))
      )
    : [];

  const isEligible = missingPrereqs.length === 0;

  // Status color styles
  const statusStyles: Record<string, { text: string; bg: string; border: string }> = {
    Available: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'In Use': { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    Reserved: { text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
    Maintenance: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  };

  const currentStatus = statusStyles[resource.status] || {
    text: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Visual Top Banner */}
        <div className="cursor-pointer" onClick={() => navigateToResource(resource.id, currentPage)}>
          <ResourceIllustration category={resource.category} name={resource.name} className="h-36 w-full transition-transform duration-300 group-hover:scale-[1.01]" />
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Unboxed Metadata Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded text-[11px]">
                {resource.id}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-900 font-semibold">{resource.category}</span>
            </div>
            <div className={`px-2 py-0.5 rounded text-xs font-medium border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
              {resource.status}
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigateToResource(resource.id, currentPage)}
            className="text-base font-bold text-slate-900 hover:text-sky-700 transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {resource.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {resource.description}
          </p>

          {/* Location & Duration Info */}
          <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{resource.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Max duration: {resource.maxBookingDurationHours} hours · {resource.leadTimeHours}h notice</span>
            </div>
          </div>

          {/* Eligibility Indicator */}
          {role === 'student' && (
            <div className="mb-2">
              {isEligible ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Eligible to reserve</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="truncate" title={`Prerequisite: ${missingPrereqs[0]}`}>
                    Prereq: {missingPrereqs[0]}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-slate-100">
        <button
          onClick={() => navigateToResource(resource.id, currentPage)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {resource.status === 'Available' ? (
          <button
            onClick={() => setBookingModalResource(resource)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
          >
            Book Slot
          </button>
        ) : resource.status === 'In Use' || resource.status === 'Reserved' ? (
          <button
            onClick={() => setBookingModalResource(resource)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
          >
            Join Waitlist
          </button>
        ) : (
          <button
            disabled
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
          >
            In Maintenance
          </button>
        )}
      </div>
    </div>
  );
};
