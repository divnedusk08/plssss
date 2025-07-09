"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(240, 240, 240)", // Much lighter grey
  width,
  height,
  className,
  maxOpacity = 0.3, // Lower base opacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; intensity: number; time: number } | null>(null);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, width, height);

      const currentTime = Date.now();

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const squareX = i * (squareSize + gridGap) * dpr;
          const squareY = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;
          
          // Calculate distance from mouse for ripple effect
          const mouseX = mousePosition.x * dpr;
          const mouseY = mousePosition.y * dpr;
          const centerX = squareX + squareWidth / 2;
          const centerY = squareY + squareHeight / 2;
          const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
          
          let opacity = squares[i * rows + j];
          let flickerIntensity = 1;
          
          // Apply ripple effect if mouse is near
          if (mousePosition.x >= 0 && mousePosition.y >= 0 && distance < 200 * dpr) {
            const rippleDistance = distance / (200 * dpr);
            const rippleIntensity = Math.max(0, 1 - rippleDistance);
            
            // Create wave-like effect
            const wave = Math.sin(currentTime * 0.01 + distance * 0.01) * 0.5 + 0.5;
            const rippleEffect = rippleIntensity * wave;
            
            // Increase flickering in ripple area
            flickerIntensity = 1 + rippleEffect * 3;
            opacity = Math.min(opacity * flickerIntensity, 0.8);
            
            // Add pulsing effect
            const pulse = Math.sin(currentTime * 0.005 + distance * 0.02) * 0.3 + 0.7;
            opacity *= pulse;
          }
          
          // Create gradient effect based on distance
          const gradientIntensity = mousePosition.x >= 0 && mousePosition.y >= 0 
            ? Math.max(0, 1 - distance / (300 * dpr))
            : 0;
          
          // Mix colors for cool effect
          const baseColor = [240, 240, 240]; // Light grey
          const accentColor = [180, 200, 255]; // Light blue tint
          
          const r = Math.floor(baseColor[0] * (1 - gradientIntensity) + accentColor[0] * gradientIntensity);
          const g = Math.floor(baseColor[1] * (1 - gradientIntensity) + accentColor[1] * gradientIntensity);
          const b = Math.floor(baseColor[2] * (1 - gradientIntensity) + accentColor[2] * gradientIntensity);
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fillRect(squareX, squareY, squareWidth, squareHeight);
        }
      }
    },
    [squareSize, gridGap, mousePosition],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    // Mouse move handler for hover effects
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: -1, y: -1 });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-auto"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export { FlickeringGrid }; 