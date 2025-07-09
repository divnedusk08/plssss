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
  const [ripple, setRipple] = useState<{ x: number; y: number; startTime: number } | null>(null);

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
      const now = performance.now();
      let rippleRadius = 0;
      let rippleAlpha = 0;
      if (ripple) {
        rippleRadius = Math.min(800, (now - ripple.startTime) * 1.2); // Expands faster and further
        rippleAlpha = Math.max(0, 1 - (now - ripple.startTime) / 2000); // Lasts 2 seconds
      }
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const squareX = i * (squareSize + gridGap) * dpr;
          const squareY = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;
          let opacity = squares[i * rows + j];

          // Ripple effect
          if (ripple) {
            const dx = ripple.x * dpr - (squareX + squareWidth / 2);
            const dy = ripple.y * dpr - (squareY + squareHeight / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const waveFront = Math.abs(dist - rippleRadius);
            if (waveFront < 60) { // Wider wavefront
              // Animate opacity and color as the wave passes
              opacity = 0.9 * rippleAlpha * (1 - waveFront / 60) + opacity * (waveFront / 60);
              ctx.fillStyle = `rgba(80, 120, 255, ${opacity})`; // Strong blue ripple
            } else {
              ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`; // Normal grid
            }
          } else {
            ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`; // Normal grid
          }
          ctx.fillRect(squareX, squareY, squareWidth, squareHeight);
        }
      }
    }, [squareSize, gridGap, ripple]);

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
      const rect = canvas.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startTime: performance.now(),
      });
    };

    const handleMouseLeave = () => {
      setRipple(null);
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