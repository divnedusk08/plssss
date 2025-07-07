import * as React from 'react';

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const StarBorder: React.FC<StarBorderProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`relative flex items-center justify-center border-2 border-yellow-400 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-yellow-100 via-white to-blue-100 text-primary-dark font-bold text-xl px-8 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${className}`}
    >
      <span className="absolute left-4 flex items-center">
        <svg
          className="w-7 h-7 text-yellow-400 animate-spin-slow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.91z" />
        </svg>
      </span>
      <span className="ml-8">{children}</span>
    </button>
  );
};

export default StarBorder; 