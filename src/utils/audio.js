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

// Play a single chime tone
const playChime = (startTime, frequency, duration = 0.25, volume = 0.3) => {
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, startTime)
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
  osc.connect(gain)
  gain.connect(audioContext.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// Play a repeating alarm pattern when timer completes (~3 seconds total)
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

  // Play 4 repetitions of a two-tone alert pattern
  for (let i = 0; i < 4; i++) {
    const offset = i * 0.7 // Each repetition starts 0.7s apart

    // High tone
    playChime(now + offset, 880, 0.2, 0.35) // A5

    // Low tone (slightly delayed)
    playChime(now + offset + 0.25, 659.25, 0.2, 0.3) // E5

    // Resolution tone
    playChime(now + offset + 0.45, 1046.5, 0.15, 0.25) // C6
  }
}
