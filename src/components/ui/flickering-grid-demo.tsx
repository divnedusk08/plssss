import { FlickeringGrid } from "@/components/ui/flickering-grid";

export function FlickeringGridDemo() {
  return (
    <div className="relative h-[500px] rounded-lg w-full bg-background overflow-hidden border">
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="rgb(240, 240, 240)" // Much lighter grey
        maxOpacity={0.3}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
} 