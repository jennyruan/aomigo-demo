import { useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { PetAvatar } from './PetAvatar';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: PostData) => Promise<void>;
  petName: string;
}

export interface PostData {
  content: string;
  image_url?: string;
  topics: string[];
  privacy: 'public' | 'friends' | 'private';
}

const TOPIC_OPTIONS = [
  'Math',
  'Science',
  'History',
  'Language',
  'Art',
  'Technology',
  'Reading',
  'Writing',
  'Music',
  'Other'
];

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Share with Everyone' },
  { value: 'friends', label: 'Friends Only' },
  { value: 'private', label: 'Just Me' }
] as const;

export function PostCreationModal({ isOpen, onClose, onSubmit, petName }: PostCreationModalProps) {
  const [content, setContent] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterLimit = 500;
  const remainingChars = characterLimit - content.length;

  if (!isOpen) return null;

  function toggleTopic(topic: string) {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImagePreview('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (content.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        content: content.trim(),
        image_url: imagePreview || undefined,
        topics: selectedTopics,
        privacy
      });

      setContent('');
      setSelectedTopics([]);
      setPrivacy('public');
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (!isSubmitting) {
      setContent('');
      setSelectedTopics([]);
      setPrivacy('public');
      setImagePreview('');
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <PetAvatar size="small" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-700">
                What did {petName} learn today?
              </h2>
              <p className="text-sm text-brown-600">Share your learning journey</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-brown-600 hover:text-brown-800 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brown-700 mb-2">
              Tell us what you learned
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
              placeholder="Today I learned..."
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[150px] text-brown-700 resize-none"
              disabled={isSubmitting}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-sm ${remainingChars < 50 ? 'text-red-500 font-semibold' : 'text-brown-600'}`}>
                {remainingChars} characters remaining
              </span>
              {content.trim().length < 10 && content.length > 0 && (
                <span className="text-sm text-red-500">Minimum 10 characters required</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-700 mb-2">
              Add a photo (optional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-orange-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
                <ImageIcon className="w-6 h-6 text-orange-500" />
                <span className="text-orange-600 font-medium">Add a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-700 mb-2">
              Select topics (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_OPTIONS.map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? 'bg-orange-500 text-white scale-105'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-700 mb-2">
              Privacy
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-brown-700 bg-white"
            >
              {PRIVACY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-orange-300 text-orange-700 rounded-xl font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || content.trim().length < 10}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Your pet is sharing...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
