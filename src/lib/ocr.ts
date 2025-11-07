import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text.trim();
  } catch (_error) {
    // hide low-level OCR errors in demo mode
    throw new Error('Failed to extract text from image');
  }
}
