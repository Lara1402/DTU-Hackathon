import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function VoiceInput({ onTranscriptReady }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please grant permission in your browser.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
      setIsSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      if (transcript.trim()) {
        onTranscriptReady(transcript);
        setTranscript('');
      }
    } else {
      setErrorMessage('');
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return (
    <div>
      <button
        type="button"
        className={`studio-tool-btn ${isListening ? 'active' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Stop recording and insert transcript' : 'Voice input (Speech to Text)'}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      {/* Floating status banner during active speech recording */}
      {isListening && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          marginBottom: '8px',
          background: '#181d29',
          border: '1px solid var(--studio-primary)',
          borderRadius: 'var(--studio-radius-sm)',
          padding: '10px 14px',
          boxShadow: 'var(--studio-shadow-md)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--studio-accent-rose)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--studio-accent-rose)',
              animation: 'pulseGlow 1.2s infinite'
            }} />
            <span style={{ fontWeight: 700 }}>Listening... Describe your interface idea</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#ffffff', fontStyle: 'italic', minHeight: '20px' }}>
            {transcript || 'Speak into your microphone...'}
          </div>
          <button
            type="button"
            className="studio-btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', alignSelf: 'flex-end' }}
            onClick={toggleListening}
          >
            Insert Transcription
          </button>
        </div>
      )}

      {errorMessage && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          marginBottom: '8px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--studio-radius-sm)',
          padding: '8px 12px',
          fontSize: '0.78rem',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 60
        }}>
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
