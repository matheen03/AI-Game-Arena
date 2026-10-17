import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Game, Investment, PTMInvestment } from '../utils/rules';
import { INITIAL_GAMES, INITIAL_INVESTMENTS, INITIAL_PTM_INVESTMENTS, SECTIONS, SectionCode } from '../data/seedData';

export interface SectionSessionState {
  status: 'not_started' | 'investing_open' | 'investing_closed' | 'results_revealed';
  eligibleInvestorsCount: number;
  lastUpdated: string;
}

export interface AppStateData {
  games: Game[];
  investments: Investment[];
  ptmInvestments: PTMInvestment[];
  sessions: Record<string, SectionSessionState>;
  supabaseConfig?: {
    url: string;
    anonKey: string;
  };
}

const STORAGE_KEY = 'AI_GAME_ARENA_STORAGE_V2';

function getDefaultSessions(): Record<string, SectionSessionState> {
  const sessions: Record<string, SectionSessionState> = {};
  SECTIONS.forEach((sec, idx) => {
    sessions[sec] = {
      // 8A is active by default for immediate demo, others not started
      status: idx === 0 ? 'investing_open' : 'not_started',
      eligibleInvestorsCount: 12,
      lastUpdated: new Date().toISOString()
    };
  });
  return sessions;
}

export function loadLocalData(): AppStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.games && parsed.investments) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage, using initial seed:', err);
  }

  const initial: AppStateData = {
    games: INITIAL_GAMES,
    investments: INITIAL_INVESTMENTS,
    ptmInvestments: INITIAL_PTM_INVESTMENTS,
    sessions: getDefaultSessions()
  };
  saveLocalData(initial);
  return initial;
}

export function saveLocalData(data: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Supabase client instance helper
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(configOverride?: { url: string; anonKey: string }): SupabaseClient | null {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const url = configOverride?.url || envUrl;
  const key = configOverride?.anonKey || envKey;

  if (url && key && url.startsWith('http')) {
    if (!supabaseClient) {
      supabaseClient = createClient(url, key);
    }
    return supabaseClient;
  }
  return null;
}
