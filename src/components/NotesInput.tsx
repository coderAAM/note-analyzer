import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Sparkles, FileText } from "lucide-react";

interface NotesInputProps {
  onAnalyze: (notes: string) => void;
  isLoading: boolean;
}

export const NotesInput = ({ onAnalyze, isLoading }: NotesInputProps) => {
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (notes.trim()) {
      onAnalyze(notes);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Your Study Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste your notes below to get started
          </p>
        </div>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your study notes here... 

Example:
Photosynthesis is the process by which plants convert sunlight into energy. It occurs in the chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle..."
        className="min-h-[280px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-base leading-relaxed placeholder:text-muted-foreground/60"
      />

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{notes.length} characters</span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!notes.trim() || isLoading}
          variant="hero"
          size="lg"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Notes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
