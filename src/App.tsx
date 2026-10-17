import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Coins, 
  Trophy, 
  Globe, 
  PlusCircle, 
  QrCode, 
  Shield, 
  Search, 
  Filter, 
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  X
} from 'lucide-react';
import { Navbar, ActiveTab, UserRole } from './components/Navbar';
import { TeacherBar } from './components/TeacherBar';
import { GameCard } from './components/GameCard';
import { PlayModal } from './components/PlayModal';
import { InvestModal } from './components/InvestModal';
import { ProjectorModal } from './components/ProjectorModal';
import { RegisterGameModal } from './components/RegisterGameModal';
import { ClassroomLeaderboardView } from './components/ClassroomLeaderboardView';
import { ConsolidatedLeaderboardView } from './components/ConsolidatedLeaderboardView';
import { PTMSharkTankView } from './components/PTMSharkTankView';
import { IdentityModal } from './components/IdentityModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { 
  Game, 
  Investment, 
  PTMInvestment, 
  computeLeaderboard, 
  exportLeaderboardToCSV,
  isSelfInvestment
} from './utils/rules';
import { SECTIONS, CATEGORIES, SectionCode, INITIAL_GAMES, INITIAL_INVESTMENTS, INITIAL_PTM_INVESTMENTS } from './data/seedData';
import { loadLocalData, saveLocalData, AppStateData, SectionSessionState } from './lib/storage';

const DEFAULT_TEACHER_PIN = 'teach88';

