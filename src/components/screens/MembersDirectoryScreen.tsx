import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Download, 
  ScanLine, 
  UserPlus, 
  Search, 
  SlidersHorizontal, 
  RotateCw, 
  MessageSquare, 
  Key, 
  MoreVertical, 
  CreditCard,
  Send,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types';

export const MembersDirectoryScreen: React.FC = () => {
  const { 
    members, 
    navigateToMember, 
    navigateToRenewal, 
    setCurrentScreen, 
    setIsScannerOpen, 
    setIsBulkReminderOpen,
    setIsWhatsAppModalOpen,
    setSelectedMemberId,
    currentBranch 
  } = useGym();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('all');
  const [selectedTrainerFilter, setSelectedTrainerFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredMembers = members.filter(m => {
    if (activeTab === 'active' && m.status !== 'active') return false;
    if (activeTab === 'expiring' && m.status !== 'expiring') return false;
    if (activeTab === 'expired' && m.status !== 'expired') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = m.name.toLowerCase().includes(term);
      const matchId = m.id.toLowerCase().includes(term);
      const matchPhone = m.phone.includes(term);
      if (!matchName && !matchId && !matchPhone) return false;
    }

    if (selectedPlanFilter !== 'all') {
      if (!m.planName.toLowerCase().includes(selectedPlanFilter.toLowerCase())) return false;
    }

    if (selectedGenderFilter !== 'all') {
      if (m.gender.toLowerCase() !== selectedGenderFilter.toLowerCase()) return false;
    }

    if (selectedTrainerFilter !== 'all') {
      if (!m.assignedTrainer?.toLowerCase().includes(selectedTrainerFilter.toLowerCase())) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map(m => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Phone,Email,Plan,Status,Expiry Date,Fee Paid"]
      .concat(members.map(m => `"${m.id}","${m.name}","${m.phone}","${m.email}","${m.planName}","${m.status}","${m.expiryDate}","${m.planPrice}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `muscleup_members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initials generator
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getInitialsBg = (name: string) => {
    const colors = [
      'bg-emerald-100 text-emerald-800',
      'bg-amber-100 text-amber-800',
      'bg-indigo-100 text-indigo-800',
      'bg-rose-100 text-rose-800',
      'bg-cyan-100 text-cyan-800'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header breadcrumb & title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>DIRECTORY • ROSTER v4.2</span>
            <span>•</span>
            <span className="text-slate-700">{currentBranch}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Members Directory
            </h1>
            <span className="text-sm font-semibold text-slate-500 font-inter">
              1,248 total enrolled
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-slate-500" />
            <span>Quick Scan</span>
          </button>
          <button
            onClick={() => setCurrentScreen('add-member')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#65a30d] hover:bg-[#558b09] text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Access */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Active Access</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            982
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>+12 this wk</span>
          </div>
        </div>

        {/* Expiring (<7 Days) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Expiring (&lt;7 Days)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2 font-jakarta font-tnum">
            38
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-500">
            Auto-SMS sent
          </div>
        </div>

        {/* Expired / Overdue */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Expired / Overdue</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2 font-jakarta font-tnum">
            64
          </div>
          <div className="mt-2 text-xs font-semibold text-rose-600">
            Gate restricted
          </div>
        </div>

        {/* Avg Renewal Rate */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Avg Renewal Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            84.2%
          </div>
          <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
            <span>+2.4% MoM</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Search & Tabs Row */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by member name or Member ID..."
              className="w-full h-9 pl-9 pr-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#65a30d]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (1,248)
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active (982)
            </button>
            <button
              onClick={() => setActiveTab('expiring')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'expiring'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Expiring Soon (38)
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'expired'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Expired (64)
            </button>
          </div>
        </div>

        {/* Secondary Filter Row & Batch Operations */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Plan Filter */}
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Plan: All Plans</option>
              <option value="yearly">Yearly Prime / All-Access</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* Gender Filter */}
            <select
              value={selectedGenderFilter}
              onChange={(e) => setSelectedGenderFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Gender: All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Trainer Filter */}
            <select
              value={selectedTrainerFilter}
              onChange={(e) => setSelectedTrainerFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Trainer: All Assigned</option>
              <option value="sandeep">Coach Sandeep Kumar</option>
              <option value="vikram">Coach Vikram</option>
              <option value="arjun">PT: Arjun Reddy</option>
              <option value="karan">PT: Karan Joshi</option>
            </select>

            {(selectedPlanFilter !== 'all' || selectedGenderFilter !== 'all' || selectedTrainerFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedPlanFilter('all');
                  setSelectedGenderFilter('all');
                  setSelectedTrainerFilter('all');
                  setSearchTerm('');
                }}
                className="text-slate-500 hover:text-slate-800 underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Batch operations */}
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Batch operations:</span>
            <button
              onClick={() => setIsBulkReminderOpen(true)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Send Bulk WhatsApp</span>
            </button>
            <button
              onClick={() => alert(`Generating badges for ${selectedIds.length || filteredMembers.length} members`)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 text-xs transition-colors"
            >
              Generate ID Badges
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredMembers.length}
                    onChange={toggleSelectAll}
                    className="rounded text-[#65a30d] focus:ring-0"
                  />
                </th>
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Active Plan & Trainer</th>
                <th className="py-3 px-4">Expiry & Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const isSelected = selectedIds.includes(member.id);
                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                      isSelected ? 'bg-lime-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(member.id)}
                        className="rounded text-[#65a30d] focus:ring-0"
                      />
                    </td>

                    {/* Member Name & ID */}
                    <td className="py-3 px-4" onClick={() => navigateToMember(member.id)}>
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-jakarta text-xs ${getInitialsBg(member.name)}`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm font-jakarta flex items-center gap-1.5">
                            {member.name}
                            {member.status === 'active' && (
                              <span title="Verified Member" className="text-emerald-500 text-xs">✓</span>
                            )}
                            {member.status === 'expiring' && (
                              <span title="Expiring Soon" className="text-amber-500 font-bold">!</span>
                            )}
                            {member.status === 'expired' && (
                              <span title="Expired" className="text-rose-500 font-bold">⊘</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {member.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Active Plan & Trainer */}
                    <td className="py-3 px-4" onClick={() => navigateToMember(member.id)}>
                      <div className="font-semibold text-slate-800">
                        {member.planName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>PT:</span>
                        <span className="font-medium text-slate-700">{member.assignedTrainer || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Expiry & Validity */}
                    <td className="py-3 px-4 font-tnum" onClick={() => navigateToMember(member.id)}>
                      <div className="font-semibold text-slate-800">
                        {member.expiryDate}
                      </div>
                      <div className={`text-[11px] font-medium mt-0.5 ${
                        member.daysRemaining > 30 
                          ? 'text-slate-500' 
                          : member.daysRemaining >= 0 
                          ? 'text-amber-600 font-bold' 
                          : 'text-rose-600 font-bold'
                      }`}>
                        {member.daysRemaining > 0 
                          ? `in ${member.daysRemaining} days` 
                          : member.daysRemaining === 0 
                          ? 'Expires today' 
                          : `${Math.abs(member.daysRemaining)} days ago`}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4" onClick={() => navigateToMember(member.id)}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          member.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.status === 'expiring'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'active'
                              ? 'bg-emerald-500'
                              : member.status === 'expiring'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        ></span>
                        {member.status === 'active' ? 'Active' : member.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {member.status === 'expiring' && (
                          <button
                            onClick={() => navigateToRenewal(member.id)}
                            className="px-2.5 py-1 bg-[#65a30d] hover:bg-[#558b09] text-white font-bold rounded text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>
                        )}
                        {member.status === 'expired' && (
                          <button
                            onClick={() => navigateToRenewal(member.id)}
                            className="px-2.5 py-1 bg-[#65a30d] hover:bg-[#558b09] text-white font-bold rounded text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Re-Activate</span>
                          </button>
                        )}

                        <button
                          onClick={() => navigateToMember(member.id)}
                          title="View Profile"
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setIsWhatsAppModalOpen(true);
                          }}
                          title="Send WhatsApp"
                          className="p-1.5 text-slate-400 hover:text-[#25D366] rounded hover:bg-slate-100 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigateToRenewal(member.id)}
                          title="Renew / Payment"
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="px-4 py-3 bg-[#f8fafc] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-inter">
          <div>
            Showing <span className="font-bold text-slate-800 font-tnum">1-{filteredMembers.length}</span> of <span className="font-bold text-slate-800 font-tnum">{members.length}</span> registered members
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select className="h-7 px-2 bg-white border border-slate-200 rounded text-xs text-slate-700">
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded disabled:opacity-40" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 bg-[#0b1c30] text-white font-bold rounded text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs flex items-center justify-center">
                125
              </button>
              <button className="p-1 text-slate-600 hover:text-slate-800 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Renewal Push Footer Card (Exact match to screenshot bottom) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 font-jakarta">
                  Automated Renewal Push
                </h3>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  38 Pending
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-inter">
                <div>
                  <span className="text-slate-400 block text-[11px]">Expiring in 24 Hours:</span>
                  <span className="font-bold text-slate-900 font-tnum">4 members</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">WhatsApp Templates Sent:</span>
                  <span className="font-bold text-slate-900 font-tnum">34 / 38</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Online UPI Links Clicked:</span>
                  <span className="font-bold text-slate-900 font-tnum">19 clicked (50%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Expected Recoverable Revenue:</span>
                  <span className="font-bold text-[#65a30d] font-tnum">₹1,84,500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsBulkReminderOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#e8701a] hover:bg-[#d65f0a] text-white text-xs font-bold rounded shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Trigger 1-Click Reminder Batch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
