/**
 * Utility functions for advanced workout performance metrics.
 */

/**
 * Calculates a consensus 1-Rep Max (1RM) using the average of the 
 * Epley and Brzycki formulas. 
 * Formula only applies reliably for reps <= 10.
 * 
 * @param {number} weight - Weight lifted (kg or lbs)
 * @param {number} reps - Number of repetitions
 * @returns {number} Estimated 1RM
 */
export const calculate1RM = (weight, reps) => {
  if (!weight || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;

  // Epley Formula: 1RM = weight * (1 + reps/30)
  const epley = weight * (1 + reps / 30);
  
  // Brzycki Formula: 1RM = weight * (36 / (37 - reps))
  // Default to Epley if reps > 36 to avoid negative/infinity, though formula only accurate for low reps.
  const brzycki = weight * (36 / Math.max(1, (37 - reps)));

  return Math.round(((epley + brzycki) / 2) * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculates total volume tonnage for a given session.
 * 
 * @param {Array} sets - Array of set objects { weights, reps }
 * @returns {number} Total volume
 */
export const calculateVolume = (sets) => {
  if (!Array.isArray(sets)) return 0;
  
  return sets.reduce((total, set) => {
    const w = parseFloat(set.weight) || 0;
    const r = parseInt(set.reps, 10) || 0;
    return total + (w * r);
  }, 0);
};

/**
 * Calculates Relative Intensity (proxy for RPE-based effort load).
 * 
 * @param {number} weightLfted 
 * @param {number} estimated1RM 
 * @returns {number} Percentage of 1RM
 */
export const getRelativeIntensity = (weightLifted, estimated1RM) => {
  if (!estimated1RM || estimated1RM <= 0) return 0;
  return Math.round((weightLifted / estimated1RM) * 100);
};
