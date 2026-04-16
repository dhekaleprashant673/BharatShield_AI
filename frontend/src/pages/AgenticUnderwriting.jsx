import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Bot, Activity, DollarSign, User, HeartPulse, FileText, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AgenticUnderwriting() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    age: 45,
    income: 12.5,
    occupation: "Business Owner",
    health_conditions: "Diabetes, Hypertension",
    smoker: true,
    past_claims: 1,
    policy_type: "Life",
    sum_insured: 500.0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // Convert comma-separated string to array
    const healthArr = formData.health_conditions.split(',').map(s => s.trim()).filter(s => s);

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10),
      income: parseFloat(formData.income),
      past_claims: parseInt(formData.past_claims, 10),
      sum_insured: parseFloat(formData.sum_insured),
      health_conditions: healthArr
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/agent/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to evaluate context via Agent.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-14 min-h-screen">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#f5550f] bg-[#f5550f]/10 border border-[#f5550f]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5550f] animate-pulse inline-block" />
            AI Orchestrator
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--text-main)] flex items-center gap-3">
          Smart{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #f5550f, #ff8a50)' }}>
            Underwriting
          </span>
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1.5 font-medium max-w-xl">
          Powered by the Adaptive Evidence Engine. Input applicant logic and let the multi-agent system calculate risk, fraud probability, and request necessary medical/financial evidence autonomously.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Input Form ── */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}
        >
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f5550f] to-[#ff8a50]" />
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-300">
               <User className="w-5 h-5 text-orange-500" />
               <h2 className="text-lg font-black uppercase tracking-widest">Applicant Context</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Age</label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input type="number" name="age" value={formData.age} onChange={handleChange} required
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Income (Lakhs)</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input type="number" step="0.1" name="income" value={formData.income} onChange={handleChange} required
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health Conditions (Comma Sep)</label>
                <div className="relative">
                   <HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input type="text" name="health_conditions" value={formData.health_conditions} onChange={handleChange}
                     className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" 
                     placeholder="e.g. Diabetes, Asthma" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 bg-black/30 border border-white/5 p-3 rounded-xl">
                   <input type="checkbox" name="smoker" checked={formData.smoker} onChange={handleChange} 
                      className="w-4 h-4 accent-orange-500 cursor-pointer" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 cursor-pointer">Is Smoker?</label>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past Claims</label>
                   <input type="number" name="past_claims" value={formData.past_claims} onChange={handleChange} required
                     className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Policy Type</label>
                  <select name="policy_type" value={formData.policy_type} onChange={handleChange}
                     className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white appearance-none cursor-pointer">
                     <option value="Life" className="bg-slate-900">Life</option>
                     <option value="Health" className="bg-slate-900">Health</option>
                     <option value="Auto" className="bg-slate-900">Auto</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sum Insured (Lakhs)</label>
                  <input type="number" step="0.1" name="sum_insured" value={formData.sum_insured} onChange={handleChange} required
                     className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-all focus:ring-1 focus:ring-orange-500/50 bg-black/30 border border-white/5 text-white" />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5">
                <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-70 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #f5550f, #ff8a50)', boxShadow: '0 8px 25px rgba(245,85,15,0.4)' }}>
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    {loading ? 'Agent Processing...' : 'Run Agentic Underwriting'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ── Output / Explanation ── */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 relative overflow-hidden flex flex-col"
          style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid var(--border-card)' }}
        >
          <div className="flex items-center gap-2 mb-6">
             <Activity className="w-5 h-5 text-orange-400" />
             <h2 className="text-lg font-black uppercase tracking-widest text-white">Agent Output</h2>
          </div>

          {!result && !loading && !error && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
                <Bot className="w-12 h-12 opacity-20" />
                <p className="text-sm font-semibold">Waiting for applicant data...</p>
             </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-bold">
               <AlertCircle className="w-5 h-5" />
               {error}
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-700 pointer-events-none" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                <Bot className="absolute inset-0 m-auto w-6 h-6 text-orange-500 animate-pulse" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 animate-pulse">Running Orchestrator...</p>
            </div>
          )}

          {result && !loading && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col gap-5">
                
                {/* Score Dials */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl" style={{ background: result.risk_score > 70 ? 'rgba(244,63,94,0.3)' : 'rgba(245,138,15,0.3)' }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 z-10">Risk Score</span>
                      <span className={`text-4xl font-black z-10 transition-colors ${result.risk_score > 70 ? 'text-rose-500' : 'text-orange-400'}`}>{result.risk_score}</span>
                   </div>
                   <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full blur-2xl" style={{ background: result.fraud_probability > 30 ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)' }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 z-10">Fraud Prob.</span>
                      <span className={`text-4xl font-black z-10 transition-colors ${result.fraud_probability > 30 ? 'text-rose-500' : 'text-emerald-400'}`}>{result.fraud_probability}%</span>
                   </div>
                </div>

                {/* Decision Badge */}
                <div className={`p-4 rounded-xl flex items-center gap-4 border ${result.decision === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30' : result.decision === 'Rejected' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  {result.decision === 'Approved' ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : result.decision === 'Rejected' ? <XCircle className="w-8 h-8 text-rose-400" /> : <AlertTriangle className="w-8 h-8 text-amber-400" />}
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Automated Decision</span>
                    <span className={`text-lg font-black uppercase tracking-wider ${result.decision === 'Approved' ? 'text-emerald-400' : result.decision === 'Rejected' ? 'text-rose-400' : 'text-amber-400'}`}>{result.decision}</span>
                  </div>
                </div>

                {/* Explainable AI */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex-1">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                     <FileText className="w-3 h-3" /> Explainable AI Traces
                   </h3>
                   <ul className="space-y-2 mb-4">
                     {result.reason.map((res, idx) => (
                        <li key={idx} className="text-xs font-semibold text-slate-300 flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0" /> {res}
                        </li>
                     ))}
                   </ul>

                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                     <ShieldAlert className="w-3 h-3 text-orange-400" /> Adaptive Evidence Requested
                   </h3>
                   {result.evidence_required && result.evidence_required.length > 0 ? (
                     <div className="flex flex-wrap gap-2">
                        {result.evidence_required.map((ev, idx) => (
                           <span key={idx} className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30">
                             {ev}
                           </span>
                        ))}
                     </div>
                   ) : (
                     <p className="text-xs font-semibold text-slate-500 italic">No additional evidence required by adaptive engine.</p>
                   )}
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

      </div>
    </div>
  );
}
