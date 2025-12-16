import { BookOpen, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="text-center mb-10 md:mb-14 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        AI-Powered Study Assistant
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-glow">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
        Study<span className="gradient-text">Buddy</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Transform your notes into interactive study materials with AI-generated questions, 
        summaries, and self-test modes.
      </p>
    </header>
  );
};
