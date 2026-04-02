# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

**Stack**: React 18 + React Router v6 + Vite + Tailwind CSS. Pure client-side SPA — no backend, no database. All data persists in browser localStorage.

### Data Flow

All state lives in custom hooks that wrap `useLocalStorage`. Pages import these hooks directly — there is no global state manager.

- `useLocalStorage` — generic wrapper for localStorage with error handling
- `useExercises` — merges built-in exercises (`src/data/exercises.js`) with custom ones stored in localStorage (`customExercises`)
- `useSessions` — manages workout session templates (`sessions`) and completed workout logs (`workoutLogs`)
- `useProgress` — tracks per-exercise progress including level, total sessions, and badges (`userProgress`)

### localStorage Keys

| Key | Contents |
|-----|----------|
| `customExercises` | User-created exercises |
| `sessions` | Workout session templates (list of exercise IDs) |
| `workoutLogs` | Completed workout records with sets/reps/weight |
| `userProgress` | Per-exercise progress object keyed by exercise ID |

### Leveling System

Defined in `src/utils/levels.js`. Per-exercise levels based on session count:
- Level 1 (Beginner): 0+
- Level 2 (Intermediate): 10+
- Level 3 (Advanced): 25+
- Level 4 (Elite): 50+

Level-ups trigger `BadgeNotification` toast animations.

### Routing

Defined in `src/App.jsx`:
- `/` — Dashboard
- `/exercises` — Exercise library (browse + create custom)
- `/exercises/:id` — Exercise detail with progression tips
- `/sessions` — Session templates
- `/workout/:sessionId` — Active workout logging
- `/history` — Past workout logs
