import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../context/WorkoutContext.jsx';
import { checkAchievements } from '../utils/analyticsUtils.js';

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState([]);
  const [showOverlay, setShowOverlay] = useState(null);

  const sessionCount = useLiveQuery(() => db.completedSessions.count(), []);

  useEffect(() => {
    checkAchievements().then(setAchievements);
  }, [sessionCount]);

  if (achievements.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-gray-800/60 text-center">
        <p className="text-gray-500 text-sm">No achievements yet. Keep training to unlock milestones!</p>
      </div>
    );
  }

  return (
    <>
      {/* Achievement Celebration Overlay */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in-up"
          onClick={() => setShowOverlay(null)}
        >
          <div className="glass-card p-10 rounded-3xl border border-primary-500/40 max-w-sm text-center shadow-[0_0_60px_rgba(74,222,128,0.2)] transform animate-bounce-gentle">
            <div className="text-7xl mb-4">{showOverlay.icon}</div>
            <h2 className="text-2xl font-black text-gradient mb-2">{showOverlay.title}</h2>
            <p className="text-gray-300 text-sm">{showOverlay.description}</p>
            <button 
              onClick={() => setShowOverlay(null)} 
              className="mt-6 bg-primary-500/20 text-primary-400 px-6 py-2 rounded-xl border border-primary-500/50 hover:bg-primary-500/30 transition-all font-semibold text-sm"
            >
              Nice!
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl border border-gray-800/60">
        <h3 className="text-white font-bold text-lg mb-1">Achievements</h3>
        <p className="text-gray-400 text-sm mb-5">{achievements.length} milestone{achievements.length !== 1 ? 's' : ''} unlocked</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(a => (
            <button
              key={a.id}
              onClick={() => setShowOverlay(a)}
              className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary-500/30 hover:bg-gray-900/80 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{a.icon}</span>
              <span className="text-white font-bold text-xs text-center leading-tight">{a.title}</span>
              <span className="text-gray-500 text-[10px] text-center leading-tight">{a.description}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
