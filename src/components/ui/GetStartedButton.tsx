import React from "react";

export function GetStartedButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="animate-yellow-glow bg-white text-black px-6 py-3 rounded-lg font-medium border border-yellow-300"
      onClick={onClick}
    >
      Get Started
    </button>
  );
} 