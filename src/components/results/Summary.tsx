import { Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportSummary } from "@/lib/exportPdf";

interface SummaryProps {
  content: string;
}

export const Summary = ({ content }: SummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportSummary(content)}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Summary</span>
        </div>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
};
