import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportImportantPoints } from "@/lib/exportPdf";

interface ImportantPointsProps {
  points: string[];
}

export const ImportantPoints = ({ points }: ImportantPointsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportImportantPoints(points)}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
      <div className="space-y-3">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex gap-3 p-4 bg-background/50 rounded-xl border border-border/30 hover:border-primary/30 transition-colors animate-scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
