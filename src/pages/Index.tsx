import { useState } from "react";
import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { AnalysisResults, AnalysisData } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";

// Mock analysis function - will be replaced with AI integration
const mockAnalyzeNotes = (notes: string): Promise<AnalysisData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        importantPoints: [
          "The main concept discussed revolves around the core subject matter from your notes.",
          "Key terminology and definitions have been identified for exam preparation.",
          "Important relationships and connections between concepts are highlighted.",
          "Critical formulas or procedures mentioned in the notes are noted.",
          "Exam-relevant facts and figures have been extracted for quick revision.",
        ],
        summary: "This comprehensive summary captures the essence of your study notes. The material covers fundamental concepts that are essential for understanding the subject. The key ideas interconnect to form a cohesive understanding of the topic, making it easier to recall during examinations. Focus on understanding the relationships between concepts rather than memorizing isolated facts.",
        mcqs: [
          {
            question: "Based on your notes, which statement best describes the main concept?",
            options: [
              "Option A describes a secondary concept",
              "Option B correctly identifies the main concept",
              "Option C is a common misconception",
              "Option D is partially correct but incomplete"
            ],
            correctAnswer: 1
          },
          {
            question: "What is the primary relationship between the key concepts?",
            options: [
              "They are independent of each other",
              "They have a cause-and-effect relationship",
              "They are synonymous terms",
              "They are contrasting ideas"
            ],
            correctAnswer: 1
          },
          {
            question: "Which term is most accurately defined in the notes?",
            options: [
              "Term A with its scientific definition",
              "Term B with its historical context",
              "Term C with its practical application",
              "Term D with its theoretical framework"
            ],
            correctAnswer: 0
          },
          {
            question: "According to your notes, what is the significance of the main topic?",
            options: [
              "It has limited practical applications",
              "It forms the foundation for advanced concepts",
              "It is primarily of historical interest",
              "It contradicts established theories"
            ],
            correctAnswer: 1
          },
          {
            question: "What conclusion can be drawn from the information provided?",
            options: [
              "The topic requires further research",
              "The concepts are well-established and verified",
              "The information is speculative",
              "The data is inconclusive"
            ],
            correctAnswer: 1
          }
        ],
        shortQuestions: [
          {
            question: "Define the main concept discussed in your notes and explain its significance.",
            answer: "The main concept refers to the central theme of your study material. Its significance lies in forming the foundational understanding necessary for grasping more complex related topics."
          },
          {
            question: "List three key characteristics of the subject matter.",
            answer: "1) It has fundamental importance in the field, 2) It connects multiple related concepts, 3) It has practical applications in real-world scenarios."
          },
          {
            question: "Explain the relationship between two major concepts from your notes.",
            answer: "The concepts share a complementary relationship where one builds upon the other, creating a logical progression of understanding from basic to advanced levels."
          },
          {
            question: "What are the key terms that need to be memorized for this topic?",
            answer: "Key terms include the primary definitions, associated vocabulary, and technical terminology specific to this subject area as mentioned in your notes."
          },
          {
            question: "Summarize the practical application of this knowledge.",
            answer: "The practical application involves using this theoretical knowledge to solve real-world problems, make informed decisions, and understand related phenomena."
          }
        ],
        longQuestions: [
          {
            question: "Provide a detailed explanation of the main topic from your notes, including its historical development, current understanding, and future implications.",
            answer: "The main topic has evolved significantly over time. Initially, it was understood in basic terms, but through extensive research and discovery, our understanding has deepened. Currently, this knowledge forms a crucial part of the field, with implications for both theoretical advancement and practical applications. The future holds promise for further developments as new research continues to expand our understanding."
          },
          {
            question: "Compare and contrast the different perspectives or approaches mentioned in your study material.",
            answer: "The study material presents multiple perspectives on the topic. While some approaches emphasize theoretical foundations, others focus on practical applications. The comparison reveals that each perspective contributes unique insights, and a comprehensive understanding requires integrating these various viewpoints. The contrasts highlight the complexity and multifaceted nature of the subject."
          },
          {
            question: "Analyze the significance of the key concepts and their interconnections within the broader context of the subject.",
            answer: "The key concepts form an interconnected web of knowledge that builds upon fundamental principles. Each concept contributes to the overall understanding while also supporting related ideas. The significance lies in recognizing these connections, as they enable deeper comprehension and more effective application of the knowledge in various contexts."
          }
        ],
        vivaQuestions: [
          {
            question: "Can you briefly explain the main concept in your own words?",
            answer: "The main concept is essentially about understanding the core principles and how they relate to the broader subject matter."
          },
          {
            question: "What would you consider the most important point from this topic?",
            answer: "The most important point is the foundational understanding that enables comprehension of all related concepts."
          },
          {
            question: "How would you apply this knowledge in a practical situation?",
            answer: "This knowledge can be applied by using the learned principles to analyze situations, make decisions, and solve related problems."
          },
          {
            question: "What connections can you draw between this topic and related subjects?",
            answer: "This topic connects with related subjects through shared principles, complementary concepts, and overlapping applications."
          },
          {
            question: "If asked to teach this to someone else, what would be your starting point?",
            answer: "The starting point would be establishing the fundamental definitions and gradually building up to more complex ideas and relationships."
          }
        ]
      });
    }, 2000);
  });
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (notes: string) => {
    setIsLoading(true);
    try {
      const data = await mockAnalyzeNotes(notes);
      setAnalysisData(data);
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your study materials have been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try again.",
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
