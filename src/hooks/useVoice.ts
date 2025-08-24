import { useState, useEffect, useCallback } from 'react';

interface VoiceConfig {
  onSpeechResult: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSpeechError?: (error: string) => void;
}

export const useVoice = ({
  onSpeechResult,
  onSpeechStart,
  onSpeechEnd,
  onSpeechError
}: VoiceConfig) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setIsListening(true);
          onSpeechStart?.();
        };

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0]?.transcript;
          if (transcript) {
            onSpeechResult(transcript);
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          onSpeechEnd?.();
        };

        recognitionInstance.onerror = (event) => {
          setIsListening(false);
          onSpeechError?.(event.error);
        };

        setRecognition(recognitionInstance);
        setIsSupported(true);
      }
    }
  }, [onSpeechResult, onSpeechStart, onSpeechEnd, onSpeechError]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}