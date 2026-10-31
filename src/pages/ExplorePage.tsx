import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, ResourceStatus } from '../types';
import { ResourceCard } from '../components/resources/ResourceCard';
import { Search, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { resources, setIsAiModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Available categories
  const categories: string[] = [
    'All',
    'Laboratories',
    'Laptops',
    'Cameras',
    'Projectors',
    '3D Printers',
    'Seminar Rooms'
  ];

  // Unique departments
  const departments = useMemo(() => {
    const deps = new Set(resources.map(r => r.department));
    return ['All', ...Array.from(deps)];
  }, [resources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      // Category filter
      if (selectedCategory !== 'All' && res.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && res.status !== selectedStatus) {
        return false;
      }
      // Department filter
      if (selectedDepartment !== 'All' && res.department !== selectedDepartment) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${res.name} ${res.category} ${res.department} ${res.location} ${res.description} ${res.specifications.join(' ')}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [resources, selectedCategory, selectedStatus, selectedDepartment, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedDepartment('All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore College Resources</h1>
          <p className="text-xs text-slate-500">
            Browse and reserve university equipment, research labs, and collaboration spaces
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="py-2 px-3.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need help choosing? Ask AI Matcher</span>
        </button>
      </div>

      {/* Search & Filter Controls Surface */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by equipment name, GPU/specs, building location, or department..."
            className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Strip (Status + Department) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Only</option>
                <option value="In Use">In Use</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Department:</span>
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-[220px] truncate"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 tabular-nums">
              Showing <strong>{filteredResources.length}</strong> of {resources.length} resources
            </span>
            {(selectedCategory !== 'All' || selectedStatus !== 'All' || selectedDepartment !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching campus resources found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the category filter, or using the AI Resource Matcher.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
