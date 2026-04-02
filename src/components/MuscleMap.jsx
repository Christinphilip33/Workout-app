/**
 * MuscleMap - Natural anatomical body illustrations with calibrated SVG overlays
 * Uses generated anatomy images as base with precisely positioned highlight regions
 * All coordinates calibrated against the actual image pixel positions
 * 100% local — zero external APIs or costs
 */

const MUSCLE_REGION_MAP = {
  'Chest': ['pec'],
  'Upper Chest': ['pec'],
  'Lower Chest': ['pec'],
  'Pectorals': ['pec'],

  'Shoulders': ['delt-front', 'delt-rear'],
  'Front Deltoids': ['delt-front'],
  'Lateral Deltoids': ['delt-front', 'delt-rear'],
  'Rear Delts': ['delt-rear'],
  'Rear Deltoids': ['delt-rear'],
  'Rotator Cuff': ['delt-rear'],

  'Arms': ['bicep', 'tricep'],
  'Biceps': ['bicep'],
  'Triceps': ['tricep'],
  'Forearms': ['forearm-front', 'forearm-back'],
  'Brachialis': ['bicep'],
  'Brachioradialis': ['forearm-front'],

  'Back': ['upper-back', 'lat', 'lower-back'],
  'Upper Back': ['upper-back'],
  'Lats': ['lat'],
  'Traps': ['trap'],
  'Rhomboids': ['upper-back'],
  'Lower Back': ['lower-back'],
  'Erector Spinae': ['lower-back'],

  'Core': ['abs', 'oblique'],
  'Abs': ['abs'],
  'Rectus Abdominis': ['abs'],
  'Obliques': ['oblique'],
  'Transverse Abdominis': ['abs'],
  'Hip Flexors': ['hip'],

  'Legs': ['quad', 'ham'],
  'Quads': ['quad'],
  'Quadriceps': ['quad'],
  'Hamstrings': ['ham'],
  'Glutes': ['glute'],
  'Adductors': ['adductor'],

  'Calves': ['calf-front', 'calf-back'],
  'Gastrocnemius': ['calf-back'],
  'Soleus': ['calf-front'],

  'External Rotators': ['delt-rear'],
  'Supraspinatus': ['delt-front'],
}

/*
 * Calibrated overlay regions — coordinates as % of image dimensions
 * Calibrated from actual image analysis:
 *   Front: head top ~4.5%, feet ~98%, left hand ~26.5%, right hand ~73.5%, body center at x=50%
 *   Back: similar centering, body center at x=50%
 */
const FRONT_REGIONS = [
  // ── LEFT SHOULDER (DELTOID) ── tighter, smaller cap shape
  { id: 'delt-front', points: '38,22 40,20 42,21 42,25 40,26 37,24' },
  // ── RIGHT SHOULDER (DELTOID) ──
  { id: 'delt-front', points: '62,22 60,20 58,21 58,25 60,26 63,24' },

  // ── LEFT PECTORAL ── tighter oval shape
  { id: 'pec', points: '44,24 49,24 49,30 47,32 44,31 43,28' },
  // ── RIGHT PECTORAL ──
  { id: 'pec', points: '56,24 51,24 51,30 53,32 56,31 57,28' },

  // ── LEFT BICEP ── smaller, more arm-shaped
  { id: 'bicep', points: '36,28 38,27 38,34 36,35 35,33 35,30' },
  // ── RIGHT BICEP ──
  { id: 'bicep', points: '64,28 62,27 62,34 64,35 65,33 65,30' },

  // ── LEFT FOREARM ── narrower
  { id: 'forearm-front', points: '33,39 35,38 35,46 34,50 31,49 31,44' },
  // ── RIGHT FOREARM ──
  { id: 'forearm-front', points: '67,39 65,38 65,46 66,50 69,49 69,44' },

  // ── ABS / CORE ── narrower vertical strip
  { id: 'abs', points: '47,36 53,36 53,42 53,50 51,53 50,53 49,53 47,50 47,42' },

  // ── LEFT OBLIQUE ── smaller side area
  { id: 'oblique', points: '42,32 44,30 46,36 45,42 44,48 42,48 41,44 41,38' },
  // ── RIGHT OBLIQUE ──
  { id: 'oblique', points: '58,32 56,30 54,36 55,42 56,48 58,48 59,44 59,38' },

  // ── HIP FLEXORS ── smaller
  { id: 'hip', points: '44,53 46,52 48,54 50,54 48,56 44,56' },
  { id: 'hip', points: '56,53 54,52 52,54 50,54 52,56 56,56' },

  // ── LEFT ADDUCTOR ── narrower
  { id: 'adductor', points: '48,58 50,58 50,66 49,70 47,66' },
  // ── RIGHT ADDUCTOR ──
  { id: 'adductor', points: '52,58 50,58 50,66 51,70 53,66' },

  // ── LEFT QUAD ── tighter thigh shape
  { id: 'quad', points: '43,59 46,60 46,68 45,74 43,76 42,74 41,68 42,62' },
  // ── RIGHT QUAD ──
  { id: 'quad', points: '57,59 54,60 54,68 55,74 57,76 58,74 59,68 58,62' },

  // ── LEFT FRONT CALF (TIBIALIS) ── smaller
  { id: 'calf-front', points: '44,82 46,81 47,83 47,89 46,92 44,92 44,88' },
  // ── RIGHT FRONT CALF ──
  { id: 'calf-front', points: '56,82 54,81 53,83 53,89 54,92 56,92 56,88' },
]

