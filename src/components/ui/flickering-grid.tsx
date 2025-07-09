"use client";

import React, {
  useCallback,
  useEffect,
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
  width,
  height,
  className,
  maxOpacity = 0.3, // Lower base opacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true); // Always true for debugging
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const ripplePos = useRef<{ x: number; y: number } | null>(null);
  const rippleStartTime = useRef<number | null>(null);

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
        if (Math.random() < flickerChance * deltaTime * 0.5) { // Reduced flicker rate for smoother effect
          squares[i] = Math.random() * maxOpacity * 0.8; // Slightly lower max opacity
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cols: number,
    rows: number,
    squares: Float32Array,
    dpr: number,
    now: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    // Water-like horizontal shift
    const shift = Math.sin(now * 0.0002) * 10; // Slowly oscillate left/right
    let rippleRadius = 0;
    let rippleAlpha = 0;
    if (ripplePos.current && rippleStartTime.current !== null) {
      rippleRadius = Math.min(800, (now - rippleStartTime.current) * 1.2);
      rippleAlpha = Math.max(0, 1 - (now - rippleStartTime.current) / 2000);
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Add shift for water effect
        const squareX = i * (squareSize + gridGap) * dpr + shift;
        const squareY = j * (squareSize + gridGap) * dpr;
        const squareWidth = squareSize * dpr;
        const squareHeight = squareSize * dpr;
        // Gentle flicker
        let opacity = 0.18 + 0.12 * Math.sin(now * 0.001 + i * 0.3 + j * 0.5);
        // Ripple effect
        if (ripplePos.current && rippleStartTime.current !== null) {
          const dx = ripplePos.current.x * dpr - (squareX + squareWidth / 2);
          const dy = ripplePos.current.y * dpr - (squareY + squareHeight / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveFront = Math.abs(dist - rippleRadius);
          if (waveFront < 60) {
            opacity = 0.9 * rippleAlpha * (1 - waveFront / 60) + opacity * (waveFront / 60);
            ctx.fillStyle = `rgba(80, 120, 255, ${opacity})`;
          } else {
            ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
          }
        } else {
          ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
        }
        ctx.fillRect(squareX, squareY, squareWidth, squareHeight);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      let newWidth = width || container.clientWidth;
      let newHeight = height || container.clientHeight;
      // Fallback to window size if container is 0
      if (!newWidth) newWidth = window.innerWidth;
      if (!newHeight) newHeight = window.innerHeight;
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
        time
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

    // Mouse move handler for ripple effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        ripplePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        rippleStartTime.current = performance.now();
      }
    };

    const handleMouseLeave = () => {
      ripplePos.current = null;
      rippleStartTime.current = null;
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
  }, [setupCanvas, updateSquares, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 min-h-screen min-w-full w-screen h-screen pointer-events-none ${className || ""}`}
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-auto"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          border: '2px solid red', // for debugging
          display: 'block',
        }}
      />
    </div>
  );
};

export { FlickeringGrid }; 