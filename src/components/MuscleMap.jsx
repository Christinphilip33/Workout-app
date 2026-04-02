/**
 * MuscleMap - Anatomically detailed SVG body diagram
 * Shows front & back views with realistic muscle definition
 * Highlighted muscles glow in green, dark theme compatible
 * 100% local SVG — zero external APIs or costs
 */

// Map muscle group names to SVG region IDs
const MUSCLE_REGION_MAP = {
  // Chest
  'Chest': ['chest-l', 'chest-r'],
  'Upper Chest': ['chest-l', 'chest-r'],
  'Lower Chest': ['chest-l', 'chest-r'],
  'Pectorals': ['chest-l', 'chest-r'],

  // Shoulders
  'Shoulders': ['delt-l', 'delt-r'],
  'Front Deltoids': ['delt-l', 'delt-r'],
  'Lateral Deltoids': ['delt-l', 'delt-r'],
  'Rear Delts': ['rear-delt-l', 'rear-delt-r'],
  'Rear Deltoids': ['rear-delt-l', 'rear-delt-r'],
  'Rotator Cuff': ['rear-delt-l', 'rear-delt-r'],

  // Arms
  'Arms': ['bicep-l', 'bicep-r', 'tricep-l', 'tricep-r'],
  'Biceps': ['bicep-l', 'bicep-r'],
  'Triceps': ['tricep-l', 'tricep-r'],
  'Forearms': ['forearm-l', 'forearm-r'],

  // Back
  'Back': ['upper-back', 'lat-l', 'lat-r', 'lower-back'],
  'Upper Back': ['upper-back'],
  'Lats': ['lat-l', 'lat-r'],
  'Traps': ['trap-l', 'trap-r'],
  'Rhomboids': ['upper-back'],
  'Lower Back': ['lower-back'],

  // Core
  'Core': ['abs', 'oblique-l', 'oblique-r'],
  'Abs': ['abs'],
  'Obliques': ['oblique-l', 'oblique-r'],
  'Hip Flexors': ['hip-l', 'hip-r'],

  // Legs
  'Legs': ['quad-l', 'quad-r', 'ham-l', 'ham-r'],
  'Quads': ['quad-l', 'quad-r'],
  'Quadriceps': ['quad-l', 'quad-r'],
  'Hamstrings': ['ham-l', 'ham-r'],
  'Glutes': ['glute-l', 'glute-r'],

  // Calves
  'Calves': ['calf-l', 'calf-r'],
}

// Muscle group helper
function MuscleRegion({ id, d, activeRegions, transform }) {
  const isActive = activeRegions.has(id)
  return (
    <path
      d={d}
      transform={transform}
      fill={isActive ? '#22c55e' : '#374151'}
      stroke={isActive ? '#4ade80' : '#4b5563'}
      strokeWidth="0.6"
      style={{
        transition: 'fill 0.3s, stroke 0.3s',
        filter: isActive ? 'drop-shadow(0 0 4px rgba(34,197,94,0.5))' : 'none',
      }}
    />
  )
}

