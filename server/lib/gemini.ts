import { GoogleGenAI } from "@google/genai";

const AI_API_KEY = process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: AI_API_KEY });

export interface GenerateContentOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export async function generateContent(
  prompt: string,
  options: GenerateContentOptions = {}
): Promise<string> {
  if (!AI_API_KEY) {
    console.warn("Gemini API key not configured");
    throw new Error("AI API key not configured. Please add GEMINI_API_KEY to your environment variables.");
  }

  const {
    model = "gemini-2.5-flash",
    systemInstruction,
    temperature = 0.7,
    maxTokens = 8192,
    responseFormat = "text",
  } = options;

  try {
    const config: any = {
      temperature,
      maxOutputTokens: maxTokens,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (responseFormat === "json") {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate content: ${error}`);
  }
}

export async function generateReportContent(topic: string, targetLength: string, tone: string): Promise<any> {
  const systemInstruction = `You are an expert technical report writer. Generate a comprehensive BET-standard technical report in JSON format.
Include sections: Introduction, Project Plan, Budget, Methodology, Results, Conclusion, References, and Appendix.
Use proper academic tone and include Gantt chart data and budget tables.
Format the response as JSON with the following structure:
{
  "title": "Report title",
  "abstract": "Brief summary",
  "sections": [
    {
      "title": "Section name",
      "content": "Section content with markdown formatting",
      "subsections": [...]
    }
  ],
  "references": ["Reference 1", "Reference 2"]
}`;

  const prompt = `Generate a ${targetLength} technical report on: ${topic}. Writing tone: ${tone}. Include all standard BET report sections with proper formatting.`;

  const response = await generateContent(prompt, {
    systemInstruction,
    responseFormat: "json",
    maxTokens: 16384,
  });

  return JSON.parse(response);
}

export async function generatePresentationContent(topic: string, slideCount: string, tone: string): Promise<any> {
  const systemInstruction = `You are an expert presentation designer. Generate a professional presentation following the 6x6 rule (max 6 bullet points, max 6-7 words per bullet).
Create engaging slides with clear structure. Include speaker notes for each slide.
Format the response as JSON with the following structure:
{
  "title": "Presentation title",
  "slides": [
    {
      "type": "title" | "content" | "image" | "quote",
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2"],
      "speakerNotes": "What to say for this slide",
      "layout": "Text Left / Image Right" (if applicable)
    }
  ]
}`;

  const prompt = `Generate a ${slideCount} presentation on: ${topic}. Style: ${tone}. Follow the 6x6 rule strictly.`;

  const response = await generateContent(prompt, {
    systemInstruction,
    responseFormat: "json",
    maxTokens: 16384,
  });

  return JSON.parse(response);
}

export async function generateConferencePaperContent(topic: string, targetPages: string, citationStyle: string): Promise<any> {
  const systemInstruction = `You are an expert academic paper writer. Generate an IEEE-formatted conference paper with proper academic structure.
Include: Abstract, Introduction, Related Work, Methodology, Results, Discussion, Conclusion, References.
Use ${citationStyle} citation format. Format the response as JSON with the following structure:
{
  "title": "Paper title",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Paper abstract",
  "keywords": ["keyword1", "keyword2"],
  "sections": [
    {
      "number": "I.",
      "title": "Section title",
      "content": "Section content with markdown"
    }
  ],
  "references": ["[1] Reference format"]
}`;

  const prompt = `Generate a ${targetPages} IEEE conference paper on: ${topic}. Citation style: ${citationStyle}.`;

  const response = await generateContent(prompt, {
    systemInstruction,
    responseFormat: "json",
    maxTokens: 32768,
  });

  return JSON.parse(response);
}

export async function generateThesisContent(topic: string, targetPages: string, citationStyle: string): Promise<any> {
  const systemInstruction = `You are an expert thesis writer. Generate a comprehensive thesis/dissertation with proper academic structure.
Include: Title Page, Abstract, Table of Contents, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion, References, Appendices.
Use ${citationStyle} citation format with author-date style. Format the response as JSON with the following structure:
{
  "title": "Thesis title",
  "author": "Author name",
  "abstract": "Thesis abstract",
  "chapters": [
    {
      "number": 1,
      "title": "Chapter title",
      "sections": [
        {
          "title": "Section title",
          "content": "Section content with markdown"
        }
      ]
    }
  ],
  "references": ["Author, A. (Year). Title. Journal..."]
}`;

  const prompt = `Generate a ${targetPages} thesis/dissertation on: ${topic}. Citation style: ${citationStyle}.`;

  const response = await generateContent(prompt, {
    systemInstruction,
    responseFormat: "json",
    maxTokens: 65536,
  });

  return JSON.parse(response);
}

export async function extractTextFromImage(imageBase64: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
        "Extract and transcribe all text from this image. Provide only the extracted text without any additional commentary.",
      ],
    });

    return response.text || "";
  } catch (error) {
    console.error("Image OCR error:", error);
    throw new Error(`Failed to extract text from image: ${error}`);
  }
}

export async function generateChatResponse(message: string): Promise<string> {
  const systemInstruction = `You are a helpful assistant for PaperGen AI, an academic document generation platform. Your role is to:
1. Answer questions about the website's features and capabilities
2. Guide users on how to use the document generators
3. Provide helpful tips for creating better academic documents
4. Explain the different document types available

About PaperGen AI:
- PaperGen AI is a unified platform for generating professional academic documents using AI
- It supports 4 document types:
  1. Technical Report (BET-standard format) - For comprehensive technical documentation with sections like Introduction, Methodology, Results, etc.
  2. PowerPoint Presentation - Professional slides following the 6x6 rule (max 6 bullets, max 6-7 words each) with speaker notes
  3. Conference Paper (IEEE format) - Academic papers for conferences with proper IEEE formatting and citations
  4. Thesis/Dissertation (Harvard citations) - Comprehensive academic works with proper Harvard citation style

Key Features:
- AI-powered content generation using Google Gemini
- File upload support (PDF, DOCX, images) to extract content
- Real-time preview of generated documents
- Multi-format export (DOCX, PDF, PPTX, HTML)
- Project saving and management
- Professional academic formatting

Navigation:
- Home: Landing page with overview
- My Projects: View and manage saved documents
- Document Generators: Access all 4 generators from the sidebar
- Settings: Configure preferences
- About: Learn more about the platform
- Contact: Get in touch

Be friendly, helpful, and concise in your responses. If you don't know something specific about implementation details, guide users to explore the relevant section of the website.`;

  const response = await generateContent(message, {
    systemInstruction,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return response;
}
