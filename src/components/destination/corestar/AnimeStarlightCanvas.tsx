import React, { useEffect, useRef } from 'react';

interface AnimeStarlightCanvasProps {
  parallaxX: number; // Normalized -1 to 1
  parallaxY: number; // Normalized -1 to 1
  reducedMotion?: boolean;
  isDimmed?: boolean;
}

interface CrossStar {
  x: number;
  y: number;
  baseSize: number;
  spikeLen: number;
  color: string;
  glowColor: string;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number;
}

interface Stardust {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  phase: number;
  depth: number;
}

interface SolarEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  active: boolean;
}

/**
 * AnimeStarlightCanvas: High-performance 2D HTML5 Canvas rendering Makoto Shinkai-style
 * anime cosmic starlight: 4-pointed cross diffraction spikes, floating golden stardust motes,
 * solar wind embers drifting from the Sun, and occasional cinematic shooting star streaks.
 */
export const AnimeStarlightCanvas: React.FC<AnimeStarlightCanvasProps> = ({
  parallaxX,
  parallaxY,
  reducedMotion = false,
  isDimmed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };
    window.addEventListener('resize', handleResize);

    // 1. Initialize Anime Cross Stars (4-point diffraction spike stars)
    let stars: CrossStar[] = [];
    let stardustList: Stardust[] = [];
    let embers: SolarEmber[] = [];
    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + 3000;

    const STAR_COLORS = [
      { core: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
      { core: '#fff3db', glow: 'rgba(255, 215, 140, 0.45)' },
      { core: '#e2f4ff', glow: 'rgba(180, 225, 255, 0.4)' },
      { core: '#ffeacc', glow: 'rgba(245, 190, 110, 0.35)' },
    ];

    const initElements = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 12000);
      for (let i = 0; i < starCount; i++) {
        const col = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        const isSpikeStar = Math.random() < 0.35; // 35% of stars have prominent anime spikes
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseSize: isSpikeStar ? 1.4 + Math.random() * 1.6 : 0.8 + Math.random() * 1.2,
          spikeLen: isSpikeStar ? 7 + Math.random() * 14 : 0,
          color: col.core,
          glowColor: col.glow,
          twinkleSpeed: 1.2 + Math.random() * 2.5,
          twinklePhase: Math.random() * Math.PI * 2,
          depth: 0.015 + Math.random() * 0.035,
        });
      }

      // 2. Floating Stardust motes
      stardustList = [];
      const dustCount = Math.floor(width / 26);
      for (let i = 0; i < dustCount; i++) {
        stardustList.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.8 + Math.random() * 1.8,
          speedY: -0.15 - Math.random() * 0.35,
          speedX: (Math.random() - 0.5) * 0.15,
          alpha: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          depth: 0.03 + Math.random() * 0.05,
        });
      }

      // 3. Solar Wind Embers (drifting leftward from Sun's vicinity on the right)
      embers = [];
      for (let i = 0; i < 30; i++) {
        spawnEmber(true);
      }
    };

    const spawnEmber = (randomLife = false) => {
      const sunCenterX = width * 0.76;
      const sunCenterY = height * 0.48;
      const angle = Math.PI * 0.65 + (Math.random() - 0.5) * Math.PI * 0.9; // Leftward fan
      const dist = 60 + Math.random() * 120;
      const maxLife = 120 + Math.random() * 160;
      embers.push({
        x: sunCenterX + Math.cos(angle) * dist,
        y: sunCenterY + Math.sin(angle) * dist,
        vx: -0.6 - Math.random() * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1.0 + Math.random() * 2.2,
        life: randomLife ? Math.random() * maxLife : 0,
        maxLife,
      });
    };

    initElements();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const targetDimAlpha = isDimmed ? 0.3 : 1.0;
      const pxOffset = parallaxX * 25;
      const pyOffset = parallaxY * 18;

      // -------------------------------------------------------------
      // 1. Draw Anime Cross-Spike Stars
      // -------------------------------------------------------------
      ctx.save();
      for (const s of stars) {
        const twinkle = Math.sin(time * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const currentAlpha = Math.max(0.15, (0.55 + 0.45 * twinkle) * targetDimAlpha);

        const sx = s.x + pxOffset * s.depth;
        const sy = s.y + pyOffset * s.depth;

        // Radial starlight aura
        if (s.spikeLen > 0) {
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.spikeLen * 1.2);
          grad.addColorStop(0, s.glowColor);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, s.spikeLen * 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Horizontal & Vertical needle spikes (Makoto Shinkai signature glint)
          ctx.strokeStyle = `rgba(255, 245, 220, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 0.9;

          const currentLen = s.spikeLen * (0.8 + 0.2 * twinkle);

          ctx.beginPath();
          ctx.moveTo(sx - currentLen, sy);
          ctx.lineTo(sx + currentLen, sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(sx, sy - currentLen * 0.85);
          ctx.lineTo(sx, sy + currentLen * 0.85);
          ctx.stroke();
        }

        // Star core diamond
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, s.baseSize * (0.85 + 0.15 * twinkle), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 2. Draw Floating Stardust Motes
      // -------------------------------------------------------------
      ctx.save();
      for (const d of stardustList) {
        if (!reducedMotion) {
          d.y += d.speedY;
          d.x += Math.sin(time * 0.001 + d.phase) * 0.25;
          if (d.y < -10) d.y = height + 10;
          if (d.x < -10) d.x = width + 10;
          if (d.x > width + 10) d.x = -10;
        }

        const dx = d.x + pxOffset * d.depth;
        const dy = d.y + pyOffset * d.depth;
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.0015 + d.phase);

        ctx.fillStyle = `rgba(245, 210, 130, ${d.alpha * pulse * targetDimAlpha})`;
        ctx.beginPath();
        ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 3. Draw Solar Wind Embers (Radiating from the Sun)
      // -------------------------------------------------------------
      ctx.save();
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        if (!reducedMotion) {
          e.life += 1;
          e.x += e.vx;
          e.y += e.vy;
        }

        const progress = e.life / e.maxLife;
        if (progress >= 1) {
          embers.splice(i, 1);
          spawnEmber(false);
          continue;
        }

        const alpha = Math.sin(progress * Math.PI) * 0.65 * targetDimAlpha;
        const ex = e.x + pxOffset * 0.04;
        const ey = e.y + pyOffset * 0.04;

        ctx.fillStyle = `rgba(255, 195, 75, ${alpha})`;
        ctx.beginPath();
        ctx.arc(ex, ey, e.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. Draw Cinematic Shooting Star
      // -------------------------------------------------------------
      if (!reducedMotion && Date.now() > nextShootingStarTime && !shootingStar) {
        shootingStar = {
          x: width * (0.1 + Math.random() * 0.6),
          y: height * (0.05 + Math.random() * 0.25),
          vx: 6.5 + Math.random() * 4.5,
          vy: 3.5 + Math.random() * 3.0,
          length: 90 + Math.random() * 70,
          alpha: 1.0,
          active: true,
        };
        nextShootingStarTime = Date.now() + 7000 + Math.random() * 6000;
      }

      if (shootingStar && shootingStar.active) {
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.alpha -= 0.022;

        if (shootingStar.alpha <= 0) {
          shootingStar = null;
        } else {
          ctx.save();
          const tailX = shootingStar.x - shootingStar.vx * 12;
          const tailY = shootingStar.y - shootingStar.vy * 12;

          const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          grad.addColorStop(0, 'rgba(255, 230, 180, 0)');
          grad.addColorStop(0.7, `rgba(255, 220, 140, ${shootingStar.alpha * 0.4 * targetDimAlpha})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha * targetDimAlpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Shooting star head glint
          ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.alpha * targetDimAlpha})`;
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 2.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [parallaxX, parallaxY, reducedMotion, isDimmed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 block h-full w-full select-none"
    />
  );
};

export default AnimeStarlightCanvas;
