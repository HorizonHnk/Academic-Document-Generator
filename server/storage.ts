import { type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByUserId(userId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private documents: Map<string, Document>;

  constructor() {
    this.documents = new Map();
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId,
    );
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const doc: Document = {
      ...insertDoc,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(id, doc);
    return doc;
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }
}

export const storage = new MemStorage();
