import { useState, useEffect, useRef, useCallback } from 'react'
import { triggerHaptic } from '../utils/haptics.js'
import { playTimerDone } from '../utils/audio.js'

export function useRestTimer(onComplete) {
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
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

  // Countdown effect — only depends on isRunning/isPaused, not timeRemaining,
  // so the interval is created once and runs until stopped (not reset every tick).
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearTimer()
            setIsRunning(false)
            setIsPaused(false)
            triggerHaptic('REST_DONE')
            playTimerDone()
            if (onCompleteRef.current) onCompleteRef.current()
            return 0
          }
          return Math.max(0, prev - 1)
        })
      }, 1000)
    }

    return clearTimer
  }, [isRunning, isPaused, clearTimer])

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
