import * as React from "react";

export interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const StarBorder = React.forwardRef<HTMLButtonElement, StarBorderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={
          `relative px-8 py-4 rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-primary via-primary-dark to-blue-200 text-white font-bold text-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ` +
          (className || "")
        }
        {...props}
      >
        <span className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none animate-star-border-glow" />
        <span className="relative z-10 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-yellow-400 animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.91z"
            />
          </svg>
          {children}
        </span>
      </button>
    );
  }
);
StarBorder.displayName = "StarBorder"; 