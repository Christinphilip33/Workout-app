/**
 * Utility to trigger browser-native haptic feedback patterns
 * Requires user interaction beforehand and a supported device/browser.
 */

// Define standard vibration patterns (in ms)
const VIBRATION_PATTERNS = {
  // 1 short pulse
  LOGGED: [50],
  
  // A rhythmic 3-pulse vibration for a new Personal Record
  PR: [50, 100, 50, 100, 50],
  
  // A heavy double pulse for rest timer finished
  REST_DONE: [150, 100, 150],
  
  // Very light tap
  TICK: [20]
};

export const triggerHaptic = (patternType) => {
  // Check if the generic vibration API is supported
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const pattern = VIBRATION_PATTERNS[patternType];
    if (pattern) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        // Vibrate may be blocked by user settings, ignore silently
      }
    }
  }
};
