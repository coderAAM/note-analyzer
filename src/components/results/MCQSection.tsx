import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface MCQSectionProps {
  mcqs: MCQ[];
}

export const MCQSection = ({ mcqs }: MCQSectionProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (!showAnswers) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: optionIndex,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnswers(!showAnswers)}
          className="gap-2"
        >
          {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Button>
      </div>

      {mcqs.map((mcq, qIndex) => (
        <div
          key={qIndex}
          className="bg-background/50 rounded-xl p-5 border border-border/30 animate-scale-in"
          style={{ animationDelay: `${qIndex * 0.05}s` }}
        >
          <p className="font-medium text-foreground mb-4">
            <span className="text-primary font-semibold">Q{qIndex + 1}.</span> {mcq.question}
          </p>

          <div className="grid gap-2">
            {mcq.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[qIndex] === oIndex;
              const isCorrect = mcq.correctAnswer === oIndex;
              const showResult = showAnswers && isSelected;

              return (
                <button
                  key={oIndex}
                  onClick={() => handleSelect(qIndex, oIndex)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    isSelected && !showAnswers && "border-primary bg-primary/5",
                    !isSelected && "border-border/50 hover:border-primary/30 hover:bg-muted/30",
                    showAnswers && isCorrect && "border-success bg-success/10",
                    showResult && !isCorrect && "border-destructive bg-destructive/10"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                      isSelected && !showAnswers && "bg-primary text-primary-foreground",
                      !isSelected && "bg-muted text-muted-foreground",
                      showAnswers && isCorrect && "bg-success text-success-foreground",
                      showResult && !isCorrect && "bg-destructive text-destructive-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + oIndex)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showAnswers && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {showResult && !isCorrect && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
