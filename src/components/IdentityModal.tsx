import React, { useState } from 'react';
import { X, User, ShieldCheck, Coins, Users } from 'lucide-react';
import { Game } from '../utils/rules';
import { SectionCode } from '../data/seedData';

interface IdentityModalProps {
  currentInvestor: {
    name: string;
    teamName?: string;
    investorId: string;
  };
  section: SectionCode;
  sectionGames: Game[];
  onSave: (name: string, teamName?: string) => void;
  onClose: () => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  currentInvestor,
  section,
  sectionGames,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>(currentInvestor.name);
  const [selectedTeam, setSelectedTeam] = useState<string>(currentInvestor.teamName || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), selectedTeam.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-700/60 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Student Investor Profile
              </h3>
              <p className="text-xs text-slate-400">
                Grade 8 • Section {section}
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

        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Your Name or Student Alias:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq Al-Harbi"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Select Your Team (Fair Play Rule):
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">I am not in any team / Guest student</option>
              {sectionGames.map((g) => (
                <option key={g.id} value={g.teamName}>
                  {g.teamName} ({g.gameTitle})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Selecting your team locks self-investment so student results remain 100% fair.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Token ID:</span>
              <span className="font-mono text-cyan-400 font-bold">{currentInvestor.investorId}</span>
            </div>
            <div className="flex justify-between">
              <span>Budget per session:</span>
              <span className="text-amber-400 font-bold">100 AI Coins</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-transform active:scale-95"
            >
              Save Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
