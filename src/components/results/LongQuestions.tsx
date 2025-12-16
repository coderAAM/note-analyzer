import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LongQuestion {
  question: string;
  answer: string;
}

interface LongQuestionsProps {
  questions: LongQuestion[];
}

export const LongQuestions = ({ questions }: LongQuestionsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-background/50 rounded-xl border border-border/30 overflow-hidden animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full flex items-start gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                <span className="text-accent font-semibold">Question {index + 1}:</span>
              </p>
              <p className="text-foreground mt-1">{q.question}</p>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground shrink-0 transition-transform mt-0.5",
                expandedIndex === index && "rotate-180"
              )}
            />
          </button>
          
          {expandedIndex === index && (
            <div className="px-5 pb-5 pt-0">
              <div className="bg-accent/5 rounded-xl p-5 border border-accent/20">
                <p className="text-sm font-medium text-accent mb-3">Detailed Answer:</p>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{q.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
