import { Sparkles } from "lucide-react";

interface SummaryProps {
  content: string;
}

export const Summary = ({ content }: SummaryProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">AI Summary</span>
      </div>
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};
