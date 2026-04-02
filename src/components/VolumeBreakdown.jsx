import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { getVolumeByMuscleGroup } from '../utils/analyticsUtils.js';

export default function VolumeBreakdown() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    getVolumeByMuscleGroup(period).then(setData);
  }, [period]);

  const periods = [
    { key: 7, label: '7d' },
    { key: 14, label: '14d' },
    { key: 30, label: '30d' },
  ];

  // Transform for Recharts Radar
  const radarData = data.slice(0, 8).map(d => ({
    muscle: d.muscle?.charAt(0).toUpperCase() + d.muscle?.slice(1),
    volume: d.current,
    fullMark: Math.max(...data.map(x => x.current), 1)
  }));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Volume Distribution</h3>
          <p className="text-gray-400 text-sm">Muscle group work breakdown.</p>
        </div>
        <div className="flex bg-gray-900/80 rounded-xl p-1 border border-gray-800/60">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                period === p.key
                  ? 'bg-primary-500/20 text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      {radarData.length > 0 ? (
        <div className="h-72 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis 
                dataKey="muscle" 
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'auto']}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Volume (kg)"
                dataKey="volume"
                stroke="#4ADE80"
                fill="#4ADE80"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  borderRadius: '12px',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No volume data for this period.</p>
        </div>
      )}

      {/* Week-over-Week Comparison Rows */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.slice(0, 6).map(item => (
            <div key={item.muscle} className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-white font-bold text-sm truncate capitalize">{item.muscle}</span>
              <span className="text-gray-400 text-xs">
                {item.current > 1000 ? (item.current / 1000).toFixed(1) + 'k' : item.current}kg
              </span>
              <span className={`text-xs font-bold ${
                item.change > 0 ? 'text-primary-400' : item.change < 0 ? 'text-red-400' : 'text-gray-500'
              }`}>
                {item.change > 0 ? '↑' : item.change < 0 ? '↓' : '–'} {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
