import { useState, useEffect, useRef, useCallback } from 'react'
import { triggerHaptic } from '../utils/haptics.js'

export function useRestTimer(onComplete) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback((seconds) => {
    clearTimer()
    setTimeRemaining(seconds)
    setTotalDuration(seconds)
    setIsRunning(true)
    setIsPaused(false)
  }, [clearTimer])

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      clearTimer()
      setIsPaused(true)
    }
  }, [isRunning, isPaused, clearTimer])

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false)
    }
  }, [isRunning, isPaused])

  const cancel = useCallback(() => {
    clearTimer()
    setTimeRemaining(0)
    setIsRunning(false)
    setIsPaused(false)
    setTotalDuration(0)
  }, [clearTimer])

  const addTime = useCallback((seconds) => {
    if (isRunning) {
      setTimeRemaining(prev => prev + seconds)
      setTotalDuration(prev => prev + seconds)
    }
  }, [isRunning])

  // Countdown effect
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearTimer()
            setIsRunning(false)
            setIsPaused(false)
            triggerHaptic('REST_DONE')
            if (onComplete) onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return clearTimer
  }, [isRunning, isPaused, timeRemaining, clearTimer, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return {
    timeRemaining,
    isRunning,
    isPaused,
    totalDuration,
    start,
    pause,
    resume,
    cancel,
    addTime
  }
}
