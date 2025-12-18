import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisData } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";

export interface StudySession {
  id: string;
  title: string;
  notes: string;
  important_points: string[];
  summary: string;
  mcqs: AnalysisData["mcqs"];
  short_questions: AnalysisData["shortQuestions"];
  long_questions: AnalysisData["longQuestions"];
  viva_questions: AnalysisData["vivaQuestions"];
  created_at: string;
  updated_at: string;
  share_token?: string | null;
}

export const useStudySessions = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSessions: StudySession[] = (data || []).map((session: any) => ({
        id: session.id,
        title: session.title,
        notes: session.notes,
        important_points: session.important_points as string[],
        summary: session.summary,
        mcqs: session.mcqs as AnalysisData["mcqs"],
        short_questions: session.short_questions as AnalysisData["shortQuestions"],
        long_questions: session.long_questions as AnalysisData["longQuestions"],
        viva_questions: session.viva_questions as AnalysisData["vivaQuestions"],
        created_at: session.created_at,
        updated_at: session.updated_at,
        share_token: session.share_token,
      }));

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "Could not load your saved sessions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (
    title: string,
    notes: string,
    analysisData: AnalysisData
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your study sessions.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          title,
          notes,
          important_points: analysisData.importantPoints,
          summary: analysisData.summary,
          mcqs: analysisData.mcqs,
          short_questions: analysisData.shortQuestions,
          long_questions: analysisData.longQuestions,
          viva_questions: analysisData.vivaQuestions,
        });

      if (error) throw error;

      toast({
        title: "Session saved!",
        description: "Your study session has been saved successfully.",
      });

      fetchSessions();
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Save failed",
        description: "Could not save your study session.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session deleted",
        description: "Your study session has been removed.",
      });

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete your study session.",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateShareLink = async (sessionId: string): Promise<string | null> => {
    try {
      // Check if session already has a share token
      const session = sessions.find((s) => s.id === sessionId);
      if (session?.share_token) {
        return `${window.location.origin}/share/${session.share_token}`;
      }

      // Generate new share token
      const shareToken = crypto.randomUUID();
      const { error } = await supabase
        .from("study_sessions")
        .update({ share_token: shareToken })
        .eq("id", sessionId);

      if (error) throw error;

      // Update local state
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, share_token: shareToken } : s
        )
      );

      return `${window.location.origin}/share/${shareToken}`;
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Share failed",
        description: "Could not generate share link.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    saveSession,
    deleteSession,
    generateShareLink,
    refetch: fetchSessions,
  };
};
