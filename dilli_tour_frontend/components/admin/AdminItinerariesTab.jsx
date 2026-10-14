'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import itineraryService from '../../services/itinerary.service';
import placeService from '../../services/place.service';

export default function AdminItinerariesTab() {
  const [itineraries, setItineraries] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    duration: '',
    description: '',
    coverImage: '',
    isFeatured: false,
    isActive: true,
    stops: [],
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [itinsRes, placesRes] = await Promise.all([
        itineraryService.getAll({ all: 'true' }),
        placeService.getAll({ all: 'true' }),
      ]);
      setItineraries(itinsRes?.data || []);
      setPlaces(placesRes?.data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load itineraries.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (itinerary) => {
    setEditingId(itinerary.id);
    setFormData({
      title: itinerary.title || '',
      duration: itinerary.duration || '',
      description: itinerary.description || '',
      coverImage: itinerary.coverImage || '',
      isFeatured: !!itinerary.isFeatured,
      isActive: itinerary.isActive !== false,
      stops: (itinerary.stops || []).map((s) => ({
        placeId: s.placeId,
        day: s.day || 1,
        sequence: s.sequence || 1,
        estimatedDuration: s.estimatedDuration || '',
        notes: s.notes || '',
      })),
    });
    setIsModalOpen(true);
  };

  const handleAddStop = () => {
    if (places.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          placeId: places[0].id,
          day: 1,
          sequence: prev.stops.length + 1,
          estimatedDuration: '2 Hours',
          notes: '',
        },
      ],
    }));
  };

  const handleRemoveStop = (index) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, idx) => idx !== index),
    }));
  };

  const handleStopChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.stops];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stops: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', text: 'Itinerary title is required.' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        stops: formData.stops.map((s, idx) => ({
          placeId: parseInt(s.placeId),
          day: parseInt(s.day) || 1,
          sequence: parseInt(s.sequence) || idx + 1,
          estimatedDuration: s.estimatedDuration,
          notes: s.notes,
        })),
      };

      if (editingId) {
        await itineraryService.update(editingId, payload);
        setFeedback({ type: 'success', text: `Itinerary "${formData.title}" updated successfully.` });
      } else {
        await itineraryService.create(payload);
        setFeedback({ type: 'success', text: `Itinerary "${formData.title}" created successfully.` });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save itinerary.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to deactivate "${title}"?`)) return;
    try {
      await itineraryService.delete(id);
      setFeedback({ type: 'success', text: `Itinerary "${title}" deactivated successfully.` });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate itinerary.' });
    }
  };

  const handleToggleFeatured = async (itinerary) => {
    try {
      await itineraryService.update(itinerary.id, { isFeatured: !itinerary.isFeatured });
      setFeedback({
        type: 'success',
        text: `Itinerary "${itinerary.title}" is now ${!itinerary.isFeatured ? 'featured' : 'unfeatured'}.`,
      });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update featured status.' });
    }
  };

  const filteredItineraries = itineraries.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.duration?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold font-serif text-stone-900">Itineraries Management</h2>
          <p className="text-xs text-stone-500">
            Curate multi-day and single-day touring itineraries and itinerary stops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search itineraries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 w-48 sm:w-64"
          />
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <span>+ Add Itinerary</span>
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

      {/* Table Listing */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">Loading itineraries...</div>
      ) : filteredItineraries.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">
          No itineraries found. Click &quot;+ Add Itinerary&quot; to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                <th className="py-3 px-3">Itinerary</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Stops</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItineraries.map((itin) => (
                <tr key={itin.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-md bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                        {itin.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={itin.coverImage}
                            alt={itin.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                            🗺️
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{itin.title}</div>
                        <div className="text-[11px] text-stone-400 font-mono">/{itin.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                      {itin.duration || 'Flexible'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-stone-700 font-medium">
                      {itin.stops?.length || 0} stops
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(itin)}
                      title="Click to toggle featured status"
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        itin.isFeatured
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {itin.isFeatured ? '★ Featured' : '☆ Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        itin.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {itin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/itineraries/${itin.slug}`}
                        target="_blank"
                        className="text-stone-500 hover:text-stone-800 font-medium"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(itin)}
                        className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(itin.id, itin.title)}
                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold font-serif text-base text-stone-900">
                {editingId ? 'Edit Itinerary' : 'Create New Itinerary'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Itinerary Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 3-Day Heritage & Sufi Delhi"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 3 Days / 2 Nights"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive walkthrough of what travelers will experience..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Itinerary Stops */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Itinerary Stops ({formData.stops.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded cursor-pointer"
                  >
                    + Add Stop
                  </button>
                </div>

                {formData.stops.length === 0 ? (
                  <p className="text-[11px] text-stone-400 italic py-2">
                    No stops added. Click &quot;+ Add Stop&quot; to assign tourist places to this itinerary.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {formData.stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row items-center gap-2 text-xs"
                      >
                        <div className="w-16">
                          <label className="text-[10px] text-stone-500 font-semibold block">Day</label>
                          <input
                            type="number"
                            min="1"
                            value={stop.day}
                            onChange={(e) => handleStopChange(idx, 'day', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-stone-500 font-semibold block">Place</label>
                          <select
                            value={stop.placeId}
                            onChange={(e) => handleStopChange(idx, 'placeId', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                          >
                            {places.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.locality || 'Delhi'})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-28">
                          <label className="text-[10px] text-stone-500 font-semibold block">Est. Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 2 hrs"
                            value={stop.estimatedDuration}
                            onChange={(e) => handleStopChange(idx, 'estimatedDuration', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold pt-3 sm:pt-4 cursor-pointer"
                          title="Remove stop"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Active &amp; Visible</span>
                </label>
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
                  {saving ? 'Saving...' : editingId ? 'Update Itinerary' : 'Create Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
