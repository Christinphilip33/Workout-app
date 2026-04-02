import { db } from '../context/WorkoutContext.jsx';

const LOCALSTORAGE_KEYS = ['customExercises', 'sessions', 'workoutLogs', 'userProgress'];
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

    const exportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      localStorage: localStorageData,
      indexedDB: {
        completedSessions,
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

    return { success: true, importedAt: data.exportedAt };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: error.message };
  }
}
