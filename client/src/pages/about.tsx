import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  FileText, 
  Presentation, 
  BookOpen, 
  GraduationCap,
  Zap,
  Shield,
  Globe,
  ExternalLink,
  Upload,
  Cloud,
  Bot,
  FolderOpen,
  Eye,
  Smartphone
} from "lucide-react";
import { SiGithub, SiYoutube, SiTiktok } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

export default function About() {
  const documentTypes = [
    {
      icon: FileText,
      title: "Technical Reports",
      description: "Generate comprehensive BET-standard technical reports with proper structure, citations, and formatting.",
      exports: "HTML, Word (.docx), PDF"
    },
    {
      icon: Presentation,
      title: "PowerPoint Presentations",
      description: "Create professional slide decks with speaker notes, visual prompts, and TTS coaching support.",
      exports: "HTML, PowerPoint (.pptx), PDF"
    },
    {
      icon: BookOpen,
      title: "Conference Papers",
      description: "Produce IEEE-formatted conference papers with two-column layout and academic citations.",
      exports: "HTML (IEEE), Word (.docx), PDF"
    },
    {
      icon: GraduationCap,
      title: "Thesis & Dissertations",
      description: "Generate Harvard-style thesis documents with front matter, chapters, and bibliography.",
      exports: "HTML (Harvard), Word (.docx), PDF"
    }
  ];

  const platformFeatures = [
    {
      icon: Upload,
      title: "File Upload Support",
      description: "Upload PDF, DOCX, TXT files or images to extract content and use as context for generation."
    },
    {
      icon: Cloud,
      title: "Cloud Save",
      description: "Save your projects to Firebase cloud storage and access them from anywhere."
    },
    {
      icon: Bot,
      title: "AI Chatbot Assistant",
      description: "Get help navigating the platform with our built-in AI chatbot powered by Gemini."
    },
    {
      icon: FolderOpen,
      title: "Project Management",
      description: "Organize and manage all your generated documents in one place with the Projects page."
    },
    {
      icon: Eye,
      title: "Real-time Preview",
      description: "See your document being generated in real-time with live preview as content is created."
    },
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description: "Works seamlessly on all devices from mobile phones (320px) to ultra-wide monitors."
    }
  ];

  const capabilities = [
    { icon: Zap, text: "AI-Powered Content Generation" },
    { icon: Shield, text: "Multiple Citation Styles (IEEE, Harvard)" },
    { icon: Globe, text: "Multi-Format Export (HTML, DOCX, PPTX, PDF)" },
    { icon: Upload, text: "File Upload Processing" },
    { icon: Cloud, text: "Firebase Cloud Storage" },
    { icon: Bot, text: "AI Chatbot Assistant" },
  ];

  return (
    <div className="container max-w-4xl py-8 px-4" data-testid="page-about">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">About PaperGen AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A unified platform for generating professional academic documents using advanced AI technology. 
            Create technical reports, presentations, conference papers, and thesis documents with ease.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {capabilities.map((cap, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
              <cap.icon className="h-3.5 w-3.5" />
              {cap.text}
            </Badge>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Generators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {documentTypes.map((doc, index) => (
                <div key={index} className="p-4 border rounded-lg hover-elevate" data-testid={`card-doctype-${index}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <doc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">{doc.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                  <p className="text-xs text-muted-foreground"><span className="font-medium">Exports:</span> {doc.exports}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg hover-elevate" data-testid={`card-feature-${index}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">AI & Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Google Gemini 2.5 Flash</li>
                  <li>Pixabay API for images</li>
                  <li>KaTeX for LaTeX rendering</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Export Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>HTML (IEEE/Harvard styles)</li>
                  <li>Microsoft Word (DOCX)</li>
                  <li>PowerPoint (PPTX)</li>
                  <li>PDF Document</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend & Storage</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Firebase Authentication</li>
                  <li>Firebase Firestore</li>
                  <li>Express.js API</li>
                  <li>React + TypeScript</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About the Author</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              HNK is a Computer Engineer based in Cape Town, South Africa, with a versatile skill set spanning software development, scientific computing, network infrastructure and electronics and embedded systems.
            </p>
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Button variant="outline" asChild data-testid="link-github-repo">
                <a 
                  href="https://github.com/HorizonHnk/Academic-Document-Generator" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <SiGithub className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" asChild data-testid="link-twitter">
                <a 
                  href="https://twitter.com/HnkHorizon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FaXTwitter className="h-4 w-4" />
                  @HnkHorizon
                </a>
              </Button>
              <Button variant="outline" asChild data-testid="link-youtube">
                <a 
                  href="https://youtube.com/@HNK2005" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <SiYoutube className="h-4 w-4" />
                  @HNK2005
                </a>
              </Button>
              <Button variant="outline" asChild data-testid="link-tiktok">
                <a 
                  href="https://tiktok.com/@codingfever" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <SiTiktok className="h-4 w-4" />
                  @codingfever
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by Google Gemini AI</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
