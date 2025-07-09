import React from 'react';
import { Squares } from "@/components/ui/squares-background";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

interface BackgroundToggleProps {
  currentBackground: 'squares' | 'flickering';
  onBackgroundChange: (background: 'squares' | 'flickering') => void;
}

export function BackgroundToggle({ currentBackground, onBackgroundChange }: BackgroundToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Background Animation:</label>
        <div className="flex gap-2">
          <button
            onClick={() => onBackgroundChange('squares')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentBackground === 'squares'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Squares
          </button>
          <button
            onClick={() => onBackgroundChange('flickering')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentBackground === 'flickering'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Flickering
          </button>
        </div>
      </div>
    </div>
  );
} 