import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResults, AnalysisData } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface SharedSession {
  title: string;
  notes: string;
  summary: string;
  important_points: string[];
  mcqs: AnalysisData["mcqs"];
  short_questions: AnalysisData["shortQuestions"];
  long_questions: AnalysisData["longQuestions"];
  viva_questions: AnalysisData["vivaQuestions"];
}

const SharedSession = () => {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<SharedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedSession = async () => {
      if (!token) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("study_sessions")
          .select("title, notes, summary, important_points, mcqs, short_questions, long_questions, viva_questions")
          .eq("share_token", token)
          .single();

        if (fetchError || !data) {
          setError("Session not found or link expired");
          return;
        }

        setSession({
          title: data.title,
          notes: data.notes,
          summary: data.summary,
          important_points: data.important_points as string[],
          mcqs: data.mcqs as AnalysisData["mcqs"],
          short_questions: data.short_questions as AnalysisData["shortQuestions"],
          long_questions: data.long_questions as AnalysisData["longQuestions"],
          viva_questions: data.viva_questions as AnalysisData["vivaQuestions"],
        });
      } catch (err) {
        console.error("Error fetching shared session:", err);
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedSession();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "Session not found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              This shared session may have been removed or the link is invalid.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const analysisData: AnalysisData = {
    importantPoints: session.important_points,
    summary: session.summary,
    mcqs: session.mcqs,
    shortQuestions: session.short_questions,
    longQuestions: session.long_questions,
    vivaQuestions: session.viva_questions,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {session.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Shared study session
          </p>
        </div>

        <AnalysisResults data={analysisData} />
      </main>
    </div>
  );
};

export default SharedSession;
