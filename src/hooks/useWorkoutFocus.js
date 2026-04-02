import { useRef, useCallback } from 'react';

/**
 * Custom hook to manage focus between workout input fields.
 * Supports the "30-Second Logging Rule" by automatically jumping focus to 
 * the next logical input when a set is completed.
 */
export const useWorkoutFocus = (inputsCount) => {
  const inputRefs = useRef([]);

  // Initialize refs array based on the expected number of inputs
  if (inputRefs.current.length !== inputsCount) {
    inputRefs.current = Array(inputsCount).fill(null).map((_, i) => inputRefs.current[i] || null);
  }

  /**
   * Focuses the input at the given index.
   */
  const focusInput = useCallback((index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  }, []);

  /**
   * Focuses the next input in the sequence or jumps to the next Superset exercise
   */
  const focusNext = useCallback((currentIndex, nextExerciseId = null) => {
    if (currentIndex + 1 < inputRefs.current.length) {
      focusInput(currentIndex + 1);
    } else if (nextExerciseId) {
      // Cross-Boundary Superset Jump
      const nextNode = document.querySelector(`input[data-exercise-id="${nextExerciseId}"]`);
      if (nextNode) {
        // Add a micro-delay to ensure any re-renders or layout animations complete
        setTimeout(() => nextNode.focus(), 50);
      }
    } else {
      // Loop back or simply drop focus (blur) if at the end.
      if (inputRefs.current[currentIndex]) {
        inputRefs.current[currentIndex].blur();
      }
    }
  }, [focusInput]);

  return {
    inputRefs,
    focusInput,
    focusNext
  };
};
