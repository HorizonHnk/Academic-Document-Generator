import { z } from "zod";

export type DocumentType = "report" | "powerpoint" | "conference" | "thesis";
export type ToneType = "academic" | "professional" | "essay" | "creative";
export type CitationStyle = "ieee" | "harvard" | "auto";
export type TemplateType = "ieee" | "thesis";

export const documentSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  type: z.enum(["report", "powerpoint", "conference", "thesis"]),
  title: z.string(),
  content: z.object({
    topic: z.string(),
    generatedContent: z.any().optional(),
    sections: z.array(z.any()).optional(),
    slides: z.array(z.any()).optional(),
  }),
  settings: z.object({
    targetLength: z.string().optional(),
    tone: z.enum(["academic", "professional", "essay", "creative"]).optional(),
    citationStyle: z.enum(["ieee", "harvard", "auto"]).optional(),
    template: z.enum(["ieee", "thesis"]).optional(),
    fontSize: z.number().optional(),
    lineSpacing: z.number().optional(),
    margins: z.number().optional(),
    generateImages: z.boolean().optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Document = z.infer<typeof documentSchema>;
export type InsertDocument = Omit<Document, "id" | "createdAt" | "updatedAt">;

export const userPreferencesSchema = z.object({
  userId: z.string(),
  defaultTone: z.enum(["academic", "professional", "essay", "creative"]).optional(),
  defaultCitationStyle: z.enum(["ieee", "harvard", "auto"]).optional(),
  geminiApiKey: z.string().optional(),
  pixabayApiKey: z.string().optional(),
});
