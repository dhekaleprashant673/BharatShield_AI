import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, AlertCircle, AlertTriangle, Eye, ShieldCheck, MoreVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const alerts = [
  { id: 'ALT-9812', claimId: 'CLM-1092', type: 'Claim Inflation', riskScore: 94, status: 'Open', date: '2026-03-24', policyHolder: 'John Doe', amount: 15400, confidence: 98 },
  { id: 'ALT-9811', claimId: 'CLM-1087', type: 'Identity Theft', riskScore: 88, status: 'Reviewing', date: '2026-03-23', policyHolder: 'Alice Smith', amount: 4200, confidence: 85 },
  { id: 'ALT-9810', claimId: 'CLM-1076', type: 'Premium Fraud', riskScore: 76, status: 'Resolved', date: '2026-03-22', policyHolder: 'Bob Johnson', amount: 1800, confidence: 72 },
  { id: 'ALT-9809', claimId: 'CLM-1045', type: 'Duplicate Claim', riskScore: 91, status: 'Open', date: '2026-03-21', policyHolder: 'Carol White', amount: 8950, confidence: 95 },
  { id: 'ALT-9808', claimId: 'CLM-1032', type: 'Documentation Forgery', riskScore: 98, status: 'Open', date: '2026-03-20', policyHolder: 'David Brown', amount: 24000, confidence: 99 }
];

const RiskBadge = ({ score }) => {
  if (score >= 90) return (
    <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-300" style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)', boxShadow: '0 0 12px rgba(244,63,94,0.15)' }}>
      <AlertCircle className="w-3 h-3" /> Critical · {score}
    </span>
  );
  if (score >= 80) return (
    <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-300" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 0 12px rgba(245,158,11,0.1)' }}>
      <AlertTriangle className="w-3 h-3" /> High · {score}
    </span>
  );
  return (
    <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-300" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
      <ShieldAlert className="w-3 h-3" /> Medium · {score}
    </span>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    Open: { color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', dot: '#6366f1' },
    Reviewing: { color: '#fcd34d', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
    Resolved: { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
  };
  const s = styles[status] || styles.Open;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: s.dot }} />
      {status}
    </span>
  );
};

export default function FraudAlerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = alerts.filter(a =>
    a.policyHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse inline-block" /> Alert Queue Active
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Fraud{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #f43f5e, #f59e0b)' }}>Alert Center</span>
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium">Investigate AI-flagged threats and respond in real-time.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts, IDs, or fraud types …"
              className="pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 placeholder-slate-600 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Filter className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Summary chips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3">
        {[
          { label: 'Open Alerts', count: 3, color: '#6366f1' },
          { label: 'Under Review', count: 1, color: '#f59e0b' },
          { label: 'Resolved Today', count: 1, color: '#10b981' },
          { label: 'Avg Risk Score', count: '89.4', color: '#f43f5e' },
        ].map((chip) => (
          <div key={chip.label} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: `${chip.color}18`, border: `1px solid ${chip.color}30`, color: chip.color }}>
            <span className="text-lg font-black" style={{ color: '#fff' }}>{chip.count}</span>
            <span className="text-xs font-semibold text-slate-400">{chip.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Alert / Claim', 'Policyholder', 'Fraud Category', 'Risk Score', 'AI Confidence', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <motion.tbody>
              <AnimatePresence>
                {filtered.map((alert, i) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
                    onMouseEnter={() => setHoveredRow(alert.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="group cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: hoveredRow === alert.id ? 'rgba(99,102,241,0.05)' : 'transparent' }}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="font-bold text-indigo-400 text-sm">{alert.id}</div>
                      <div className="text-xs text-slate-600 mt-0.5 font-medium">{alert.claimId}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, #6366f1, #a855f7)` }}>
                          {alert.policyHolder.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200">{alert.policyHolder}</div>
                          <div className="text-xs text-slate-600 font-medium">${alert.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <RiskBadge score={alert.riskScore} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${alert.confidence}%` }}
                            transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{
                              background: alert.confidence >= 90 ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'linear-gradient(90deg, #64748b, #94a3b8)',
                              boxShadow: alert.confidence >= 90 ? '0 0 8px rgba(99,102,241,0.5)' : 'none'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-9 text-right">{alert.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap"><StatusPill status={alert.status} /></td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <AnimatePresence>
                        {hoveredRow === alert.id ? (
                          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex justify-end gap-1">
                            <button className="p-2 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors" title="Investigate"
                              style={{ background: 'rgba(99,102,241,0.12)' }}>
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors" title="Mark Safe"
                              style={{ background: 'rgba(16,185,129,0.12)' }}>
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-medium text-slate-600">Showing <span className="font-bold text-slate-400">1–5</span> of <span className="font-bold text-slate-400">97</span> alerts</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-500 rounded-xl transition-colors hover:text-slate-300"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>← Previous</button>
            <button className="px-4 py-2 text-xs font-bold text-white rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>Next →</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
