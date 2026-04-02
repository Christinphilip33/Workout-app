import React from 'react';

/**
 * Maps volume intensity (0.0 to 1.0) to a specific tailwind color.
 * Light Blue -> Neon Green
 */
const getHeatmapColor = (intensity) => {
  if (intensity > 0.8) return 'bg-primary-400 border-primary-300 shadow-[0_0_15px_rgba(74,222,128,0.4)]';
  if (intensity > 0.6) return 'bg-primary-600 border-primary-500';
  if (intensity > 0.4) return 'bg-teal-600 border-teal-500';
  if (intensity > 0.2) return 'bg-cyan-700 border-cyan-600';
  if (intensity > 0) return 'bg-blue-900 border-blue-800';
  return 'bg-gray-800 border-gray-700';
};

export default function VolumeHeatmap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-gray-800/60 text-center">
        <p className="text-gray-500 text-sm">No volume data available. Log a workout to generate your heatmap.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800/60">
      <h3 className="text-white font-bold text-lg mb-1">Muscle Volume Heatmap</h3>
      <p className="text-gray-400 text-sm mb-6">Historical tonnage distribution.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`flex flex-col p-3 rounded-xl border ${getHeatmapColor(item.intensity)} transition-all duration-300`}
          >
            <span className="text-white font-bold text-sm truncate">{item.muscle}</span>
            <span className="text-white/80 text-xs font-medium mt-1">
              {item.totalVolume > 1000 ? (item.totalVolume / 1000).toFixed(1) + 'k' : item.totalVolume} kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
