# Improvement Plan

**Status: COMPLETED** (2026-04-01)

Ordered by impact. Each item describes the problem, where it lives, and exactly what to do.

---

## 1. Fix Duplicate `globalFormCues` Keys in `exercises.js` - DONE

**Problem:** Every exercise object in `src/data/exercises.js` has two identical `globalFormCues` lines in a row (lines 16–17, 33–34, 50–51, etc.). In a JavaScript object literal, duplicate keys silently drop the first one — the data is fine since both values match, but it's noise and a footgun if someone ever updates only one copy.

**Fix:** In `src/data/exercises.js`, remove every duplicate `globalFormCues` line. Each exercise object should have exactly one.

**Scope:** `src/data/exercises.js` only. Do a search-and-replace pass — every exercise has the same duplicated line so it's mechanical.

---

## 2. Add React Error Boundaries - DONE

**Problem:** No error boundaries anywhere. If any component throws during render (e.g., malformed localStorage data, IndexedDB returning unexpected shape), the entire app goes blank with no recovery path.

**Fix:** Create `src/components/ErrorBoundary.jsx` — a class component implementing `componentDidCatch` and `getDerivedStateFromError`. Render a fallback UI ("Something went wrong — tap to reload") that lets users recover without clearing their data.

Wrap at two levels:
- Top-level in `src/App.jsx` around all routes (catches catastrophic failures)
- Per-page in each page component import in `App.jsx` (isolates failures to one route)

---

## 3. Add Unit Tests for Performance Math - DONE

**Problem:** `src/utils/performanceMath.js` contains the core 1RM estimation and volume calculation logic that drives PRs, strength charts, and auto-regulation alerts. Zero tests. A bad formula tweak could silently break all analytics.

**Fix:**
1. Install Vitest (already using Vite, so it's zero-config): `npm install -D vitest`
2. Add `"test": "vitest"` to `package.json` scripts
3. Create `src/utils/performanceMath.test.js` with tests covering:
   - `calculate1RM`: known values (e.g., 100kg × 5 reps ≈ 116.25kg), edge cases (reps=1, reps=0, weight=0)
   - `calculateVolume`: empty array, single set, multiple sets with mixed weight/reps
   - `getRelativeIntensity`: zero 1RM guard, normal percentage calculation

Also add `src/utils/levels.test.js` testing level thresholds from `src/utils/levels.js`.

---

## 4. Add Data Export / Import - DONE

**Problem:** All user data (workout logs, progress, custom exercises, session templates) lives only in localStorage and IndexedDB. No export means users can't back up, switch browsers, or move to a new device without losing everything.

**Fix:** Add an Export/Import panel to the Dashboard or a new Settings page.

**Export:** Collect all four localStorage keys (`customExercises`, `sessions`, `workoutLogs`, `userProgress`) plus completed sessions from IndexedDB (via Dexie), serialize to JSON, and trigger a file download via `URL.createObjectURL(new Blob([json], { type: 'application/json' }))`.

**Import:** File input that reads a `.json` file, validates the shape (check for expected top-level keys), then writes back to localStorage and IndexedDB with a confirmation prompt before overwriting.

**Where to add:** New `<button>` on the Dashboard quick-actions bar, or a `/settings` route if you want to expand it later.

---

## 5. Replace Magic Numbers with Named Constants - DONE

**Problem:** Several hardcoded values scattered through the codebase make intent unclear and changes error-prone:
- The `50` exercise limit in the session dropdown (somewhere in `Sessions.jsx` or `ActiveWorkout.jsx`)
- Level thresholds (0, 10, 25, 50) are defined in `src/utils/levels.js` but may be re-stated inline elsewhere
- RPE thresholds for deload warnings (9.5, 10, "3 consecutive sessions") in `useIntelligence.js`

**Fix:**
- In `src/utils/levels.js`: already has the thresholds — confirm nothing else hardcodes them
- In `src/utils/performanceMath.js`: add `export const MAX_RELIABLE_REPS = 10` (currently just a comment)
- In `src/hooks/useIntelligence.js`: extract RPE deload constants to the top of the file:
  ```js
  const DELOAD_RPE_THRESHOLD = 9.5;
  const DELOAD_SESSION_COUNT = 3;
  ```
- In whichever file has the `50` exercise dropdown limit: extract to a named constant at the top

---

## 6. Add ARIA Labels for Accessibility - DONE

**Problem:** Interactive elements likely lack accessible labels — icon-only buttons, number inputs without visible labels in the set logger, and modal close buttons won't be announced correctly by screen readers.

**Fix:** Audit and patch the following:
- `src/components/SetLogger.jsx`: Add `aria-label` to each number input (`aria-label="Reps"`, `aria-label="Weight (kg)"`, `aria-label="RPE"`)
- `src/components/PRModal.jsx`: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the modal title
- `src/components/Layout/Navbar.jsx`: Add `aria-label="Main navigation"` to the `<nav>` element; label any icon-only buttons
- `src/components/PlateCalculator.jsx`: Label the weight input
- Any `<button>` that is icon-only (no visible text): add `aria-label` describing the action

---

## 7. TypeScript Migration (Optional — Larger Effort)

**Problem:** No type safety. The exercise objects, workout log records, and progress state are all plain JS objects — typos in property names and shape mismatches fail silently at runtime.

**Note:** This is the largest item and a breaking change to the build config. Do it last, or incrementally.

**Fix:**
1. `npm install -D typescript @types/react @types/react-dom`
2. Add `tsconfig.json` (Vite supports `.tsx` out of the box with `@vitejs/plugin-react`)
3. Start by adding types to the most critical files first:
   - `src/utils/performanceMath.js` → `.ts` (pure functions, easiest)
   - `src/utils/levels.js` → `.ts`
   - `src/hooks/useLocalStorage.js` → `.ts` with generic `useLocalStorage<T>`
4. Define shared interfaces in `src/types/index.ts`:
   - `Exercise`, `WorkoutLog`, `SessionTemplate`, `UserProgress`, `WorkoutSet`
5. Migrate pages and components one at a time, renaming `.jsx` → `.tsx`

Vite will type-check on build if you add `tsc --noEmit` to the build script.

---

## Priority Order

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | Fix duplicate `globalFormCues` | 15 min | Low bug risk, cleaner data |
| 2 | Error boundaries | 30 min | High — prevents total blank-screen failures |
| 3 | Unit tests for performance math | 1–2 hr | High — protects core analytics logic |
| 4 | Data export/import | 2–3 hr | High — critical for user trust and data safety |
| 5 | Named constants | 30 min | Medium — maintainability |
| 6 | ARIA labels | 1 hr | Medium — accessibility |
| 7 | TypeScript migration | Days | Long-term quality improvement |
