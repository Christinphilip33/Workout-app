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
  // ── LEFT SHOULDER (DELTOID) ──
  // Outer x~37.5, inner x~43, top y~20.5, bottom y~26.5
  { id: 'delt-front', points: '37,21 40,19 43,20 43,26 39,27 36,25' },
  // ── RIGHT SHOULDER (DELTOID) ──
  { id: 'delt-front', points: '63,21 60,19 57,20 57,26 61,27 64,25' },

  // ── LEFT PECTORAL ──
  // x: 41-50, y: 22.5-34
  { id: 'pec', points: '43,22 50,22 50,32 47,34 42,33 40,28' },
  // ── RIGHT PECTORAL ──
  { id: 'pec', points: '57,22 50,22 50,32 53,34 58,33 60,28' },

  // ── LEFT BICEP ──
  // x: 33-38, y: 26.5-37
  { id: 'bicep', points: '35,27 38,26 39,28 38,36 36,37 33,35 33,30' },
  // ── RIGHT BICEP ──
  { id: 'bicep', points: '65,27 62,26 61,28 62,36 64,37 67,35 67,30' },

  // ── LEFT FOREARM ──
  // x: 29-35.5, y: 38-52
  { id: 'forearm-front', points: '32,38 35,37 36,40 35,48 33,52 30,51 29,46 30,40' },
  // ── RIGHT FOREARM ──
  { id: 'forearm-front', points: '68,38 65,37 64,40 65,48 67,52 70,51 71,46 70,40' },

  // ── ABS / CORE ──
  // x: 44-56, y: 34-54
  { id: 'abs', points: '46,34 54,34 55,40 55,50 53,54 50,55 47,54 45,50 45,40' },

  // ── LEFT OBLIQUE ──
  // x: 40.5-44, y: 28-50
  { id: 'oblique', points: '40,30 43,28 46,34 45,44 44,50 42,52 39,48 38,38' },
  // ── RIGHT OBLIQUE ──
  { id: 'oblique', points: '60,30 57,28 54,34 55,44 56,50 58,52 61,48 62,38' },

  // ── HIP FLEXORS ──
  { id: 'hip', points: '42,52 44,50 47,54 50,55 47,58 42,57' },
  { id: 'hip', points: '58,52 56,50 53,54 50,55 53,58 58,57' },

  // ── LEFT ADDUCTOR ──
  { id: 'adductor', points: '47,58 50,57 50,68 48,72 46,68' },
  // ── RIGHT ADDUCTOR ──
  { id: 'adductor', points: '53,58 50,57 50,68 52,72 54,68' },

  // ── LEFT QUAD ──
  // x: 40-49.5, y: 57-78.5
  { id: 'quad', points: '42,57 47,58 46,68 46,74 44,78 42,79 40,76 39,68 40,60' },
  // ── RIGHT QUAD ──
  { id: 'quad', points: '58,57 53,58 54,68 54,74 56,78 58,79 60,76 61,68 60,60' },

  // ── LEFT FRONT CALF (TIBIALIS) ──
  // x: 44-49, y: 81-93.5
  { id: 'calf-front', points: '43,82 46,80 48,82 48,90 47,94 44,94 43,90' },
  // ── RIGHT FRONT CALF ──
  { id: 'calf-front', points: '57,82 54,80 52,82 52,90 53,94 56,94 57,90' },
]

const BACK_REGIONS = [
  // ── TRAPEZIUS ──
  // x: 42-58, y: 11-23, diamond shape
  { id: 'trap', points: '50,11 58,16 62,20 50,24 38,20 42,16' },

  // ── LEFT REAR DELTOID ──
  // x: 36-42, y: 19-26
  { id: 'delt-rear', points: '36,20 40,18 42,20 42,26 39,27 36,25' },
  // ── RIGHT REAR DELTOID ──
  { id: 'delt-rear', points: '64,20 60,18 58,20 58,26 61,27 64,25' },

  // ── UPPER BACK / RHOMBOIDS ──
  // x: 43-57, y: 23-35
  { id: 'upper-back', points: '44,24 50,22 56,24 57,30 54,35 50,36 46,35 43,30' },

  // ── LEFT LAT ──
  // x: 40-47, y: 28-44
  { id: 'lat', points: '40,28 44,24 46,30 46,38 44,44 40,46 38,40 38,32' },
  // ── RIGHT LAT ──
  { id: 'lat', points: '60,28 56,24 54,30 54,38 56,44 60,46 62,40 62,32' },

  // ── LEFT TRICEP ──
  // x: 33-38, y: 24-37
  { id: 'tricep', points: '34,24 37,23 39,26 38,34 36,37 33,35 33,28' },
  // ── RIGHT TRICEP ──
  { id: 'tricep', points: '66,24 63,23 61,26 62,34 64,37 67,35 67,28' },

  // ── LEFT BACK FOREARM ──
  // x: 30-37, y: 38-51
  { id: 'forearm-back', points: '32,38 36,37 37,40 36,48 34,52 30,51 30,46 31,41' },
  // ── RIGHT BACK FOREARM ──
  { id: 'forearm-back', points: '68,38 64,37 63,40 64,48 66,52 70,51 70,46 69,41' },

  // ── LOWER BACK / ERECTORS ──
  // x: 45-55, y: 36-50
  { id: 'lower-back', points: '46,36 50,35 54,36 55,42 54,48 50,50 46,48 45,42' },

  // ── LEFT GLUTE ──
  // x: 42-50, y: 48-58
  { id: 'glute', points: '42,48 46,46 50,48 50,56 48,59 43,58 41,54' },
  // ── RIGHT GLUTE ──
  { id: 'glute', points: '58,48 54,46 50,48 50,56 52,59 57,58 59,54' },

  // ── LEFT HAMSTRING ──
  // x: 43-49, y: 60-78
  { id: 'ham', points: '43,60 48,59 49,64 49,72 47,78 44,78 42,72 42,64' },
  // ── RIGHT HAMSTRING ──
  { id: 'ham', points: '57,60 52,59 51,64 51,72 53,78 56,78 58,72 58,64' },

  // ── LEFT BACK CALF (GASTROCNEMIUS) ──
  // x: 43-49, y: 79-92
  { id: 'calf-back', points: '43,80 47,78 49,80 49,88 48,92 44,92 43,88' },
  // ── RIGHT BACK CALF ──
  { id: 'calf-back', points: '57,80 53,78 51,80 51,88 52,92 56,92 57,88' },
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
