import * as React from 'react';

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`relative px-8 py-4 rounded-lg font-bold text-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(90deg, #2563EB 0%, #1e3a8a 100%)',
        color: '#fff',
        boxShadow: '0 4px 24px 0 rgba(37,99,235,0.15)',
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        <svg
          className="animate-spin-slow"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L13.09 8.26L19 8.27L14.18 12.14L15.64 18.02L12 14.77L8.36 18.02L9.82 12.14L5 8.27L10.91 8.26L12 2Z"
            stroke="#FBBF24"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        {children}
      </span>
      <span className="absolute inset-0 border-2 border-accent rounded-lg pointer-events-none animate-border-glow" />
    </button>
  );
};

export default StarBorder; 