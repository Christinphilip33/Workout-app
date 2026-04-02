import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../context/WorkoutContext.jsx';
import { calculate1RM, calculateVolume } from '../utils/performanceMath.js';

// Auto-regulation thresholds
const DELOAD_RPE_THRESHOLD = 9.5;
const DELOAD_SESSION_COUNT = 3;
const ADAPTATION_RPE_DROP_THRESHOLD = 1.5;

/**
 * useIntelligence Hook
 * Provides local AI/Intelligence insights based on IndexedDB history.
 */
export function useIntelligence() {
  const [completedSessions, setCompletedSessions] = useState([]);
  const allExercises = useLiveQuery(() => db.exercises.toArray(), [], []);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await db.completedSessions.toArray();
      setCompletedSessions(history);
    };
    loadHistory();
  }, []);

  /**
   * Heatmap Data Generator
   * Maps completed sessions to Volume Tonnage per muscle group.
   */
  const getVolumeHeatmap = () => {
    const volumeMap = {};

    completedSessions.forEach(session => {
      session.entries.forEach(entry => {
        // Find exercise to get muscle groups
        const exerciseDef = allExercises?.find(e => e.id === entry.exerciseId);
        if (!exerciseDef) return;

        const volume = calculateVolume(entry.sets);
        
        exerciseDef.muscleGroups.forEach(muscle => {
          volumeMap[muscle] = (volumeMap[muscle] || 0) + volume;
        });
      });
    });

    // Normalize intensity 0-1 (Light Blue to Neon Green)
    const maxVolume = Math.max(...Object.values(volumeMap), 1);
    
    return Object.entries(volumeMap).map(([muscle, totalVolume]) => ({
      muscle,
      totalVolume,
      intensity: totalVolume / maxVolume // 0.0 to 1.0
    })).sort((a, b) => b.totalVolume - a.totalVolume);
  };

  /**
   * Progress Charts Data (Recharts format)
   * Plots Estimated 1RM and Volume Tonnage for an exercise over time.
   */
  const getExerciseProgress = (exerciseId) => {
    const data = [];
    
    completedSessions.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(session => {
      const entry = session.entries.find(e => e.exerciseId === exerciseId);
      if (entry && entry.sets.length > 0) {
        // Find best set for 1RM
        let best1RM = 0;
        entry.sets.forEach(set => {
          const e1rm = calculate1RM(set.weight, set.reps);
          if (e1rm > best1RM) best1RM = e1rm;
        });

        data.push({
          date: new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          volume: calculateVolume(entry.sets),
          estimated1RM: Math.round(best1RM * 10) / 10
        });
      }
    });

    return data;
  };

  /**
   * PR Detection Engine
   * Compares the new set against historical sets in Dexie.
   * Runs locally, highly performant.
   */
  const checkPR = async (exerciseId, newSet) => {
    if (!newSet.weight || !newSet.reps) return { isNewPR: false };
    
    const new1RM = calculate1RM(newSet.weight, newSet.reps);
    let historicalBest1RM = 0;
    let historicalMaxWeight = 0;

    const history = await db.completedSessions.toArray();
    
    history.forEach(session => {
      const entry = session.entries.find(e => e.exerciseId === exerciseId);
      if (entry) {
        entry.sets.forEach(set => {
          const past1RM = calculate1RM(set.weight, set.reps);
          if (past1RM > historicalBest1RM) historicalBest1RM = past1RM;
          if (set.weight > historicalMaxWeight) historicalMaxWeight = set.weight;
        });
      }
    });

    if (new1RM > historicalBest1RM && historicalBest1RM > 0) {
      return { isNewPR: true, type: '1RM', value: new1RM };
    }
    
    if (newSet.weight > historicalMaxWeight && historicalMaxWeight > 0) {
      return { isNewPR: true, type: 'Weight', value: newSet.weight };
    }

    return { isNewPR: false };
  };

  /**
   * Auto-regulation Insights
   * Analyzes RPE trends over recent sessions.
   */
  const getAutoRegulationInsights = (exerciseId) => {
    // Filter to last N times this exercise was performed
    const pastEntries = completedSessions
      .filter(s => s.entries.some(e => e.exerciseId === exerciseId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, DELOAD_SESSION_COUNT)
      .map(s => s.entries.find(e => e.exerciseId === exerciseId));

    if (pastEntries.length < DELOAD_SESSION_COUNT) return null; // Need baseline data

    // Check if hitting high RPE consistently across last sessions
    const consistentFailure = pastEntries.every(entry =>
      entry.sets.some(set => set.rpe >= DELOAD_RPE_THRESHOLD)
    );

    if (consistentFailure) {
      return {
        warning: 'High Fatigue Detected. You have hit RPE 10 consistently.',
        suggestion: 'Consider a Deload. Drop working weight by 10-15% this session or reduce total volume by 1-2 sets to allow CNS recovery.',
        type: 'deload'
      };
    }

    // Check if RPE is dropping but volume is maintained (Adaptation)
    const recentRPEAve = pastEntries[0].sets.reduce((acc, s) => acc + (s.rpe || 0), 0) / (pastEntries[0].sets.length || 1);
    const oldestEntry = pastEntries[DELOAD_SESSION_COUNT - 1];
    const oldestRPEAve = oldestEntry.sets.reduce((acc, s) => acc + (s.rpe || 0), 0) / (oldestEntry.sets.length || 1);

    if (recentRPEAve > 0 && oldestRPEAve > 0 && recentRPEAve <= oldestRPEAve - ADAPTATION_RPE_DROP_THRESHOLD) {
      return {
        warning: 'Adaptation Phase.',
        suggestion: 'Your RPE is trending down! The load is getting relatively lighter. Consider progressively overloading by adding 2.5kg to your working weight.',
        type: 'overload'
      };
    }

    return null;
  };

  return {
    getVolumeHeatmap,
    getExerciseProgress,
    checkPR,
    getAutoRegulationInsights,
    completedSessions
  };
}
