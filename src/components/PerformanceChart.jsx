import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * A beautiful glassmorphic Recharts implementation to display exercise progress.
 */
export default function PerformanceChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-gray-800/60 text-center h-64 flex flex-col justify-center">
        <p className="text-gray-500 text-sm">Keep logging! More data needed to project progress.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800/60">
      <h3 className="text-white font-bold text-lg mb-1">Performance Trend</h3>
      <p className="text-gray-400 text-sm mb-6">Estimated 1RM & Volume Tracking.</p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#4ADE80" 
              fontSize={12} 
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#60A5FA" 
              fontSize={12} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderRadius: '12px', border: '1px solid rgba(75, 85, 99, 0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
            
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="estimated1RM" 
              name="Est. 1RM (kg)" 
              stroke="#4ADE80" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#4ADE80', strokeWidth: 0 }} 
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
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
    </div>
  );
}
