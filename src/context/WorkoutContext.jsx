import React, { createContext, useContext, useEffect, useState } from 'react';
import Dexie from 'dexie';

// Initialize Dexie
export const db = new Dexie('WorkoutProDB');
db.version(3).stores({
  activeSessions: 'id, date, name, state', // Store the active workout
  pendingSyncs: '++id, type, payload',     // Offline queue for backend sync
  completedSessions: 'id, date',           // Local historical logs
  exercises: 'id, name, bodyPart, equipment' // New RapidAPI Library
});

const WorkoutContext = createContext();

export const useWorkoutSync = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of active session from IndexedDB
    const loadSession = async () => {
      const session = await db.activeSessions.toCollection().first();
      if (session) setActiveSession(session);
    };
    loadSession();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize a new active session structure if one doesn't exist
  const initSession = () => ({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name: 'Live Workout',
    exercises: [], // Array of exercise objects with their sets attached
    state: 'active'
  });

  // Save partial session to IndexedDB (basement-proof)
  const saveActiveSession = async (sessionData) => {
    setActiveSession(sessionData);
    await db.activeSessions.put(sessionData);
  };

  const addExerciseToSession = async (exercise) => {
    // Get current session or initialize new one
    let currentSession = activeSession || await db.activeSessions.toCollection().first() || initSession();

    // Check if exercise is already added
    const exists = currentSession.exercises.some(ex => ex.id === exercise.id);
    if (!exists) {
      const sessionUpdate = {
        ...currentSession,
        exercises: [...currentSession.exercises, { ...exercise, sets: [] }]
      };

      await saveActiveSession(sessionUpdate);
    }
  };

  // Start a new workout from a session template
  const startSessionFromTemplate = async (templateName, exercises) => {
    // Clear any existing active session first
    await db.activeSessions.clear();

    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: templateName,
      exercises: exercises.map(ex => ({
        ...ex,
        sets: []
      })),
      state: 'active'
    };

    await saveActiveSession(newSession);
    return newSession;
  };

  // Clear active session (e.g., when finished)
  const clearActiveSession = async () => {
    if (activeSession) {
      await db.activeSessions.delete(activeSession.id);
      setActiveSession(null);
    }
  };

  // Mock sync logic
  const syncOfflineData = async () => {
    const pending = await db.pendingSyncs.toArray();
    if (pending.length > 0) {
      console.log('Syncing offline data to Cloud...', pending);
      // In a real app, send to API here
      await db.pendingSyncs.clear();
    }
  };

  // Queue finished workout for sync and clear local cache
  const finishSessionOfflineSafe = async (workoutLog) => {
    // Save to historical completedSessions in Dexie for the Intelligence Layer
    await db.completedSessions.put({
      ...workoutLog,
      date: new Date().toISOString()
    });

    if (isOnline) {
      // Direct sync
      console.log('Syncing directly to cloud:', workoutLog);
    } else {
      // Queue it
      await db.pendingSyncs.add({ type: 'WORKOUT_FINISHED', payload: workoutLog });
    }
    await clearActiveSession();
  };

  return (
    <WorkoutContext.Provider value={{
      isOnline,
      activeSession,
      saveActiveSession,
      addExerciseToSession,
      startSessionFromTemplate,
      clearActiveSession,
      finishSessionOfflineSafe
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};
