import { useEffect, useRef } from 'react';

export default function RotatingGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let rotation = 0;
    let time = 0;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Globe parameters
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.75;
    const dotCount = 1200; // Reduced dot count
    const dots = [];

    // Generate random dots on sphere surface using fibonacci sphere
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dotCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      dots.push({
        phi,
        theta,
        size: Math.random() * 1.5 + 0.5 // Smaller dots
      });
    }

    // Add latitude/longitude lines for wireframe effect - reduced density
    const meridians = 12;
    const parallels = 8;
    const linePoints = [];

    // Meridians (vertical lines)
    for (let m = 0; m < meridians; m++) {
      const theta = (m / meridians) * Math.PI * 2;
      for (let p = 0; p <= 40; p++) {
        const phi = (p / 40) * Math.PI;
        linePoints.push({ phi, theta, size: 0.8, isLine: true, meridianIndex: m });
      }
    }

    // Parallels (horizontal lines)
    for (let p = 1; p < parallels; p++) {
      const phi = (p / parallels) * Math.PI;
      for (let m = 0; m <= 50; m++) {
        const theta = (m / 50) * Math.PI * 2;
        linePoints.push({ phi, theta, size: 0.8, isLine: true, parallelIndex: p });
      }
    }

    const allDots = [...dots, ...linePoints];

    // Create flowing particles - reduced count
    const particles = [];
    const particleCount = 30;

    // Meridian particles
    for (let i = 0; i < particleCount / 2; i++) {
      const meridianIndex = Math.floor(Math.random() * meridians);
      const theta = (meridianIndex / meridians) * Math.PI * 2;
      particles.push({
        type: 'meridian',
        theta,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        size: 1.5 + Math.random() * 1.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        trail: [],
        trailLength: 5 + Math.floor(Math.random() * 4)
      });
    }

    // Parallel particles
    for (let i = 0; i < particleCount / 2; i++) {
      const parallelIndex = 1 + Math.floor(Math.random() * (parallels - 1));
      const phi = (parallelIndex / parallels) * Math.PI;
      particles.push({
        type: 'parallel',
        phi,
        progress: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.015,
        size: 1.5 + Math.random() * 1.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        trail: [],
        trailLength: 5 + Math.floor(Math.random() * 4)
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Sort dots by z-depth
      const sortedDots = allDots.map(dot => {
        const x = Math.sin(dot.phi) * Math.cos(dot.theta + rotation);
        const y = Math.cos(dot.phi);
        const z = Math.sin(dot.phi) * Math.sin(dot.theta + rotation);
        
        return {
          ...dot,
          screenX: centerX + x * radius,
          screenY: centerY + y * radius,
          z,
          depth: z
        };
      }).sort((a, b) => a.depth - b.depth);

      // Draw dots with reduced opacity
      sortedDots.forEach(dot => {
        if (dot.z > -0.2) {
          const opacity = Math.max(0.05, (dot.z + 0.2) / 1.2);
          const adjustedSize = dot.size * (0.5 + (dot.z + 1) * 0.3);
          
          ctx.beginPath();
          ctx.arc(dot.screenX, dot.screenY, adjustedSize, 0, Math.PI * 2);
          
          if (dot.isLine) {
            ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.25})`; // Reduced opacity
          } else {
            ctx.fillStyle = `rgba(180, 180, 200, ${opacity * 0.35})`; // Reduced opacity
          }
          ctx.fill();
        }
      });

      // Update and draw particles with reduced glow
      particles.forEach(particle => {
        let phi, theta;
        
        if (particle.type === 'meridian') {
          particle.progress += particle.speed * particle.direction;
          if (particle.progress > 1) particle.progress = 0;
          if (particle.progress < 0) particle.progress = 1;
          
          phi = particle.progress * Math.PI;
          theta = particle.theta;
        } else {
          particle.progress += particle.speed * particle.direction;
          if (particle.progress > Math.PI * 2) particle.progress -= Math.PI * 2;
          if (particle.progress < 0) particle.progress += Math.PI * 2;
          
          phi = particle.phi;
          theta = particle.progress;
        }

        const x = Math.sin(phi) * Math.cos(theta + rotation);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta + rotation);
        
        const screenX = centerX + x * radius;
        const screenY = centerY + y * radius;

        particle.trail.unshift({ x: screenX, y: screenY, z });
        if (particle.trail.length > particle.trailLength) {
          particle.trail.pop();
        }

        if (z > -0.1) {
          const baseOpacity = Math.max(0.15, (z + 0.1) / 1.1);
          
          // Draw trail with reduced opacity
          particle.trail.forEach((point, index) => {
            if (point.z > -0.1) {
              const trailOpacity = baseOpacity * (1 - index / particle.trailLength) * 0.4;
              const trailSize = particle.size * (1 - index / particle.trailLength * 0.5);
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(100, 180, 255, ${trailOpacity})`;
              ctx.fill();
            }
          });

          // Smaller glow
          const glowSize = particle.size * 2;
          const gradient = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, glowSize
          );
          gradient.addColorStop(0, `rgba(130, 200, 255, ${baseOpacity * 0.6})`);
          gradient.addColorStop(0.4, `rgba(80, 150, 255, ${baseOpacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          ctx.beginPath();
          ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(screenX, screenY, particle.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 230, 255, ${baseOpacity * 0.8})`;
          ctx.fill();
        }
      });

      rotation += 0.0015;
      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}
