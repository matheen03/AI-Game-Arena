export interface Game {
  id: string;
  section: string; // e.g. '8A' .. '8L'
  teamName?: string; // Optional: defaults to Student 1 if omitted
  student1: string; // Required
  student2?: string; // Optional (individual or pair)
  gameTitle: string; // Required
  category: string;
  description?: string; // Optional
  netlifyUrl: string; // Required
  isVerified: boolean;
  isFinalist?: boolean;
  createdAt: string;
}

export interface Investment {
  id: string;
  section: string;
  gameId: string;
  investorId: string; // pseudonymous ID e.g. STU-8A-1234
  investorName: string;
  studentTeamName?: string; // the team this student belongs to, to prevent self-investing
  coins: number;
  timestamp: string;
}

export interface PTMInvestment {
  id: string;
  gameId: string;
  investorId: string;
  parentName: string;
  coins: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  game: Game;
  totalCoins: number;
  distinctInvestors: number;
  normalizedScore: number;
}

/**
 * Validates whether an investment amount is valid given remaining budget
 */
export function validateCoinAllocation(
  currentAllocation: number,
  allocatedOtherGames: number,
  maxBudget: number = 100
): { valid: boolean; error?: string } {
  if (isNaN(currentAllocation) || currentAllocation < 0) {
    return { valid: false, error: 'Investment must be a positive number of AI Coins.' };
  }
  if (!Number.isInteger(currentAllocation)) {
    return { valid: false, error: 'AI Coins must be whole numbers.' };
  }
  if (currentAllocation + allocatedOtherGames > maxBudget) {
    return {
      valid: false,
      error: `Total investments (${currentAllocation + allocatedOtherGames}) would exceed your ${maxBudget} AI Coin budget.`
    };
  }
  return { valid: true };
}

/**
 * Checks if a student is attempting to invest in their own team or project
 */
export function isSelfInvestment(
  studentNameOrTeam: string | undefined,
  gameTeamName?: string,
  student1?: string,
  student2?: string
): boolean {
  if (!studentNameOrTeam || !studentNameOrTeam.trim()) return false;
  const target = studentNameOrTeam.trim().toLowerCase();

  if (gameTeamName && gameTeamName.trim().toLowerCase() === target) return true;
  if (student1 && student1.trim().toLowerCase() === target) return true;
  if (student2 && student2.trim().toLowerCase() === target) return true;
  
  return false;
}

/**
 * Validates a submitted game URL, automatically prepending https:// if omitted
 */
export function validateGameUrl(rawUrl: string): { valid: boolean; normalizedUrl: string; isNetlify: boolean; error?: string } {
  if (!rawUrl || !rawUrl.trim()) {
    return { valid: false, normalizedUrl: '', isNetlify: false, error: 'Netlify Game URL is required.' };
  }

  let formatted = rawUrl.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, normalizedUrl: '', isNetlify: false, error: 'URL must start with http:// or https://' };
    }
    const isNetlify = parsed.hostname.endsWith('netlify.app');
    return { valid: true, normalizedUrl: formatted, isNetlify };
  } catch {
    return { valid: false, normalizedUrl: '', isNetlify: false, error: 'Invalid URL format. Example: https://mygame.netlify.app' };
  }
}

/**
 * Calculates normalized score for school-wide comparison:
 * Formula: (Total Coins / Active Section Investors) normalized to standard 100-coin base.
 * If section has 10 active investors, 200 coins = average 20.0 coins per investor.
 */
export function calculateNormalizedScore(
  totalCoins: number,
  activeInvestorsCount: number
): number {
  if (!activeInvestorsCount || activeInvestorsCount <= 0) {
    return totalCoins > 0 ? totalCoins : 0;
  }
  // Rounded to 2 decimal places
  const avgCoinsPerInvestor = (totalCoins / activeInvestorsCount);
  return Math.round(avgCoinsPerInvestor * 100) / 100;
}

/**
 * Computes ranked leaderboard from games and investment records
 */
export function computeLeaderboard(
  games: Game[],
  investments: Investment[],
  sectionInvestorCountMap: Record<string, number> = {}
): LeaderboardEntry[] {
  // Aggregate coins and distinct investors per game
  const statsMap: Record<string, { totalCoins: number; investors: Set<string> }> = {};

  games.forEach(g => {
    statsMap[g.id] = { totalCoins: 0, investors: new Set() };
  });

  investments.forEach(inv => {
    if (statsMap[inv.gameId]) {
      statsMap[inv.gameId].totalCoins += inv.coins;
      statsMap[inv.gameId].investors.add(inv.investorId);
    }
  });

  const entries: LeaderboardEntry[] = games.map(game => {
    const stat = statsMap[game.id] || { totalCoins: 0, investors: new Set() };
    const distinctInvestors = stat.investors.size;
    const activeInvestors = sectionInvestorCountMap[game.section] || Math.max(1, distinctInvestors);
    const normalizedScore = calculateNormalizedScore(stat.totalCoins, activeInvestors);

    return {
      rank: 0,
      game,
      totalCoins: stat.totalCoins,
      distinctInvestors,
      normalizedScore
    };
  });

  // Sort by normalized score first (or totalCoins if not normalized), then totalCoins, then distinctInvestors
  entries.sort((a, b) => {
    if (b.normalizedScore !== a.normalizedScore) {
      return b.normalizedScore - a.normalizedScore;
    }
    if (b.totalCoins !== a.totalCoins) {
      return b.totalCoins - a.totalCoins;
    }
    return b.distinctInvestors - a.distinctInvestors;
  });

  // Assign ranks
  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return entries;
}

/**
 * Converts leaderboard entries to CSV format for export
 */
export function exportLeaderboardToCSV(entries: LeaderboardEntry[]): string {
  const headers = [
    'Rank',
    'Game Title',
    'Team Name',
    'Section',
    'Students',
    'Category',
    'Total AI Coins',
    'Distinct Investors',
    'Normalized Score (Coins/Investor)',
    'Netlify URL',
    'Finalist Status'
  ];

  const rows = entries.map(e => {
    const studentNames = e.game.student2
      ? `${e.game.student1} & ${e.game.student2}`
      : e.game.student1;
    const team = e.game.teamName || `${e.game.student1}'s Project`;

    return [
      e.rank,
      `"${e.game.gameTitle.replace(/"/g, '""')}"`,
      `"${team.replace(/"/g, '""')}"`,
      e.game.section,
      `"${studentNames.replace(/"/g, '""')}"`,
      `"${e.game.category.replace(/"/g, '""')}"`,
      e.totalCoins,
      e.distinctInvestors,
      e.normalizedScore,
      `"${e.game.netlifyUrl}"`,
      e.game.isFinalist ? 'FINALIST' : 'Classroom'
    ];
  });

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
