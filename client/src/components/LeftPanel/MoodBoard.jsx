import React, { useState } from 'react';
import { Palette, Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function MoodBoard({ moodBoard, onAddItem, onRemoveItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const sampleInspirations = [
    {
      title: 'Minimal Geometric Cyber',
      notes: 'Monochrome dark, sharp angles, vibrant accent lines',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Nordic Clean Studio',
      notes: 'Light mode, airy whitespace, sans-serif high contrast',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Neon Gradient Pulse',
      notes: 'Vibrant indigo & magenta glows, frosted glass cards',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    onAddItem({
      title: newTitle.trim() || 'Visual Reference',
      notes: newNotes.trim() || 'Design inspiration',
      url: newUrl.trim()
    });
    setNewTitle('');
    setNewNotes('');
    setNewUrl('');
  };

  return (
    <div style={{
      borderTop: '1px solid var(--studio-border)',
      background: 'rgba(0,0,0,0.2)'
    }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 20px',
          background: 'transparent',
          border: 'none',
          color: 'var(--studio-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.8rem',
          fontWeight: 600
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={14} color="var(--studio-primary)" />
          <span>Inspiration Mood Board ({moodBoard.length})</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--studio-text-dim)' }}>
          {isOpen ? 'Collapse ▲' : 'Expand ▼'}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--studio-text-dim)', lineHeight: 1.4 }}>
            Mood board references act as visual guidance for Gemma 4 layout synthesis without polluting page content.
          </p>

          {/* Existing Mood Board Items */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {moodBoard.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--studio-radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--studio-border)',
                  background: 'var(--studio-surface)'
                }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove from mood board"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: '#ffffff',
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={11} />
                </button>
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--studio-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--studio-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick preset inspirations */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--studio-text-dim)', marginBottom: '6px' }}>
              Add Curated Inspiration:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {sampleInspirations.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onAddItem(sample)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--studio-border)',
                    color: 'var(--studio-text-muted)',
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  + {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