// Muscle definition lines (the anatomical detail lines within muscles)
function DefinitionLine({ d, activeRegions, regionId }) {
  const isActive = activeRegions.has(regionId)
  return (
    <path
      d={d}
      fill="none"
      stroke={isActive ? '#16a34a' : '#4b5563'}
      strokeWidth="0.35"
      opacity={isActive ? 0.7 : 0.4}
      style={{ transition: 'stroke 0.3s, opacity 0.3s' }}
    />
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
    <div className="flex justify-center gap-6 sm:gap-10 py-2">
      {/* ────── FRONT VIEW ────── */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-3 font-medium tracking-wider uppercase">Front</span>
        <svg viewBox="0 0 120 220" className="w-28 h-48 sm:w-36 sm:h-60">
          {/* Head */}
          <ellipse cx="60" cy="16" rx="11" ry="13" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5"/>
          {/* Neck */}
          <path d="M53 28 L53 36 Q60 38 67 36 L67 28" fill="#4b5563" stroke="#6b7280" strokeWidth="0.4"/>

          {/* ── TRAPS ── */}
          <MuscleRegion id="trap-l" d="M53 34 L42 38 L38 44 L42 44 L53 40 Z" activeRegions={activeRegions} />
          <MuscleRegion id="trap-r" d="M67 34 L78 38 L82 44 L78 44 L67 40 Z" activeRegions={activeRegions} />
          <DefinitionLine d="M47 38 L50 36" activeRegions={activeRegions} regionId="trap-l" />
          <DefinitionLine d="M73 38 L70 36" activeRegions={activeRegions} regionId="trap-r" />

          {/* ── SHOULDERS / DELTS ── */}
          <MuscleRegion id="delt-l" d="M38 44 L26 46 L22 52 L24 60 L30 62 L38 54 Z" activeRegions={activeRegions} />
          <MuscleRegion id="delt-r" d="M82 44 L94 46 L98 52 L96 60 L90 62 L82 54 Z" activeRegions={activeRegions} />
          {/* Delt striations */}
          <DefinitionLine d="M30 48 L28 55" activeRegions={activeRegions} regionId="delt-l" />
          <DefinitionLine d="M34 47 L32 56" activeRegions={activeRegions} regionId="delt-l" />
          <DefinitionLine d="M90 48 L92 55" activeRegions={activeRegions} regionId="delt-r" />
          <DefinitionLine d="M86 47 L88 56" activeRegions={activeRegions} regionId="delt-r" />

          {/* ── CHEST / PECS ── */}
          <MuscleRegion id="chest-l" d="M42 44 L53 42 L58 48 L58 62 L52 68 L38 66 L30 62 L38 54 Z" activeRegions={activeRegions} />
          <MuscleRegion id="chest-r" d="M78 44 L67 42 L62 48 L62 62 L68 68 L82 66 L90 62 L82 54 Z" activeRegions={activeRegions} />
          {/* Pec striations */}
          <DefinitionLine d="M44 50 L54 56" activeRegions={activeRegions} regionId="chest-l" />
          <DefinitionLine d="M42 54 L52 60" activeRegions={activeRegions} regionId="chest-l" />
          <DefinitionLine d="M40 58 L50 64" activeRegions={activeRegions} regionId="chest-l" />
          <DefinitionLine d="M76 50 L66 56" activeRegions={activeRegions} regionId="chest-r" />
          <DefinitionLine d="M78 54 L68 60" activeRegions={activeRegions} regionId="chest-r" />
          <DefinitionLine d="M80 58 L70 64" activeRegions={activeRegions} regionId="chest-r" />
          {/* Sternum line */}
          <path d="M60 42 L60 68" fill="none" stroke="#1f2937" strokeWidth="0.8" opacity="0.6"/>

          {/* ── BICEPS ── */}
          <MuscleRegion id="bicep-l" d="M24 62 L20 66 L16 78 L18 88 L22 90 L28 86 L30 74 L28 64 Z" activeRegions={activeRegions} />
          <MuscleRegion id="bicep-r" d="M96 62 L100 66 L104 78 L102 88 L98 90 L92 86 L90 74 L92 64 Z" activeRegions={activeRegions} />
          {/* Bicep peak line */}
          <DefinitionLine d="M22 70 L22 82" activeRegions={activeRegions} regionId="bicep-l" />
          <DefinitionLine d="M98 70 L98 82" activeRegions={activeRegions} regionId="bicep-r" />

          {/* ── FOREARMS ── */}
          <MuscleRegion id="forearm-l" d="M18 90 L14 98 L12 112 L14 118 L20 118 L24 108 L26 96 L22 90 Z" activeRegions={activeRegions} />
          <MuscleRegion id="forearm-r" d="M102 90 L106 98 L108 112 L106 118 L100 118 L96 108 L94 96 L98 90 Z" activeRegions={activeRegions} />
          <DefinitionLine d="M18 96 L16 110" activeRegions={activeRegions} regionId="forearm-l" />
          <DefinitionLine d="M102 96 L104 110" activeRegions={activeRegions} regionId="forearm-r" />

          {/* ── ABS ── */}
          <MuscleRegion id="abs" d="M52 68 L58 68 L62 68 L68 68 L70 78 L70 98 L66 106 L60 108 L54 106 L50 98 L50 78 Z" activeRegions={activeRegions} />
          {/* Ab segmentation lines */}
          <DefinitionLine d="M60 68 L60 106" activeRegions={activeRegions} regionId="abs" />
          <DefinitionLine d="M52 74 L68 74" activeRegions={activeRegions} regionId="abs" />
          <DefinitionLine d="M51 82 L69 82" activeRegions={activeRegions} regionId="abs" />
          <DefinitionLine d="M52 90 L68 90" activeRegions={activeRegions} regionId="abs" />
          <DefinitionLine d="M53 98 L67 98" activeRegions={activeRegions} regionId="abs" />

          {/* ── OBLIQUES ── (SERRATUS + OBLIQUES) */}
          <MuscleRegion id="oblique-l" d="M38 66 L50 78 L50 98 L54 106 L46 112 L36 104 L32 88 L34 72 Z" activeRegions={activeRegions} />
          <MuscleRegion id="oblique-r" d="M82 66 L70 78 L70 98 L66 106 L74 112 L84 104 L88 88 L86 72 Z" activeRegions={activeRegions} />
          {/* Serratus striations */}
          <DefinitionLine d="M38 68 L46 76" activeRegions={activeRegions} regionId="oblique-l" />
          <DefinitionLine d="M36 74 L44 82" activeRegions={activeRegions} regionId="oblique-l" />
          <DefinitionLine d="M35 80 L42 88" activeRegions={activeRegions} regionId="oblique-l" />
          <DefinitionLine d="M82 68 L74 76" activeRegions={activeRegions} regionId="oblique-r" />
          <DefinitionLine d="M84 74 L76 82" activeRegions={activeRegions} regionId="oblique-r" />
          <DefinitionLine d="M85 80 L78 88" activeRegions={activeRegions} regionId="oblique-r" />

          {/* ── HIP FLEXORS ── */}
          <MuscleRegion id="hip-l" d="M46 112 L54 108 L56 116 L48 120 L40 118 Z" activeRegions={activeRegions} />
          <MuscleRegion id="hip-r" d="M74 112 L66 108 L64 116 L72 120 L80 118 Z" activeRegions={activeRegions} />

          {/* ── QUADS ── */}
          <MuscleRegion id="quad-l" d="M40 118 L48 120 L56 116 L58 124 L56 150 L54 164 L50 168 L44 168 L38 164 L35 148 L34 130 Z" activeRegions={activeRegions} />
          <MuscleRegion id="quad-r" d="M80 118 L72 120 L64 116 L62 124 L64 150 L66 164 L70 168 L76 168 L82 164 L85 148 L86 130 Z" activeRegions={activeRegions} />
          {/* Quad separation lines - rectus femoris / vastus */}
          <DefinitionLine d="M47 122 L48 162" activeRegions={activeRegions} regionId="quad-l" />
          <DefinitionLine d="M42 124 L40 158" activeRegions={activeRegions} regionId="quad-l" />
          <DefinitionLine d="M52 120 L54 160" activeRegions={activeRegions} regionId="quad-l" />
          <DefinitionLine d="M73 122 L72 162" activeRegions={activeRegions} regionId="quad-r" />
          <DefinitionLine d="M78 124 L80 158" activeRegions={activeRegions} regionId="quad-r" />
          <DefinitionLine d="M68 120 L66 160" activeRegions={activeRegions} regionId="quad-r" />

          {/* Knee joint */}
          <path d="M38 168 Q47 174 56 168" fill="none" stroke="#4b5563" strokeWidth="0.5" opacity="0.5"/>
          <path d="M64 168 Q73 174 82 168" fill="none" stroke="#4b5563" strokeWidth="0.5" opacity="0.5"/>

          {/* ── CALVES (FRONT - TIBIALIS) ── */}
          <MuscleRegion id="calf-l" d="M40 172 L50 170 L52 186 L50 200 L46 206 L40 206 L38 198 L38 182 Z" activeRegions={activeRegions} />
          <MuscleRegion id="calf-r" d="M80 172 L70 170 L68 186 L70 200 L74 206 L80 206 L82 198 L82 182 Z" activeRegions={activeRegions} />
          <DefinitionLine d="M44 176 L44 200" activeRegions={activeRegions} regionId="calf-l" />
          <DefinitionLine d="M76 176 L76 200" activeRegions={activeRegions} regionId="calf-r" />

          {/* Feet */}
          <ellipse cx="46" cy="212" rx="8" ry="4" fill="#374151" stroke="#4b5563" strokeWidth="0.4"/>
          <ellipse cx="74" cy="212" rx="8" ry="4" fill="#374151" stroke="#4b5563" strokeWidth="0.4"/>
        </svg>
      </div>

      {/* ────── BACK VIEW ────── */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-3 font-medium tracking-wider uppercase">Back</span>
        <svg viewBox="0 0 120 220" className="w-28 h-48 sm:w-36 sm:h-60">
          {/* Head */}
          <ellipse cx="60" cy="16" rx="11" ry="13" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5"/>
          {/* Neck */}
          <path d="M53 28 L53 36 Q60 38 67 36 L67 28" fill="#4b5563" stroke="#6b7280" strokeWidth="0.4"/>

          {/* ── TRAPS ── */}
          <MuscleRegion id="trap-l" d="M53 34 L44 38 L36 44 L38 50 L48 48 L53 42 Z" activeRegions={activeRegions} />
          <MuscleRegion id="trap-r" d="M67 34 L76 38 L84 44 L82 50 L72 48 L67 42 Z" activeRegions={activeRegions} />
          {/* Trap fibers */}
          <DefinitionLine d="M48 38 L42 44" activeRegions={activeRegions} regionId="trap-l" />
          <DefinitionLine d="M50 40 L44 46" activeRegions={activeRegions} regionId="trap-l" />
          <DefinitionLine d="M72 38 L78 44" activeRegions={activeRegions} regionId="trap-r" />
          <DefinitionLine d="M70 40 L76 46" activeRegions={activeRegions} regionId="trap-r" />

          {/* ── REAR DELTS ── */}
          <MuscleRegion id="rear-delt-l" d="M36 44 L24 48 L22 54 L26 62 L32 62 L38 54 L38 50 Z" activeRegions={activeRegions} />
          <MuscleRegion id="rear-delt-r" d="M84 44 L96 48 L98 54 L94 62 L88 62 L82 54 L82 50 Z" activeRegions={activeRegions} />
          <DefinitionLine d="M30 50 L28 58" activeRegions={activeRegions} regionId="rear-delt-l" />
          <DefinitionLine d="M34 49 L32 58" activeRegions={activeRegions} regionId="rear-delt-l" />
          <DefinitionLine d="M90 50 L92 58" activeRegions={activeRegions} regionId="rear-delt-r" />
          <DefinitionLine d="M86 49 L88 58" activeRegions={activeRegions} regionId="rear-delt-r" />

          {/* ── UPPER BACK (RHOMBOIDS / MID-TRAPS) ── */}
          <MuscleRegion id="upper-back" d="M48 48 L38 54 L38 68 L46 74 L54 72 L58 64 L58 48 Z M72 48 L82 54 L82 68 L74 74 L66 72 L62 64 L62 48 Z" activeRegions={activeRegions} />
          {/* Spine */}
          <path d="M60 36 L60 108" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.5"/>
          {/* Rhomboid fibers */}
          <DefinitionLine d="M58 52 L44 58" activeRegions={activeRegions} regionId="upper-back" />
          <DefinitionLine d="M58 58 L44 64" activeRegions={activeRegions} regionId="upper-back" />
          <DefinitionLine d="M62 52 L76 58" activeRegions={activeRegions} regionId="upper-back" />
          <DefinitionLine d="M62 58 L76 64" activeRegions={activeRegions} regionId="upper-back" />

          {/* ── LATS ── */}
          <MuscleRegion id="lat-l" d="M38 62 L28 66 L26 78 L30 92 L38 96 L46 90 L48 78 L46 74 L38 68 Z" activeRegions={activeRegions} />
          <MuscleRegion id="lat-r" d="M82 62 L92 66 L94 78 L90 92 L82 96 L74 90 L72 78 L74 74 L82 68 Z" activeRegions={activeRegions} />
          {/* Lat fibers */}
          <DefinitionLine d="M34 68 L42 82" activeRegions={activeRegions} regionId="lat-l" />
          <DefinitionLine d="M32 74 L38 86" activeRegions={activeRegions} regionId="lat-l" />
          <DefinitionLine d="M30 80 L36 90" activeRegions={activeRegions} regionId="lat-l" />
          <DefinitionLine d="M86 68 L78 82" activeRegions={activeRegions} regionId="lat-r" />
          <DefinitionLine d="M88 74 L82 86" activeRegions={activeRegions} regionId="lat-r" />
          <DefinitionLine d="M90 80 L84 90" activeRegions={activeRegions} regionId="lat-r" />

          {/* ── TRICEPS ── */}
          <MuscleRegion id="tricep-l" d="M26 62 L20 68 L16 80 L18 90 L22 92 L28 88 L30 78 L30 66 Z" activeRegions={activeRegions} />
          <MuscleRegion id="tricep-r" d="M94 62 L100 68 L104 80 L102 90 L98 92 L92 88 L90 78 L90 66 Z" activeRegions={activeRegions} />
          {/* Tricep heads */}
          <DefinitionLine d="M24 68 L22 84" activeRegions={activeRegions} regionId="tricep-l" />
          <DefinitionLine d="M96 68 L98 84" activeRegions={activeRegions} regionId="tricep-r" />

          {/* ── FOREARMS (BACK) ── */}
          <MuscleRegion id="forearm-l" d="M18 92 L14 100 L12 114 L14 118 L20 118 L24 108 L24 96 L22 92 Z" activeRegions={activeRegions} />
          <MuscleRegion id="forearm-r" d="M102 92 L106 100 L108 114 L106 118 L100 118 L96 108 L96 96 L98 92 Z" activeRegions={activeRegions} />

          {/* ── LOWER BACK (ERECTORS) ── */}
          <MuscleRegion id="lower-back" d="M48 78 L54 72 L58 72 L62 72 L66 72 L72 78 L74 90 L70 104 L60 108 L50 104 L46 90 Z" activeRegions={activeRegions} />
          {/* Erector spinae lines */}
          <DefinitionLine d="M56 76 L54 100" activeRegions={activeRegions} regionId="lower-back" />
          <DefinitionLine d="M64 76 L66 100" activeRegions={activeRegions} regionId="lower-back" />

          {/* ── GLUTES ── */}
          <MuscleRegion id="glute-l" d="M38 96 L50 104 L58 108 L58 122 L52 126 L40 124 L34 118 L34 104 Z" activeRegions={activeRegions} />
          <MuscleRegion id="glute-r" d="M82 96 L70 104 L62 108 L62 122 L68 126 L80 124 L86 118 L86 104 Z" activeRegions={activeRegions} />
          {/* Glute fibers */}
          <DefinitionLine d="M40 104 L50 116" activeRegions={activeRegions} regionId="glute-l" />
          <DefinitionLine d="M44 100 L52 112" activeRegions={activeRegions} regionId="glute-l" />
          <DefinitionLine d="M80 104 L70 116" activeRegions={activeRegions} regionId="glute-r" />
          <DefinitionLine d="M76 100 L68 112" activeRegions={activeRegions} regionId="glute-r" />

          {/* ── HAMSTRINGS ── */}
          <MuscleRegion id="ham-l" d="M34 124 L40 126 L52 126 L56 130 L56 156 L52 168 L44 170 L38 168 L34 156 L32 140 Z" activeRegions={activeRegions} />
          <MuscleRegion id="ham-r" d="M86 124 L80 126 L68 126 L64 130 L64 156 L68 168 L76 170 L82 168 L86 156 L88 140 Z" activeRegions={activeRegions} />
          {/* Hamstring separation (bicep femoris / semitendinosus) */}
          <DefinitionLine d="M46 128 L46 166" activeRegions={activeRegions} regionId="ham-l" />
          <DefinitionLine d="M40 130 L38 162" activeRegions={activeRegions} regionId="ham-l" />
          <DefinitionLine d="M74 128 L74 166" activeRegions={activeRegions} regionId="ham-r" />
          <DefinitionLine d="M80 130 L82 162" activeRegions={activeRegions} regionId="ham-r" />

          {/* Knee crease */}
          <path d="M38 170 Q47 174 56 170" fill="none" stroke="#4b5563" strokeWidth="0.5" opacity="0.5"/>
          <path d="M64 170 Q73 174 82 170" fill="none" stroke="#4b5563" strokeWidth="0.5" opacity="0.5"/>

          {/* ── CALVES (BACK - GASTROCNEMIUS) ── */}
          <MuscleRegion id="calf-l" d="M36 174 L44 172 L52 174 L54 186 L52 198 L48 206 L42 206 L36 198 L34 186 Z" activeRegions={activeRegions} />
          <MuscleRegion id="calf-r" d="M84 174 L76 172 L68 174 L66 186 L68 198 L72 206 L78 206 L84 198 L86 186 Z" activeRegions={activeRegions} />
          {/* Calf separation (medial / lateral head) */}
          <DefinitionLine d="M44 176 L46 200" activeRegions={activeRegions} regionId="calf-l" />
          <DefinitionLine d="M76 176 L74 200" activeRegions={activeRegions} regionId="calf-r" />
          {/* Gastrocnemius diamond shape */}
          <DefinitionLine d="M38 180 L44 186 L50 180" activeRegions={activeRegions} regionId="calf-l" />
          <DefinitionLine d="M70 180 L76 186 L82 180" activeRegions={activeRegions} regionId="calf-r" />

          {/* Feet */}
          <ellipse cx="46" cy="212" rx="8" ry="4" fill="#374151" stroke="#4b5563" strokeWidth="0.4"/>
          <ellipse cx="74" cy="212" rx="8" ry="4" fill="#374151" stroke="#4b5563" strokeWidth="0.4"/>
        </svg>
      </div>
    </div>
  )
}
