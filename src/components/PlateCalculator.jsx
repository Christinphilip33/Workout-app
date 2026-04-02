import React, { useMemo } from 'react';

/**
 * Calculates and visualizes the plates required for a given target weight.
 * Assumes a standard 20kg barbell.
 * Only calculates plates for ONE side of the bar.
 */
const PlateCalculator = ({ targetWeight }) => {
  const plates = useMemo(() => {
    if (!targetWeight || targetWeight <= 20) return [];
    
    // Total weight to add to BOTH sides (target - 20kg bar)
    let weightToDistribute = targetWeight - 20;
    
    // Weight per side
    let weightPerSide = weightToDistribute / 2;
    
    // Standard metric plates
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesNeeded = [];
    
    for (const plate of availablePlates) {
      while (weightPerSide >= plate - 0.001) {
        platesNeeded.push(plate);
        weightPerSide = Math.round((weightPerSide - plate) * 1000) / 1000;
      }
    }
    
    return platesNeeded;
  }, [targetWeight]);

  if (!targetWeight || targetWeight <= 20) {
    return (
      <div className="glass-panel px-4 py-3 rounded-xl border border-gray-700/50 flex flex-col items-center">
        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Plate Math</p>
        <p className="text-white text-sm font-medium">Empty Bar (20kg)</p>
      </div>
    );
  }

  return (
    <div className="glass-panel px-4 py-3 rounded-xl border border-gray-700/50 flex flex-col items-center">
      <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Each Side</p>
      
      {plates.length === 0 ? (
        <p className="text-white text-sm font-medium">Empty Bar</p>
      ) : (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {plates.map((p, i) => (
            <div 
              key={i}
              className={`flex-shrink-0 border flex items-center justify-center font-bold shadow-sm ${
                p >= 20 ? 'h-10 w-4 bg-red-500/20 text-red-300 border-red-500/50 rounded-sm' :
                p >= 10 ? 'h-8 w-3 bg-green-500/20 text-transparent border-green-500/50 rounded-sm' :
                p >= 5 ? 'h-6 w-2 bg-blue-500/20 text-transparent border-blue-500/50 rounded-sm' :
                'h-5 w-1.5 bg-gray-500/20 text-transparent border-gray-500/50 rounded-sm'
              }`}
            >
              <span className="sr-only">{p}kg</span>
            </div>
          ))}
          <span className="text-white font-bold ml-2 text-sm">{plates.join(', ')}kg</span>
        </div>
      )}
    </div>
  );
};

export default PlateCalculator;
