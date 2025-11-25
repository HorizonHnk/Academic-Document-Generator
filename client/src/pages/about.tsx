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
  ExternalLink
} from "lucide-react";
import { SiGithub, SiYoutube, SiTiktok } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

export default function About() {
  const features = [
    {
      icon: FileText,
      title: "Technical Reports",
      description: "Generate comprehensive BET-standard technical reports with proper structure, citations, and formatting."
    },
    {
      icon: Presentation,
      title: "PowerPoint Presentations",
      description: "Create professional slide decks with speaker notes, visual prompts, and export to PPTX format."
    },
    {
      icon: BookOpen,
      title: "Conference Papers",
      description: "Produce IEEE-formatted conference papers with proper academic structure and citations."
    },
    {
      icon: GraduationCap,
      title: "Thesis & Dissertations",
      description: "Generate Harvard-style thesis documents with comprehensive chapters and bibliography."
    }
  ];

  const capabilities = [
    { icon: Zap, text: "AI-Powered Content Generation" },
    { icon: Shield, text: "Multiple Citation Styles" },
    { icon: Globe, text: "Multi-Format Export" },
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

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">AI & Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Google Gemini 2.5 Flash for content</li>
                  <li>Pixabay API for images</li>
                  <li>KaTeX for LaTeX rendering</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Export Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Microsoft Word (DOCX)</li>
                  <li>PowerPoint (PPTX)</li>
                  <li>PDF Document</li>
                  <li>HTML Preview</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer & Source Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
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
            <p className="text-sm text-muted-foreground">
              Built with passion for helping students and researchers create professional academic documents efficiently.
            </p>
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
