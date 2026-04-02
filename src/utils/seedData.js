/**
 * Utility to seed the IndexedDB with exercise data.
 * 
 * ZERO COST by default — uses the bundled 50-exercise starter pack.
 * If a VITE_RAPIDAPI_KEY is provided, upgrades to the full 1,300+ ExerciseDB library.
 */
import { builtInExercises } from '../data/builtInExercises.js';

export async function seedExerciseLibrary(db) {
  try {
    await db.open();
    const count = await db.exercises.count();
    if (count >= 10) {
      return { success: true, message: 'Already seeded', count };
    }
    console.log('Exercise library empty or incomplete, seeding...');
  } catch (err) {
    console.warn('DB not ready or count failed, proceeding to seed:', err.message);
  }

  localStorage.removeItem('library_seeded');

  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (apiKey && import.meta.env.DEV) {
    console.warn(
      '[SECURITY WARNING] VITE_RAPIDAPI_KEY is exposed in your client bundle. ' +
      'Anyone can read it in DevTools. For production, proxy this through a backend server.'
    );
  }

  // ─── Strategy 1: Free built-in pack (default) ───
  if (!apiKey) {
    await db.exercises.bulkPut(builtInExercises);
    localStorage.setItem('library_seeded', 'true');
    return { success: true, count: builtInExercises.length, source: 'built-in' };
  }

  // ─── Strategy 2: Full API library (optional paid upgrade) ───
  const abortController = new AbortController();
  try {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=1300', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      },
      signal: abortController.signal
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('API rate limited — falling back to built-in exercises.');
        await db.exercises.bulkPut(builtInExercises);
        localStorage.setItem('library_seeded', 'true');
        return { success: true, count: builtInExercises.length, source: 'built-in-fallback' };
      }
      throw new Error(`Failed to fetch library: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      // API returned garbage — fall back to built-in
      await db.exercises.bulkPut(builtInExercises);
      localStorage.setItem('library_seeded', 'true');
      return { success: true, count: builtInExercises.length, source: 'built-in-fallback' };
    }

    const normalizedData = data.map(ex => ({
      id: ex.id || String(Date.now() + Math.random()),
      name: ex.name,
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      target: ex.target,
      gifUrl: ex.gifUrl,
      instructions: ex.instructions || [],
      category: ex.bodyPart === 'cardio' ? 'Cardio' 
                : ex.bodyPart === 'waist' ? 'Core'
                : ex.bodyPart.includes('leg') ? 'Legs'
                : ex.bodyPart === 'back' ? 'Pull'
                : 'Push',
      muscleGroups: [ex.target, ...(ex.secondaryMuscles || [])],
      description: ex.instructions ? ex.instructions.join(' ') : 'No instructions available',
      isCustom: false
    }));

    await db.exercises.bulkPut(normalizedData);
    localStorage.setItem('library_seeded', 'true');
    
    return { success: true, count: normalizedData.length, source: 'api' };
  } catch (err) {
    // Any failure → gracefully fall back to built-in (zero cost)
    console.warn('API seed failed, using built-in exercises:', err.message);
    await db.exercises.bulkPut(builtInExercises);
    localStorage.setItem('library_seeded', 'true');
    return { success: true, count: builtInExercises.length, source: 'built-in-fallback' };
  }
}
