'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import { searchService } from '../../services/search.service';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await searchService.search(query.trim());
        if (res?.success) {
          setResults(res.data);
        }
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasAnyResults = results && (
    (results.places && results.places.length > 0) ||
    (results.circuits && results.circuits.length > 0) ||
    (results.categories && results.categories.length > 0) ||
    (results.events && results.events.length > 0) ||
    (results.itineraries && results.itineraries.length > 0)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 w-5 h-5 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places, circuits, categories, events, itineraries..."
            className="w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/60"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-stone-500 gap-3">
            <Spinner size="md" color="text-primary-500" />
            <span className="text-sm">Searching Delhi&apos;s treasures...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Results view */}
        {!isLoading && results && hasAnyResults && (
          <div className="space-y-6 pt-2 divide-y divide-stone-100">
            {/* Places Results */}
            {results.places?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Places ({results.places.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.places.map((place) => (
                    <Link
                      key={place.id}
                      href={`/places/${place.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/60 transition-all group"
                    >
                      {place.coverImage ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                          <Image
                            src={place.coverImage}
                            alt={place.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 font-serif font-bold">
                          {place.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-stone-900 group-hover:text-primary-700 truncate">
                          {place.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {place.locality || 'Delhi'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Circuits Results */}
            {results.circuits?.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Curated Circuits ({results.circuits.length})
                </h4>
                <div className="space-y-2">
                  {results.circuits.map((circuit) => (
                    <Link
                      key={circuit.id}
                      href={`/circuits/${circuit.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/70 border border-stone-100 hover:border-amber-200 transition-all group"
                    >
                      <div>
                        <p className="font-medium text-sm text-stone-900 group-hover:text-primary-700">
                          {circuit.name}
                        </p>
                        {circuit.tagline && (
                          <p className="text-xs text-stone-500 mt-0.5">{circuit.tagline}</p>
                        )}
                      </div>
                      <Badge variant="heritage" size="sm">Circuit</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {results.categories?.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Categories ({results.categories.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-primary-50 hover:text-primary-700 text-stone-800 text-xs font-medium border border-stone-200 transition-colors"
                    >
                      <span>🏛️</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Itineraries & Events */}
            {((results.itineraries?.length > 0) || (results.events?.length > 0)) && (
              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Itineraries & Events
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.itineraries?.map((it) => (
                    <Link
                      key={it.id}
                      href={`/itineraries/${it.slug}`}
                      onClick={onClose}
                      className="p-3 rounded-xl border border-stone-100 hover:bg-amber-50/60 hover:border-amber-200 transition-all"
                    >
                      <Badge variant="gold" size="sm" className="mb-1.5">Itinerary • {it.duration}</Badge>
                      <p className="font-medium text-sm text-stone-900 truncate">{it.title}</p>
                    </Link>
                  ))}
                  {results.events?.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.slug}`}
                      onClick={onClose}
                      className="p-3 rounded-xl border border-stone-100 hover:bg-amber-50/60 hover:border-amber-200 transition-all"
                    >
                      <Badge variant="accent" size="sm" className="mb-1.5">Event • {ev.venue}</Badge>
                      <p className="font-medium text-sm text-stone-900 truncate">{ev.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && query.trim().length >= 2 && results && !hasAnyResults && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              🔍
            </div>
            <p className="font-medium text-stone-800 text-sm">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-stone-500 mt-1">Try searching for &quot;Fort&quot;, &quot;Temple&quot;, &quot;Heritage&quot;, or &quot;Spiritual&quot;.</p>
          </div>
        )}

        {/* Initial Prompt */}
        {!query && (
          <div className="py-8 text-center text-xs text-stone-400">
            Search across monuments, spiritual paths, curated circuits, and seasonal festivals.
          </div>
        )}
      </div>
    </Modal>
  );
}