export default function App() {
  // Read URL params for instant role / section routing (e.g. from student or parent QR code)
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialRole: UserRole = useMemo(() => {
    const roleParam = urlParams.get('role');
    if (roleParam === 'teacher') return 'teacher';
    if (roleParam === 'parent' || roleParam === 'ptm') return 'parent';
    return 'student'; // Default to student view for clean student experience
  }, [urlParams]);

  const initialSection: SectionCode = useMemo(() => {
    const secParam = urlParams.get('section')?.toUpperCase();
    if (secParam && SECTIONS.includes(secParam as SectionCode)) {
      return secParam as SectionCode;
    }
    return '8A';
  }, [urlParams]);

  // Persistent app data
  const [appData, setAppData] = useState<AppStateData>(() => loadLocalData());
  const [currentSection, setCurrentSection] = useState<SectionCode>(initialSection);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('AI_TEACHER_AUTH') === 'true';
  });
  const [isTeacherPinModalOpen, setIsTeacherPinModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab based on role
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (initialRole === 'parent') return 'ptm_finals';
    return 'gallery';
  });
  
  // Student Investor state
  const [studentInvestor, setStudentInvestor] = useState<{
    name: string;
    teamName?: string;
    investorId: string;
  }>(() => {
    const saved = localStorage.getItem('AI_STUDENT_INVESTOR');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const rand = Math.floor(1000 + Math.random() * 9000);
    return {
      name: 'Tariq Al-Harbi',
      teamName: 'Cyber Falcons',
      investorId: `STU-8A-${rand}`
    };
  });

  // Parent name state
  const [parentName, setParentName] = useState<string>('Guest Investor (Parent)');

  // Modals state
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<Game | null>(null);
  const [selectedGameForInvest, setSelectedGameForInvest] = useState<Game | null>(null);
  const [isProjectorModalOpen, setIsProjectorModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Gallery Filters
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('ALL');
  const [gallerySearch, setGallerySearch] = useState<string>('');

  // Persist state whenever appData changes
  useEffect(() => {
    saveLocalData(appData);
  }, [appData]);

  // Persist student investor
  useEffect(() => {
    localStorage.setItem('AI_STUDENT_INVESTOR', JSON.stringify(studentInvestor));
  }, [studentInvestor]);

  // Role switching handler
  const handleRoleChange = (targetRole: UserRole) => {
    if (targetRole === 'teacher') {
      if (!isTeacherAuthenticated) {
        setPinInput('');
        setPinError(null);
        setIsTeacherPinModalOpen(true);
        return;
      }
      setCurrentRole('teacher');
      return;
    }

    setCurrentRole(targetRole);
    if (targetRole === 'parent') {
      setActiveTab('ptm_finals');
    } else {
      setActiveTab('gallery');
    }
  };

  const handleVerifyTeacherPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_TEACHER_PIN || pinInput.trim() === 'admin') {
      setIsTeacherAuthenticated(true);
      sessionStorage.setItem('AI_TEACHER_AUTH', 'true');
      setIsTeacherPinModalOpen(false);
      setCurrentRole('teacher');
    } else {
      setPinError('Incorrect Teacher PIN. (Default: teach88)');
    }
  };

  // Current section session state
  const currentSessionState: SectionSessionState = useMemo(() => {
    return appData.sessions[currentSection] || {
      status: 'investing_open',
      eligibleInvestorsCount: 12,
      lastUpdated: new Date().toISOString()
    };
  }, [appData.sessions, currentSection]);

  // Filter games for current section
  const sectionGames = useMemo(() => {
    return appData.games.filter((g) => g.section === currentSection);
  }, [appData.games, currentSection]);

  // Student investments in current section
  const mySectionInvestments = useMemo(() => {
    return appData.investments.filter(
      (inv) => inv.section === currentSection && inv.investorId === studentInvestor.investorId
    );
  }, [appData.investments, currentSection, studentInvestor.investorId]);

  const totalInvestedByMe = useMemo(() => {
    return mySectionInvestments.reduce((sum, inv) => sum + inv.coins, 0);
  }, [mySectionInvestments]);

  // Mapping of section -> active distinct investors count
  const sectionInvestorsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    SECTIONS.forEach((sec) => {
      const distinctInSec = new Set(
        appData.investments.filter((i) => i.section === sec).map((i) => i.investorId)
      );
      map[sec] = Math.max(1, distinctInSec.size);
    });
    return map;
  }, [appData.investments]);

  // Classroom Leaderboard for current section
  const sectionLeaderboard = useMemo(() => {
    const sectionInv = appData.investments.filter((inv) => inv.section === currentSection);
    return computeLeaderboard(sectionGames, sectionInv, sectionInvestorsCountMap);
  }, [sectionGames, appData.investments, currentSection, sectionInvestorsCountMap]);

  // School-wide Consolidated Leaderboard for all 12 sections
  const consolidatedLeaderboard = useMemo(() => {
    return computeLeaderboard(appData.games, appData.investments, sectionInvestorsCountMap);
  }, [appData.games, appData.investments, sectionInvestorsCountMap]);

  // All Qualified Finalists for Shark Tank PTM
  const finalists = useMemo(() => {
    return appData.games.filter((g) => g.isFinalist);
  }, [appData.games]);

  // Handle investing in a game
  const handleInvestInGame = (gameId: string, coins: number) => {
    setAppData((prev) => {
      const otherInvestments = prev.investments.filter(
        (inv) => !(inv.section === currentSection && inv.gameId === gameId && inv.investorId === studentInvestor.investorId)
      );

      let updated = otherInvestments;
      if (coins > 0) {
        const newRecord: Investment = {
          id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          section: currentSection,
          gameId,
          investorId: studentInvestor.investorId,
          investorName: studentInvestor.name,
          studentTeamName: studentInvestor.teamName,
          coins,
          timestamp: new Date().toISOString()
        };
        updated = [...otherInvestments, newRecord];
      }

      return {
        ...prev,
        investments: updated
      };
    });
  };

  // Handle PTM Shark Tank VIP Investment
  const handleSubmitPTMInvestment = (gameId: string, coins: number, pName: string) => {
    setParentName(pName);
    const rand = Math.floor(Math.random() * 1000);
    const newRecord: PTMInvestment = {
      id: `ptm-${Date.now()}-${rand}`,
      gameId,
      investorId: `PARENT-${Date.now()}`,
      parentName: pName,
      coins,
      timestamp: new Date().toISOString()
    };

    setAppData((prev) => ({
      ...prev,
      ptmInvestments: [...prev.ptmInvestments, newRecord]
    }));
  };

  // Teacher handlers
  const handleToggleInvesting = (open: boolean) => {
    setAppData((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [currentSection]: {
          ...currentSessionState,
          status: open ? 'investing_open' : 'investing_closed',
          lastUpdated: new Date().toISOString()
        }
      }
    }));
  };

  const handleRevealLeaderboard = () => {
    setAppData((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [currentSection]: {
          ...currentSessionState,
          status: 'results_revealed',
          lastUpdated: new Date().toISOString()
        }
      }
    }));
    setActiveTab('classroom_leaderboard');
  };

  const handleToggleVerify = (gameId: string) => {
    setAppData((prev) => ({
      ...prev,
      games: prev.games.map((g) => (g.id === gameId ? { ...g, isVerified: !g.isVerified } : g))
    }));
  };

  const handleToggleFinalist = (gameId: string) => {
    setAppData((prev) => ({
      ...prev,
      games: prev.games.map((g) => (g.id === gameId ? { ...g, isFinalist: !g.isFinalist } : g))
    }));
  };

  const handleRegisterGame = (gameData: Omit<Game, 'id' | 'createdAt'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${gameData.section.toLowerCase()}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };

    setAppData((prev) => ({
      ...prev,
      games: [newGame, ...prev.games]
    }));
  };

  const handleExportSectionCSV = () => {
    const csv = exportLeaderboardToCSV(sectionLeaderboard);
    downloadFile(csv, `AI_Game_Arena_Section_${currentSection}_Results.csv`, 'text/csv');
  };

  const handleExportConsolidatedCSV = () => {
    const csv = exportLeaderboardToCSV(consolidatedLeaderboard);
    downloadFile(csv, `AI_Game_Arena_School_Wide_All_12_Sections.csv`, 'text/csv');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered gallery games
  const filteredGalleryGames = useMemo(() => {
    return sectionGames.filter((g) => {
      const matchCat = galleryCategoryFilter === 'ALL' || g.category === galleryCategoryFilter;
      const query = gallerySearch.toLowerCase().trim();
      const matchSearch =
        !query ||
        g.gameTitle.toLowerCase().includes(query) ||
        (g.teamName && g.teamName.toLowerCase().includes(query)) ||
        g.student1.toLowerCase().includes(query) ||
        (g.student2 && g.student2.toLowerCase().includes(query)) ||
        (g.description && g.description.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [sectionGames, galleryCategoryFilter, gallerySearch]);

  return (
    <div className="min-h-screen bg-[#070d1a] text-slate-100 flex flex-col arcade-grid-bg">
      
      {/* Top Professional Role Navbar */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentSection={currentSection}
        studentInvestor={studentInvestor}
        totalInvested={totalInvestedByMe}
        maxBudget={100}
        onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
        onOpenSubmitGameModal={() => setIsRegisterModalOpen(true)}
        parentName={parentName}
      />

      {/* Teacher Hub Controls (ONLY displayed to Teacher Admin) */}
      {currentRole === 'teacher' && (
        <TeacherBar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          sessionState={currentSessionState}
          onToggleInvesting={handleToggleInvesting}
          onRevealLeaderboard={handleRevealLeaderboard}
          onOpenProjectorModal={() => setIsProjectorModalOpen(true)}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onExportCSV={handleExportSectionCSV}
          totalGamesInSection={sectionGames.length}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: GAME GALLERY (Student or Teacher) */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            
            {/* Gallery Hero Banner */}
            <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 p-6 sm:p-8 rounded-3xl border border-cyan-800/40 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    GRADE 8 SECTION {currentSection} ARCADE
                  </span>
                  {currentSessionState.status === 'investing_open' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      🟢 Investing Open
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      Investing Closed
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Student Game Showcase
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                  {currentRole === 'student'
                    ? 'Play peer-created Netlify games, scan real QR codes with your phone, and allocate your 100 AI Coins to the most innovative projects!'
                    : `Managing Section ${currentSection} projects and student investments.`}
                </p>
              </div>

              {/* Action Buttons tailored to role */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Prominent Student Submission Button */}
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>+ Submit Your Netlify Game</span>
                </button>

                <button
                  onClick={() => setActiveTab('classroom_leaderboard')}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Class Rank</span>
                </button>
              </div>
            </div>

            {/* Quick Student Project Registration Helper Banner (for Student Role) */}
            {currentRole === 'student' && (
              <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Have an AI Game to Submit?</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">Takes 30 Seconds</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Required: <span className="text-cyan-300 font-medium">Student 1 Full Name</span>, <span className="text-cyan-300 font-medium">Game Title</span>, and <span className="text-cyan-300 font-medium">Netlify URL</span>. (Team Name, Student 2, and Description are optional).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all flex-shrink-0 cursor-pointer"
                >
                  + Enter Project Details
                </button>
              </div>
            )}

            {/* Gallery Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search game title, team, creator..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                  Category:
                </span>
                <select
                  value={galleryCategoryFilter}
                  onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white font-semibold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  ({filteredGalleryGames.length} games)
                </span>
              </div>

            </div>

            {/* Game Grid */}
            {filteredGalleryGames.length === 0 ? (
              <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Games Found</h3>
                <p className="text-xs text-slate-400 mb-4">
                  No games registered yet in Section {currentSection}.
                </p>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit the First Game in Section {currentSection}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleryGames.map((game) => {
                  const myInv = mySectionInvestments.find((i) => i.gameId === game.id)?.coins || 0;
                  const totalCoins = appData.investments
                    .filter((i) => i.gameId === game.id)
                    .reduce((sum, i) => sum + i.coins, 0);
                  const distinctInvestors = new Set(
                    appData.investments.filter((i) => i.gameId === game.id).map((i) => i.investorId)
                  ).size;

                  const isSelfTeam = isSelfInvestment(
                    studentInvestor.teamName || studentInvestor.name,
                    game.teamName,
                    game.student1,
                    game.student2
                  );

                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      totalCoinsInvested={totalCoins}
                      distinctInvestorsCount={distinctInvestors}
                      myInvestmentInGame={myInv}
                      remainingCoins={Math.max(0, 100 - totalInvestedByMe)}
                      isSelfTeam={isSelfTeam}
                      isInvestingOpen={currentSessionState.status === 'investing_open'}
                      onPlayGame={(g) => setSelectedGameForPlay(g)}
                      onInvestInGame={(g) => setSelectedGameForInvest(g)}
                      isTeacherMode={currentRole === 'teacher'}
                      onToggleVerify={handleToggleVerify}
                      onToggleFinalist={handleToggleFinalist}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: CLASSROOM LEADERBOARD */}
        {activeTab === 'classroom_leaderboard' && (
          <ClassroomLeaderboardView
            section={currentSection}
            entries={sectionLeaderboard}
            isRevealed={currentSessionState.status === 'results_revealed'}
            onReveal={handleRevealLeaderboard}
            isTeacherMode={currentRole === 'teacher'}
            onToggleFinalist={handleToggleFinalist}
            onPlayGame={(g) => setSelectedGameForPlay(g)}
            onExportCSV={handleExportSectionCSV}
            onViewSchoolWide={() => setActiveTab('consolidated_leaderboard')}
          />
        )}

        {/* VIEW 3: CONSOLIDATED ALL 12 SECTIONS (Teacher role) */}
        {activeTab === 'consolidated_leaderboard' && (
          <ConsolidatedLeaderboardView
            entries={consolidatedLeaderboard}
            onPlayGame={(g) => setSelectedGameForPlay(g)}
            onExportCSV={handleExportConsolidatedCSV}
            isTeacherMode={currentRole === 'teacher'}
            onToggleFinalist={handleToggleFinalist}
          />
        )}

        {/* VIEW 4: SHARK TANK PTM FINALS (Parents, Guests & Teachers) */}
        {activeTab === 'ptm_finals' && (
          <PTMSharkTankView
            finalists={finalists}
            ptmInvestments={appData.ptmInvestments}
            onPlayGame={(g) => setSelectedGameForPlay(g)}
            onSubmitPTMInvestment={handleSubmitPTMInvestment}
            isTeacherMode={currentRole === 'teacher'}
          />
        )}

      </main>

      {/* Modals */}
      <PlayModal
        game={selectedGameForPlay}
        onClose={() => setSelectedGameForPlay(null)}
      />

      <InvestModal
        game={selectedGameForInvest}
        currentInvestment={
          selectedGameForInvest
            ? mySectionInvestments.find((i) => i.gameId === selectedGameForInvest.id)?.coins || 0
            : 0
        }
        totalInvestedAcrossOtherGames={
          selectedGameForInvest
            ? totalInvestedByMe - (mySectionInvestments.find((i) => i.gameId === selectedGameForInvest.id)?.coins || 0)
            : totalInvestedByMe
        }
        maxBudget={100}
        investorName={studentInvestor.name}
        studentTeamName={studentInvestor.teamName}
        onClose={() => setSelectedGameForInvest(null)}
        onSubmitInvestment={handleInvestInGame}
      />

      {isProjectorModalOpen && (
        <ProjectorModal
          section={currentSection}
          onClose={() => setIsProjectorModalOpen(false)}
          totalGames={sectionGames.length}
          games={sectionGames}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterGameModal
          currentSection={currentSection}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegisterGame={handleRegisterGame}
          isTeacherMode={currentRole === 'teacher'}
          studentName={studentInvestor.name}
          studentTeamName={studentInvestor.teamName}
        />
      )}

      {isIdentityModalOpen && (
        <IdentityModal
          currentInvestor={studentInvestor}
          section={currentSection}
          sectionGames={sectionGames}
          onSave={(name, teamName) => setStudentInvestor((prev) => ({ ...prev, name, teamName }))}
          onClose={() => setIsIdentityModalOpen(false)}
        />
      )}

      <TeacherSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        supabaseConfig={appData.supabaseConfig}
        onSaveSupabaseConfig={(config) => setAppData((prev) => ({ ...prev, supabaseConfig: config }))}
        onResetSeedData={() => {
          setAppData({
            games: INITIAL_GAMES,
            investments: INITIAL_INVESTMENTS,
            ptmInvestments: INITIAL_PTM_INVESTMENTS,
            sessions: {
              ...appData.sessions,
              '8A': { status: 'investing_open', eligibleInvestorsCount: 12, lastUpdated: new Date().toISOString() }
            }
          });
          setIsSettingsModalOpen(false);
        }}
        onClearAllData={() => {
          setAppData({
            games: [],
            investments: [],
            ptmInvestments: [],
            sessions: {}
          });
          setIsSettingsModalOpen(false);
        }}
      />

      {/* Teacher PIN Unlock Modal */}
      {isTeacherPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-slate-900 border border-indigo-500/60 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsTeacherPinModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-500/40">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Teacher Admin Access</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter teacher PIN to unlock event management and session controls.
              </p>
            </div>

            <form onSubmit={handleVerifyTeacherPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="Enter PIN (teach88)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest"
                  autoFocus
                />
                {pinError && (
                  <p className="text-rose-400 text-xs mt-1 text-center font-medium">
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
              >
                Unlock Teacher Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinInput('teach88');
                  setIsTeacherAuthenticated(true);
                  sessionStorage.setItem('AI_TEACHER_AUTH', 'true');
                  setIsTeacherPinModalOpen(false);
                  setCurrentRole('teacher');
                }}
                className="w-full py-2 text-[11px] text-indigo-400 hover:text-indigo-300 underline text-center cursor-pointer"
              >
                Quick Unlock (Default: teach88)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
