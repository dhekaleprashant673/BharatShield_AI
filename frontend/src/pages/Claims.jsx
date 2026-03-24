import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, UploadCloud, Search, Filter, ChevronDown,
  Clock, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight,
  Eye, MoreVertical, TrendingUp, Zap, RefreshCw, Download,
  ShieldCheck, Calendar, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const claimsData = [
  { id: 'CLM-1092', holder: 'John Doe', type: 'Auto Collision', amount: 15400, date: '2026-03-24', status: 'Under Review', riskScore: 94, adjuster: 'Sarah K.' },
  { id: 'CLM-1087', holder: 'Alice Smith', type: 'Medical Expense', amount: 4200, date: '2026-03-23', status: 'Pending', riskScore: 42, adjuster: 'Mike R.' },
  { id: 'CLM-1076', holder: 'Bob Johnson', type: 'Property Damage', amount: 88000, date: '2026-03-22', status: 'Approved', riskScore: 18, adjuster: 'Lisa T.' },
  { id: 'CLM-1045', holder: 'Carol White', type: 'Liability', amount: 8950, date: '2026-03-21', status: 'Flagged', riskScore: 91, adjuster: 'James L.' },
  { id: 'CLM-1032', holder: 'David Brown', type: 'Life Insurance', amount: 24000, date: '2026-03-20', status: 'Flagged', riskScore: 98, adjuster: 'Nina P.' },
  { id: 'CLM-1029', holder: 'Emma Wilson', type: 'Auto Theft', amount: 32000, date: '2026-03-19', status: 'Approved', riskScore: 22, adjuster: 'Sarah K.' },
  { id: 'CLM-1018', holder: 'Frank Garcia', type: 'Medical Expense', amount: 6750, date: '2026-03-18', status: 'Pending', riskScore: 55, adjuster: 'Mike R.' },
];

const STATUS_CONFIG = {
  'Approved':     { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle2 },
  'Pending':      { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  icon: Clock },
  'Under Review': { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', icon: Eye },
  'Flagged':      { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)',  icon: AlertTriangle },
};

const STATS = [
  { label: 'Total Claims', value: '1,247', trend: '+12.3%', icon: FileText, gradient: 'from-indigo-500 to-violet-500', glow: 'rgba(99,102,241,0.4)' },
  { label: 'Approved', value: '892', trend: '+5.1%', icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.4)' },
  { label: 'Pending Review', value: '218', trend: '-3.2%', icon: Clock, gradient: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.4)' },
  { label: 'AI Flagged', value: '137', trend: '+8.7%', icon: AlertTriangle, gradient: 'from-rose-500 to-pink-500', glow: 'rgba(244,63,94,0.4)' },
];

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg?.icon || Clock;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
      style={{ color: cfg?.color, background: cfg?.bg, border: `1px solid ${cfg?.border}` }}
    >
      <Icon style={{ width: 11, height: 11 }} />
      {status}
    </span>
  );
};

const RiskMeter = ({ score }) => {
  const color = score >= 80 ? '#f43f5e' : score >= 50 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          style={{ background: color, boxShadow: `0 0 8px ${color}99` }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
};

export default function Claims() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const filtered = claimsData.filter(c => {
    const matchSearch =
      c.holder.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Claims Management
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Claims{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #6366f1, #a855f7)' }}>
              Database
            </span>
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium">
            Verify, track, and process all incoming insurance claims in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
          >
            <Plus className="w-4 h-4" /> New Claim
          </button>
        </motion.div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08 + 0.1, type: 'spring', stiffness: 120 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className={`absolute -right-8 -top-8 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br ${stat.gradient}`} />
            <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${stat.gradient} opacity-50`} />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`p-2 rounded-xl bg-white/5 ring-1 ring-white/10`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-black text-white tracking-tight relative z-10">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 relative z-10">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Filters Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search claims, holders, or types…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'Pending', 'Under Review', 'Flagged', 'Approved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={
                statusFilter === s
                  ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Claims Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Top shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Claim ID', 'Policyholder', 'Claim Type', 'Amount', 'Date', 'Risk Score', 'Status', 'Adjuster', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((claim, i) => (
                  <motion.tr
                    key={claim.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                    onMouseEnter={() => setHoveredRow(claim.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="group cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: hoveredRow === claim.id ? 'rgba(99,102,241,0.05)' : 'transparent' }}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-indigo-400">{claim.id}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                        >
                          {claim.holder.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{claim.holder}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-white">${claim.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-500 font-medium">{claim.date}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <RiskMeter score={claim.riskScore} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusPill status={claim.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-600 font-medium">{claim.adjuster}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <AnimatePresence>
                        {hoveredRow === claim.id ? (
                          <motion.div
                            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                            className="flex justify-end gap-1"
                          >
                            <button className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors" style={{ background: 'rgba(99,102,241,0.12)' }}>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors" style={{ background: 'rgba(16,185,129,0.12)' }}>
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-400 transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <FileText className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold">No claims match your search.</p>
              <p className="text-slate-700 text-sm mt-1">Try adjusting your filters.</p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-slate-600 font-medium">
            Showing <span className="text-slate-400 font-bold">{filtered.length}</span> of <span className="text-slate-400 font-bold">1,247</span> claims
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-500 rounded-xl hover:text-slate-300 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← Prev
            </button>
            <button className="px-4 py-2 text-xs font-bold text-white rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              Next →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── New Claim Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={e => e.stopPropagation()}
              className="relative overflow-hidden rounded-2xl p-8 w-full max-w-lg"
              style={{ background: 'linear-gradient(135deg, #0d0f26 0%, #0a0c20 100%)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.1)' }}
            >
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full" />
              <h2 className="text-xl font-black text-white mb-6 relative z-10 flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-400" /> Digitize New Claim
              </h2>
              <div className="space-y-4 relative z-10">
                {[
                  { label: 'Policyholder Name', placeholder: 'Full legal name...' },
                  { label: 'Claim Type', placeholder: 'Auto / Medical / Property...' },
                  { label: 'Claim Amount ($)', placeholder: '0.00' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">{field.label}</label>
                    <input
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Cancel
                  </button>
                  <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
                    Submit Claim
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
