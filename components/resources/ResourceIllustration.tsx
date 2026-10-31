import React from 'react';
import { ResourceCategory } from '../../types';
import {
  FlaskConical,
  Laptop,
  Camera,
  Projector,
  Printer,
  Users,
  Cpu,
  Microscope,
  Box
} from 'lucide-react';

interface Props {
  category: ResourceCategory;
  name?: string;
  className?: string;
}

export const ResourceIllustration: React.FC<Props> = ({ category, name = '', className = 'h-40 w-full' }) => {
  switch (category) {
    case 'Laboratories':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-2 shadow-inner">
              {name.toLowerCase().includes('robot') ? (
                <Cpu className="w-7 h-7" />
              ) : name.toLowerCase().includes('nano') ? (
                <Microscope className="w-7 h-7" />
              ) : (
                <FlaskConical className="w-7 h-7" />
              )}
            </div>
            <span className="text-xs font-mono tracking-wider text-sky-300 uppercase">Specialized Lab Facility</span>
          </div>
        </div>
      );

    case 'Laptops':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#818cf8_1px,transparent_1px),linear-gradient(to_bottom,#818cf8_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300 mb-2 shadow-inner">
              <Laptop className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono tracking-wider text-indigo-200 uppercase">High-Performance Computing</span>
          </div>
        </div>
      );

    case 'Cameras':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-300 mb-2 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono tracking-wider text-amber-200 uppercase">Cinema & AV Capture Kit</span>
          </div>
        </div>
      );

    case 'Projectors':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,#06b6d4_1px,transparent_1px)] bg-[size:18px_18px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-2 shadow-inner">
              <Projector className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono tracking-wider text-cyan-200 uppercase">Laser & 4K Projection</span>
          </div>
        </div>
      );

    case '3D Printers':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-2 shadow-inner">
              <Printer className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono tracking-wider text-emerald-300 uppercase">Rapid Prototyping Fab</span>
          </div>
        </div>
      );

    case 'Seminar Rooms':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-2 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono tracking-wider text-blue-200 uppercase">Collaborative Suite</span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`bg-slate-900 flex items-center justify-center p-6 ${className}`}>
          <Box className="w-8 h-8 text-slate-400" />
        </div>
      );
  }
};
