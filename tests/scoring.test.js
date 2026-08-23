import { test } from 'node:test';
import assert from 'node:assert';

// 1. Suitability Scorer Unit Test
function calculateSuitability(answers, archetype) {
  let score = 40;

  if (answers.sector === 'Any' || archetype.sector === answers.sector) score += 15;
  if (archetype.capital === answers.capital) score += 15;
  if (archetype.space === answers.space) score += 10;
  if (archetype.risk === answers.risk) score += 5;

  const sectorSkills = {
    'Agriculture & Livestock': 'Agriculture',
    'Manufacturing': 'Production/Labor',
    'IT & Services': 'Tech/Digital',
    'Food & Hospitality': 'Food/Cooking',
    'Retail & Trade': 'Trading'
  };
  if (sectorSkills[archetype.sector] === answers.strength) score += 10;

  // Crop yield synergies
  const block = answers.tehsil;
  if (archetype.id === 'orange_pulp' && ['Katol', 'Narkhed', 'Savner', 'Kalmeshwar'].includes(block)) score += 25;
  if (archetype.id === 'cold_pressed_oil' && ['Kuhi', 'Mauda', 'Umred', 'Hingna'].includes(block)) score += 25;
  if (archetype.id === 'spices_grinding' && block === 'Bhiwapur') score += 35;

  return Math.max(35, Math.min(99, score));
}

test('Suitability Scorer - Exact sector & yield boosts', () => {
  const answers = {
    tehsil: 'Bhiwapur',
    capital: 'low',
    sector: 'Agriculture & Livestock',
    space: 'small',
    risk: 'medium',
    strength: 'Agriculture'
  };
  
  const archetype = {
    id: 'spices_grinding',
    sector: 'Agriculture & Livestock',
    capital: 'low',
    space: 'small',
    risk: 'medium'
  };

  const score = calculateSuitability(answers, archetype);
  
  // Base 40 + 15 (sector) + 15 (capital) + 10 (space) + 5 (risk) + 10 (skill) + 35 (Bhiwapur Spice boost) = 130 -> capped at 99
  assert.strictEqual(score, 99);
});

test('Suitability Scorer - Default low baseline cap', () => {
  const answers = {
    tehsil: 'Kamptee',
    capital: 'high',
    sector: 'IT & Services',
    space: 'large',
    risk: 'high',
    strength: 'Production/Labor'
  };

  const archetype = {
    id: 'orange_pulp',
    sector: 'Agriculture & Livestock',
    capital: 'low',
    space: 'small',
    risk: 'low'
  };

  const score = calculateSuitability(answers, archetype);
  // Mismatched parameters should yield minimum default cap
  assert.strictEqual(score, 40);
});

// 2. Financial Scorer Unit Test
function calculateBreakEven(fixedCost, price, varCost) {
  const contributionMargin = price - varCost;
  return contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : 999999;
}

test('Financial Calculations - Correct Break Even units', () => {
  const rent = 10000;
  const wages = 15000;
  const fixed = rent + wages + 5000; // 30,000 fixed
  const price = 100;
  const varCost = 50;

  const breakEvenUnits = calculateBreakEven(fixed, price, varCost);
  // 30000 / (100 - 50) = 600 units
  assert.strictEqual(breakEvenUnits, 600);
});
