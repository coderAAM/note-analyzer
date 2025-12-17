import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { AnalysisResults, AnalysisData } from "@/components/AnalysisResults";
import { SavedSessionsList } from "@/components/SavedSessionsList";
import { SaveSessionDialog } from "@/components/SaveSessionDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useStudySessions, StudySession } from "@/hooks/useStudySessions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  History, 
  LogIn, 
  LogOut, 
  User,
  ChevronUp,
  Info
} from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading, saveSession, deleteSession } = useStudySessions();

  const handleAnalyze = async (notes: string) => {
    setIsLoading(true);
    setCurrentNotes(notes);
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

  const handleSave = async (title: string) => {
    if (!analysisData) return;
    
    setIsSaving(true);
    const success = await saveSession(title, currentNotes, analysisData);
    setIsSaving(false);
    
    if (success) {
      setShowSaveDialog(false);
    }
  };

  const handleLoadSession = (session: StudySession) => {
    setAnalysisData({
      importantPoints: session.important_points,
      summary: session.summary,
      mcqs: session.mcqs,
      shortQuestions: session.short_questions,
      longQuestions: session.long_questions,
      vivaQuestions: session.viva_questions,
    });
    setCurrentNotes(session.notes);
    setShowSavedSessions(false);
    
    toast({
      title: "Session loaded",
      description: `"${session.title}" has been loaded.`,
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
  };

  const handleSignOut = async () => {
    await signOut();
    setAnalysisData(null);
    setCurrentNotes("");
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const handleSaveClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your study sessions.",
      });
      navigate("/auth");
      return;
    }
    setShowSaveDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* User bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {user ? (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {user.email}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Sign in to save sessions
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedSessions(!showSavedSessions)}
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">My Sessions</span>
                  {sessions.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5">
                      {sessions.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Header />

        {/* Saved sessions panel */}
        {user && showSavedSessions && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Saved Sessions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedSessions(false)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
            <SavedSessionsList
              sessions={sessions}
              loading={sessionsLoading}
              onLoad={handleLoadSession}
              onDelete={handleDeleteSession}
            />
          </div>
        )}
        
        <div className="space-y-8">
          <NotesInput 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            initialNotes={currentNotes}
          />
          
          {analysisData && (
            <>
              {/* Save button - always visible */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleSaveClick}
                  variant="outline"
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {user ? "Save Session" : "Sign in to Save"}
                </Button>
              </div>
              
              <AnalysisResults data={analysisData} />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>StudyBuddy — Your AI-powered study companion</p>
        </div>
      </footer>

      {/* Save dialog */}
      <SaveSessionDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Index;
