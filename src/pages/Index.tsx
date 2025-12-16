import { useState } from "react";
import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { AnalysisResults, AnalysisData } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (notes: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-notes', {
        body: { notes }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Failed to analyze notes');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisData(data);
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your personalized study materials are ready.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
        <Header />
        
        <div className="space-y-8">
          <NotesInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {analysisData && <AnalysisResults data={analysisData} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>StudyBuddy — Your AI-powered study companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
