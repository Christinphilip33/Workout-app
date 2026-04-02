/**
 * MuscleMap - Natural anatomical body illustrations with interactive SVG overlays
 * Uses generated anatomy images as base with positioned SVG highlight regions
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

/* ── SVG overlay regions mapped to % positions on the body images ── */
/* Each region: { id, view: 'front'|'back', polygon points as % of image } */
const FRONT_REGIONS = [
  // Pectorals
  { id: 'pec', points: '38,19 50,17 50,27 47,30 38,29 33,27 32,24' },
  { id: 'pec', points: '62,19 50,17 50,27 53,30 62,29 67,27 68,24' },
  // Front deltoids
  { id: 'delt-front', points: '30,18 38,19 33,27 28,27 25,23' },
  { id: 'delt-front', points: '70,18 62,19 67,27 72,27 75,23' },
  // Biceps
  { id: 'bicep', points: '25,27 28,27 30,36 29,42 25,42 23,36' },
  { id: 'bicep', points: '75,27 72,27 70,36 71,42 75,42 77,36' },
  // Forearms (front)
  { id: 'forearm-front', points: '23,42 25,42 27,52 26,58 22,58 21,52' },
  { id: 'forearm-front', points: '77,42 75,42 73,52 74,58 78,58 79,52' },
  // Abs
  { id: 'abs', points: '45,30 55,30 55,44 53,48 47,48 45,44' },
  // Obliques / serratus
  { id: 'oblique', points: '33,27 38,29 45,30 45,44 43,48 36,46 31,40 30,32' },
  { id: 'oblique', points: '67,27 62,29 55,30 55,44 57,48 64,46 69,40 70,32' },
  // Hip flexors
  { id: 'hip', points: '36,46 43,48 47,48 45,52 40,53 35,50' },
  { id: 'hip', points: '64,46 57,48 53,48 55,52 60,53 65,50' },
  // Adductors
  { id: 'adductor', points: '45,52 50,52 50,66 47,68 44,64' },
  { id: 'adductor', points: '55,52 50,52 50,66 53,68 56,64' },
  // Quadriceps
  { id: 'quad', points: '35,50 40,53 45,52 44,64 43,74 40,76 35,74 32,66 32,56' },
  { id: 'quad', points: '65,50 60,53 55,52 56,64 57,74 60,76 65,74 68,66 68,56' },
  // Front calves (tibialis)
  { id: 'calf-front', points: '36,78 42,78 43,88 42,95 38,95 35,88' },
  { id: 'calf-front', points: '64,78 58,78 57,88 58,95 62,95 65,88' },
]

const BACK_REGIONS = [
  // Trapezius
  { id: 'trap', points: '37,15 50,12 63,15 65,20 60,22 50,18 40,22 35,20' },
  // Rear deltoids
  { id: 'delt-rear', points: '28,20 37,19 35,28 30,29 25,26 24,22' },
  { id: 'delt-rear', points: '72,20 63,19 65,28 70,29 75,26 76,22' },
  // Upper back (rhomboids/infraspinatus)
  { id: 'upper-back', points: '40,22 50,18 60,22 62,28 56,32 50,30 44,32 38,28' },
  // Lats
  { id: 'lat', points: '30,29 35,28 38,28 44,32 44,42 40,46 32,42 28,36' },
  { id: 'lat', points: '70,29 65,28 62,28 56,32 56,42 60,46 68,42 72,36' },
  // Triceps
  { id: 'tricep', points: '24,26 28,29 28,38 26,44 22,44 20,38 20,30' },
  { id: 'tricep', points: '76,26 72,29 72,38 74,44 78,44 80,38 80,30' },
  // Back forearms
  { id: 'forearm-back', points: '20,44 22,44 24,54 24,60 20,60 18,54' },
  { id: 'forearm-back', points: '80,44 78,44 76,54 76,60 80,60 82,54' },
  // Lower back / erector spinae
  { id: 'lower-back', points: '44,38 50,36 56,38 56,48 52,52 50,52 48,52 44,48' },
  // Glutes
  { id: 'glute', points: '34,48 44,48 48,52 50,52 50,58 46,62 38,60 32,54' },
  { id: 'glute', points: '66,48 56,48 52,52 50,52 50,58 54,62 62,60 68,54' },
  // Hamstrings
  { id: 'ham', points: '32,58 38,60 46,62 47,72 44,80 40,82 34,78 30,70 30,62' },
  { id: 'ham', points: '68,58 62,60 54,62 53,72 56,80 60,82 66,78 70,70 70,62' },
  // Back calves (gastrocnemius)
  { id: 'calf-back', points: '32,84 40,82 43,88 42,96 38,98 33,96 30,90' },
  { id: 'calf-back', points: '68,84 60,82 57,88 58,96 62,98 67,96 70,90' },
]

function OverlayRegion({ points, isActive }) {
  return (
    <polygon
      points={points}
      fill={isActive ? 'rgba(34, 197, 94, 0.45)' : 'transparent'}
      stroke={isActive ? 'rgba(74, 222, 128, 0.7)' : 'transparent'}
      strokeWidth="0.4"
      style={{
        transition: 'fill 0.4s ease, stroke 0.4s ease',
        filter: isActive ? 'drop-shadow(0 0 6px rgba(34,197,94,0.5))' : 'none',
      }}
    />
  )
}

function BodyView({ label, imageSrc, regions, activeRegions }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] text-gray-500 mb-2 font-semibold tracking-widest uppercase">
        {label}
      </span>
      <div className="relative" style={{ width: '100%', maxWidth: '160px' }}>
        <img
          src={imageSrc}
          alt={`${label} body anatomy`}
          className="w-full h-auto rounded-lg"
          draggable={false}
          style={{ display: 'block' }}
        />
        {/* SVG overlay positioned exactly on top of the image */}
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
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function MuscleMap({ highlightedMuscles }) {
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
      />
      <BodyView
        label="Back"
        imageSrc="/images/body-back.png"
        regions={BACK_REGIONS}
        activeRegions={activeRegions}
      />
    </div>
  )
}
