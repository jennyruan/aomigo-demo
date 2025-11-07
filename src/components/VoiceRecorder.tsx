import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access to use voice input.');
        }
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  function startRecording() {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  }

  function stopRecording() {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      if (transcript) {
        onTranscript(transcript);
      }
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-brown-600 bg-orange-50 p-3 rounded-xl">
        Voice input is only supported on Chrome and Edge browsers.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
          isRecording
            ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-5 h-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Voice Input
          </>
        )}
      </button>

      {transcript && (
        <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
          <p className="text-sm font-medium text-purple-700 mb-1">Transcript:</p>
          <p className="text-brown-700">{transcript}</p>
        </div>
      )}
    </div>
  );
}
