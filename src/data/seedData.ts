import { Game } from '../utils/rules';

export const SECTIONS = [
  '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I', '8J', '8K', '8L'
] as const;

export type SectionCode = typeof SECTIONS[number];

export const CATEGORIES = [
  'Arcade Retro',
  'Platformer & Action',
  'Puzzle & Logic',
  'Desert & Racing',
  'AI & Sci-Fi',
  'Strategy & Defense',
  'Trivia & Heritage'
] as const;

export const INITIAL_GAMES: Game[] = [
  // Section 8A
  {
    id: 'game-8a-01',
    section: '8A',
    teamName: 'Cyber Falcons',
    student1: 'Tariq Al-Harbi',
    student2: 'Omar Al-Ghamdi',
    gameTitle: 'Falcon Flight 2099',
    category: 'AI & Sci-Fi',
    description: 'An AI-augmented cyber falcon dodging supersonic sandstorm obstacles over futuristic Riyadh.',
    netlifyUrl: 'https://falcon-flight-8a.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T08:30:00Z'
  },
  {
    id: 'game-8a-02',
    section: '8A',
    teamName: 'Dune Drifters',
    student1: 'Fahad Al-Otaibi',
    student2: 'Saud Al-Shehri',
    gameTitle: 'Dune Drift Rally',
    category: 'Desert & Racing',
    description: 'Physics-based desert buggy racing over dynamic dunes with Gemini-assisted track generation.',
    netlifyUrl: 'https://dune-drift-8a.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T08:35:00Z'
  },
  {
    id: 'game-8a-03',
    section: '8A',
    teamName: 'Pixel Oasis',
    student1: 'Khalid Al-Zahrani',
    student2: 'Bader Al-Dosari',
    gameTitle: 'Oasis Waterkeeper',
    category: 'Strategy & Defense',
    description: 'Manage water conduits and solar pump stations against desert heatwaves in a retro pixel style.',
    netlifyUrl: 'https://oasis-waterkeeper-8a.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T08:40:00Z'
  },
  {
    id: 'game-8a-04',
    section: '8A',
    teamName: 'Neural Knights',
    student1: 'Ziyad Al-Mutairi',
    student2: 'Nawaf Al-Subaie',
    gameTitle: 'AlUla Mystery Maze',
    category: 'Puzzle & Logic',
    description: 'Explore the ancient stone pillars of Hegra to solve optical light beam puzzles.',
    netlifyUrl: 'https://alula-maze-8a.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T08:45:00Z'
  },
  {
    id: 'game-8a-05',
    section: '8A',
    teamName: 'Turbo Strikers',
    student1: 'Rayan Al-Qarni',
    student2: 'Sultan Al-Shammari',
    gameTitle: 'Gravity Goalie 3000',
    category: 'Arcade Retro',
    description: 'High-speed arcade pong and gravity goal shooter with bouncing neon balls.',
    netlifyUrl: 'https://gravity-goalie-8a.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T08:50:00Z'
  },
  {
    id: 'game-8a-06',
    section: '8A',
    teamName: 'Code Alchemists',
    student1: 'Mansour Al-Bishi',
    student2: 'Hamad Al-Kahtani',
    gameTitle: 'Heritage Quest: Diriyah',
    category: 'Trivia & Heritage',
    description: 'Interactive cultural RPG answering historical trivia to rebuild mud-brick fortresses.',
    netlifyUrl: 'https://diriyah-quest-8a.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T08:55:00Z'
  },

  // Section 8B
  {
    id: 'game-8b-01',
    section: '8B',
    teamName: 'Red Sea Explorers',
    student1: 'Abdullah Al-Amri',
    student2: 'Yousef Al-Husseini',
    gameTitle: 'Coral Reef Defender',
    category: 'Platformer & Action',
    description: 'Submarine arcade cleaning microplastics and protecting sea turtles along the Red Sea coast.',
    netlifyUrl: 'https://coral-defender-8b.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T09:10:00Z'
  },
  {
    id: 'game-8b-02',
    section: '8B',
    teamName: 'Solar Pioneers',
    student1: 'Majed Al-Ghamdi',
    student2: 'Ibrahim Al-Sayed',
    gameTitle: 'Solar Grid Tycoon',
    category: 'Strategy & Defense',
    description: 'Balance energy generation from mega solar farms across the desert to power smart cities.',
    netlifyUrl: 'https://solar-grid-8b.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T09:15:00Z'
  },
  {
    id: 'game-8b-03',
    section: '8B',
    teamName: 'Skyline Architects',
    student1: 'Meshal Al-Khatib',
    student2: 'Turki Al-Rasheed',
    gameTitle: 'Tower of The Line',
    category: 'Arcade Retro',
    description: 'Precision stacking vertical eco-towers with zero gravity physics and wind turbulence.',
    netlifyUrl: 'https://theline-tower-8b.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T09:20:00Z'
  },

  // Section 8C
  {
    id: 'game-8c-01',
    section: '8C',
    teamName: 'Desert Fox Studios',
    student1: 'Ahmed Al-Thani',
    student2: 'Hassan Al-Saeed',
    gameTitle: 'Fox Runner: Mirage',
    category: 'Platformer & Action',
    description: 'Endless runner with shifting sand mirages, oasis power-ups and nocturnal desert creatures.',
    netlifyUrl: 'https://fox-runner-8c.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T09:40:00Z'
  },
  {
    id: 'game-8c-02',
    section: '8C',
    teamName: 'Cosmic Camels',
    student1: 'Bandar Al-Sulaiman',
    student2: 'Waleed Al-Malki',
    gameTitle: 'Astro Camel Odyssey',
    category: 'AI & Sci-Fi',
    description: 'Space camel jumping between low-gravity asteroids collecting starlight water droplets.',
    netlifyUrl: 'https://astro-camel-8c.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T09:45:00Z'
  },

  // Section 8D
  {
    id: 'game-8d-01',
    section: '8D',
    teamName: 'Viper Mechanics',
    student1: 'Sami Al-Najjar',
    student2: 'Rami Al-Qadi',
    gameTitle: 'Formula Desert E-Prix',
    category: 'Desert & Racing',
    description: 'Electric racing formula cars dodging dust devils on the Riyadh street circuit.',
    netlifyUrl: 'https://desert-eprix-8d.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T10:00:00Z'
  },

  // Section 8E
  {
    id: 'game-8e-01',
    section: '8E',
    teamName: 'Algorithm Assassins',
    student1: 'Zayd Al-Muzaini',
    student2: 'Karim Al-Hassan',
    gameTitle: 'Quantum Cipher Escape',
    category: 'Puzzle & Logic',
    description: 'Decode binary signals and mathematical matrices to escape an AI supercomputer core.',
    netlifyUrl: 'https://quantum-cipher-8e.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T10:30:00Z'
  },

  // Section 8F
  {
    id: 'game-8f-01',
    section: '8F',
    teamName: 'Green Desert Labs',
    student1: 'Talal Al-Juhani',
    student2: 'Anas Al-Ghamdi',
    gameTitle: 'Flora Sandbox',
    category: 'Strategy & Defense',
    description: 'Terraform barren sand into lush date palm groves using sustainable cloud-seeding drones.',
    netlifyUrl: 'https://flora-sandbox-8f.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: '2026-10-15T11:00:00Z'
  },

  // Section 8G
  {
    id: 'game-8g-01',
    section: '8G',
    teamName: 'Riyadh Sparks',
    student1: 'Firas Al-Mutlaq',
    student2: 'Mazen Al-Tamimi',
    gameTitle: 'Neon Highway Stunt',
    category: 'Arcade Retro',
    description: 'Cyberpunk highway motorcycle stunts with speed boosts and synthwave beats.',
    netlifyUrl: 'https://neon-highway-8g.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T11:30:00Z'
  },

  // Section 8H
  {
    id: 'game-8h-01',
    section: '8H',
    teamName: 'Bedouin Builders',
    student1: 'Salman Al-Bawardi',
    student2: 'Moath Al-Farhan',
    gameTitle: 'Nomad Camp Survival',
    category: 'Strategy & Defense',
    description: 'Survive harsh star-lit nights, craft compasses, and navigate by constellation maps.',
    netlifyUrl: 'https://nomad-camp-8h.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T12:00:00Z'
  },

  // Section 8I
  {
    id: 'game-8i-01',
    section: '8I',
    teamName: 'Star Navigators',
    student1: 'Yazid Al-Qurashi',
    student2: 'Adel Al-Barrak',
    gameTitle: 'Astrolabe Quest',
    category: 'Puzzle & Logic',
    description: 'Align antique astronomical brass astrolabes to navigate sailing dhows across the Arabian Sea.',
    netlifyUrl: 'https://astrolabe-8i.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T12:30:00Z'
  },

  // Section 8J
  {
    id: 'game-8j-01',
    section: '8J',
    teamName: 'Oryx Speedsters',
    student1: 'Nayef Al-Husseini',
    student2: 'Faris Al-Amoudi',
    gameTitle: 'Oryx Dash: Kingdom Cup',
    category: 'Desert & Racing',
    description: 'High-speed animal athletic dash with turbo leaps over canyon crevices.',
    netlifyUrl: 'https://oryx-dash-8j.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T13:00:00Z'
  },

  // Section 8K
  {
    id: 'game-8k-01',
    section: '8K',
    teamName: 'Hyperion AI',
    student1: 'Rayyan Al-Jadaan',
    student2: 'Bariq Al-Hamdan',
    gameTitle: 'Gemini Code Duel',
    category: 'Trivia & Heritage',
    description: 'Competitive rapid-fire coding and logic puzzle arena against an adaptive AI bot.',
    netlifyUrl: 'https://code-duel-8k.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T13:30:00Z'
  },

  // Section 8L
  {
    id: 'game-8l-01',
    section: '8L',
    teamName: 'Desert Tempest',
    student1: 'Zahir Al-Sharif',
    student2: 'Ghaith Al-Kindi',
    gameTitle: 'Tempest Tower Blitz',
    category: 'Arcade Retro',
    description: 'Laser tower defense warding off sand whirlwind vortexes over a desert citadel.',
    netlifyUrl: 'https://tempest-tower-8l.netlify.app',
    isVerified: true,
    isFinalist: false,
    createdAt: '2026-10-15T14:00:00Z'
  }
];

