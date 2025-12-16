import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 50;

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let devicePixelRatio = window.devicePixelRatio || 1;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 3,
      speedX: -0.25 + Math.random() * 0.5,
      speedY: -0.25 + Math.random() * 0.5,
      pulse: Math.random() * 360,
      hue: 200 + Math.random() * 80,
    }));

    const resize = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      devicePixelRatio = window.devicePixelRatio || 1;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(devicePixelRatio, devicePixelRatio);
    };

    const drawGradientBackdrop = (time) => {
      const gradient = context.createLinearGradient(0, 0, width, height);

      const shift = (Math.sin(time / 4000) + 1) / 2;
      gradient.addColorStop(0, `rgba(59,130,246,${0.35 + shift * 0.25})`);
      gradient.addColorStop(0.5, `rgba(168,85,247,${0.3 + (1 - shift) * 0.2})`);
      gradient.addColorStop(1, `rgba(248,113,113,${0.35 + shift * 0.3})`);

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const drawParticles = (time) => {
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += prefersReducedMotion ? 0 : 0.5;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const alpha =
          0.15 + (Math.sin((particle.pulse * Math.PI) / 180) + 1) / 4;
        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
        context.shadowBlur = 20;
        context.shadowColor = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
        context.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);
      drawGradientBackdrop(time);
      if (!prefersReducedMotion) {
        drawParticles(time);
      }
      frameRef.current = requestAnimationFrame(render);
    };

    resize();
    render();

    const handleResize = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-95"
      aria-hidden="true"
    />
  );
}
