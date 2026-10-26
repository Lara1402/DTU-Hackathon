import React, { useState, useRef, useEffect } from 'react';
import VoiceInput from './VoiceInput.jsx';
import ImageUpload from './ImageUpload.jsx';
import MoodBoard from './MoodBoard.jsx';
import { Send, Sparkles, MessageSquare, RotateCcw, X, Paperclip, Bot, User } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  "Build a landing page for a college learning platform",
  "Create a modern portfolio website for a beginner developer",
  "Design a dark minimal SaaS platform for AI developers",
  "Make the hero section more spacious and increase padding",
  "Make the navigation sticky at the top",
  "The mobile layout is overflowing horizontally. Diagnose and fix it"
];

export default function LeftPanel({
  messages,
  onSendMessage,
  moodBoard,
  onAddMoodBoardItem,
  onRemoveMoodBoardItem,
  isProcessing,
  selectedComponent
}) {
  const [promptText, setPromptText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!promptText.trim() && attachments.length === 0) return;
    if (isProcessing) return;

    onSendMessage({
      text: promptText.trim(),
      attachments,
      moodBoard
    });

    setPromptText('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTranscriptReady = (transcript) => {
    setPromptText(prev => prev ? `${prev} ${transcript}` : transcript);
  };

  const handleAddAttachment = (attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <aside className="studio-left-panel">
      {/* Header */}
      <div className="studio-panel-header">
        <div className="studio-panel-title">
          <Bot size={16} color="var(--studio-primary)" />
          <span>Gemma AI Workspace</span>
        </div>
        {selectedComponent && (
          <span style={{ fontSize: '0.72rem', color: 'var(--studio-primary)', fontWeight: 600 }}>
            Target: {selectedComponent.type}
          </span>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="studio-prompt-suggestions">
        {EXAMPLE_PROMPTS.map((example, idx) => (
          <button
            key={idx}
            type="button"
            className="studio-suggestion-chip"
            onClick={() => setPromptText(example)}
          >
            {example}
          </button>
        ))}
      </div>

      {/* Conversation Stream */}
      <div className="studio-conversation-stream">
        {messages.map((msg) => (
          <div key={msg.id} className={`studio-chat-bubble ${msg.sender}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
              {msg.sender === 'assistant' ? (
                <>
                  <Bot size={13} color="var(--studio-primary)" />
                  <span>MoodUI Gemma Agent</span>
                </>
              ) : (
                <>
                  <User size={13} />
                  <span>You</span>
                </>
              )}
            </div>
            <div>{msg.text}</div>
            {msg.attachments && msg.attachments.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                {msg.attachments.map((att) => (
                  <img
                    key={att.id}
                    src={att.url}
                    alt={att.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--studio-border)' }}
                  />
                ))}
              </div>
            )}
            <div className="studio-bubble-meta">
              <span>{msg.timestamp}</span>
              {msg.model && <span>{msg.model}</span>}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="studio-chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--studio-text-muted)' }}>
              Synthesizing structured AST specification...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mood Board Drawer */}
      <MoodBoard
        moodBoard={moodBoard}
        onAddItem={onAddMoodBoardItem}
        onRemoveItem={onRemoveMoodBoardItem}
      />

      {/* Multimodal Input Form */}
      <div className="studio-multimodal-container">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  position: 'relative',
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--studio-radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--studio-primary)'
                }}
              >
                <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: '#ffffff',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="studio-input-wrapper">
            <textarea
              className="studio-textarea"
              placeholder={
                selectedComponent
                  ? `Refine selected ${selectedComponent.type} or describe page modifications...`
                  : 'Describe your website interface, ask for adjustments, or report a bug...'
              }
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
            />

            <div className="studio-input-actions">
              <div className="studio-input-tools">
                <VoiceInput onTranscriptReady={handleTranscriptReady} />
                <ImageUpload
                  attachments={attachments}
                  onAddAttachment={handleAddAttachment}
                  onRemoveAttachment={handleRemoveAttachment}
                />
              </div>

              <button
                type="submit"
                className="studio-btn-primary"
                disabled={(!promptText.trim() && attachments.length === 0) || isProcessing}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <span>{isProcessing ? 'Thinking...' : 'Generate'}</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
}
