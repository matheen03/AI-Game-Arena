import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Key, 
  HelpCircle,
  ExternalLink,
  Trash2,
  FileCode 
} from 'lucide-react';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabaseConfig?: { url: string; anonKey: string };
  onSaveSupabaseConfig: (config: { url: string; anonKey: string }) => void;
  onResetSeedData: () => void;
  onClearAllData: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  supabaseConfig,
  onSaveSupabaseConfig,
  onResetSeedData,
  onClearAllData,
}) => {
  const [url, setUrl] = useState(supabaseConfig?.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig?.anonKey || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const downloadSqlSchema = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/supabase_schema.sql');
    element.setAttribute('download', 'supabase_schema.sql');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-700/50">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Teacher Controls & Database Settings
              </h3>
              <p className="text-xs text-slate-400">
                Data persistence, Supabase configuration, and pre-launch checklist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Supabase Configuration */}
        <form onSubmit={handleSave} className="mb-8 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Supabase Cloud Database (Optional)</h4>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {url ? 'Configured' : 'Local Storage Fallback Active'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The application persists all sections 8A–8L directly in local browser storage without data loss. To share live updates across multiple teacher and student devices, enter your Supabase project credentials below:
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={downloadSqlSchema}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download supabase_schema.sql</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : null}
              <span>{isSaved ? 'Settings Saved!' : 'Save Supabase Settings'}</span>
            </button>
          </div>
        </form>

        {/* Section 2: Competition Pre-Launch Checklist */}
        <div className="mb-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Tomorrow's Classroom Competition Checklist:</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">1.</span>
              <span><strong>Select Section:</strong> Choose your current class (e.g. 8A, 8B) in the top Teacher Bar.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">2.</span>
              <span><strong>Display Projector QR:</strong> Click "Projector QR" to project the join code on the smartboard.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">3.</span>
              <span><strong>Open Session:</strong> Verify status is "Live Investing". Students browse games & invest their 100 AI Coins.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">4.</span>
              <span><strong>Close & Reveal:</strong> Click "Close Investing" and then "Reveal Leaderboard" to launch the top-3 podium celebration.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">5.</span>
              <span><strong>Qualify Finalists:</strong> Click "+ Finalist" on the winning projects to automatically prepare them for the Shark Tank PTM evening!</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Data Management */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onResetSeedData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Seed Projects</span>
          </button>

          <button
            type="button"
            onClick={onClearAllData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors w-full sm:w-auto justify-center"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Wipe Clean for Fresh Event</span>
          </button>
        </div>

      </div>
    </div>
  );
};
