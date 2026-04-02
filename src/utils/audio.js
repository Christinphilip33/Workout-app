/**
 * Audio utility for timer completion sound
 * Uses Web Audio API to generate a pleasant beep/chime
 */

let audioContext = null

// Initialize AudioContext (must be called after user interaction)
export const initAudio = () => {
  if (audioContext) return
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  } catch (err) {
    console.warn('Web Audio API not supported:', err)
  }
}

// Play a pleasant two-tone chime when timer completes
export const playTimerDone = () => {
  if (!audioContext) {
    initAudio()
  }
  if (!audioContext) return

  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  const now = audioContext.currentTime

  // First tone (higher pitch)
  const osc1 = audioContext.createOscillator()
  const gain1 = audioContext.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(880, now) // A5
  gain1.gain.setValueAtTime(0.3, now)
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
  osc1.connect(gain1)
  gain1.connect(audioContext.destination)
  osc1.start(now)
  osc1.stop(now + 0.3)

  // Second tone (slightly lower, delayed)
  const osc2 = audioContext.createOscillator()
  const gain2 = audioContext.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(659.25, now + 0.15) // E5
  gain2.gain.setValueAtTime(0, now)
  gain2.gain.setValueAtTime(0.3, now + 0.15)
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
  osc2.connect(gain2)
  gain2.connect(audioContext.destination)
  osc2.start(now + 0.15)
  osc2.stop(now + 0.5)

  // Third tone (resolution chord)
  const osc3 = audioContext.createOscillator()
  const gain3 = audioContext.createGain()
  osc3.type = 'sine'
  osc3.frequency.setValueAtTime(1318.5, now + 0.3) // E6
  gain3.gain.setValueAtTime(0, now)
  gain3.gain.setValueAtTime(0.25, now + 0.3)
  gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.7)
  osc3.connect(gain3)
  gain3.connect(audioContext.destination)
  osc3.start(now + 0.3)
  osc3.stop(now + 0.7)
}
