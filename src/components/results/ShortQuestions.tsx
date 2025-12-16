import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortQuestion {
  question: string;
  answer: string;
}

interface ShortQuestionsProps {
  questions: ShortQuestion[];
}

export const ShortQuestions = ({ questions }: ShortQuestionsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-background/50 rounded-xl border border-border/30 overflow-hidden animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <p className="font-medium text-foreground pr-4">
              <span className="text-primary font-semibold">Q{index + 1}.</span> {q.question}
            </p>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground shrink-0 transition-transform",
                expandedIndex === index && "rotate-180"
              )}
            />
          </button>
          
          {expandedIndex === index && (
            <div className="px-4 pb-4 pt-0">
              <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                <p className="text-sm font-medium text-primary mb-1">Answer:</p>
                <p className="text-foreground leading-relaxed">{q.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
