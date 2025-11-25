import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { generateReportContent, generatePresentationContent, generateConferencePaperContent, generateThesisContent, extractTextFromImage, generateChatResponse } from "./lib/gemini";
import { searchImages, getRandomImage } from "./lib/pixabay";
import { extractTextFromFile } from "./lib/file-processor";
import { getRandomTopic } from "../shared/random-topics";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate/report", async (req, res) => {
    try {
      const { topic, targetLength, tone } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const content = await generateReportContent(
        topic,
        targetLength || "auto",
        tone || "academic"
      );

      res.json({ success: true, content });
    } catch (error: any) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  app.post("/api/generate/powerpoint", async (req, res) => {
    try {
      const { topic, slideCount, tone } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const content = await generatePresentationContent(
        topic,
        slideCount || "auto",
        tone || "professional"
      );

      res.json({ success: true, content });
    } catch (error: any) {
      console.error("Presentation generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate presentation" });
    }
  });

  app.post("/api/generate/conference", async (req, res) => {
    try {
      const { topic, targetPages, citationStyle } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const content = await generateConferencePaperContent(
        topic,
        targetPages || "auto",
        citationStyle || "ieee"
      );

      res.json({ success: true, content });
    } catch (error: any) {
      console.error("Conference paper generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate conference paper" });
    }
  });

  app.post("/api/generate/thesis", async (req, res) => {
    try {
      const { topic, targetPages, citationStyle } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const content = await generateThesisContent(
        topic,
        targetPages || "auto",
        citationStyle || "harvard"
      );

      res.json({ success: true, content });
    } catch (error: any) {
      console.error("Thesis generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate thesis" });
    }
  });

  app.post("/api/images/search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const images = await searchImages(query, 10);
      res.json({ success: true, images });
    } catch (error: any) {
      console.error("Image search error:", error);
      res.status(500).json({ error: error.message || "Failed to search images" });
    }
  });

  app.post("/api/images/random", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const image = await getRandomImage(query);
      res.json({ success: true, image });
    } catch (error: any) {
      console.error("Random image error:", error);
      res.status(500).json({ error: error.message || "Failed to get random image" });
    }
  });

  app.post("/api/files/process", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const { buffer, mimetype } = req.file;

      if (mimetype.startsWith("image/")) {
        const base64 = buffer.toString("base64");
        const text = await extractTextFromImage(base64);
        return res.json({ success: true, text, type: "image" });
      }

      const text = await extractTextFromFile(buffer, mimetype);
      res.json({ success: true, text, type: "document" });
    } catch (error: any) {
      console.error("File processing error:", error);
      res.status(500).json({ error: error.message || "Failed to process file" });
    }
  });

  app.get("/api/random-topic", (req, res) => {
    try {
      const randomTopic = getRandomTopic();
      res.json({ success: true, ...randomTopic });
    } catch (error: any) {
      console.error("Random topic error:", error);
      res.status(500).json({ error: error.message || "Failed to get random topic" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { title, documentType, content, userId } = req.body;
      
      if (!title || !documentType || !content || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const project = await storage.createDocument({
        title,
        documentType,
        content,
        userId,
      });

      res.json({ success: true, project });
    } catch (error: any) {
      console.error("Project creation error:", error);
      res.status(500).json({ error: error.message || "Failed to create project" });
    }
  });

  app.get("/api/projects/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const projects = await storage.getDocumentsByUserId(userId);
      res.json({ success: true, projects });
    } catch (error: any) {
      console.error("Projects fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch projects" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      await storage.deleteDocument(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Project deletion error:", error);
      res.status(500).json({ error: error.message || "Failed to delete project" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await generateChatResponse(message);
      res.json({ success: true, response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
