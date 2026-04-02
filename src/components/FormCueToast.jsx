import React, { useEffect, useState } from 'react';

/**
 * A persistent Frosted Glass toast for global form cues.
 */
const FormCueToast = ({ cues, isVisible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && cues) {
      setShow(true);
      // Auto-hide after 10 seconds or keep it persistent depending on requirements.
      // E.g. keeping it persistent for the first subset
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, cues]);

  if (!show || !cues) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up md:top-auto md:bottom-24 pointer-events-none w-11/12 max-w-sm">
      <div className="glass-card rounded-2xl p-4 shadow-2xl border-primary-500/30 bg-gray-900/80 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="bg-primary-500/20 text-primary-400 p-2 rounded-xl shrink-0 mt-0.5">
            💡
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-0.5">Expert Cue</p>
            <p className="text-gray-300 text-sm leading-relaxed">{cues}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCueToast;
