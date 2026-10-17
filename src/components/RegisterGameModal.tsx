import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Gamepad2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Check,
  ExternalLink
} from 'lucide-react';
import { SECTIONS, CATEGORIES, SectionCode } from '../data/seedData';
import { Game, validateGameUrl } from '../utils/rules';

interface RegisterGameModalProps {
  currentSection: SectionCode;
  onClose: () => void;
  onRegisterGame: (gameData: Omit<Game, 'id' | 'createdAt'>) => void;
  isTeacherMode: boolean;
  studentName?: string;
  studentTeamName?: string;
}

export const RegisterGameModal: React.FC<RegisterGameModalProps> = ({
  currentSection,
  onClose,
  onRegisterGame,
  isTeacherMode,
  studentName = '',
  studentTeamName = '',
}) => {
  const [section, setSection] = useState<SectionCode>(currentSection);
  const [teamName, setTeamName] = useState(studentTeamName);
  const [student1, setStudent1] = useState(studentName);
  const [student2, setStudent2] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [netlifyUrl, setNetlifyUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Live URL validation
  const urlCheck = validateGameUrl(netlifyUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Student 1 Full Name (Must)
    if (!student1.trim()) {
      setErrorMsg('Student 1 Full Name is required.');
      return;
    }

    // 2. Game Title (Must)
    if (!gameTitle.trim()) {
      setErrorMsg('Game Title is required.');
      return;
    }

    // 3. Netlify URL (Must)
    if (!urlCheck.valid) {
      setErrorMsg(urlCheck.error || 'Please enter a valid Netlify URL (e.g. https://mygame.netlify.app).');
      return;
    }

    // Build game object with optional fallbacks
    const derivedTeamName = teamName.trim() || `${student1.trim()}'s Team`;
    const derivedDescription = description.trim() || 'Interactive AI browser game built with Gemini and deployed on Netlify.';

    onRegisterGame({
      section,
      teamName: derivedTeamName,
      student1: student1.trim(),
      student2: student2.trim() || undefined,
      gameTitle: gameTitle.trim(),
      category,
      description: derivedDescription,
      netlifyUrl: urlCheck.normalizedUrl,
      isVerified: true,
      isFinalist: false,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden my-4 arcade-glow-cyan">
        
        {/* Header with School Branding */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-cyan-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/school-logo.svg"
              alt="Al-Rowad International Schools"
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(30,165,233,0.5)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">
                  Enter Project Details
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Student Entry
                </span>
              </div>
              <p className="text-xs text-cyan-300/80">
                Al-Rowad International Schools • Grade 8 Section {section}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Game Registered Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your game card with real QR code is now live in Section {section} gallery for classmates to play and invest!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Minimal Instructions Banner */}
            <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-2xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                Fill in your project details below. Only <span className="font-bold text-white">Student 1</span>, <span className="font-bold text-white">Game Title</span>, and <span className="font-bold text-white">Netlify URL</span> are required!
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/70 border border-rose-500/60 rounded-xl text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section & Team Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Section <span className="text-cyan-400 font-bold">*</span>
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value as SectionCode)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Team Name
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Cyber Falcons"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Student 1 (Must) & Student 2 (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-white">
                    Student 1 Full Name
                  </label>
                  <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-800 px-1.5 py-0.5 rounded">
                    Must *
                  </span>
                </div>
                <input
                  type="text"
                  value={student1}
                  onChange={(e) => setStudent1(e.target.value)}
                  placeholder="e.g. Tariq Al-Harbi"
                  className="w-full bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Student 2 Full Name
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <input
                  type="text"
                  value={student2}
                  onChange={(e) => setStudent2(e.target.value)}
                  placeholder="e.g. Omar Al-Ghamdi (if pair)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Game Title (Must) & Category (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-white">
                    Game Title
                  </label>
                  <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-800 px-1.5 py-0.5 rounded">
                    Must *
                  </span>
                </div>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="e.g. Falcon Flight 2099"
                  className="w-full bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Game Category
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short Description (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Short Description
                </label>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dodge obstacles and collect AI energy crystals across desert dunes."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Netlify URL (Must) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-800/60">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-white">
                      Netlify URL
                    </label>
                    <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-800 px-1.5 py-0.5 rounded">
                      Must *
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={netlifyUrl}
                      onChange={(e) => setNetlifyUrl(e.target.value)}
                      placeholder="e.g. my-game.netlify.app"
                      className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl pl-3 pr-10 py-2.5 text-sm text-cyan-300 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                    {urlCheck.valid && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3 top-2.5" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    {urlCheck.valid ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ✓ Ready: {urlCheck.normalizedUrl}
                      </span>
                    ) : netlifyUrl ? (
                      <span className="text-amber-400">Example: mygame.netlify.app</span>
                    ) : (
                      <span className="text-slate-400">Paste your live Netlify game link</span>
                    )}
                  </div>
                </div>

                {/* Live Real QR Preview */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-1.5 bg-white rounded-xl shadow-md">
                    <QRCodeSVG
                      value={urlCheck.valid ? urlCheck.normalizedUrl : 'https://ai-game-arena.netlify.app'}
                      size={68}
                      level="M"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-semibold">Live Game QR</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Auto-generates QR card for Section {section}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 cursor-pointer"
                >
                  Submit Project Details
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
