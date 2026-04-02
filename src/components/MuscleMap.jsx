/**
 * MuscleMap - Anatomically accurate line-art body diagram
 * Clean outline style matching professional fitness app anatomy illustrations
 * Dark-theme adapted: light gray outlines, green fill on highlighted muscles
 * 100% local SVG — zero external APIs or costs
 */

const MUSCLE_REGION_MAP = {
  'Chest': ['pec-l', 'pec-r'],
  'Upper Chest': ['pec-l', 'pec-r'],
  'Lower Chest': ['pec-l', 'pec-r'],
  'Pectorals': ['pec-l', 'pec-r'],

  'Shoulders': ['delt-front-l', 'delt-front-r', 'delt-rear-l', 'delt-rear-r'],
  'Front Deltoids': ['delt-front-l', 'delt-front-r'],
  'Lateral Deltoids': ['delt-front-l', 'delt-front-r', 'delt-rear-l', 'delt-rear-r'],
  'Rear Delts': ['delt-rear-l', 'delt-rear-r'],
  'Rear Deltoids': ['delt-rear-l', 'delt-rear-r'],
  'Rotator Cuff': ['delt-rear-l', 'delt-rear-r'],

  'Arms': ['bicep-l', 'bicep-r', 'tricep-l', 'tricep-r'],
  'Biceps': ['bicep-l', 'bicep-r'],
  'Triceps': ['tricep-l', 'tricep-r'],
  'Forearms': ['forearm-front-l', 'forearm-front-r', 'forearm-back-l', 'forearm-back-r'],

  'Back': ['upper-back', 'lat-l', 'lat-r', 'lower-back'],
  'Upper Back': ['upper-back'],
  'Lats': ['lat-l', 'lat-r'],
  'Traps': ['trap'],
  'Rhomboids': ['upper-back'],
  'Lower Back': ['lower-back'],

  'Core': ['abs', 'oblique-l', 'oblique-r'],
  'Abs': ['abs'],
  'Obliques': ['oblique-l', 'oblique-r'],
  'Hip Flexors': ['hip-l', 'hip-r'],

  'Legs': ['quad-l', 'quad-r', 'ham-l', 'ham-r'],
  'Quads': ['quad-l', 'quad-r'],
  'Quadriceps': ['quad-l', 'quad-r'],
  'Hamstrings': ['ham-l', 'ham-r'],
  'Glutes': ['glute-l', 'glute-r'],

  'Calves': ['calf-front-l', 'calf-front-r', 'calf-back-l', 'calf-back-r'],

  'Adductors': ['adductor-l', 'adductor-r'],
}

function MR({ id, d, active, outline }) {
  const isActive = active.has(id)
  return (
    <path
      d={d}
      fill={isActive ? 'rgba(34,197,94,0.35)' : 'transparent'}
      stroke={isActive ? '#4ade80' : (outline || '#6b7280')}
      strokeWidth={isActive ? '0.9' : '0.6'}
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{
        transition: 'fill 0.3s ease, stroke 0.3s ease',
        filter: isActive ? 'drop-shadow(0 0 3px rgba(34,197,94,0.4))' : 'none',
      }}
    />
  )
}

// Detail / definition lines within muscle groups
function DL({ d, active, id, outline }) {
  const isActive = active.has(id)
  return (
    <path
      d={d}
      fill="none"
      stroke={isActive ? '#22c55e' : (outline || '#4b5563')}
      strokeWidth="0.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={isActive ? 0.8 : 0.5}
    />
  )
}

// Body outline (non-muscle structural lines)
function BL({ d }) {
  return <path d={d} fill="none" stroke="#6b7280" strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" />
}

