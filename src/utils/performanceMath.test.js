import { describe, it, expect } from 'vitest';
import { calculate1RM, calculateVolume, getRelativeIntensity } from './performanceMath.js';

describe('calculate1RM', () => {
  it('returns 0 for invalid inputs', () => {
    expect(calculate1RM(0, 5)).toBe(0);
    expect(calculate1RM(100, 0)).toBe(0);
    expect(calculate1RM(null, 5)).toBe(0);
    expect(calculate1RM(100, -1)).toBe(0);
  });

  it('returns the weight itself for 1 rep', () => {
    expect(calculate1RM(100, 1)).toBe(100);
    expect(calculate1RM(60, 1)).toBe(60);
  });

  it('estimates 1RM correctly for known values', () => {
    // 100kg x 5 reps should be approximately 115-117kg
    const result = calculate1RM(100, 5);
    expect(result).toBeGreaterThan(110);
    expect(result).toBeLessThan(120);
  });

  it('handles high rep ranges', () => {
    // Should still return a reasonable value for 10 reps
    const result = calculate1RM(60, 10);
    expect(result).toBeGreaterThan(70);
    expect(result).toBeLessThan(90);
  });

  it('rounds to 1 decimal place', () => {
    const result = calculate1RM(100, 5);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(1);
  });
});

describe('calculateVolume', () => {
  it('returns 0 for empty or invalid arrays', () => {
    expect(calculateVolume([])).toBe(0);
    expect(calculateVolume(null)).toBe(0);
    expect(calculateVolume(undefined)).toBe(0);
  });

  it('calculates volume for a single set', () => {
    const sets = [{ weight: 100, reps: 10 }];
    expect(calculateVolume(sets)).toBe(1000);
  });

  it('calculates volume for multiple sets', () => {
    const sets = [
      { weight: 100, reps: 10 },
      { weight: 100, reps: 8 },
      { weight: 90, reps: 6 },
    ];
    // 1000 + 800 + 540 = 2340
    expect(calculateVolume(sets)).toBe(2340);
  });

  it('handles sets with missing or invalid values', () => {
    const sets = [
      { weight: 100, reps: 10 },
      { weight: null, reps: 5 },
      { weight: 50, reps: undefined },
    ];
    // Only first set counts: 1000
    expect(calculateVolume(sets)).toBe(1000);
  });

  it('handles string values (from form inputs)', () => {
    const sets = [
      { weight: '100', reps: '10' },
      { weight: '80', reps: '8' },
    ];
    // 1000 + 640 = 1640
    expect(calculateVolume(sets)).toBe(1640);
  });
});

describe('getRelativeIntensity', () => {
  it('returns 0 when 1RM is zero or invalid', () => {
    expect(getRelativeIntensity(80, 0)).toBe(0);
    expect(getRelativeIntensity(80, null)).toBe(0);
    expect(getRelativeIntensity(80, -10)).toBe(0);
  });

  it('calculates correct percentage', () => {
    expect(getRelativeIntensity(80, 100)).toBe(80);
    expect(getRelativeIntensity(75, 100)).toBe(75);
    expect(getRelativeIntensity(100, 100)).toBe(100);
  });

  it('rounds to whole number', () => {
    expect(getRelativeIntensity(85, 100)).toBe(85);
    expect(getRelativeIntensity(77.5, 100)).toBe(78); // Rounds
  });
});
