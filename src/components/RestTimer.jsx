import { useState } from 'react'

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
]

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function RestTimer({
  timer,
  defaultDuration,
  onDurationChange,
  isWorkoutActive,
  showPicker,
  onPickerClose
}) {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [customSeconds, setCustomSeconds] = useState('')

  if (!isWorkoutActive) return null

  const { timeRemaining, isRunning, isPaused, start, pause, resume, cancel, addTime } = timer

  const handlePresetClick = (seconds) => {
    onDurationChange(seconds)
    start(seconds)
    onPickerClose()
    setShowCustomInput(false)
  }

  const handleSkipRest = () => {
    onPickerClose()
    setShowCustomInput(false)
  }

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes, 10) || 0
    const secs = parseInt(customSeconds, 10) || 0
    const totalSeconds = Math.max(5, Math.min(600, mins * 60 + secs)) // 5s min, 10m max
    onDurationChange(totalSeconds)
    start(totalSeconds)
    onPickerClose()
    setShowCustomInput(false)
    setCustomMinutes('')
    setCustomSeconds('')
  }

  // Duration picker modal after logging a set
  if (showPicker && !isRunning) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in">
        <div className="w-full max-w-lg bg-gray-900 rounded-t-3xl p-6 pb-8 animate-slide-up border-t border-gray-700">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⏱️</div>
            <h2 className="text-2xl font-bold text-white">Rest Time</h2>
            <p className="text-gray-400 mt-1">How long do you want to rest?</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {PRESETS.map(preset => (
              <button
                key={preset.seconds}
                onClick={() => handlePresetClick(preset.seconds)}
                className={`py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                  preset.seconds === defaultDuration
                    ? 'bg-primary-500 text-gray-900 shadow-lg shadow-primary-500/30'
                    : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom duration input */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-3 bg-gray-800 text-gray-300 rounded-2xl font-semibold hover:bg-gray-700 hover:text-white transition-all border border-gray-700 mb-4"
            >
              + Custom
            </button>
          ) : (
            <div className="flex gap-2 items-center justify-center mb-4 p-3 bg-gray-800/50 rounded-2xl border border-gray-700">
              <input
                type="number"
                placeholder="min"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                min={0}
                max={10}
                className="w-16 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-primary-500"
              />
              <span className="text-gray-400 text-xl font-bold">:</span>
              <input
                type="number"
                placeholder="sec"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                min={0}
                max={59}
                className="w-16 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleCustomSubmit}
                className="bg-primary-500 text-gray-900 font-bold px-5 py-2 rounded-xl hover:bg-primary-400 transition-all"
              >
                Go
              </button>
              <button
                onClick={() => setShowCustomInput(false)}
                className="text-gray-500 hover:text-white px-2 py-2 transition-colors"
              >
                X
              </button>
            </div>
          )}

          <button
            onClick={handleSkipRest}
            className="w-full py-3 text-gray-400 font-medium hover:text-white transition-colors"
          >
            Skip rest
          </button>
        </div>
      </div>
    )
  }

  // Running/paused timer - centered modal overlay for mobile visibility
  if (isRunning) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-sm mx-4 bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
          {/* Countdown Display */}
          <div className="text-center mb-5">
            <div className={`text-6xl font-black text-white tabular-nums tracking-tight ${isPaused ? 'opacity-50' : ''}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-400 mt-2 font-medium">
              {isPaused ? 'Paused' : 'Resting...'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(timeRemaining / (timer.totalDuration || 1)) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={isPaused ? resume : pause}
              className="py-3 px-5 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={() => addTime(15)}
              className="py-3 px-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              +15s
            </button>

            <button
              onClick={cancel}
              className="py-3 px-5 bg-primary-500 text-gray-900 font-bold rounded-xl hover:bg-primary-400 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Idle state - always visible timer bar with quick presets
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent">
      <div className="max-w-lg mx-auto bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-gray-700/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl mr-1">⏱️</span>
          <span className="text-gray-400 text-sm font-medium mr-2">Rest:</span>

          {/* Quick preset buttons */}
          {PRESETS.map(preset => (
            <button
              key={preset.seconds}
              onClick={() => handlePresetClick(preset.seconds)}
              className={`py-2 px-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                preset.seconds === defaultDuration
                  ? 'bg-primary-500 text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Custom timer button */}
          <button
            onClick={() => setShowCustomInput(true)}
            className="py-2 px-3 rounded-xl font-semibold text-sm transition-all active:scale-95 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
            title="Custom duration"
          >
            ...
          </button>
        </div>

        {/* Inline custom input when triggered from idle */}
        {showCustomInput && (
          <div className="flex gap-2 items-center justify-center mt-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <input
              type="number"
              placeholder="min"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min={0}
              max={10}
              className="w-14 bg-gray-900 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-center font-bold text-sm focus:outline-none focus:border-primary-500"
            />
            <span className="text-gray-400 font-bold">:</span>
            <input
              type="number"
              placeholder="sec"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
              min={0}
              max={59}
              className="w-14 bg-gray-900 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-center font-bold text-sm focus:outline-none focus:border-primary-500"
            />
            <button
              onClick={handleCustomSubmit}
              className="bg-primary-500 text-gray-900 font-bold px-4 py-1.5 rounded-lg hover:bg-primary-400 transition-all text-sm"
            >
              Go
            </button>
            <button
              onClick={() => setShowCustomInput(false)}
              className="text-gray-500 hover:text-white px-2 transition-colors"
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
