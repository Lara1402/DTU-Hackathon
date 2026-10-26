import React, { useRef } from 'react';
import { Image, X, UploadCloud } from 'lucide-react';

export default function ImageUpload({ attachments, onAddAttachment, onRemoveAttachment }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not an image.`);
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onAddAttachment({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          url: event.target.result,
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="studio-tool-btn"
        onClick={() => fileInputRef.current?.click()}
        title="Upload reference screenshots or design sketches"
      >
        <Image size={16} />
      </button>
    </div>
  );
}
