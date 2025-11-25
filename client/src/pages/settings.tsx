import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Key, 
  Palette, 
  Save,
  Eye,
  EyeOff,
  RotateCcw
} from "lucide-react";

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    geminiApiKey: "",
    pixabayApiKey: "",
    defaultTone: "Academic",
    defaultReferenceStyle: "Harvard",
    generateImages: true,
    autoSave: true,
    darkMode: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("papergen-settings");
    if (saved) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("papergen-settings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      geminiApiKey: "",
      pixabayApiKey: "",
      defaultTone: "Academic",
      defaultReferenceStyle: "Harvard",
      generateImages: true,
      autoSave: true,
      darkMode: false,
    };
    setSettings(defaultSettings);
    localStorage.removeItem("papergen-settings");
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="container max-w-3xl py-8 px-4" data-testid="page-settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your API keys and preferences for document generation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Enter your API keys to enable AI-powered content and image generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="gemini-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key"
                    value={settings.geminiApiKey}
                    onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                    data-testid="input-gemini-key"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  data-testid="button-toggle-key-visibility"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixabay-key">Pixabay API Key (Optional)</Label>
              <Input
                id="pixabay-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your Pixabay API key for images"
                value={settings.pixabayApiKey}
                onChange={(e) => setSettings({ ...settings, pixabayApiKey: e.target.value })}
                data-testid="input-pixabay-key"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a 
                  href="https://pixabay.com/api/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Pixabay API
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Default Preferences
            </CardTitle>
            <CardDescription>
              Set default options for document generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-tone">Default Tone</Label>
                <Select
                  value={settings.defaultTone}
                  onValueChange={(value) => setSettings({ ...settings, defaultTone: value })}
                >
                  <SelectTrigger id="default-tone" data-testid="select-default-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Conversational">Conversational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-reference">Default Reference Style</Label>
                <Select
                  value={settings.defaultReferenceStyle}
                  onValueChange={(value) => setSettings({ ...settings, defaultReferenceStyle: value })}
                >
                  <SelectTrigger id="default-reference" data-testid="select-default-reference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Harvard">Harvard</SelectItem>
                    <SelectItem value="IEEE">IEEE</SelectItem>
                    <SelectItem value="APA">APA</SelectItem>
                    <SelectItem value="MLA">MLA</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generate Images</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate images for documents
                  </p>
                </div>
                <Switch
                  checked={settings.generateImages}
                  onCheckedChange={(checked) => setSettings({ ...settings, generateImages: checked })}
                  data-testid="switch-generate-images"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Save Projects</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save projects to your account
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                  data-testid="switch-auto-save"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleReset} data-testid="button-reset">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} data-testid="button-save">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
