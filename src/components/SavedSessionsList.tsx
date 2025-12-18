import { useState } from "react";
import { StudySession } from "@/hooks/useStudySessions";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, FileText, ChevronRight, Share2, Check, Link } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SavedSessionsListProps {
  sessions: StudySession[];
  loading: boolean;
  onLoad: (session: StudySession) => void;
  onDelete: (sessionId: string) => void;
  onShare: (sessionId: string) => Promise<string | null>;
}

export const SavedSessionsList = ({
  sessions,
  loading,
  onLoad,
  onDelete,
  onShare,
}: SavedSessionsListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const link = await onShare(sessionId);
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopiedId(sessionId);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-muted/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-muted-foreground">No saved sessions yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Analyze your notes and save them for later review
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <div
          key={session.id}
          className={cn(
            "group bg-background/50 rounded-xl border border-border/30 p-4 hover:border-primary/30 transition-all animate-scale-in",
          )}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={() => onLoad(session)}
              className="flex-1 text-left hover:opacity-80 transition-opacity"
            >
              <h4 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {session.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(session.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-border">•</span>
                <span>{session.mcqs.length} MCQs</span>
              </div>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={(e) => handleShare(e, session.id)}
                title="Share session"
              >
                {copiedId === session.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
