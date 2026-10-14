'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '../ui/Modal';

export default function ImageGallery({ images = [], title = 'Photo Gallery' }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-2xl text-stone-900">
          {title} ({images.length})
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => setSelectedImage(img)}
            className="group relative h-40 sm:h-48 rounded-xl overflow-hidden bg-stone-100 cursor-pointer border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-300"
          >
            <Image
              src={img.imageUrl}
              alt={img.altText || img.title || `Gallery photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 transition-colors" />

            {img.title && (
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-medium truncate">
                  {img.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title || 'Photo Preview'}
        maxWidth="max-w-4xl"
      >
        {selectedImage && (
          <div className="space-y-3">
            <div className="relative h-[65vh] w-full rounded-xl overflow-hidden bg-stone-950">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.altText || selectedImage.title || 'Photo'}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
            {selectedImage.altText && (
              <p className="text-stone-600 text-xs italic text-center">
                {selectedImage.altText}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
