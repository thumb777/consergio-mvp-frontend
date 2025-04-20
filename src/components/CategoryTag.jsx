import React from 'react';
import { X } from 'lucide-react';

const Tag = ({ text, onClose }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full border bg-orange-300 text-orange-800 text-sm font-medium">
      {text}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 inline-flex items-center justify-center hover:bg-black/5 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${text} tag`}
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
}

export default Tag;