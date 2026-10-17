import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCoinAllocation,
  isSelfInvestment,
  validateGameUrl,
  calculateNormalizedScore,
  computeLeaderboard,
  exportLeaderboardToCSV,
  type Game,
  type Investment
} from './rules.ts';

test('validateCoinAllocation allows valid amounts within 100 coin budget', () => {
  const result1 = validateCoinAllocation(30, 40, 100);
  assert.equal(result1.valid, true);

  const result2 = validateCoinAllocation(30, 70, 100);
  assert.equal(result2.valid, true);
});

test('validateCoinAllocation rejects exceeding budget or invalid amounts', () => {
  const resultOver = validateCoinAllocation(40, 70, 100);
  assert.equal(resultOver.valid, false);
  assert.match(resultOver.error || '', /exceed/i);

  const resultNegative = validateCoinAllocation(-10, 0, 100);
  assert.equal(resultNegative.valid, false);

  const resultDecimal = validateCoinAllocation(15.5, 0, 100);
  assert.equal(resultDecimal.valid, false);
  assert.match(resultDecimal.error || '', /whole numbers/i);
});

test('isSelfInvestment correctly detects same team or creator student name', () => {
  assert.equal(isSelfInvestment('Cyber Falcons', 'Cyber Falcons', 'Tariq', 'Omar'), true);
  assert.equal(isSelfInvestment('Tariq', 'Cyber Falcons', 'Tariq', 'Omar'), true);
  assert.equal(isSelfInvestment('Omar', 'Cyber Falcons', 'Tariq', 'Omar'), true);
  assert.equal(isSelfInvestment('Zaid', 'Cyber Falcons', 'Tariq', 'Omar'), false);
  assert.equal(isSelfInvestment(undefined, 'Cyber Falcons', 'Tariq', 'Omar'), false);
});

test('validateGameUrl checks valid netlify or general web url and auto-prefixes https', () => {
  const netlifyUrl = validateGameUrl('https://gemini-arcade-8a.netlify.app');
  assert.equal(netlifyUrl.valid, true);
  assert.equal(netlifyUrl.isNetlify, true);

  const autoPrefixed = validateGameUrl('my-gemini-game.netlify.app');
  assert.equal(autoPrefixed.valid, true);
  assert.equal(autoPrefixed.normalizedUrl, 'https://my-gemini-game.netlify.app');
  assert.equal(autoPrefixed.isNetlify, true);

  const otherUrl = validateGameUrl('https://mygame.com/play');
  assert.equal(otherUrl.valid, true);
  assert.equal(otherUrl.isNetlify, false);

  const invalidUrl = validateGameUrl('');
  assert.equal(invalidUrl.valid, false);
});

test('calculateNormalizedScore computes correct normalized average per investor', () => {
  // 300 coins received in a section with 15 active investors = 20.0 coins per investor
  assert.equal(calculateNormalizedScore(300, 15), 20.0);
  // 125 coins received in a section with 10 active investors = 12.5 coins per investor
  assert.equal(calculateNormalizedScore(125, 10), 12.5);
  // Zero coins
  assert.equal(calculateNormalizedScore(0, 10), 0);
});

test('computeLeaderboard aggregates investments and ranks correctly', () => {
  const sampleGames: Game[] = [
    {
      id: 'g1',
      section: '8A',
      teamName: 'Team Alpha',
      student1: 'Tariq',
      student2: 'Omar',
      gameTitle: 'Sandstorm Racer',
      category: 'Racing',
      description: 'AI desert racer',
      netlifyUrl: 'https://sandstorm.netlify.app',
      isVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'g2',
      section: '8A',
      teamName: 'Team Beta',
      student1: 'Zaid',
      student2: 'Fahad',
      gameTitle: 'Falcon Flight',
      category: 'Arcade',
      description: 'Falcon simulator',
      netlifyUrl: 'https://falcon.netlify.app',
      isVerified: true,
      createdAt: new Date().toISOString()
    }
  ];

  const sampleInvestments: Investment[] = [
    {
      id: 'inv1',
      section: '8A',
      gameId: 'g1',
      investorId: 'stu-1',
      investorName: 'Investor 1',
      coins: 50,
      timestamp: new Date().toISOString()
    },
    {
      id: 'inv2',
      section: '8A',
      gameId: 'g1',
      investorId: 'stu-2',
      investorName: 'Investor 2',
      coins: 30,
      timestamp: new Date().toISOString()
    },
    {
      id: 'inv3',
      section: '8A',
      gameId: 'g2',
      investorId: 'stu-1',
      investorName: 'Investor 1',
      coins: 20,
      timestamp: new Date().toISOString()
    }
  ];

  const results = computeLeaderboard(sampleGames, sampleInvestments, { '8A': 2 });
  assert.equal(results[0].game.id, 'g1');
  assert.equal(results[0].rank, 1);
  assert.equal(results[0].totalCoins, 80);
  assert.equal(results[0].distinctInvestors, 2);
  assert.equal(results[0].normalizedScore, 40); // 80 / 2 = 40

  assert.equal(results[1].game.id, 'g2');
  assert.equal(results[1].rank, 2);
  assert.equal(results[1].totalCoins, 20);
  assert.equal(results[1].distinctInvestors, 1);
});

test('exportLeaderboardToCSV formats valid CSV string', () => {
  const sampleGame: Game = {
    id: 'g1',
    section: '8A',
    teamName: 'Team "Alpha"',
    student1: 'Tariq',
    student2: 'Omar',
    gameTitle: 'Sandstorm, Desert',
    category: 'Racing',
    description: 'Fast game',
    netlifyUrl: 'https://sandstorm.netlify.app',
    isVerified: true,
    isFinalist: true,
    createdAt: new Date().toISOString()
  };

  const entries = [
    {
      rank: 1,
      game: sampleGame,
      totalCoins: 80,
      distinctInvestors: 2,
      normalizedScore: 40
    }
  ];

  const csv = exportLeaderboardToCSV(entries);
  assert.match(csv, /Rank,Game Title/);
  assert.match(csv, /"Sandstorm, Desert"/);
  assert.match(csv, /FINALIST/);
});
