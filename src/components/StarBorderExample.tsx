import { StarBorder } from "@/components/ui/star-border"

export function StarBorderExample() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">StarBorder Component Examples</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <StarBorder>
            Default Theme-aware Border
          </StarBorder>
        </div>
        
        <div className="text-center">
          <StarBorder color="#FBBF24" speed="4s">
            Custom Yellow Border (Faster)
          </StarBorder>
        </div>
        
        <div className="text-center">
          <StarBorder as="div" color="#60a5fa" speed="8s" className="cursor-pointer">
            Custom Blue Border (Slower) - As Div
          </StarBorder>
        </div>
        
        <div className="text-center">
          <StarBorder 
            color="#10b981" 
            speed="3s"
            onClick={() => alert('StarBorder clicked!')}
            className="hover:scale-105 transition-transform"
          >
            Interactive Green Border
          </StarBorder>
        </div>
      </div>
    </div>
  )
} 