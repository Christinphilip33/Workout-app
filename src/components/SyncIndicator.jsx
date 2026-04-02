import React from 'react';
import { useWorkoutSync } from '../context/WorkoutContext.jsx';

/**
 * A tiny Glassmorphic capsule that reflects the live offline/online state of the app.
 * Sits inside the Navbar to provide reassurance the app is "Basement-Proof".
 */
export default function SyncIndicator() {
  const { isOnline } = useWorkoutSync();

  return (
    <div 
      title={isOnline ? "Connected & Syncing" : "Offline Mode Active"}
      className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 backdrop-blur-md px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-gray-800/80 cursor-default"
    >
      <div className="relative flex items-center justify-center">
        {/* The glow ping effect (only active when online/syncing) */}
        {isOnline && (
          <div className="absolute w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-75"></div>
        )}
        
        {/* The core indicator dot */}
        <div className={`w-2 h-2 rounded-full shadow-inner z-10 ${
          isOnline 
            ? "bg-primary-500 shadow-[0_0_8px_rgba(74,222,128,0.8)]" 
            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
        }`}></div>
      </div>
      
      <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
