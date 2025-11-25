import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = "//unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjs.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    
    let fullText = "";
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error(`Failed to extract text from DOCX: ${error}`);
  }
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDOCX(buffer);
  } else if (mimeType.startsWith("text/")) {
    return buffer.toString("utf-8");
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
