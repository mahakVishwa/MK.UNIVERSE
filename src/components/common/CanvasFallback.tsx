import React from 'react';

interface CanvasFallbackProps {
  error?: Error | null;
  message?: string;
}

/**
 * Fallback display shown if WebGL cannot be initialized or during initial canvas mount.
 */
export const CanvasFallback: React.FC<CanvasFallbackProps> = ({ error, message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex h-full w-full flex-col items-center justify-center bg-[#030712] px-6 text-center text-slate-200 select-none"
    >
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500/20 opacity-75" />
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 font-mono text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          MK
        </span>
      </div>

      <h2 className="text-lg font-medium tracking-wider uppercase text-slate-100 font-mono">
        {error ? 'WebGL Offline' : 'Initializing Canvas'}
      </h2>

      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400 font-mono">
        {error
          ? (message || 'Hardware acceleration is disabled or WebGL is unsupported. 2D fallback mode active.')
          : (message || 'Establishing cosmic viewport coordinates and starfield geometry...')}
      </p>
    </div>
  );
};
