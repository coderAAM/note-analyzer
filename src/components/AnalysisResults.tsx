import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportantPoints } from "./results/ImportantPoints";
import { Summary } from "./results/Summary";
import { DetailedNotes } from "./results/DetailedNotes";
import { GraphSection } from "./results/GraphSection";
import { MCQSection } from "./results/MCQSection";
import { ShortQuestions } from "./results/ShortQuestions";
import { LongQuestions } from "./results/LongQuestions";
import { VivaQuestions } from "./results/VivaQuestions";
import { SelfTestMode } from "./results/SelfTestMode";
import { 
  Lightbulb, 
  FileText, 
  ListChecks, 
  MessageSquare, 
  BookOpen, 
  Mic, 
  GraduationCap,
  NotebookPen,
  BarChart3
} from "lucide-react";

export interface AnalysisData {
  importantPoints: string[];
  summary: string;
  detailedNotes?: {
    heading: string;
    content: string;
    keyPoints?: string[];
  }[];
  graphs?: {
    title: string;
    type: "bar" | "line" | "pie" | "area" | "comparison";
    data: { name: string; value: number; category?: string }[];
    description?: string;
  }[];
  mcqs: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  shortQuestions: {
    question: string;
    answer: string;
  }[];
  longQuestions: {
    question: string;
    answer: string;
  }[];
  vivaQuestions: {
    question: string;
    answer: string;
  }[];
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up stagger-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-success/10">
          <GraduationCap className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Analysis Complete
          </h2>
          <p className="text-sm text-muted-foreground">
            Your personalized study materials are ready
          </p>
        </div>
      </div>

      <Tabs defaultValue="points" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-6">
          <TabsTrigger value="points" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Key Points</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="detailed" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <NotebookPen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Detailed</span>
          </TabsTrigger>
          <TabsTrigger value="graphs" className="gap-1.5 data-[state=active]:bg-success data-[state=active]:text-success-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Graphs</span>
          </TabsTrigger>
          <TabsTrigger value="mcqs" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <ListChecks className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MCQs</span>
          </TabsTrigger>
          <TabsTrigger value="short" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Short</span>
          </TabsTrigger>
          <TabsTrigger value="long" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Long</span>
          </TabsTrigger>
          <TabsTrigger value="viva" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viva</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Self Test</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-0">
          <ImportantPoints points={data.importantPoints} />
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <Summary content={data.summary} />
        </TabsContent>

        <TabsContent value="detailed" className="mt-0">
          <DetailedNotes notes={data.detailedNotes || []} />
        </TabsContent>

        <TabsContent value="graphs" className="mt-0">
          <GraphSection graphs={data.graphs || []} />
        </TabsContent>

        <TabsContent value="mcqs" className="mt-0">
          <MCQSection mcqs={data.mcqs} />
        </TabsContent>

        <TabsContent value="short" className="mt-0">
          <ShortQuestions questions={data.shortQuestions} />
        </TabsContent>

        <TabsContent value="long" className="mt-0">
          <LongQuestions questions={data.longQuestions} />
        </TabsContent>

        <TabsContent value="viva" className="mt-0">
          <VivaQuestions questions={data.vivaQuestions} />
        </TabsContent>

        <TabsContent value="test" className="mt-0">
          <SelfTestMode data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
