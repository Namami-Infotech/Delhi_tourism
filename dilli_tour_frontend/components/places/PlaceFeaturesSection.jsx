'use client';

import React, { useState } from 'react';
import Badge from '../ui/Badge';

const getFeatureIcon = (featureName = '') => {
  const name = featureName.toLowerCase();
  if (name.includes('history')) return '📜';
  if (name.includes('construction') || name.includes('build')) return '🏛️';
  if (name.includes('architect')) return '🕌';
  if (name.includes('photograph') || name.includes('camera')) return '📸';
  if (name.includes('fact')) return '✨';
  if (name.includes('personality') || name.includes('people') || name.includes('leader')) return '👑';
  if (name.includes('sarovar') || name.includes('water') || name.includes('spiritual')) return '💧';
  if (name.includes('langar') || name.includes('kitchen') || name.includes('food')) return '🍲';
  if (name.includes('family')) return '👨‍👩‍👧‍👦';
  return '📍';
};

export default function PlaceFeaturesSection({ features = [], placeName = 'Place' }) {
  const safeFeatures = Array.isArray(features) ? features : [];
  const richFeatures = safeFeatures.filter((f) => f && f.description && f.description.trim().length > 0);
  const tagOnlyFeatures = safeFeatures.filter((f) => !f || !f.description || f.description.trim().length === 0);

  // Default: first rich feature is open
  const [openIds, setOpenIds] = useState(() => {
    if (richFeatures.length > 0) {
      return [richFeatures[0].id || 0];
    }
    return [];
  });

  if (safeFeatures.length === 0) return null;

  const toggleFeature = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(richFeatures.map((f, idx) => f.id || idx));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  // Helper to format text with bullet points and paragraphs
  const renderFormattedDescription = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-2.5 text-stone-700 leading-relaxed font-light text-base sm:text-lg">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={index} className="h-2" />;
          }
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
            return (
              <div key={index} className="flex items-start gap-2.5 pl-1 sm:pl-3">
                <span className="text-amber-600 font-bold mt-1 shrink-0 text-sm">✦</span>
                <span className="flex-1 text-stone-800 font-normal">{trimmed.replace(/^[•\-]\s*/, '')}</span>
              </div>
            );
          }
          return (
            <p key={index} className="text-stone-700">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Header with Expand/Collapse Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h3 className="font-serif font-bold text-2xl text-stone-900 flex items-center gap-2">
            <span>✨</span> Key Features & In-Depth Details
          </h3>
          <p className="text-stone-500 text-sm mt-0.5">
            Click on any feature below to explore complete history, construction, architecture, and photography insights for {placeName}.
          </p>
        </div>

        {richFeatures.length > 1 && (
          <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-1 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors cursor-pointer border border-stone-200"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer border border-stone-200"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* Rich Features Accordion */}
      {richFeatures.length > 0 && (
        <div className="space-y-3">
          {richFeatures.map((f, idx) => {
            const featureId = f.id || idx;
            const isOpen = openIds.includes(featureId);
            const icon = getFeatureIcon(f.feature);

            return (
              <div
                key={featureId}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-200/50'
                    : 'bg-stone-50/70 border-stone-200 hover:border-amber-200 hover:bg-stone-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFeature(featureId)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-amber-50 border border-amber-200/60 shrink-0">
                      {icon}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
                        {f.feature}
                      </h4>
                      <span className="text-xs text-amber-700/80 font-medium">
                        {isOpen ? 'Click to collapse details' : 'Click to view complete details →'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                      isOpen
                        ? 'bg-amber-500 text-white border-amber-500 rotate-180'
                        : 'bg-white text-stone-400 border-stone-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 border-t border-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white">
                    <div className="pt-3">
                      {renderFormattedDescription(f.description)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Simple Tag Features (if any) */}
      {tagOnlyFeatures.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2">
            Additional Highlights
          </h4>
          <div className="flex flex-wrap gap-2">
            {tagOnlyFeatures.map((f, idx) => (
              <Badge key={idx} variant="heritage" size="md">
                ✓ {f.feature || f}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
