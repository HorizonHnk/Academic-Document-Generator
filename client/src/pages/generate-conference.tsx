import { useState } from "react";
import { BookOpen, Sparkles, Upload, Download, Save, X, FileIcon, Settings, UserPlus, Trash2 } from "lucide-react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDocumentGenerator } from "@/hooks/use-document-generator";
import { useRandomTopic } from "@/hooks/use-random-topic";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import type { ToneType } from "@shared/schema";

interface Author {
  name: string;
  affiliation: string;
  email: string;
}

export default function GenerateConference() {
  const [topic, setTopic] = useState("");
  const [targetPages, setTargetPages] = useState("auto");
  const [tone, setTone] = useState<ToneType>("academic");
  const [citationStyle, setCitationStyle] = useState("ieee");
  const [generateImages, setGenerateImages] = useState(true);
  
  const [useManualAuthors, setUseManualAuthors] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([{ name: "", affiliation: "", email: "" }]);
  
  const [useCustomFormatting, setUseCustomFormatting] = useState(false);
  const [customFormat, setCustomFormat] = useState({
    fontSize: "12",
    lineSpacing: "1.5",
    padding: "1.5",
    textAlign: "justify",
    textColor: "#000000",
    fontFamily: "Times New Roman"
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { generate, isGenerating, generatedContent, progress } = useDocumentGenerator("conference");
  const { generateTopic, isLoading: isLoadingTopic } = useRandomTopic();
  const { uploadedFiles, isProcessing, extractedText, handleFileUpload, removeFile } = useFileUpload();
  const { toast } = useToast();

  const addAuthor = () => {
    setAuthors([...authors, { name: "", affiliation: "", email: "" }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const handleGenerate = () => {
    const finalTopic = extractedText ? `${topic}\n\nAdditional Context:\n${extractedText}` : topic;
    generate({
      topic: finalTopic,
      targetPages,
      tone,
      citationStyle,
      generateImages,
      authors: useManualAuthors ? authors : undefined,
      customFormat: useCustomFormatting ? customFormat : undefined,
    });
  };

  return (
    <GeneratorLayout
      title="Conference Paper Generator"
      description="IEEE-formatted papers with proper citations and academic structure"
      icon={<BookOpen className="w-6 h-6 text-white" />}
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
                  <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors">
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
                  <Label>Target Length</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["auto", "1-2", "3-5", "6-10", "10+"].map((pages) => (
                      <Button
                        key={pages}
                        variant={targetPages === pages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTargetPages(pages)}
                        data-testid={`button-pages-${pages}`}
                      >
                        {pages === "auto" ? "Auto" : `${pages} Pages`}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tone & Style</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(["academic", "professional", "essay", "creative"] as ToneType[]).map((t) => (
                      <Button
                        key={t}
                        variant={tone === t ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTone(t)}
                        className="capitalize"
                        data-testid={`button-tone-${t}`}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Reference Style</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["auto", "harvard", "ieee"].map((style) => (
                      <Button
                        key={style}
                        variant={citationStyle === style ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCitationStyle(style)}
                        className="uppercase"
                        data-testid={`button-citation-${style}`}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
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

              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-advanced-settings">
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Advanced Settings
                    </span>
                    <span className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Manual Author Details</Label>
                      <Switch
                        checked={useManualAuthors}
                        onCheckedChange={setUseManualAuthors}
                        data-testid="switch-manual-authors"
                      />
                    </div>
                    
                    {useManualAuthors && (
                      <div className="space-y-4">
                        {authors.map((author, index) => (
                          <div key={index} className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Author {index + 1}</Label>
                              {authors.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAuthor(index)}
                                  data-testid={`button-remove-author-${index}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Full Name"
                              value={author.name}
                              onChange={(e) => updateAuthor(index, "name", e.target.value)}
                              data-testid={`input-author-name-${index}`}
                            />
                            <Input
                              placeholder="Affiliation (University/Organization)"
                              value={author.affiliation}
                              onChange={(e) => updateAuthor(index, "affiliation", e.target.value)}
                              data-testid={`input-author-affiliation-${index}`}
                            />
                            <Input
                              type="email"
                              placeholder="Email Address"
                              value={author.email}
                              onChange={(e) => updateAuthor(index, "email", e.target.value)}
                              data-testid={`input-author-email-${index}`}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addAuthor}
                          className="w-full"
                          data-testid="button-add-author"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Author
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Custom Formatting</Label>
                      <Switch
                        checked={useCustomFormatting}
                        onCheckedChange={setUseCustomFormatting}
                        data-testid="switch-custom-formatting"
                      />
                    </div>
                    
                    {useCustomFormatting && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Font Size</Label>
                          <Select
                            value={customFormat.fontSize}
                            onValueChange={(v) => setCustomFormat({ ...customFormat, fontSize: v })}
                          >
                            <SelectTrigger data-testid="select-font-size">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10pt</SelectItem>
                              <SelectItem value="11">11pt</SelectItem>
                              <SelectItem value="12">12pt</SelectItem>
                              <SelectItem value="14">14pt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Line Spacing</Label>
                          <Select
                            value={customFormat.lineSpacing}
                            onValueChange={(v) => setCustomFormat({ ...customFormat, lineSpacing: v })}
                          >
                            <SelectTrigger data-testid="select-line-spacing">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.0">1.0</SelectItem>
                              <SelectItem value="1.15">1.15</SelectItem>
                              <SelectItem value="1.5">1.5</SelectItem>
                              <SelectItem value="2.0">2.0</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Margins (cm)</Label>
                          <Select
                            value={customFormat.padding}
                            onValueChange={(v) => setCustomFormat({ ...customFormat, padding: v })}
                          >
                            <SelectTrigger data-testid="select-margins">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.5">0.5cm</SelectItem>
                              <SelectItem value="1.0">1.0cm</SelectItem>
                              <SelectItem value="1.5">1.5cm</SelectItem>
                              <SelectItem value="2.0">2.0cm</SelectItem>
                              <SelectItem value="2.5">2.5cm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Text Align</Label>
                          <Select
                            value={customFormat.textAlign}
                            onValueChange={(v) => setCustomFormat({ ...customFormat, textAlign: v })}
                          >
                            <SelectTrigger data-testid="select-text-align">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="justify">Justify</SelectItem>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Font Family</Label>
                          <Select
                            value={customFormat.fontFamily}
                            onValueChange={(v) => setCustomFormat({ ...customFormat, fontFamily: v })}
                          >
                            <SelectTrigger data-testid="select-font-family">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Calibri">Calibri</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Text Color</Label>
                          <Input
                            type="color"
                            value={customFormat.textColor}
                            onChange={(e) => setCustomFormat({ ...customFormat, textColor: e.target.value })}
                            className="h-9 w-full cursor-pointer"
                            data-testid="input-text-color"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                className="w-full"
                size="lg"
                disabled={!topic.trim() || isGenerating || isProcessing}
                onClick={handleGenerate}
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
              <div className="flex items-center justify-between flex-wrap gap-2">
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
                    Generating IEEE-formatted conference paper...
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
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
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
