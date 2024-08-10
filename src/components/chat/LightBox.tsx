import React from 'react';
import { X } from 'lucide-react';

const Lightbox = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative max-w-full max-h-full p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none transition-colors"
          aria-label="Close lightbox"
        >
          <X size={32} />
        </button>
        {/* Image */}
        <img
          src={imageUrl}
          alt="Lightbox"
          className="max-w-screen-md max-h-screen-md mx-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Lightbox;
