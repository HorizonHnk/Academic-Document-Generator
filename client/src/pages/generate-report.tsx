import { useState } from "react";
import { FileText, Sparkles, Upload, Settings, Download, Save, X, FileIcon, FileDown, FileCode, Printer, Cloud } from "lucide-react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useDocumentGenerator } from "@/hooks/use-document-generator";
import { useRandomTopic } from "@/hooks/use-random-topic";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import type { ToneType } from "@shared/schema";

export default function GenerateReport() {
  const [topic, setTopic] = useState("");
  const [targetLength, setTargetLength] = useState("auto");
  const [tone, setTone] = useState<ToneType>("academic");
  const [citationStyle, setCitationStyle] = useState("auto");
  const [generateImages, setGenerateImages] = useState(true);
  
  const { generate, isGenerating, generatedContent, progress } = useDocumentGenerator("report");
  const { generateTopic, isLoading: isLoadingTopic } = useRandomTopic();
  const { uploadedFiles, isProcessing, extractedText, handleFileUpload, removeFile } = useFileUpload();
  const { toast } = useToast();

  return (
    <GeneratorLayout
      title="Technical Report Generator"
      description="BET-standard reports with Gantt charts, budget tables, and LaTeX equations"
      icon={<FileText className="w-6 h-6 text-white" />}
      gradient="from-blue-500 to-cyan-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Configuration</CardTitle>
              <CardDescription>Define your report topic and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" data-testid="tab-text-input">Text Input</TabsTrigger>
                  <TabsTrigger value="upload" data-testid="tab-file-upload">File Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Report Topic</Label>
                    <Textarea
                      id="topic"
                      placeholder="Enter your technical report topic or abstract..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-32 mt-2"
                      data-testid="input-report-topic"
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      {topic.length} characters
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const randomResult = generateTopic();
                      setTopic(randomResult.topic);
                      toast({
                        title: randomResult.category,
                        description: `Topic: ${randomResult.topic}`,
                      });
                    }}
                    disabled={isLoadingTopic}
                    data-testid="button-surprise-me"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Surprise Me
                  </Button>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOCX, TXT, and images
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      multiple
                      accept=".pdf,.docx,.txt,image/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      data-testid="input-file-upload"
                    />
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files</Label>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="target-length">Target Length</Label>
                  <Select value={targetLength} onValueChange={setTargetLength}>
                    <SelectTrigger id="target-length" className="mt-2" data-testid="select-target-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (AI-determined)</SelectItem>
                      <SelectItem value="2-5">2-5 Pages</SelectItem>
                      <SelectItem value="6-10">6-10 Pages</SelectItem>
                      <SelectItem value="11-20">11-20 Pages</SelectItem>
                      <SelectItem value="20+">20+ Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Writing Tone</Label>
                  <Select value={tone} onValueChange={(val) => setTone(val as ToneType)}>
                    <SelectTrigger id="tone" className="mt-2" data-testid="select-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="generate-images">Generate Images</Label>
                  <Switch
                    id="generate-images"
                    checked={generateImages}
                    onCheckedChange={setGenerateImages}
                    data-testid="switch-generate-images"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!topic.trim() || isGenerating || isProcessing}
                onClick={() => {
                  const finalTopic = extractedText ? `${topic}\n\nAdditional Context:\n${extractedText}` : topic;
                  generate({
                    topic: finalTopic,
                    targetLength,
                    tone,
                    generateImages,
                  });
                }}
                data-testid="button-generate-report"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Citation Style</Label>
                <Select value={citationStyle} onValueChange={setCitationStyle}>
                  <SelectTrigger className="mt-2" data-testid="select-citation-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="ieee">IEEE</SelectItem>
                    <SelectItem value="harvard">Harvard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>Real-time preview of your generated report</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid="button-cloud-save">
                    <Cloud className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" data-testid="button-export-menu">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid="export-html">
                        <FileCode className="w-4 h-4 mr-2" />
                        Export as HTML
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="export-docx">
                        <FileDown className="w-4 h-4 mr-2" />
                        Export as Word (.docx)
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="export-pdf">
                        <Printer className="w-4 h-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="space-y-4 mb-6">
                  <Progress value={progress} className="w-full" />
                  <div className="text-sm text-muted-foreground text-center">
                    Generating content with AI...
                  </div>
                </div>
              )}
              
              <div className="border rounded-lg bg-muted/10 min-h-[600px] p-8 overflow-auto">
                {generatedContent ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <h1 className="text-center">{generatedContent.title}</h1>
                    {generatedContent.abstract && (
                      <div className="mb-6">
                        <h2>Abstract</h2>
                        <p>{generatedContent.abstract}</p>
                      </div>
                    )}
                    {generatedContent.sections?.map((section: any, index: number) => (
                      <div key={index} className="mb-6">
                        <h2>{section.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: section.content || "" }} />
                      </div>
                    ))}
                    {generatedContent.references && generatedContent.references.length > 0 && (
                      <div className="mt-8">
                        <h2>References</h2>
                        <ol className="list-decimal pl-6">
                          {generatedContent.references.map((ref: string, idx: number) => (
                            <li key={idx} className="mb-2">{ref}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Your generated report will appear here</p>
                    <p className="text-sm mt-2">Configure settings and click "Generate Report" to start</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GeneratorLayout>
  );
}
