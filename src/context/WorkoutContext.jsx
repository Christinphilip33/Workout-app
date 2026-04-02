import React, { createContext, useContext, useEffect, useState } from 'react';
import Dexie from 'dexie';
import { useUser } from './UserContext.jsx';

// Initialize Dexie
export const db = new Dexie('WorkoutProDB');
db.version(3).stores({
  activeSessions: 'id, date, name, state', // Store the active workout
  pendingSyncs: '++id, type, payload',     // Offline queue for backend sync
  completedSessions: 'id, date',           // Local historical logs
  exercises: 'id, name, bodyPart, equipment' // New RapidAPI Library
});

// Version 4: Add userId to support multi-user
db.version(4).stores({
  activeSessions: 'id, date, name, state, userId',
  pendingSyncs: '++id, type, payload, userId',
  completedSessions: 'id, date, userId',
  exercises: 'id, name, bodyPart, equipment'
});

const WorkoutContext = createContext();

export const useWorkoutSync = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const { currentUserId } = useUser();
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

    // Initial load of active session from IndexedDB (filtered by userId)
    const loadSession = async () => {
      if (!currentUserId) return;
      try {
        const session = await db.activeSessions
          .where('userId').equals(currentUserId)
          .first();
        if (session) {
          setActiveSession(session);
        } else {
          setActiveSession(null);
        }
      } catch (err) {
        // Fallback for old data without userId
        try {
          const session = await db.activeSessions.toCollection().first();
          if (session && !session.userId) {
            // Migrate old session to current user
            session.userId = currentUserId;
            await db.activeSessions.put(session);
            setActiveSession(session);
          }
        } catch (e) {
          console.error('Failed to load active session from IndexedDB:', e);
        }
      }
    };
    loadSession();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUserId]);

  // Initialize a new active session structure if one doesn't exist
  const initSession = () => ({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name: 'Live Workout',
    exercises: [], // Array of exercise objects with their sets attached
    state: 'active',
    userId: currentUserId
  });

  // Save partial session to IndexedDB (basement-proof)
  const saveActiveSession = async (sessionData) => {
    const dataWithUser = { ...sessionData, userId: currentUserId };
    setActiveSession(dataWithUser);
    await db.activeSessions.put(dataWithUser);
  };

  const addExerciseToSession = async (exercise) => {
    if (!currentUserId) return;
    let updatedSession = null;
    await db.transaction('rw', db.activeSessions, async () => {
      let currentSession = await db.activeSessions
        .where('userId').equals(currentUserId)
        .first();
      if (!currentSession) {
        currentSession = initSession();
      }
      const exists = currentSession.exercises.some(ex => ex.id === exercise.id);
      if (!exists) {
        updatedSession = {
          ...currentSession,
          userId: currentUserId,
          exercises: [...currentSession.exercises, { ...exercise, sets: [] }]
        };
        await db.activeSessions.put(updatedSession);
      }
    });
    if (updatedSession) {
      setActiveSession(updatedSession);
    }
  };

  // Start a new workout from a session template
  const startSessionFromTemplate = async (templateName, exercises) => {
    if (!currentUserId) return null;
    // Clear any existing active session for this user first
    await db.activeSessions.where('userId').equals(currentUserId).delete();

    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: templateName,
      exercises: exercises.map(ex => ({
        ...ex,
        sets: []
      })),
      state: 'active',
      userId: currentUserId
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
      date: new Date().toISOString(),
      userId: currentUserId
    });

    if (isOnline) {
      // Direct sync
      console.log('Syncing directly to cloud:', workoutLog);
    } else {
      // Queue it
      await db.pendingSyncs.add({ type: 'WORKOUT_FINISHED', payload: workoutLog, userId: currentUserId });
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
