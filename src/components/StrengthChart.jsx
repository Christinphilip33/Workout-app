import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { get1RMTrend } from '../utils/analyticsUtils.js';

/**
 * Custom Glassmorphic Tooltip showing date, est 1RM, and heaviest raw set.
 */
function GlassTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/60 rounded-2xl px-5 py-4 shadow-2xl">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{data.date}</p>
      <div className="flex flex-col gap-1.5">
        <p className="text-primary-400 font-bold text-sm">
          Est. 1RM: <span className="text-white text-lg">{data.value}kg</span>
        </p>
        <p className="text-cyan-400 font-bold text-sm">
          Heaviest: <span className="text-white">{data.heaviestWeight}kg × {data.heaviestReps}</span>
        </p>
        {data.volume > 0 && (
          <p className="text-blue-400 font-medium text-xs">
            Volume: {data.volume > 1000 ? (data.volume / 1000).toFixed(1) + 'k' : data.volume}kg
          </p>
        )}
      </div>
    </div>
  );
}

export default function StrengthChart({ exerciseId, exerciseName }) {
  const [timeframe, setTimeframe] = useState('all');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!exerciseId) return;
    get1RMTrend(exerciseId, timeframe).then(setData);
  }, [exerciseId, timeframe]);

  const timeframes = [
    { key: '1m', label: '1 Month' },
    { key: '3m', label: '3 Months' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800/60">
      {/* Header with Timeframe Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Strength Curve</h3>
          <p className="text-gray-400 text-sm">{exerciseName || 'Select an exercise'}</p>
        </div>
        <div className="flex bg-gray-900/80 rounded-xl p-1 border border-gray-800/60">
          {timeframes.map(tf => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                timeframe === tf.key
                  ? 'bg-primary-500/20 text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart or Empty State */}
      {data.length < 2 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 text-sm text-center">Keep logging! Need 2+ sessions to project a strength curve.</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={11}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#4ADE80"
                fontSize={11}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
                label={{ value: '1RM (kg)', angle: -90, position: 'insideLeft', style: { fill: '#4ADE80', fontSize: 10 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#60A5FA"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                name="Est. 1RM (kg)"
                stroke="#4ADE80"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4ADE80', strokeWidth: 0 }}
                activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 2, fill: '#030712' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                name="Volume (kg)"
                stroke="#60A5FA"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
