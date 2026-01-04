import { useState } from "react";
import { Mic, Eye, EyeOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportVivaQuestions } from "@/lib/exportPdf";

interface VivaQuestion {
  question: string;
  answer: string;
}

interface VivaQuestionsProps {
  questions: VivaQuestion[];
}

export const VivaQuestions = ({ questions }: VivaQuestionsProps) => {
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  const toggleAnswer = (index: number) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportVivaQuestions(questions)}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
      <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 mb-6">
        <div className="flex items-center gap-2 text-accent">
          <Mic className="w-4 h-4" />
          <span className="text-sm font-medium">Quick Revision Tips</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Practice answering these questions out loud for better retention
        </p>
      </div>

      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-background/50 rounded-xl p-5 border border-border/30 animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium text-foreground">
              <span className="text-primary font-semibold">V{index + 1}.</span> {q.question}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAnswer(index)}
              className="shrink-0 gap-1.5"
            >
              {visibleAnswers[index] ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Reveal
                </>
              )}
            </Button>
          </div>
          
          {visibleAnswers[index] && (
            <div className="mt-4 bg-muted/50 rounded-lg p-4">
              <p className="text-foreground leading-relaxed">{q.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
