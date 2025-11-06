import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { extractTextFromImage } from '../lib/ocr';

interface ImageUploaderProps {
  onTextExtracted: (text: string) => void;
}

export function ImageUploader({ onTextExtracted }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG)');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setExtractedText('');

    try {
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      onTextExtracted(text);
    } catch (error) {
      alert('Failed to extract text from image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <div className="w-full border-2 border-dashed border-orange-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
          <Upload className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <span className="text-brown-700 font-medium">Upload Photo</span>
          <p className="text-sm text-brown-600 mt-1">
            JPG, PNG (Handwritten or typed notes)
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="bg-white rounded-xl p-4 border border-orange-200">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg mb-3"
          />
        </div>
      )}

      {isProcessing && (
        <div className="bg-purple-50 p-4 rounded-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-700 font-medium">
            Extracting text from image...
          </span>
        </div>
      )}

      {extractedText && !isProcessing && (
        <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
          <p className="text-sm font-medium text-green-700 mb-2">
            Extracted Text:
          </p>
          <p className="text-brown-700 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )}
    </div>
  );
}