export default function MuscleMap({ highlightedMuscles }) {
  const muscles = highlightedMuscles || []
  const a = new Set()
  muscles.forEach(m => {
    const regions = MUSCLE_REGION_MAP[m] || []
    regions.forEach(r => a.add(r))
  })

  return (
    <div className="flex justify-center gap-8 sm:gap-14 py-4">
      {/* ═══════════════════ FRONT VIEW ═══════════════════ */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] text-gray-500 mb-3 font-semibold tracking-widest uppercase">Front</span>
        <svg viewBox="0 0 200 420" className="w-32 h-56 sm:w-44 sm:h-[310px]">
          {/* ── HEAD ── */}
          <ellipse cx="100" cy="24" rx="16" ry="20" fill="none" stroke="#6b7280" strokeWidth="0.7"/>
          {/* Jawline */}
          <BL d="M84 28 Q90 40 100 42 Q110 40 116 28" />

          {/* ── NECK ── */}
          <BL d="M90 42 L88 56" />
          <BL d="M110 42 L112 56" />
          {/* Sternocleidomastoid */}
          <DL d="M92 44 L96 54" active={a} id="trap" />
          <DL d="M108 44 L104 54" active={a} id="trap" />

          {/* ── TRAPS (FRONT VIEW) ── */}
          <MR id="trap" d="M88 56 L76 60 L68 66 L74 66 L88 60 Z M112 56 L124 60 L132 66 L126 66 L112 60 Z" active={a} />

          {/* ── DELTOIDS (FRONT) ── */}
          <MR id="delt-front-l" d="M68 66 L56 70 L48 80 L50 92 L58 96 L68 88 L74 78 L74 66 Z" active={a} />
          <MR id="delt-front-r" d="M132 66 L144 70 L152 80 L150 92 L142 96 L132 88 L126 78 L126 66 Z" active={a} />
          {/* Delt striations */}
          <DL d="M60 74 L56 86" active={a} id="delt-front-l" />
          <DL d="M66 72 L62 86" active={a} id="delt-front-l" />
          <DL d="M140 74 L144 86" active={a} id="delt-front-r" />
          <DL d="M134 72 L138 86" active={a} id="delt-front-r" />

          {/* ── PECTORALS ── */}
          <MR id="pec-l" d="M74 66 L88 60 L98 66 L98 84 L94 96 L82 102 L68 98 L58 96 L68 88 L74 78 Z" active={a} />
          <MR id="pec-r" d="M126 66 L112 60 L102 66 L102 84 L106 96 L118 102 L132 98 L142 96 L132 88 L126 78 Z" active={a} />
          {/* Pec fiber lines */}
          <DL d="M72 74 L92 82" active={a} id="pec-l" />
          <DL d="M70 80 L90 88" active={a} id="pec-l" />
          <DL d="M68 86 L88 94" active={a} id="pec-l" />
          <DL d="M128 74 L108 82" active={a} id="pec-r" />
          <DL d="M130 80 L110 88" active={a} id="pec-r" />
          <DL d="M132 86 L112 94" active={a} id="pec-r" />
          {/* Center chest line (sternum) */}
          <BL d="M100 60 L100 102" />

          {/* ── BICEPS ── */}
          <MR id="bicep-l" d="M50 96 L46 102 L40 118 L42 136 L48 140 L56 134 L60 120 L58 104 Z" active={a} />
          <MR id="bicep-r" d="M150 96 L154 102 L160 118 L158 136 L152 140 L144 134 L140 120 L142 104 Z" active={a} />
          {/* Bicep peak */}
          <DL d="M48 106 L46 130" active={a} id="bicep-l" />
          <DL d="M52 104 L50 128" active={a} id="bicep-l" />
          <DL d="M152 106 L154 130" active={a} id="bicep-r" />
          <DL d="M148 104 L150 128" active={a} id="bicep-r" />

          {/* ── FOREARMS (FRONT) ── */}
          <MR id="forearm-front-l" d="M42 140 L36 150 L30 172 L28 190 L32 196 L40 196 L46 182 L50 164 L52 148 L48 140 Z" active={a} />
          <MR id="forearm-front-r" d="M158 140 L164 150 L170 172 L172 190 L168 196 L160 196 L154 182 L150 164 L148 148 L152 140 Z" active={a} />
          <DL d="M38 148 L34 180" active={a} id="forearm-front-l" />
          <DL d="M44 146 L40 176" active={a} id="forearm-front-l" />
          <DL d="M162 148 L166 180" active={a} id="forearm-front-r" />
          <DL d="M156 146 L160 176" active={a} id="forearm-front-r" />

          {/* Hands */}
          <BL d="M28 196 L24 212 L28 216 L32 214 L34 210 L36 214 L38 210 L40 214 L42 210 L44 206 L40 196" />
          <BL d="M172 196 L176 212 L172 216 L168 214 L166 210 L164 214 L162 210 L160 214 L158 210 L156 206 L160 196" />

          {/* ── SERRATUS / OBLIQUES ── */}
          <MR id="oblique-l" d="M68 98 L82 102 L94 96 L94 108 L92 130 L90 142 L84 150 L74 148 L66 136 L62 118 L64 104 Z" active={a} />
          <MR id="oblique-r" d="M132 98 L118 102 L106 96 L106 108 L108 130 L110 142 L116 150 L126 148 L134 136 L138 118 L136 104 Z" active={a} />
          {/* Serratus interdigitations */}
          <DL d="M68 100 L80 110" active={a} id="oblique-l" />
          <DL d="M66 108 L78 118" active={a} id="oblique-l" />
          <DL d="M64 116 L76 126" active={a} id="oblique-l" />
          <DL d="M66 124 L76 134" active={a} id="oblique-l" />
          <DL d="M132 100 L120 110" active={a} id="oblique-r" />
          <DL d="M134 108 L122 118" active={a} id="oblique-r" />
          <DL d="M136 116 L124 126" active={a} id="oblique-r" />
          <DL d="M134 124 L124 134" active={a} id="oblique-r" />

          {/* ── RECTUS ABDOMINIS ── */}
          <MR id="abs" d="M94 96 L106 96 L108 108 L110 130 L110 148 L106 158 L100 162 L94 158 L90 148 L90 130 L92 108 Z" active={a} />
          {/* Linea alba (center line) */}
          <DL d="M100 96 L100 158" active={a} id="abs" />
          {/* Tendinous inscriptions (6-pack lines) */}
          <DL d="M92 106 L108 106" active={a} id="abs" />
          <DL d="M91 118 L109 118" active={a} id="abs" />
          <DL d="M91 130 L109 130" active={a} id="abs" />
          <DL d="M92 142 L108 142" active={a} id="abs" />
          {/* Lower abs V-line */}
          <DL d="M94 148 L100 162 L106 148" active={a} id="abs" />

          {/* ── HIP FLEXORS / ILIAC ── */}
          <MR id="hip-l" d="M74 148 L84 150 L90 148 L94 158 L92 168 L82 172 L72 168 L68 158 Z" active={a} />
          <MR id="hip-r" d="M126 148 L116 150 L110 148 L106 158 L108 168 L118 172 L128 168 L132 158 Z" active={a} />

          {/* ── ADDUCTORS ── */}
          <MR id="adductor-l" d="M82 172 L92 168 L96 180 L98 210 L96 230 L92 236 L86 230 L84 210 L82 190 Z" active={a} />
          <MR id="adductor-r" d="M118 172 L108 168 L104 180 L102 210 L104 230 L108 236 L114 230 L116 210 L118 190 Z" active={a} />

          {/* ── QUADRICEPS ── */}
          <MR id="quad-l" d="M72 168 L82 172 L82 190 L84 220 L86 250 L88 274 L84 280 L76 282 L68 278 L64 268 L62 248 L62 228 L64 200 L66 180 Z" active={a} />
          <MR id="quad-r" d="M128 168 L118 172 L118 190 L116 220 L114 250 L112 274 L116 280 L124 282 L132 278 L136 268 L138 248 L138 228 L136 200 L134 180 Z" active={a} />
          {/* Quad muscle separations: rectus femoris, vastus lateralis, vastus medialis */}
          <DL d="M76 176 L78 270" active={a} id="quad-l" />
          <DL d="M70 180 L68 264" active={a} id="quad-l" />
          <DL d="M82 188 L84 260" active={a} id="quad-l" />
          <DL d="M124 176 L122 270" active={a} id="quad-r" />
          <DL d="M130 180 L132 264" active={a} id="quad-r" />
          <DL d="M118 188 L116 260" active={a} id="quad-r" />

          {/* ── KNEECAP ── */}
          <ellipse cx="78" cy="286" rx="8" ry="6" fill="none" stroke="#6b7280" strokeWidth="0.5"/>
          <ellipse cx="122" cy="286" rx="8" ry="6" fill="none" stroke="#6b7280" strokeWidth="0.5"/>

          {/* ── CALVES (FRONT - TIBIALIS) ── */}
          <MR id="calf-front-l" d="M68 292 L84 292 L88 306 L88 340 L86 360 L82 372 L74 372 L68 360 L66 340 L66 310 Z" active={a} />
          <MR id="calf-front-r" d="M132 292 L116 292 L112 306 L112 340 L114 360 L118 372 L126 372 L132 360 L134 340 L134 310 Z" active={a} />
          {/* Tibialis anterior / shin line */}
          <DL d="M76 296 L76 366" active={a} id="calf-front-l" />
          <DL d="M124 296 L124 366" active={a} id="calf-front-r" />

          {/* ── ANKLES & FEET ── */}
          <BL d="M70 372 L68 384 L64 392 L86 392 L84 384 L82 372" />
          <BL d="M118 372 L116 384 L114 392 L136 392 L134 384 L132 372" />

          {/* Body outline connectors */}
          <BL d="M98 162 L98 172 Q100 178 102 172 L102 162" />
        </svg>
      </div>

      {/* ═══════════════════ BACK VIEW ═══════════════════ */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] text-gray-500 mb-3 font-semibold tracking-widest uppercase">Back</span>
        <svg viewBox="0 0 200 420" className="w-32 h-56 sm:w-44 sm:h-[310px]">
          {/* ── HEAD ── */}
          <ellipse cx="100" cy="24" rx="16" ry="20" fill="none" stroke="#6b7280" strokeWidth="0.7"/>
          {/* Ear lines */}
          <BL d="M84 24 L82 22 L82 28 L84 26" />
          <BL d="M116 24 L118 22 L118 28 L116 26" />

          {/* ── NECK ── */}
          <BL d="M90 42 L88 56" />
          <BL d="M110 42 L112 56" />

          {/* ── TRAPEZIUS ── */}
          <MR id="trap" d="M88 48 L78 52 L66 62 L56 70 L60 74 L74 68 L88 60 L98 56 L100 54 L102 56 L112 60 L126 68 L140 74 L144 70 L134 62 L122 52 L112 48 L104 44 L100 42 L96 44 Z" active={a} />
          {/* Trap fiber lines */}
          <DL d="M100 44 L82 58" active={a} id="trap" />
          <DL d="M100 44 L118 58" active={a} id="trap" />
          <DL d="M98 50 L74 66" active={a} id="trap" />
          <DL d="M102 50 L126 66" active={a} id="trap" />
          <DL d="M96 54 L66 70" active={a} id="trap" />
          <DL d="M104 54 L134 70" active={a} id="trap" />

          {/* ── REAR DELTOIDS ── */}
          <MR id="delt-rear-l" d="M56 70 L44 76 L40 86 L44 98 L52 100 L60 94 L66 82 L66 72 L60 74 Z" active={a} />
          <MR id="delt-rear-r" d="M144 70 L156 76 L160 86 L156 98 L148 100 L140 94 L134 82 L134 72 L140 74 Z" active={a} />
          <DL d="M50 80 L48 94" active={a} id="delt-rear-l" />
          <DL d="M56 78 L54 92" active={a} id="delt-rear-l" />
          <DL d="M150 80 L152 94" active={a} id="delt-rear-r" />
          <DL d="M144 78 L146 92" active={a} id="delt-rear-r" />

          {/* ── INFRASPINATUS / TERES / UPPER BACK ── */}
          <MR id="upper-back" d="M74 68 L88 60 L98 56 L100 56 L102 56 L112 60 L126 68 L132 78 L128 90 L120 96 L108 96 L102 88 L100 86 L98 88 L92 96 L80 96 L72 90 L68 78 Z" active={a} />
          {/* Spine */}
          <path d="M100 42 L100 170" fill="none" stroke="#4b5563" strokeWidth="0.8" opacity="0.6"/>
          {/* Infraspinatus line */}
          <DL d="M74 78 L92 86" active={a} id="upper-back" />
          <DL d="M126 78 L108 86" active={a} id="upper-back" />
          {/* Teres major */}
          <DL d="M70 84 L82 92" active={a} id="upper-back" />
          <DL d="M130 84 L118 92" active={a} id="upper-back" />
          {/* Rhomboid lines */}
          <DL d="M98 64 L82 76" active={a} id="upper-back" />
          <DL d="M102 64 L118 76" active={a} id="upper-back" />
          <DL d="M98 72 L84 84" active={a} id="upper-back" />
          <DL d="M102 72 L116 84" active={a} id="upper-back" />

          {/* ── TRICEPS ── */}
          <MR id="tricep-l" d="M44 98 L38 106 L34 122 L36 140 L42 144 L50 138 L54 124 L54 108 L52 100 Z" active={a} />
          <MR id="tricep-r" d="M156 98 L162 106 L166 122 L164 140 L158 144 L150 138 L146 124 L146 108 L148 100 Z" active={a} />
          {/* Tricep heads separation */}
          <DL d="M46 106 L42 134" active={a} id="tricep-l" />
          <DL d="M50 104 L48 130" active={a} id="tricep-l" />
          <DL d="M154 106 L158 134" active={a} id="tricep-r" />
          <DL d="M150 104 L152 130" active={a} id="tricep-r" />

          {/* ── FOREARMS (BACK) ── */}
          <MR id="forearm-back-l" d="M36 144 L30 154 L26 176 L24 194 L28 200 L36 200 L42 186 L46 168 L48 152 L42 144 Z" active={a} />
          <MR id="forearm-back-r" d="M164 144 L170 154 L174 176 L176 194 L172 200 L164 200 L158 186 L154 168 L152 152 L158 144 Z" active={a} />
          <DL d="M34 152 L30 184" active={a} id="forearm-back-l" />
          <DL d="M40 150 L36 180" active={a} id="forearm-back-l" />
          <DL d="M166 152 L170 184" active={a} id="forearm-back-r" />
          <DL d="M160 150 L164 180" active={a} id="forearm-back-r" />

          {/* Hands */}
          <BL d="M24 200 L20 216 L24 220 L28 218 L30 214 L32 218 L34 214 L36 218 L38 214 L40 208 L36 200" />
          <BL d="M176 200 L180 216 L176 220 L172 218 L170 214 L168 218 L166 214 L164 218 L162 214 L160 208 L164 200" />

          {/* ── LATISSIMUS DORSI ── */}
          <MR id="lat-l" d="M60 94 L52 100 L48 110 L48 124 L52 140 L60 150 L72 156 L84 148 L88 134 L90 118 L88 102 L80 96 L72 90 L66 82 Z" active={a} />
          <MR id="lat-r" d="M140 94 L148 100 L152 110 L152 124 L148 140 L140 150 L128 156 L116 148 L112 134 L110 118 L112 102 L120 96 L128 90 L134 82 Z" active={a} />
          {/* Lat fiber lines */}
          <DL d="M62 92 L74 120" active={a} id="lat-l" />
          <DL d="M58 100 L68 128" active={a} id="lat-l" />
          <DL d="M54 110 L64 138" active={a} id="lat-l" />
          <DL d="M52 120 L62 146" active={a} id="lat-l" />
          <DL d="M138 92 L126 120" active={a} id="lat-r" />
          <DL d="M142 100 L132 128" active={a} id="lat-r" />
          <DL d="M146 110 L136 138" active={a} id="lat-r" />
          <DL d="M148 120 L138 146" active={a} id="lat-r" />

          {/* ── LOWER BACK / ERECTORS ── */}
          <MR id="lower-back" d="M88 102 L92 96 L100 92 L108 96 L112 102 L114 120 L112 140 L108 156 L100 162 L92 156 L88 140 L86 120 Z" active={a} />
          {/* Erector spinae columns */}
          <DL d="M96 100 L94 152" active={a} id="lower-back" />
          <DL d="M104 100 L106 152" active={a} id="lower-back" />
          {/* Horizontal fascial lines */}
          <DL d="M90 116 L110 116" active={a} id="lower-back" />
          <DL d="M90 132 L110 132" active={a} id="lower-back" />
          <DL d="M92 146 L108 146" active={a} id="lower-back" />

          {/* ── GLUTES ── */}
          <MR id="glute-l" d="M60 150 L72 156 L84 148 L92 156 L98 164 L98 182 L92 190 L78 192 L66 186 L58 174 L56 162 Z" active={a} />
          <MR id="glute-r" d="M140 150 L128 156 L116 148 L108 156 L102 164 L102 182 L108 190 L122 192 L134 186 L142 174 L144 162 Z" active={a} />
          {/* Glute fiber lines */}
          <DL d="M66 160 L84 178" active={a} id="glute-l" />
          <DL d="M62 168 L80 184" active={a} id="glute-l" />
          <DL d="M70 156 L86 172" active={a} id="glute-l" />
          <DL d="M134 160 L116 178" active={a} id="glute-r" />
          <DL d="M138 168 L120 184" active={a} id="glute-r" />
          <DL d="M130 156 L114 172" active={a} id="glute-r" />
          {/* Glute cleft */}
          <BL d="M98 164 Q100 180 102 164" />

          {/* ── HAMSTRINGS ── */}
          <MR id="ham-l" d="M58 192 L78 192 L92 190 L96 200 L96 240 L94 268 L90 282 L82 284 L72 282 L66 272 L62 252 L58 228 L56 208 Z" active={a} />
          <MR id="ham-r" d="M142 192 L122 192 L108 190 L104 200 L104 240 L106 268 L110 282 L118 284 L128 282 L134 272 L138 252 L142 228 L144 208 Z" active={a} />
          {/* Hamstring separations: biceps femoris / semitendinosus / semimembranosus */}
          <DL d="M80 196 L82 278" active={a} id="ham-l" />
          <DL d="M70 198 L68 274" active={a} id="ham-l" />
          <DL d="M88 194 L90 270" active={a} id="ham-l" />
          <DL d="M120 196 L118 278" active={a} id="ham-r" />
          <DL d="M130 198 L132 274" active={a} id="ham-r" />
          <DL d="M112 194 L110 270" active={a} id="ham-r" />

          {/* Knee crease */}
          <BL d="M64 284 Q78 292 92 284" />
          <BL d="M108 284 Q122 292 136 284" />

          {/* ── CALVES (BACK - GASTROCNEMIUS) ── */}
          <MR id="calf-back-l" d="M62 290 L78 288 L92 290 L94 310 L92 336 L88 358 L82 370 L74 370 L66 358 L62 336 L60 310 Z" active={a} />
          <MR id="calf-back-r" d="M138 290 L122 288 L108 290 L106 310 L108 336 L112 358 L118 370 L126 370 L134 358 L138 336 L140 310 Z" active={a} />
          {/* Gastrocnemius medial/lateral head separation */}
          <DL d="M78 292 L80 362" active={a} id="calf-back-l" />
          <DL d="M122 292 L120 362" active={a} id="calf-back-r" />
          {/* Diamond shape of gastrocnemius */}
          <DL d="M66 298 L78 310 L90 298" active={a} id="calf-back-l" />
          <DL d="M110 298 L122 310 L134 298" active={a} id="calf-back-r" />
          {/* Soleus line */}
          <DL d="M68 330 Q78 338 88 330" active={a} id="calf-back-l" />
          <DL d="M112 330 Q122 338 132 330" active={a} id="calf-back-r" />

          {/* Achilles tendon */}
          <BL d="M78 368 L76 384 L78 390" />
          <BL d="M122 368 L124 384 L122 390" />

          {/* ── ANKLES & FEET ── */}
          <BL d="M68 370 L66 384 L62 394 L90 394 L88 384 L86 370" />
          <BL d="M114 370 L112 384 L110 394 L138 394 L136 384 L134 370" />
        </svg>
      </div>
    </div>
  )
}
