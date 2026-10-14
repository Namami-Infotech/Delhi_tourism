'use client';

import React, { useState, useEffect, useCallback } from 'react';
import galleryService from '../../services/gallery.service';
import placeService from '../../services/place.service';
import circuitService from '../../services/circuit.service';
import eventService from '../../services/event.service';
import itineraryService from '../../services/itinerary.service';

export default function AdminGalleriesTab() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [feedback, setFeedback] = useState(null);

  // Entities for linking
  const [places, setPlaces] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [events, setEvents] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    entityType: 'place',
    entityId: '',
    imageUrl: '',
    title: '',
    altText: '',
    displayOrder: 0,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterType !== 'all' ? { entityType: filterType } : {};
      const res = await galleryService.getAll(params);
      setGalleries(res?.data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load gallery items.' });
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  const loadEntities = useCallback(async () => {
    try {
      const [placesRes, circuitsRes, eventsRes, itinRes] = await Promise.all([
        placeService.getAll({ all: 'true' }),
        circuitService.getAll({ all: 'true' }),
        eventService.getAll({ all: 'true' }),
        itineraryService.getAll({ all: 'true' }),
      ]);
      setPlaces(placesRes?.data || []);
      setCircuits(circuitsRes?.data || []);
      setEvents(eventsRes?.data || []);
      setItineraries(itinRes?.data || []);
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    loadGalleries();
  }, [loadGalleries]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleOpenAdd = () => {
    setEditingId(null);
    const defaultEntityId = places.length > 0 ? places[0].id : '';
    setFormData({ ...initialForm, entityId: defaultEntityId });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gallery) => {
    setEditingId(gallery.id);
    setFormData({
      entityType: gallery.entityType,
      entityId: gallery.entityId,
      imageUrl: gallery.imageUrl,
      title: gallery.title || '',
      altText: gallery.altText || '',
      displayOrder: gallery.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleEntityTypeChange = (type) => {
    let defaultId = '';
    if (type === 'place' && places.length > 0) defaultId = places[0].id;
    else if (type === 'circuit' && circuits.length > 0) defaultId = circuits[0].id;
    else if (type === 'event' && events.length > 0) defaultId = events[0].id;
    else if (type === 'itinerary' && itineraries.length > 0) defaultId = itineraries[0].id;

    setFormData((prev) => ({
      ...prev,
      entityType: type,
      entityId: defaultId,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setFeedback({ type: 'error', text: 'Image URL is required.' });
      return;
    }
    if (!formData.entityId && !editingId) {
      setFeedback({ type: 'error', text: 'Please select a linked entity.' });
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await galleryService.update(editingId, {
          imageUrl: formData.imageUrl,
          title: formData.title,
          altText: formData.altText,
          displayOrder: parseInt(formData.displayOrder) || 0,
        });
        setFeedback({ type: 'success', text: 'Gallery image updated successfully.' });
      } else {
        await galleryService.create({
          entityType: formData.entityType,
          entityId: parseInt(formData.entityId),
          imageUrl: formData.imageUrl,
          title: formData.title,
          altText: formData.altText,
          displayOrder: parseInt(formData.displayOrder) || 0,
        });
        setFeedback({ type: 'success', text: 'Gallery image added successfully.' });
      }

      setIsModalOpen(false);
      await loadGalleries();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save gallery image.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete this gallery image "${title || 'Untitled'}"?`)) return;
    try {
      await galleryService.delete(id);
      setFeedback({ type: 'success', text: 'Gallery image removed successfully.' });
      await loadGalleries();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete gallery image.' });
    }
  };

  const getEntityTitle = (entityType, entityId) => {
    if (entityType === 'place') {
      const match = places.find((p) => p.id === entityId);
      return match ? `Place: ${match.name}` : `Place #${entityId}`;
    }
    if (entityType === 'circuit') {
      const match = circuits.find((c) => c.id === entityId);
      return match ? `Circuit: ${match.name}` : `Circuit #${entityId}`;
    }
    if (entityType === 'event') {
      const match = events.find((ev) => ev.id === entityId);
      return match ? `Event: ${match.title}` : `Event #${entityId}`;
    }
    if (entityType === 'itinerary') {
      const match = itineraries.find((it) => it.id === entityId);
      return match ? `Itinerary: ${match.title}` : `Itinerary #${entityId}`;
    }
    return `${entityType} #${entityId}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold font-serif text-stone-900">Gallery &amp; Media Management</h2>
          <p className="text-xs text-stone-500">
            Upload and manage photo galleries attached to Places, Circuits, Events, and Itineraries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">All Entity Types</option>
            <option value="place">Places Only</option>
            <option value="circuit">Circuits Only</option>
            <option value="event">Events Only</option>
            <option value="itinerary">Itineraries Only</option>
          </select>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <span>+ Add Photo</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg text-xs flex items-center justify-between ${
            feedback.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid listing */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">Loading gallery photos...</div>
      ) : galleries.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">
          No gallery images found. Click &quot;+ Add Photo&quot; to attach images to destinations or experiences.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((img) => (
            <div
              key={img.id}
              className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50 shadow-xs flex flex-col group hover:border-amber-400 transition-all"
            >
              <div className="relative h-40 w-full bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.altText || img.title || 'Delhi Tourism Gallery'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase bg-black/70 text-white backdrop-blur-xs">
                    {img.entityType}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-stone-900/60 text-white">
                    Order: #{img.displayOrder}
                  </span>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-amber-700 truncate">
                    {getEntityTitle(img.entityType, img.entityId)}
                  </div>
                  <h4 className="font-bold text-xs text-stone-900 mt-1 line-clamp-1">
                    {img.title || 'Untitled Photo'}
                  </h4>
                  {img.altText && (
                    <p className="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1">
                      Alt: {img.altText}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200 text-xs">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(img)}
                    className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id, img.title)}
                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold font-serif text-base text-stone-900">
                {editingId ? 'Edit Gallery Photo' : 'Attach New Gallery Photo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {!editingId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Entity Type *
                    </label>
                    <select
                      value={formData.entityType}
                      onChange={(e) => handleEntityTypeChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="place">Tourist Place</option>
                      <option value="circuit">Curated Circuit</option>
                      <option value="event">Tourism Event</option>
                      <option value="itinerary">Itinerary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Entity *
                    </label>
                    <select
                      value={formData.entityId}
                      onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      {formData.entityType === 'place' &&
                        places.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      {formData.entityType === 'circuit' &&
                        circuits.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      {formData.entityType === 'event' &&
                        events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title}
                          </option>
                        ))}
                      {formData.entityType === 'itinerary' &&
                        itineraries.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Photo Title / Caption
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sunset view from Lahori Gate"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="Detailed description of photo for screen readers..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Photo' : 'Attach Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
