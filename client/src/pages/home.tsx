import { Link } from "wouter";
import { FileText, Presentation, FileSpreadsheet, GraduationCap, Sparkles, Zap, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const documentTypes = [
  {
    id: "report",
    title: "Technical Report",
    description: "BET-standard reports with Gantt charts, budget tables, and LaTeX equations",
    icon: FileText,
    features: ["Gantt Charts", "Budget Tables", "LaTeX Support", "BET Standards"],
    gradient: "from-blue-500 to-cyan-500",
    href: "/generate/report",
  },
  {
    id: "powerpoint",
    title: "PowerPoint Presentation",
    description: "Professional slides with AI structuring, speaker notes, and TTS coaching",
    icon: Presentation,
    features: ["AI Slides", "Speaker Notes", "TTS Coaching", "6x6 Rule"],
    gradient: "from-orange-500 to-red-500",
    href: "/generate/powerpoint",
  },
  {
    id: "conference",
    title: "Conference Paper",
    description: "IEEE-formatted papers with proper citations and academic structure",
    icon: FileSpreadsheet,
    features: ["IEEE Format", "Citations", "Two-Column", "References"],
    gradient: "from-purple-500 to-pink-500",
    href: "/generate/conference",
  },
  {
    id: "thesis",
    title: "Thesis/Dissertation",
    description: "Complete thesis with front matter, Harvard citations, and chapters",
    icon: GraduationCap,
    features: ["Harvard Style", "Front Matter", "Chapters", "TOC"],
    gradient: "from-green-500 to-emerald-500",
    href: "/generate/thesis",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-7xl" data-testid="page-home">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Google Gemini 2.5 Flash</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Academic
            </span>
            <br />
            <span>Document Generator</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create professional reports, presentations, conference papers, and thesis documents in seconds.
            Powered by advanced AI with automatic formatting, citations, and images.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-my-projects">
                <Lock className="w-4 h-4" />
                My Projects
              </Button>
            </Link>
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" data-testid="button-get-started">
              <Zap className="w-4 h-4" />
              Get Started
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentTypes.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.id} href={doc.href}>
                <Card 
                  className="h-full hover-elevate transition-all duration-200 cursor-pointer border-card-border group"
                  data-testid={`card-document-${doc.id}`}
                >
                  <CardHeader className="space-y-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${doc.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{doc.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {doc.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {doc.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline" data-testid={`button-generate-${doc.id}`}>
                      Generate {doc.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Document Types</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">66+</div>
            <div className="text-sm text-muted-foreground">Topic Templates</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Export Formats</div>
          </div>
        </div>
      </div>
    </div>
  );
}
