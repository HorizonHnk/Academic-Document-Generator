import { useState } from "react";
import { Presentation, Sparkles, Upload, Download, Save, Play, X, FileIcon } from "lucide-react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useDocumentGenerator } from "@/hooks/use-document-generator";
import { useRandomTopic } from "@/hooks/use-random-topic";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import type { ToneType } from "@shared/schema";

export default function GeneratePowerPoint() {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState("auto");
  const [tone, setTone] = useState<ToneType>("professional");
  const [generateImages, setGenerateImages] = useState(true);
  const [speakerNotes, setSpeakerNotes] = useState(true);
  const [ttsCoaching, setTtsCoaching] = useState(false);
  
  const { generate, isGenerating, generatedContent, progress } = useDocumentGenerator("powerpoint");
  const { generateTopic, isLoading: isLoadingTopic } = useRandomTopic();
  const { uploadedFiles, isProcessing, extractedText, handleFileUpload, removeFile } = useFileUpload();
  const { toast } = useToast();

  return (
    <GeneratorLayout
      title="PowerPoint Presentation Generator"
      description="Professional slides with AI structuring, speaker notes, and TTS coaching"
      icon={<Presentation className="w-6 h-6 text-white" />}
      gradient="from-orange-500 to-red-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Presentation Configuration</CardTitle>
              <CardDescription>Define your presentation topic and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" data-testid="tab-text-input">Text Input</TabsTrigger>
                  <TabsTrigger value="upload" data-testid="tab-file-upload">File Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Presentation Topic</Label>
                    <Textarea
                      id="topic"
                      placeholder="Enter your presentation topic..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-32 mt-2"
                      data-testid="input-presentation-topic"
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
                  <Label htmlFor="slide-count">Number of Slides</Label>
                  <Select value={slideCount} onValueChange={setSlideCount}>
                    <SelectTrigger id="slide-count" className="mt-2" data-testid="select-slide-count">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (AI-determined)</SelectItem>
                      <SelectItem value="5-10">5-10 Slides</SelectItem>
                      <SelectItem value="11-15">11-15 Slides</SelectItem>
                      <SelectItem value="16-20">16-20 Slides</SelectItem>
                      <SelectItem value="20+">20+ Slides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Presentation Style</Label>
                  <Select value={tone} onValueChange={(val) => setTone(val as ToneType)}>
                    <SelectTrigger id="tone" className="mt-2" data-testid="select-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="speaker-notes">Include Speaker Notes</Label>
                  <Switch
                    id="speaker-notes"
                    checked={speakerNotes}
                    onCheckedChange={setSpeakerNotes}
                    data-testid="switch-speaker-notes"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="tts-coaching">TTS Coaching</Label>
                  <Switch
                    id="tts-coaching"
                    checked={ttsCoaching}
                    onCheckedChange={setTtsCoaching}
                    data-testid="switch-tts-coaching"
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
                    slideCount,
                    tone,
                    generateImages,
                  });
                }}
                data-testid="button-generate-presentation"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Presentation
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
                  <CardTitle>Slide Preview</CardTitle>
                  <CardDescription>Real-time preview of your presentation</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid="button-save-project">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-export-pptx">
                    <Download className="w-4 h-4 mr-2" />
                    Export PPTX
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="space-y-4 mb-6">
                  <Progress value={progress} className="w-full" />
                  <div className="text-sm text-muted-foreground text-center">
                    Creating slides with AI...
                  </div>
                </div>
              )}
              
              <div className="border rounded-lg bg-muted/10 min-h-[600px] p-8 overflow-auto">
                {generatedContent ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <h1 className="text-center">{generatedContent.title}</h1>
                    {generatedContent.slides?.map((slide: any, index: number) => (
                      <div key={index} className="mb-8 pb-6 border-b last:border-0">
                        <h2>Slide {index + 1}: {slide.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: slide.content || "" }} />
                        {slide.speakerNotes && (
                          <div className="mt-4 p-4 bg-muted rounded-md">
                            <p className="text-sm font-semibold mb-2">Speaker Notes:</p>
                            <p className="text-sm">{slide.speakerNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <Presentation className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Your presentation slides will appear here</p>
                    <p className="text-sm mt-2">Configure settings and click "Generate Presentation" to start</p>
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
