import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Sparkles, FileText, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotesInputProps {
  onAnalyze: (notes: string) => void;
  isLoading: boolean;
  initialNotes?: string;
}

export const NotesInput = ({ onAnalyze, isLoading, initialNotes = "" }: NotesInputProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (notes.trim()) {
      onAnalyze(notes);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const isAllowed = allowedTypes.includes(file.type) || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.pdf') || 
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc');

    if (!isAllowed) {
      toast({
        title: "Unsupported file type",
        description: "Please upload TXT, PDF, or DOCX files.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-text`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text');
      }

      setNotes(data.text);
      toast({
        title: "File processed!",
        description: `Extracted ${data.text.length} characters from ${file.name}`,
      });
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Could not extract text from file.",
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setNotes("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Your Study Notes
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste notes or upload a file
            </p>
          </div>
        </div>

        {/* File upload button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting || isLoading}
            className="gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Show uploaded file info */}
      {uploadedFile && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground flex-1 truncate">
            {uploadedFile.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={clearFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your study notes here... 

Example:
Photosynthesis is the process by which plants convert sunlight into energy. It occurs in the chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle...

Or click 'Upload File' to upload a TXT, PDF, or DOCX file."
        className="min-h-[280px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-base leading-relaxed placeholder:text-muted-foreground/60"
      />

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{notes.length} characters</span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!notes.trim() || isLoading || isExtracting}
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
