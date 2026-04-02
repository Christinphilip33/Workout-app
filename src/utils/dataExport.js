import { db } from '../context/WorkoutContext.jsx';

const LOCALSTORAGE_KEYS = ['sessions', 'workoutLogs', 'userProgress'];
const EXPORT_VERSION = 1;

/**
 * Exports all user data to a JSON file download.
 * Includes localStorage data and IndexedDB completed sessions.
 */
export async function exportAllData() {
  try {
    // Gather localStorage data
    const localStorageData = {};
    for (const key of LOCALSTORAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value) {
        localStorageData[key] = JSON.parse(value);
      }
    }

    // Gather IndexedDB data
    const completedSessions = await db.completedSessions.toArray();
    const customExercises = await db.exercises.filter(ex => ex.isCustom === true).toArray();

    const exportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      localStorage: localStorageData,
      indexedDB: {
        completedSessions,
        customExercises,
      },
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validates import data structure.
 */
function validateImportData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid file format' };
  }
  if (!data.version || !data.exportedAt) {
    return { valid: false, error: 'Missing version or export date' };
  }
  if (!data.localStorage || typeof data.localStorage !== 'object') {
    return { valid: false, error: 'Missing localStorage data' };
  }
  if (data.indexedDB?.completedSessions?.length > 10000) {
    return { valid: false, error: 'Import file is suspiciously large (over 10,000 sessions)' };
  }
  if (data.indexedDB?.customExercises?.length > 500) {
    return { valid: false, error: 'Import file is suspiciously large (over 500 custom exercises)' };
  }
  if (data.indexedDB?.completedSessions) {
    for (const session of data.indexedDB.completedSessions) {
      if (!session.id || !session.date || !Array.isArray(session.entries)) {
        return { valid: false, error: 'Corrupted session data found in import file' };
      }
      for (const entry of session.entries) {
        if (!entry.exerciseId || !Array.isArray(entry.sets)) {
          return { valid: false, error: 'Corrupted entry data found in import file' };
        }
        for (const set of entry.sets) {
          if (typeof set.reps !== 'number' || typeof set.weight !== 'number' ||
              set.reps < 0 || set.weight < 0 || set.reps > 100 || set.weight > 999) {
            return { valid: false, error: 'Invalid set data found in import file' };
          }
        }
      }
    }
  }
  if (data.indexedDB?.customExercises) {
    for (const ex of data.indexedDB.customExercises) {
      if (!ex.id || typeof ex.id !== 'string' || !ex.name || typeof ex.name !== 'string') {
        return { valid: false, error: 'Corrupted exercise data found in import file' };
      }
    }
  }
  return { valid: true };
}

/**
 * Imports data from a JSON backup file.
 * @param {File} file - The JSON file to import
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function importData(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    const validation = validateImportData(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Restore localStorage data
    for (const key of LOCALSTORAGE_KEYS) {
      if (data.localStorage[key]) {
        localStorage.setItem(key, JSON.stringify(data.localStorage[key]));
      }
    }

    // Restore IndexedDB data
    if (data.indexedDB?.completedSessions?.length > 0) {
      await db.completedSessions.clear();
      await db.completedSessions.bulkPut(data.indexedDB.completedSessions);
    }
    if (data.indexedDB?.customExercises?.length > 0) {
      await db.exercises.bulkPut(data.indexedDB.customExercises);
    }

    return { success: true, importedAt: data.exportedAt };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: error.message };
  }
}
