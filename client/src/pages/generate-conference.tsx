import { useState } from "react";
import { FileSpreadsheet, Sparkles, Upload, Download, Save, X, FileIcon } from "lucide-react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useDocumentGenerator } from "@/hooks/use-document-generator";
import { useRandomTopic } from "@/hooks/use-random-topic";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import type { ToneType } from "@shared/schema";

export default function GenerateConference() {
  const [topic, setTopic] = useState("");
  const [targetPages, setTargetPages] = useState("auto");
  const [citationStyle, setCitationStyle] = useState("ieee");
  const [generateImages, setGenerateImages] = useState(true);
  
  const { generate, isGenerating, generatedContent, progress } = useDocumentGenerator("conference");
  const { generateTopic, isLoading: isLoadingTopic } = useRandomTopic();
  const { uploadedFiles, isProcessing, extractedText, handleFileUpload, removeFile } = useFileUpload();
  const { toast } = useToast();

  return (
    <GeneratorLayout
      title="Conference Paper Generator"
      description="IEEE-formatted papers with proper citations and academic structure"
      icon={<FileSpreadsheet className="w-6 h-6 text-white" />}
      gradient="from-purple-500 to-pink-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paper Configuration</CardTitle>
              <CardDescription>Define your conference paper topic and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" data-testid="tab-text-input">Text Input</TabsTrigger>
                  <TabsTrigger value="upload" data-testid="tab-file-upload">File Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Research Topic/Abstract</Label>
                    <Textarea
                      id="topic"
                      placeholder="Enter your conference paper topic or abstract..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-32 mt-2"
                      data-testid="input-paper-topic"
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
                  <Label>Template Format</Label>
                  <RadioGroup defaultValue="ieee" className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ieee" id="ieee" data-testid="radio-ieee" />
                      <Label htmlFor="ieee" className="font-normal cursor-pointer">
                        IEEE Conference Paper (Two-column)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="target-pages">Target Length</Label>
                  <Select value={targetPages} onValueChange={setTargetPages}>
                    <SelectTrigger id="target-pages" className="mt-2" data-testid="select-target-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (AI-determined)</SelectItem>
                      <SelectItem value="4-6">4-6 Pages</SelectItem>
                      <SelectItem value="7-10">7-10 Pages</SelectItem>
                      <SelectItem value="10+">10+ Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="citation-style">Citation Style</Label>
                  <Select value={citationStyle} onValueChange={setCitationStyle}>
                    <SelectTrigger id="citation-style" className="mt-2" data-testid="select-citation-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ieee">IEEE (Numbered)</SelectItem>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="generate-images">Generate Figures</Label>
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
                    targetPages,
                    citationStyle,
                    generateImages,
                  });
                }}
                data-testid="button-generate-paper"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Conference Paper
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Paper Preview</CardTitle>
                  <CardDescription>Real-time preview of your conference paper</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid="button-save-project">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-export-pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="space-y-4 mb-6">
                  <Progress value={progress} className="w-full" />
                  <div className="text-sm text-muted-foreground text-center">
                    Generating IEEE-formatted paper...
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
                    <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Your conference paper will appear here</p>
                    <p className="text-sm mt-2">Configure settings and click "Generate Conference Paper" to start</p>
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
