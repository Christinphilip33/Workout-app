import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar.jsx'
import PageWrapper from './components/Layout/PageWrapper.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExerciseLibrary from './pages/ExerciseLibrary.jsx'
import ExerciseDetail from './pages/ExerciseDetail.jsx'
import Sessions from './pages/Sessions.jsx'
import ActiveWorkout from './pages/ActiveWorkout.jsx'
import History from './pages/History.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { WorkoutProvider, db } from './context/WorkoutContext.jsx'
import { seedExerciseLibrary } from './utils/seedData.js'
import { useEffect, useState } from 'react'

export default function App() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await seedExerciseLibrary(db);
        setIsSyncing(false);
      } catch (err) {
        setSyncError(err.message);
        setIsSyncing(false);
      }
    };
    initDB();
  }, []);

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="glass-card p-10 rounded-3xl flex flex-col items-center max-w-sm w-full text-center border border-primary-500/30 shadow-[0_0_50px_rgba(74,222,128,0.15)] animate-pulse">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-primary-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black mb-2 text-gradient">Syncing Library</h2>
          <p className="text-gray-400 text-sm">Setting up your exercise library for offline use. This only happens once.</p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="glass-card p-8 rounded-3xl border border-red-500/30 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-3">Sync Failed</h2>
          <p className="text-gray-300 text-sm mb-6">{syncError}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500/20 text-red-300 px-6 py-2 rounded-xl border border-red-500/50 hover:bg-red-500/30 transition-all font-semibold shadow-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WorkoutProvider>
        <div className="min-h-screen bg-gray-950 text-white">
          <Navbar />
          <PageWrapper>
            <ErrorBoundary fallbackMessage="This page encountered an error. Try navigating to a different page.">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/exercises" element={<ExerciseLibrary />} />
                <Route path="/exercises/:id" element={<ExerciseDetail />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/workout/:sessionId" element={<ActiveWorkout />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </ErrorBoundary>
          </PageWrapper>
        </div>
      </WorkoutProvider>
    </ErrorBoundary>
  )
}
