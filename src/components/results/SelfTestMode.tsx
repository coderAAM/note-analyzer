import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisData } from "../AnalysisResults";
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Trophy,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SelfTestModeProps {
  data: AnalysisData;
}

type Question = {
  type: "mcq" | "short" | "viva";
  question: string;
  options?: string[];
  correctAnswer?: number;
  answer?: string;
};

export const SelfTestMode = ({ data }: SelfTestModeProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  // Combine all questions for the test
  const allQuestions: Question[] = [
    ...data.mcqs.map((mcq) => ({
      type: "mcq" as const,
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
    })),
    ...data.shortQuestions.slice(0, 3).map((sq) => ({
      type: "short" as const,
      question: sq.question,
      answer: sq.answer,
    })),
    ...data.vivaQuestions.slice(0, 2).map((vq) => ({
      type: "viva" as const,
      question: vq.question,
      answer: vq.answer,
    })),
  ];

  const currentQuestion = allQuestions[currentIndex];

  const handleStart = () => {
    setIsStarted(true);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setIsComplete(false);
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
    
    let isCorrect = false;
    if (currentQuestion.type === "mcq") {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    } else {
      // For short/viva, mark as attempted (self-check)
      isCorrect = userAnswer.trim().length > 0;
    }

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setUserAnswer("");
    setSelectedOption(null);
    setShowFeedback(false);
    setScore({ correct: 0, total: 0 });
    setIsComplete(false);
  };

  if (!isStarted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center">
          <Target className="w-10 h-10 text-accent" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
          Self Test Mode
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Test yourself with {allQuestions.length} questions generated from your notes. 
          Get instant feedback and track your progress.
        </p>
        <Button onClick={handleStart} variant="hero" size="lg" className="gap-2">
          <Play className="w-5 h-5" />
          Start Test
        </Button>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-success/20 to-success/30 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-success" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
          Test Complete!
        </h3>
        <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
        <p className="text-muted-foreground mb-8">
          You answered {score.correct} out of {score.total} questions correctly
        </p>
        <Button onClick={handleRestart} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-5 h-5" />
          Take Test Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} of {allQuestions.length}
        </span>
        <span className="font-medium text-primary">
          Score: {score.correct}/{score.total}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-background/50 rounded-xl p-6 border border-border/30">
        <span className={cn(
          "inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-4",
          currentQuestion.type === "mcq" && "bg-primary/10 text-primary",
          currentQuestion.type === "short" && "bg-accent/10 text-accent",
          currentQuestion.type === "viva" && "bg-success/10 text-success"
        )}>
          {currentQuestion.type === "mcq" ? "Multiple Choice" : 
           currentQuestion.type === "short" ? "Short Answer" : "Viva Question"}
        </span>
        
        <p className="text-lg font-medium text-foreground mb-6">
          {currentQuestion.question}
        </p>

        {currentQuestion.type === "mcq" && currentQuestion.options ? (
          <div className="grid gap-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = currentQuestion.correctAnswer === index;
              
              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && setSelectedOption(index)}
                  disabled={showFeedback}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    !showFeedback && isSelected && "border-primary bg-primary/5",
                    !showFeedback && !isSelected && "border-border/50 hover:border-primary/30",
                    showFeedback && isCorrect && "border-success bg-success/10",
                    showFeedback && isSelected && !isCorrect && "border-destructive bg-destructive/10"
                  )}
                >
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                    !showFeedback && isSelected && "bg-primary text-primary-foreground",
                    !showFeedback && !isSelected && "bg-muted text-muted-foreground",
                    showFeedback && isCorrect && "bg-success text-success-foreground",
                    showFeedback && isSelected && !isCorrect && "bg-destructive text-destructive-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                  {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                </button>
              );
            })}
          </div>
        ) : (
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={showFeedback}
            className="min-h-[120px]"
          />
        )}

        {showFeedback && currentQuestion.type !== "mcq" && currentQuestion.answer && (
          <div className="mt-4 bg-success/5 rounded-lg p-4 border border-success/20">
            <p className="text-sm font-medium text-success mb-2">Suggested Answer:</p>
            <p className="text-foreground text-sm">{currentQuestion.answer}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showFeedback ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={currentQuestion.type === "mcq" ? selectedOption === null : !userAnswer.trim()}
            variant="default"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} variant="hero" className="gap-2">
            {currentIndex < allQuestions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Finish Test"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
