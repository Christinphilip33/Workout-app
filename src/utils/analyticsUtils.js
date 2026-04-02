/**
 * analyticsUtils.js
 * Client-side analytics engine — pulls directly from IndexedDB for Basement-Proof performance.
 */
import { db } from '../context/WorkoutContext.jsx';
import { calculate1RM, calculateVolume } from './performanceMath.js';

/**
 * Returns a time-series array of Estimated 1RM for a specific exercise.
 * Each point includes date, estimated 1RM, and the heaviest raw set.
 * 
 * @param {string} exerciseId
 * @param {'1m'|'3m'|'all'} timeframe
 * @returns {Promise<Array<{date, value, heaviestWeight, heaviestReps}>>}
 */
export async function get1RMTrend(exerciseId, timeframe = 'all') {
  const sessions = await db.completedSessions.toArray();
  const cutoff = getTimeframeCutoff(timeframe);

  const trend = [];

  sessions
    .filter(s => new Date(s.date) >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(session => {
      const entry = session.entries?.find(e => e.exerciseId === exerciseId);
      if (!entry || !entry.sets?.length) return;

      let best1RM = 0;
      let heaviestWeight = 0;
      let heaviestReps = 0;

      entry.sets.forEach(set => {
        const e1rm = calculate1RM(set.weight, set.reps);
        if (e1rm > best1RM) {
          best1RM = e1rm;
        }
        if (set.weight > heaviestWeight) {
          heaviestWeight = set.weight;
          heaviestReps = set.reps;
        }
      });

      trend.push({
        date: new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        rawDate: session.date,
        value: Math.round(best1RM * 10) / 10,
        volume: calculateVolume(entry.sets),
        heaviestWeight,
        heaviestReps
      });
    });

  return trend;
}

/**
 * Aggregates total Volume Tonnage per muscle group for a given period.
 * Returns both current and previous period for week-over-week comparison.
 * 
 * @param {number} days - Number of days to look back (default 7)
 * @returns {Promise<Array<{muscle, current, previous, change}>>}
 */
export async function getVolumeByMuscleGroup(days = 7) {
  const sessions = await db.completedSessions.toArray();
  const exercises = await db.exercises.toArray();
  
  const now = new Date();
  const currentStart = new Date(now.getTime() - days * 86400000);
  const previousStart = new Date(currentStart.getTime() - days * 86400000);

  const currentMap = {};
  const previousMap = {};

  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const isCurrentPeriod = sessionDate >= currentStart;
    const isPreviousPeriod = sessionDate >= previousStart && sessionDate < currentStart;
    
    if (!isCurrentPeriod && !isPreviousPeriod) return;

    session.entries?.forEach(entry => {
      const exerciseDef = exercises.find(e => e.id === entry.exerciseId);
      if (!exerciseDef) return;

      const volume = calculateVolume(entry.sets);
      const muscles = exerciseDef.muscleGroups || [exerciseDef.target || exerciseDef.bodyPart || 'Other'];

      muscles.forEach(muscle => {
        if (isCurrentPeriod) {
          currentMap[muscle] = (currentMap[muscle] || 0) + volume;
        } else {
          previousMap[muscle] = (previousMap[muscle] || 0) + volume;
        }
      });
    });
  });

  // Merge all muscle groups
  const allMuscles = new Set([...Object.keys(currentMap), ...Object.keys(previousMap)]);
  
  return Array.from(allMuscles).map(muscle => {
    const current = currentMap[muscle] || 0;
    const previous = previousMap[muscle] || 0;
    const change = previous > 0 ? Math.round(((current - previous) / previous) * 100) : (current > 0 ? 100 : 0);

    return { muscle, current, previous, change };
  }).sort((a, b) => b.current - a.current);
}

/**
 * Achievement milestone checker.
 * Returns any newly achieved milestones based on all-time history.
 * 
 * @returns {Promise<Array<{id, title, description, icon}>>}
 */
export async function checkAchievements() {
  const sessions = await db.completedSessions.toArray();
  const achieved = [];

  // Milestone 1: Total Workouts
  if (sessions.length >= 5) achieved.push({ id: 'workouts_5', title: 'Getting Started', description: '5 workouts completed', icon: '🔥' });
  if (sessions.length >= 25) achieved.push({ id: 'workouts_25', title: 'Dedicated', description: '25 workouts completed', icon: '💎' });
  if (sessions.length >= 100) achieved.push({ id: 'workouts_100', title: 'Century Club', description: '100 workouts completed', icon: '🏆' });

  // Milestone 2: Single session 1000kg volume
  const hasMonsterSession = sessions.some(session => {
    const totalVol = session.entries?.reduce((acc, entry) => acc + calculateVolume(entry.sets), 0) || 0;
    return totalVol >= 1000;
  });
  if (hasMonsterSession) achieved.push({ id: 'volume_1k', title: 'Volume Monster', description: '1,000kg total volume in a single session', icon: '🦍' });

  // Milestone 3: 5000kg session
  const has5kSession = sessions.some(session => {
    const totalVol = session.entries?.reduce((acc, entry) => acc + calculateVolume(entry.sets), 0) || 0;
    return totalVol >= 5000;
  });
  if (has5kSession) achieved.push({ id: 'volume_5k', title: 'Iron Giant', description: '5,000kg moved in one session', icon: '⚡' });

  // Milestone 4: Consecutive training days
  if (sessions.length >= 2) {
    const sortedDates = sessions
      .map(s => new Date(s.date).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(a) - new Date(b));

    let maxStreak = 1, streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (new Date(sortedDates[i]) - new Date(sortedDates[i - 1])) / 86400000;
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    if (maxStreak >= 3) achieved.push({ id: 'streak_3', title: 'Hat Trick', description: '3 consecutive training days', icon: '🎯' });
    if (maxStreak >= 5) achieved.push({ id: 'streak_5', title: 'Iron Will', description: '5 consecutive training days', icon: '🔱' });
    if (maxStreak >= 7) achieved.push({ id: 'streak_7', title: 'Unstoppable', description: '7 consecutive training days', icon: '👑' });
  }

  // Milestone 5: 100kg+ 1RM
  let hasElite1RM = false;
  sessions.forEach(session => {
    session.entries?.forEach(entry => {
      entry.sets?.forEach(set => {
        if (calculate1RM(set.weight, set.reps) >= 100) hasElite1RM = true;
      });
    });
  });
  if (hasElite1RM) achieved.push({ id: '1rm_100', title: 'Triple Digits', description: 'Estimated 1RM over 100kg', icon: '💪' });

  return achieved;
}

/**
 * Returns a Date cutoff for the given timeframe key.
 */
function getTimeframeCutoff(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case '1m': return new Date(now.getTime() - 30 * 86400000);
    case '3m': return new Date(now.getTime() - 90 * 86400000);
    default: return new Date(0); // All time
  }
}
