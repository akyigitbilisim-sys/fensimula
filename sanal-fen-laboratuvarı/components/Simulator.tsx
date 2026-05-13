'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Search, 
  FlaskConical, 
  AlertTriangle, 
  BookOpen, 
  Zap, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { generateExperiment, ExperimentData } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Simulator() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExperimentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateExperiment(question);
      if (data) {
        setResult(data);
      } else {
        setError('Üzgünüm, bu deneyi gerçekleştiremedim. Lütfen başka bir soru sormayı dene.');
      }
    } catch (err) {
      setError('Bir bağlantı hatası oluştu. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (q: string) => {
    setQuestion(q);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-inter overflow-hidden text-slate-800">
      {/* Header Navigation */}
      <nav className="h-16 bg-indigo-600 flex items-center justify-between px-8 shadow-lg shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-6 h-6 bg-indigo-500 rounded-full border-4 border-yellow-400"></div>
          </div>
          <span className="text-white font-black text-xl tracking-tight uppercase font-outfit">
            FenLab <span className="font-light opacity-80 italic lowercase text-base">simülatör</span>
          </span>
        </div>
        <div className="flex space-x-4">
          <button className="hidden sm:block px-4 py-2 bg-indigo-500 text-indigo-100 rounded-lg font-bold text-sm border-b-4 border-indigo-700 hover:bg-indigo-400 transition-colors">
            Kütüphane
          </button>
          <button className="px-4 py-2 bg-yellow-400 text-indigo-900 rounded-lg font-bold text-sm border-b-4 border-yellow-600 hover:bg-yellow-300 transition-colors">
            Giriş Yap
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Popüler Deneyler */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 shrink-0 overflow-y-auto">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Popüler Deneyler</h3>
          <div className="space-y-3">
            {[
              { title: "Fotosentez Hızı ve Işık Rengi", active: true },
              { title: "Arşimet Prensibi: Yoğunluk", active: false },
              { title: "Sıvıların Genleşmesi", active: false },
              { title: "Basit Elektrik Devreleri", active: false }
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleExample(item.title)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  item.active ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50'
                }`}
              >
                <p className={`text-sm font-bold leading-tight ${item.active ? 'text-blue-700 italic' : 'text-slate-600'}`}>
                  {item.title}
                </p>
                {item.active && <span className="text-[10px] text-blue-400 font-bold uppercase">Aktif Tema</span>}
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium italic">&quot;Bilim, her zaman yeni sorular sormaktır.&quot;</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
          {/* Question Area */}
          <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-indigo-100 flex items-center space-x-4 shrink-0">
            <div className="bg-indigo-600 p-3 rounded-2xl hidden sm:block">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-3">
              <div className="flex-1">
                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Senin Soru</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="&quot;Ne olur eğer...&quot; diye sor"
                  className="w-full text-xl font-bold text-slate-800 bg-transparent border-none focus:outline-none placeholder:text-slate-300"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg border-b-4 border-pink-700 hover:bg-pink-400 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SİMÜLE ET'}
              </button>
            </form>
          </div>

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-3 rounded-2xl flex items-center gap-3 shrink-0"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="font-bold text-sm tracking-tight">{error}</p>
            </motion.div>
          )}

          {/* Visualization / Result Viewport */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-slate-900 rounded-[40px] relative overflow-hidden border-8 border-slate-800 shadow-2xl flex flex-col">
              {/* Lab Environment Mockup Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black/60 pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading-ui"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto text-blue-400 w-10 h-10 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white font-outfit uppercase">Veri Akışı İnceleniyor</h3>
                    <p className="text-blue-300/80 font-mono text-sm mt-2">CALCULATING_PROBABILITIES...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    key="result-ui"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col p-8 z-10 overflow-y-auto"
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/30 mb-2">
                        <Zap className="w-3 h-3" /> Deney Sonucu
                      </div>
                      <h2 className="text-3xl font-black text-white font-outfit uppercase leading-none">{result.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                      {/* Visual Mockup Area */}
                      <div className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 flex items-center justify-center relative min-h-[200px]">
                        <div className="absolute top-4 left-4 text-white/50 font-mono text-[10px] space-y-1 uppercase">
                          <p>DURUM: AKTİF</p>
                          <p>GÖZLEM: {result.materials.length} VERİ NOKTASI</p>
                        </div>
                        <Beaker className="w-24 h-24 text-blue-400 opacity-20 absolute" />
                        <div className="relative z-10 text-center">
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {result.materials.map((m, i) => (
                              <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/50 rounded">
                                {m.toUpperCase()}
                              </span>
                            ))}
                          </div>
                          <p className="text-white font-bold italic text-lg leading-tight px-4 flex items-center gap-2">
                             <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                             {result.steps[result.steps.length - 1]}
                          </p>
                        </div>
                      </div>

                      {/* Info Panel for Mobile/Middle */}
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Güvenlik Protokolü
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed italic">
                            {result.safety}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
                    <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-16 h-16 text-indigo-400/40" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-500 font-outfit uppercase">Simülasyon Bekleniyor</h3>
                    <p className="text-slate-600 max-w-xs mt-2">Bilim dünyasına adım atmak için yukarıdaki alana bir soru yaz ve &apos;SİMÜLE ET&apos; butonuna bas.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel: Detailed Info */}
            <AnimatePresence>
              {result && (
                <motion.aside 
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="w-full lg:w-96 bg-white rounded-[40px] shadow-2xl border border-slate-200 flex flex-col p-8 overflow-y-auto"
                >
                  <section className="mb-8">
                    <h4 className="text-sm font-black text-slate-800 uppercase flex items-center space-x-2">
                      <span className="w-2 h-6 bg-orange-500 rounded-full block"></span>
                      <span>Deney Adımları</span>
                    </h4>
                    <ul className="mt-6 space-y-4">
                      {result.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            idx === result.steps.length - 1 
                            ? 'bg-indigo-100 text-indigo-600' 
                            : 'bg-slate-100 text-slate-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <p className={`text-xs leading-relaxed ${
                            idx === result.steps.length - 1 
                            ? 'text-indigo-900 font-bold italic' 
                            : 'text-slate-600'
                          }`}>
                            {step}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="flex-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase flex items-center space-x-2">
                      <span className="w-2 h-6 bg-blue-500 rounded-full block"></span>
                      <span>Bilimsel Analiz</span>
                    </h4>
                    <div className="mt-6 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="prose prose-sm prose-slate leading-relaxed text-slate-600 text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {result.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </section>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Alternatif Senaryo:</p>
                    <div 
                      onClick={() => handleExample(result.alternative.replace(/Peki ya | şöyle yapsaydık\?| senaryosu/g, ""))}
                      className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl cursor-pointer hover:border-purple-400 transition-colors group"
                    >
                      <p className="text-xs font-bold text-purple-700 leading-tight group-hover:translate-x-1 transition-transform flex items-center gap-2">
                        {result.alternative} <ArrowRight className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer: Quick Actions */}
      <footer className="h-20 bg-slate-100 border-t border-slate-200 flex items-center px-8 shrink-0 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-6 shrink-0">Hızlı Deneyler:</span>
        <div className="flex space-x-3 shrink-0">
          {[
            { q: "Su fışkırtan şişe deneyi?", color: "border-purple-200 text-purple-600 hover:border-purple-400" },
            { q: "Sirkeli karbonat tepkimesi?", color: "border-red-200 text-red-600 hover:border-red-400" },
            { q: "Sütün içine deterjan damlatınca?", color: "border-blue-200 text-blue-600 hover:border-blue-400" }
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleExample(item.q)}
              className={`px-4 py-2 bg-white border-2 rounded-full text-xs font-bold transition-colors shrink-0 ${item.color}`}
            >
              {item.q}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
