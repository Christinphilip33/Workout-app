/**
 * MuscleMap - SVG body diagram with highlighted muscles
 * 100% local, no external APIs or costs
 */

// Map muscle group names to SVG region IDs
const MUSCLE_REGION_MAP = {
  // Chest
  'Chest': ['chest-left', 'chest-right'],
  'Upper Chest': ['chest-left', 'chest-right'],
  'Lower Chest': ['chest-left', 'chest-right'],

  // Shoulders
  'Shoulders': ['shoulder-left', 'shoulder-right'],
  'Front Deltoids': ['shoulder-left', 'shoulder-right'],
  'Lateral Deltoids': ['shoulder-left', 'shoulder-right'],
  'Rear Deltoids': ['rear-delt-left', 'rear-delt-right'],

  // Arms
  'Arms': ['bicep-left', 'bicep-right', 'tricep-left', 'tricep-right'],
  'Biceps': ['bicep-left', 'bicep-right'],
  'Triceps': ['tricep-left', 'tricep-right'],
  'Brachialis': ['bicep-left', 'bicep-right'],
  'Brachioradialis': ['forearm-left', 'forearm-right'],

  // Back
  'Back': ['upper-back', 'lats-left', 'lats-right', 'lower-back'],
  'Lats': ['lats-left', 'lats-right'],
  'Traps': ['traps'],
  'Upper Traps': ['traps'],
  'Rhomboids': ['upper-back'],
  'Erector Spinae': ['lower-back'],

  // Core
  'Core': ['abs', 'obliques-left', 'obliques-right'],
  'Rectus Abdominis': ['abs'],
  'Obliques': ['obliques-left', 'obliques-right'],
  'Transverse Abdominis': ['abs'],

  // Legs
  'Legs': ['quad-left', 'quad-right', 'hamstring-left', 'hamstring-right'],
  'Quadriceps': ['quad-left', 'quad-right'],
  'Hamstrings': ['hamstring-left', 'hamstring-right'],
  'Glutes': ['glute-left', 'glute-right'],
  'Hip Flexors': ['hip-left', 'hip-right'],

  // Calves
  'Calves': ['calf-left', 'calf-right'],
  'Gastrocnemius': ['calf-left', 'calf-right'],
  'Soleus': ['calf-left', 'calf-right'],

  // Other
  'External Rotators': ['rear-delt-left', 'rear-delt-right'],
  'Supraspinatus': ['shoulder-left', 'shoulder-right'],
}

