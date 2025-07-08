"use client";
import { Button } from "@/components/ui/moving-border";

export function MovingBorderExample() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Moving Border Examples</h2>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {/* Basic example */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Basic Button</h3>
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            Borders are cool
          </Button>
        </div>

        {/* Custom duration */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Fast Animation</h3>
          <Button
            borderRadius="1.75rem"
            duration={1000}
            className="bg-blue-500 text-white border-blue-400"
          >
            Fast Border
          </Button>
        </div>

        {/* Custom border radius */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Rounded Button</h3>
          <Button
            borderRadius="0.5rem"
            className="bg-green-500 text-white border-green-400"
          >
            Rounded
          </Button>
        </div>

        {/* As different element */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">As Link</h3>
          <Button
            as="a"
            href="#"
            borderRadius="1.75rem"
            className="bg-purple-500 text-white border-purple-400"
          >
            Link Button
          </Button>
        </div>

        {/* Interactive */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Interactive</h3>
          <Button
            borderRadius="1.75rem"
            onClick={() => alert('Moving border clicked!')}
            className="bg-red-500 text-white border-red-400 hover:scale-105 transition-transform"
          >
            Click Me!
          </Button>
        </div>

        {/* Custom border color */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Custom Border</h3>
          <Button
            borderRadius="1.75rem"
            borderClassName="bg-[radial-gradient(var(--yellow-500)_40%,transparent_60%)]"
            className="bg-gray-800 text-white border-gray-700"
          >
            Yellow Border
          </Button>
        </div>
      </div>
    </div>
  );
} 