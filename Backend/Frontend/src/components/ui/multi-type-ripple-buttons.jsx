import React, { useState, useMemo } from 'react';

const JS_RIPPLE_KEYFRAMES = `
  @keyframes js-ripple-animation {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  .animate-js-ripple-effect {
    animation: js-ripple-animation var(--ripple-duration) ease-out forwards;
  }
`;

export const RippleButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  rippleColor,
  rippleDuration = 600,
}) => {
  const [ripples, setRipples] = useState([]);

  const color = rippleColor || 'var(--button-ripple-color, rgba(0,0,0,0.12))';

  const createRipple = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const key = Date.now();
    setRipples((prev) => [...prev, { key, x, y, size }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.key !== key)), rippleDuration);
  };

  const handleClick = (e) => {
    if (!disabled) { createRipple(e); if (onClick) onClick(e); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: JS_RIPPLE_KEYFRAMES }} />
      <button
        className={['relative overflow-hidden isolate cursor-pointer', disabled ? 'opacity-50 cursor-not-allowed' : '', className].join(' ')}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="relative z-10 pointer-events-none">{children}</span>
        <div className="absolute inset-0 pointer-events-none z-[5]">
          {ripples.map((r) => (
            <span
              key={r.key}
              className="absolute rounded-full animate-js-ripple-effect"
              style={{
                left: r.x, top: r.y, width: r.size, height: r.size,
                backgroundColor: color,
                '--ripple-duration': `${rippleDuration}ms`,
              }}
            />
          ))}
        </div>
      </button>
    </>
  );
};
