import React, { useState } from 'react';
import { 
  ShieldAlert, Scan, Image as ImageIcon, FileText, 
  Search, AlertCircle, CheckCircle, RefreshCw, 
  Zap, UploadCloud, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiContentScan, aiContentScanFile } from '../utils/api';

export default function DeepfakeDetection() {
  const [text, setText] = useState('');
  const [imagePaths, setImagePaths] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('text');

  const handleScan = async () => {
    setLoading(true);
    setResult(null);
    try {
      let data;
      if (activeTab === 'text') {
        data = await aiContentScan({ text });
      } else {
        if (selectedFile) {
          data = await aiContentScanFile(selectedFile);
        } else if (imagePaths) {
          data = await aiContentScan({ image_paths: [imagePaths] });
        }
      }
      setResult(data);
    } catch (error) {
      console.error('Scan failed:', error);
      setResult({ error: 'Detection engine failed to respond. Check API status.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-14">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-600/10 px-3 py-1 rounded-full border border-orange-600/20">
            Advanced AI Security
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--text-main)]">
          Deepfake & <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #f5550f, #ff8a50)' }}>AI Content</span> Detector
        </h1>
        <p className="text-[color:var(--text-muted)] font-medium max-w-2xl">
          Identify synthetic media, LLM-generated narratives, and manipulated document photos using multi-agent forensic analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Input Section ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-1" style={{ background: 'linear-gradient(135deg, rgba(245,85,15,0.2), rgba(255,255,255,0.05))' }}>
            <div className="rounded-[22px] p-6 lg:p-8 space-y-6" style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)' }}>
              
              <div className="flex gap-4 p-1 rounded-2xl bg-black/20 self-start w-fit border border-white/5">
                {[
                  { id: 'text', icon: FileText, label: 'Text Analysis' },
                  { id: 'image', icon: ImageIcon, label: 'Image Forensics' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-white'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {activeTab === 'text' ? (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste email content, claim descriptions, or witness statements to analyze for AI generation patterns..."
                    className="w-full h-64 p-6 rounded-2xl bg-black/40 border border-white/5 text-sm font-medium text-[color:var(--text-main)] placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-all resize-none shadow-inner"
                  />
                ) : (
                  <div className="space-y-4">
                    <div 
                      onClick={() => document.getElementById('forensic-upload').click()}
                      className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <input 
                         id="forensic-upload"
                         type="file" 
                         className="hidden" 
                         onChange={(e) => {
                           if (e.target.files?.[0]) {
                             setSelectedFile(e.target.files[0]);
                             setImagePaths(e.target.files[0].name);
                           }
                         }} 
                      />
                      <UploadCloud className="w-12 h-12 text-orange-500/50 group-hover:text-orange-500 transition-colors mb-4" />
                      <p className="text-sm font-bold text-[color:var(--text-main)]">
                         {selectedFile ? selectedFile.name : 'Upload Claim Image'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF supported</p>
                    </div>
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input 
                         type="text"
                         value={imagePaths}
                         onChange={(e) => setImagePaths(e.target.value)}
                         placeholder="Or enter server image path..."
                         className="w-full pl-11 pr-4 py-4 rounded-xl bg-black/40 border border-white/5 text-sm font-medium text-[color:var(--text-main)] focus:outline-none focus:ring-1 focus:ring-orange-600"
                       />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleScan}
                disabled={loading || (activeTab === 'text' ? !text : (!imagePaths && !selectedFile))}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:grayscale"
                style={{ background: 'linear-gradient(135deg, #f5550f 0%, #ff8a50 100%)', boxShadow: '0 12px 40px rgba(245,85,15,0.3)' }}
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
                {loading ? 'Analyzing Neural Patterns...' : 'Run Forensic Scan'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Result Section ── */}
        <div className="space-y-6">
           <AnimatePresence mode="wait">
             {!result ? (
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="h-full flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 bg-white/2"
                 style={{ minHeight: '400px' }}
               >
                 <ShieldAlert className="w-12 h-12 text-slate-800 mb-4" />
                 <p className="text-sm font-bold text-slate-700 text-center">Engine Ready</p>
                 <p className="text-xs text-slate-800 text-center mt-1">Upload content to begin forensic analysis</p>
               </motion.div>
             ) : (
               <motion.div
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                 className="rounded-3xl p-6 lg:p-8 space-y-8 sticky top-8"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}
               >
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black text-[color:var(--text-main)]">Forensic Report</h3>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${result.ai_probability > 0.5 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                     {result.ai_probability > 0.5 ? 'AI Generated' : 'Human Origin'}
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex flex-col gap-1">
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">Detection Probability</span>
                       <span className="text-2xl font-black text-[color:var(--text-main)]">{Math.round((result.ai_probability || 0) * 100)}%</span>
                     </div>
                     <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} animate={{ width: `${(result.ai_probability || 0) * 100}%` }}
                         className={`h-full rounded-full ${(result.ai_probability || 0) > 0.7 ? 'bg-rose-500' : (result.ai_probability || 0) > 0.4 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                         style={{ boxShadow: (result.ai_probability || 0) > 0.7 ? '0 0 15px rgba(244,63,94,0.5)' : 'none' }}
                       />
                     </div>
                   </div>

                   <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${result.ai_probability > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <p className="text-[11px] font-medium text-[color:var(--text-muted)] leading-relaxed italic">
                          "{result.recommendation || 'No specific neural findings determined for this content scan.'}"
                        </p>
                      </div>
                      {result.text_analysis && (
                        <div className="pt-2 border-t border-white/5 mt-2">
                           <p className="text-[9px] font-bold uppercase text-slate-500 mb-2 tracking-tighter">Text Forensics</p>
                           <p className="text-[10px] text-[color:var(--text-muted)]">{result.text_analysis.narrative || 'Analyzed narratives for LLM footprint.'}</p>
                        </div>
                      )}
                   </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                   <div className="flex items-center gap-3 text-xs font-bold text-orange-500 mb-4">
                      <Zap className="w-4 h-4 fill-orange-500/20" />
                      Agent Recommendations
                   </div>
                   <div className="space-y-2">
                     {result.ai_probability > 0.5 ? (
                       <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                         <span className="text-[11px] font-semibold text-rose-500">Flag for manual review</span>
                         <ChevronRight className="w-3 h-3 text-rose-500" />
                       </div>
                     ) : (
                       <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                         <span className="text-[11px] font-semibold text-emerald-500">Proceed with claim</span>
                         <CheckCircle className="w-3 h-3 text-emerald-500" />
                       </div>
                     )}
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