const BACK_REGIONS = [
  // ── TRAPEZIUS ── tighter diamond
  { id: 'trap', points: '50,13 56,17 58,20 50,23 42,20 44,17' },

  // ── LEFT REAR DELTOID ── smaller cap
  { id: 'delt-rear', points: '38,21 40,19 42,21 42,25 40,26 37,24' },
  // ── RIGHT REAR DELTOID ──
  { id: 'delt-rear', points: '62,21 60,19 58,21 58,25 60,26 63,24' },

  // ── UPPER BACK / RHOMBOIDS ── tighter
  { id: 'upper-back', points: '46,25 50,24 54,25 55,29 53,33 50,34 47,33 45,29' },

  // ── LEFT LAT ── narrower wing shape
  { id: 'lat', points: '42,29 45,26 46,31 46,37 44,42 41,43 40,38 41,32' },
  // ── RIGHT LAT ──
  { id: 'lat', points: '58,29 55,26 54,31 54,37 56,42 59,43 60,38 59,32' },

  // ── LEFT TRICEP ── smaller
  { id: 'tricep', points: '35,25 37,24 38,27 38,33 36,35 34,33 35,28' },
  // ── RIGHT TRICEP ──
  { id: 'tricep', points: '65,25 63,24 62,27 62,33 64,35 66,33 65,28' },

  // ── LEFT BACK FOREARM ── narrower
  { id: 'forearm-back', points: '33,39 35,38 36,41 35,47 34,50 31,49 32,44' },
  // ── RIGHT BACK FOREARM ──
  { id: 'forearm-back', points: '67,39 65,38 64,41 65,47 66,50 69,49 68,44' },

  // ── LOWER BACK / ERECTORS ── smaller
  { id: 'lower-back', points: '47,38 50,37 53,38 54,43 53,47 50,48 47,47 46,43' },

  // ── LEFT GLUTE ── tighter rounded shape
  { id: 'glute', points: '43,50 46,48 50,50 50,55 48,57 44,56 42,53' },
  // ── RIGHT GLUTE ──
  { id: 'glute', points: '57,50 54,48 50,50 50,55 52,57 56,56 58,53' },

  // ── LEFT HAMSTRING ── narrower
  { id: 'ham', points: '44,61 47,60 48,65 48,72 46,76 44,76 43,71 43,65' },
  // ── RIGHT HAMSTRING ──
  { id: 'ham', points: '56,61 53,60 52,65 52,72 54,76 56,76 57,71 57,65' },

  // ── LEFT BACK CALF (GASTROCNEMIUS) ── smaller
  { id: 'calf-back', points: '44,81 46,79 48,81 48,87 47,90 45,90 44,87' },
  // ── RIGHT BACK CALF ──
  { id: 'calf-back', points: '56,81 54,79 52,81 52,87 53,90 55,90 56,87' },
]

function OverlayRegion({ points, isActive, debug = false }) {
  // Debug mode shows all regions faintly for calibration
  const showRegion = isActive || debug
  return (
    <polygon
      points={points}
      fill={isActive ? 'rgba(239, 68, 68, 0.4)' : debug ? 'rgba(100, 100, 100, 0.15)' : 'transparent'}
      stroke={showRegion ? (isActive ? 'rgba(248, 113, 113, 0.6)' : 'rgba(255, 255, 255, 0.3)') : 'transparent'}
      strokeWidth="0.3"
      strokeLinejoin="round"
      style={{
        transition: 'fill 0.4s ease, stroke 0.4s ease',
        filter: isActive ? 'drop-shadow(0 0 4px rgba(239,68,68,0.45))' : 'none',
      }}
    />
  )
}

function BodyView({ label, imageSrc, regions, activeRegions, debug = false }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] text-gray-500 mb-2 font-semibold tracking-widest uppercase">
        {label}
      </span>
      <div className="relative" style={{ width: '100%', maxWidth: '180px' }}>
        <img
          src={imageSrc}
          alt={`${label} body anatomy`}
          className="w-full h-auto rounded-xl"
          draggable={false}
          style={{ display: 'block' }}
        />
        {/* SVG overlay — viewBox matches the 100x100 percentage coordinate system */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        >
          {regions.map((region, i) => (
            <OverlayRegion
              key={`${region.id}-${i}`}
              points={region.points}
              isActive={activeRegions.has(region.id)}
              debug={debug}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function MuscleMap({ highlightedMuscles, debug = false }) {
  const muscles = highlightedMuscles || []
  const activeRegions = new Set()
  muscles.forEach(muscle => {
    const regions = MUSCLE_REGION_MAP[muscle] || []
    regions.forEach(r => activeRegions.add(r))
  })

  return (
    <div className="flex justify-center gap-6 sm:gap-10 py-3">
      <BodyView
        label="Front"
        imageSrc="/images/body-front.png"
        regions={FRONT_REGIONS}
        activeRegions={activeRegions}
        debug={debug}
      />
      <BodyView
        label="Back"
        imageSrc="/images/body-back.png"
        regions={BACK_REGIONS}
        activeRegions={activeRegions}
        debug={debug}
      />
    </div>
  )
}
