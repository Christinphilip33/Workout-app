import React, { useEffect, useState } from 'react';

/**
 * A highly animated Glassmorphic Modal for celebrating new Personal Records.
 */
export default function PRModal({ isOpen, prDetails, onClose, weightUnit = 'kg' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Allow fade out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-modal-title"
    >
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm shadow-inner transition-opacity duration-300" aria-hidden="true"></div>

      {/* Modal Card */}
      <div className={`relative px-8 py-10 rounded-3xl glass-card border border-primary-400/50 shadow-[0_0_50px_rgba(74,222,128,0.3)] flex flex-col items-center bg-gray-900/90 transform transition-transform duration-500 ease-out ${show ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'}`}>

        {/* Confetti / Star decoration (CSS only) */}
        <div className="absolute -top-6 -right-6 text-4xl animate-bounce" aria-hidden="true">🌟</div>
        <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse delay-100" aria-hidden="true">🔥</div>

        <div className="bg-gradient-to-br from-primary-400 to-teal-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/40 mb-5" aria-hidden="true">
          <span className="text-4xl">🏆</span>
        </div>

        <h2 id="pr-modal-title" className="text-3xl font-black text-white text-gradient mb-1">NEW PR!</h2>
        <p className="text-gray-300 text-center font-medium max-w-[200px]">
          You just hit a new all-time <span className="text-white font-bold">{prDetails?.type}</span> record:
        </p>
        <p className="text-5xl font-black text-white mt-4 tracking-tighter shadow-sm" aria-live="polite">
          {prDetails?.value}<span className="text-2xl text-primary-400 ml-1">{weightUnit}</span>
        </p>

      </div>
    </div>
  );
}
