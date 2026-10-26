import React, { useState } from 'react';
import { Palette, Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function MoodBoard({ moodBoard, onAddItem, onRemoveItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    onAddItem({
      title: newTitle.trim() || 'Visual Reference',
      notes: newNotes.trim() || '',
      url: newUrl.trim()
    });
    setNewTitle('');
    setNewNotes('');
    setNewUrl('');
    setShowAddForm(false);
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
            Attach reference image URLs and notes to guide Gemma 4 layout synthesis without polluting your website content.
          </p>

          {/* Mood Board Items */}
          {moodBoard.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '16px',
              border: '1px dashed var(--studio-border)',
              borderRadius: 'var(--studio-radius-sm)',
              color: 'var(--studio-text-dim)',
              fontSize: '0.75rem'
            }}>
              No inspiration references attached yet.
            </div>
          ) : (
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
                    title="Remove reference"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.65)',
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
          )}

          {/* Add Reference Form */}
          {showAddForm ? (
            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="Image URL (https://...)"
                className="studio-prop-input"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Title or Label (e.g. Minimal Hero)"
                className="studio-prop-input"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Inspiration Notes (optional)"
                className="studio-prop-input"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  className="studio-btn-primary"
                  style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  Save Reference
                </button>
                <button
                  type="button"
                  className="studio-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="studio-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={13} />
              <span>Add Inspiration Reference</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