export default function MuscleMap({ highlightedMuscles }) {
  // Get all region IDs that should be highlighted
  const muscles = highlightedMuscles || []
  const activeRegions = new Set()
  muscles.forEach(muscle => {
    const regions = MUSCLE_REGION_MAP[muscle] || []
    regions.forEach(r => activeRegions.add(r))
  })

  const getColor = (regionId) => {
    return activeRegions.has(regionId) ? '#22c55e' : '#374151'
  }

  return (
    <div className="flex justify-center gap-4 mb-6">
      {/* Front View */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-2">Front</span>
        <svg viewBox="0 0 100 180" className="w-24 h-40 sm:w-32 sm:h-52">
          {/* Head */}
          <circle cx="50" cy="15" r="12" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5"/>

          {/* Neck */}
          <rect x="45" y="27" width="10" height="8" fill="#4b5563"/>

          {/* Traps */}
          <path id="traps" d="M35 35 L45 30 L55 30 L65 35 L60 40 L40 40 Z" fill={getColor('traps')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Shoulders */}
          <ellipse id="shoulder-left" cx="28" cy="42" rx="10" ry="7" fill={getColor('shoulder-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="shoulder-right" cx="72" cy="42" rx="10" ry="7" fill={getColor('shoulder-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Chest */}
          <ellipse id="chest-left" cx="38" cy="52" rx="12" ry="10" fill={getColor('chest-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="chest-right" cx="62" cy="52" rx="12" ry="10" fill={getColor('chest-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Biceps */}
          <ellipse id="bicep-left" cx="20" cy="60" rx="6" ry="14" fill={getColor('bicep-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="bicep-right" cx="80" cy="60" rx="6" ry="14" fill={getColor('bicep-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Forearms */}
          <ellipse id="forearm-left" cx="18" cy="85" rx="5" ry="12" fill={getColor('forearm-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="forearm-right" cx="82" cy="85" rx="5" ry="12" fill={getColor('forearm-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Abs */}
          <rect id="abs" x="40" y="65" width="20" height="28" rx="3" fill={getColor('abs')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Obliques */}
          <path id="obliques-left" d="M28 65 Q35 70 38 80 Q35 90 30 95 Q25 85 28 65" fill={getColor('obliques-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <path id="obliques-right" d="M72 65 Q65 70 62 80 Q65 90 70 95 Q75 85 72 65" fill={getColor('obliques-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Hip flexors */}
          <ellipse id="hip-left" cx="38" cy="100" rx="8" ry="5" fill={getColor('hip-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="hip-right" cx="62" cy="100" rx="8" ry="5" fill={getColor('hip-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Quads */}
          <ellipse id="quad-left" cx="38" cy="125" rx="10" ry="22" fill={getColor('quad-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="quad-right" cx="62" cy="125" rx="10" ry="22" fill={getColor('quad-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Calves (front) */}
          <ellipse cx="38" cy="160" rx="6" ry="12" fill={getColor('calf-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse cx="62" cy="160" rx="6" ry="12" fill={getColor('calf-right')} stroke="#6b7280" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-2">Back</span>
        <svg viewBox="0 0 100 180" className="w-24 h-40 sm:w-32 sm:h-52">
          {/* Head */}
          <circle cx="50" cy="15" r="12" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5"/>

          {/* Neck */}
          <rect x="45" y="27" width="10" height="8" fill="#4b5563"/>

          {/* Traps */}
          <path d="M35 35 L45 30 L55 30 L65 35 L60 45 L40 45 Z" fill={getColor('traps')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Rear Delts */}
          <ellipse id="rear-delt-left" cx="28" cy="42" rx="10" ry="7" fill={getColor('rear-delt-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="rear-delt-right" cx="72" cy="42" rx="10" ry="7" fill={getColor('rear-delt-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Upper Back / Rhomboids */}
          <rect id="upper-back" x="35" y="45" width="30" height="15" rx="3" fill={getColor('upper-back')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Triceps */}
          <ellipse id="tricep-left" cx="20" cy="58" rx="6" ry="14" fill={getColor('tricep-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="tricep-right" cx="80" cy="58" rx="6" ry="14" fill={getColor('tricep-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Forearms (back) */}
          <ellipse cx="18" cy="85" rx="5" ry="12" fill={getColor('forearm-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse cx="82" cy="85" rx="5" ry="12" fill={getColor('forearm-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Lats */}
          <path id="lats-left" d="M28 50 Q22 65 25 80 L38 75 L38 55 Z" fill={getColor('lats-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <path id="lats-right" d="M72 50 Q78 65 75 80 L62 75 L62 55 Z" fill={getColor('lats-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Lower Back / Erector Spinae */}
          <rect id="lower-back" x="38" y="62" width="24" height="25" rx="3" fill={getColor('lower-back')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Glutes */}
          <ellipse id="glute-left" cx="38" cy="100" rx="12" ry="10" fill={getColor('glute-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="glute-right" cx="62" cy="100" rx="12" ry="10" fill={getColor('glute-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Hamstrings */}
          <ellipse id="hamstring-left" cx="38" cy="128" rx="10" ry="20" fill={getColor('hamstring-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="hamstring-right" cx="62" cy="128" rx="10" ry="20" fill={getColor('hamstring-right')} stroke="#6b7280" strokeWidth="0.5"/>

          {/* Calves (back) */}
          <ellipse id="calf-left" cx="38" cy="160" rx="7" ry="12" fill={getColor('calf-left')} stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse id="calf-right" cx="62" cy="160" rx="7" ry="12" fill={getColor('calf-right')} stroke="#6b7280" strokeWidth="0.5"/>
        </svg>
      </div>
    </div>
  )
}