export const INITIAL_INVESTMENTS = [
  // Section 8A investments
  {
    id: 'inv-8a-01',
    section: '8A',
    gameId: 'game-8a-01',
    investorId: 'STU-8A-001',
    investorName: 'Fahad Al-Otaibi',
    studentTeamName: 'Dune Drifters',
    coins: 40,
    timestamp: '2026-10-15T09:00:00Z'
  },
  {
    id: 'inv-8a-02',
    section: '8A',
    gameId: 'game-8a-02',
    investorId: 'STU-8A-002',
    investorName: 'Tariq Al-Harbi',
    studentTeamName: 'Cyber Falcons',
    coins: 50,
    timestamp: '2026-10-15T09:02:00Z'
  },
  {
    id: 'inv-8a-03',
    section: '8A',
    gameId: 'game-8a-01',
    investorId: 'STU-8A-003',
    investorName: 'Khalid Al-Zahrani',
    studentTeamName: 'Pixel Oasis',
    coins: 35,
    timestamp: '2026-10-15T09:03:00Z'
  },
  {
    id: 'inv-8a-04',
    section: '8A',
    gameId: 'game-8a-04',
    investorId: 'STU-8A-003',
    investorName: 'Khalid Al-Zahrani',
    studentTeamName: 'Pixel Oasis',
    coins: 30,
    timestamp: '2026-10-15T09:04:00Z'
  },
  {
    id: 'inv-8a-05',
    section: '8A',
    gameId: 'game-8a-02',
    investorId: 'STU-8A-004',
    investorName: 'Ziyad Al-Mutairi',
    studentTeamName: 'Neural Knights',
    coins: 45,
    timestamp: '2026-10-15T09:05:00Z'
  },
  {
    id: 'inv-8a-06',
    section: '8A',
    gameId: 'game-8a-03',
    investorId: 'STU-8A-001',
    investorName: 'Fahad Al-Otaibi',
    studentTeamName: 'Dune Drifters',
    coins: 30,
    timestamp: '2026-10-15T09:06:00Z'
  },
  {
    id: 'inv-8a-07',
    section: '8A',
    gameId: 'game-8a-05',
    investorId: 'STU-8A-002',
    investorName: 'Tariq Al-Harbi',
    studentTeamName: 'Cyber Falcons',
    coins: 30,
    timestamp: '2026-10-15T09:07:00Z'
  },

  // Section 8B investments
  {
    id: 'inv-8b-01',
    section: '8B',
    gameId: 'game-8b-01',
    investorId: 'STU-8B-001',
    investorName: 'Majed Al-Ghamdi',
    studentTeamName: 'Solar Pioneers',
    coins: 60,
    timestamp: '2026-10-15T09:25:00Z'
  },
  {
    id: 'inv-8b-02',
    section: '8B',
    gameId: 'game-8b-02',
    investorId: 'STU-8B-002',
    investorName: 'Abdullah Al-Amri',
    studentTeamName: 'Red Sea Explorers',
    coins: 50,
    timestamp: '2026-10-15T09:26:00Z'
  },

  // Section 8C investments
  {
    id: 'inv-8c-01',
    section: '8C',
    gameId: 'game-8c-01',
    investorId: 'STU-8C-001',
    investorName: 'Bandar Al-Sulaiman',
    studentTeamName: 'Cosmic Camels',
    coins: 55,
    timestamp: '2026-10-15T09:50:00Z'
  }
];

export const INITIAL_PTM_INVESTMENTS = [
  {
    id: 'ptm-01',
    gameId: 'game-8a-01',
    investorId: 'PARENT-101',
    parentName: 'Dr. Tariq Al-Ghamdi (Parent)',
    coins: 150,
    timestamp: '2026-10-16T18:00:00Z'
  },
  {
    id: 'ptm-02',
    gameId: 'game-8a-02',
    investorId: 'PARENT-102',
    parentName: 'Eng. Saud Al-Shehri (Parent)',
    coins: 120,
    timestamp: '2026-10-16T18:05:00Z'
  },
  {
    id: 'ptm-03',
    gameId: 'game-8b-01',
    investorId: 'PARENT-103',
    parentName: 'Nouf Al-Amri (Parent)',
    coins: 200,
    timestamp: '2026-10-16T18:10:00Z'
  }
];
