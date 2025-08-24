import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  isSupported,
  onStartListening,
  onStopListening,
  onStopSpeaking
}) => {
  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
        <MicOff className="w-4 h-4" />
        <span className="font-medium">Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isListening ? onStopListening : onStartListening}
        className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 shadow-lg ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25 scale-110'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25 hover:shadow-lg'
        }`}
        disabled={isSpeaking}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            <div className="absolute inset-0 rounded-2xl bg-red-500 opacity-75 animate-pulse"></div>
          </>
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {isSpeaking && (
        <button
          onClick={onStopSpeaking}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 transition-all duration-200"
          title="Stop speaking"
        >
          <VolumeX className="w-5 h-5" />
        </button>
      )}

      {(isListening || isSpeaking) && (
        <div className="flex items-center gap-2 text-sm font-semibold">
          {isListening && (
            <span className="text-red-600 animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Listening...
            </span>
          )}
          {isSpeaking && (
            <span className="text-orange-600 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Speaking...
            </span>
          )}
        </div>
      )}
    </div>
  );
};