import { useEffect, useRef } from 'react';

export default function RotatingGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let rotation = 0;

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
    const dotCount = 2000;
    const dots = [];

    // Generate random dots on sphere surface using fibonacci sphere
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dotCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      dots.push({
        phi,
        theta,
        size: Math.random() * 2 + 1
      });
    }

    // Add latitude/longitude lines for wireframe effect
    const meridians = 18;
    const parallels = 12;
    const linePoints = [];

    // Meridians (vertical lines)
    for (let m = 0; m < meridians; m++) {
      const theta = (m / meridians) * Math.PI * 2;
      for (let p = 0; p <= 60; p++) {
        const phi = (p / 60) * Math.PI;
        linePoints.push({ phi, theta, size: 1.2, isLine: true });
      }
    }

    // Parallels (horizontal lines)
    for (let p = 1; p < parallels; p++) {
      const phi = (p / parallels) * Math.PI;
      for (let m = 0; m <= 80; m++) {
        const theta = (m / 80) * Math.PI * 2;
        linePoints.push({ phi, theta, size: 1.2, isLine: true });
      }
    }

    const allDots = [...dots, ...linePoints];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Sort dots by z-depth for proper rendering
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

      // Draw dots
      sortedDots.forEach(dot => {
        // Only draw dots on the visible side
        if (dot.z > -0.2) {
          const opacity = Math.max(0.1, (dot.z + 0.2) / 1.2);
          const adjustedSize = dot.size * (0.6 + (dot.z + 1) * 0.4);
          
          ctx.beginPath();
          ctx.arc(dot.screenX, dot.screenY, adjustedSize, 0, Math.PI * 2);
          
          if (dot.isLine) {
            // Blue wireframe lines
            ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.7})`;
          } else {
            // White dots for surface
            ctx.fillStyle = `rgba(200, 200, 220, ${opacity * 0.8})`;
          }
          ctx.fill();
        }
      });

      // Draw faint glow behind the globe
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.03)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.01)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update rotation - slow, smooth rotation
      rotation += 0.002;
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
      style={{ opacity: 0.8 }}
    />
  );
}
