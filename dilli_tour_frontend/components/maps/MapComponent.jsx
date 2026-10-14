'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import Badge from '../ui/Badge';

export default function MapComponent({
  latitude,
  longitude,
  title = 'Location',
  address,
  markers = [],
  className = '',
}) {
  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;

  // Single place location or multiple circuit locations
  const hasCoordinates = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
  const activeMarkers = markers.length > 0 ? markers : (hasCoordinates ? [{ lat, lng, title, address }] : []);

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || title + ' Delhi')}`;

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || title + ' Delhi')}`;

  return (
    <div className={cn('rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm flex flex-col', className)}>
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <h4 className="font-serif font-bold text-stone-900 text-base">
              {title}
            </h4>
          </div>
          {address && (
            <p className="text-xs text-stone-500 mt-0.5 truncate max-w-md">
              {address}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Get Directions</span>
            <span>↗</span>
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors"
          >
            <span>Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Map View Display */}
      <div className="relative h-72 sm:h-80 w-full bg-stone-100 overflow-hidden">
        {hasCoordinates ? (
          <iframe
            title={`Map view for ${title}`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`}
            className="w-full h-full border-0 filter contrast-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-500 bg-stone-50">
            <span className="text-3xl mb-2">📍</span>
            <p className="font-medium text-sm text-stone-800">{title}</p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">{address || 'Delhi, India'}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        )}
      </div>

      {/* Multiple Markers / Stops Strip (For Circuits) */}
      {activeMarkers.length > 1 && (
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Route Stops on Map ({activeMarkers.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {activeMarkers.map((marker, idx) => (
              <Badge key={idx} variant="default" size="sm" className="bg-white">
                <span className="font-bold text-primary-600">{idx + 1}.</span> {marker.title}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
