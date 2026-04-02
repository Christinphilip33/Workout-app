import { describe, it, expect } from 'vitest';
import {
  LEVEL_THRESHOLDS,
  getLevelFromSessions,
  getLevelName,
  getNextThreshold
} from './levels.js';

describe('LEVEL_THRESHOLDS', () => {
  it('has 4 levels defined', () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(4);
  });

  it('levels are in ascending order', () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i].sessions).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1].sessions);
    }
  });
});

describe('getLevelFromSessions', () => {
  it('returns level 1 for 0 sessions', () => {
    expect(getLevelFromSessions(0)).toBe(1);
  });

  it('returns level 1 for sessions below 10', () => {
    expect(getLevelFromSessions(5)).toBe(1);
    expect(getLevelFromSessions(9)).toBe(1);
  });

  it('returns level 2 for 10+ sessions', () => {
    expect(getLevelFromSessions(10)).toBe(2);
    expect(getLevelFromSessions(15)).toBe(2);
    expect(getLevelFromSessions(24)).toBe(2);
  });

  it('returns level 3 for 25+ sessions', () => {
    expect(getLevelFromSessions(25)).toBe(3);
    expect(getLevelFromSessions(40)).toBe(3);
    expect(getLevelFromSessions(49)).toBe(3);
  });

  it('returns level 4 for 50+ sessions', () => {
    expect(getLevelFromSessions(50)).toBe(4);
    expect(getLevelFromSessions(100)).toBe(4);
    expect(getLevelFromSessions(999)).toBe(4);
  });
});

describe('getLevelName', () => {
  it('returns correct names for each level', () => {
    expect(getLevelName(1)).toBe('Beginner');
    expect(getLevelName(2)).toBe('Intermediate');
    expect(getLevelName(3)).toBe('Advanced');
    expect(getLevelName(4)).toBe('Elite');
  });

  it('returns Beginner for invalid levels', () => {
    expect(getLevelName(0)).toBe('Beginner');
    expect(getLevelName(5)).toBe('Beginner');
    expect(getLevelName(-1)).toBe('Beginner');
  });
});

describe('getNextThreshold', () => {
  it('returns next threshold for levels 1-3', () => {
    expect(getNextThreshold(1)).toEqual({ level: 2, name: 'Intermediate', sessions: 10 });
    expect(getNextThreshold(2)).toEqual({ level: 3, name: 'Advanced', sessions: 25 });
    expect(getNextThreshold(3)).toEqual({ level: 4, name: 'Elite', sessions: 50 });
  });

  it('returns null for level 4 (max level)', () => {
    expect(getNextThreshold(4)).toBeNull();
  });

  it('returns null for invalid levels', () => {
    expect(getNextThreshold(5)).toBeNull();
    expect(getNextThreshold(10)).toBeNull();
  });
});
