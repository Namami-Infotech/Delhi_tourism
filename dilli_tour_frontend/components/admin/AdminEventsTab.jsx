'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import eventService from '../../services/event.service';
import { EVENT_CATEGORIES } from '../../lib/constants';

export default function AdminEventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const initialForm = {
    title: '',
    category: EVENT_CATEGORIES[0] || 'Festivals',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    venue: '',
    address: '',
    coverImage: '',
    description: '',
    isFeatured: false,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAll();
      if (res?.success) {
        setEvents(res.data || []);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load events.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      category: event.category || EVENT_CATEGORIES[0] || 'Festivals',
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      venue: event.venue || '',
      address: event.address || '',
      coverImage: event.coverImage || '',
      description: event.description || '',
      isFeatured: !!event.isFeatured,
      isActive: event.isActive !== undefined ? event.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (editingEvent) {
        await eventService.update(editingEvent.id, payload);
        setFeedback({ type: 'success', text: `Event "${formData.title}" updated successfully.` });
      } else {
        await eventService.create(payload);
        setFeedback({ type: 'success', text: `Event "${formData.title}" created successfully.` });
      }
      setModalOpen(false);
      await loadEvents();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save event.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to deactivate event "${title}"?`)) return;
    try {
      await eventService.delete(id);
      setFeedback({ type: 'success', text: `Event "${title}" deactivated successfully.` });
      await loadEvents();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate event.' });
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Manage Events & Festivals</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Publish cultural fairs, music festivals, culinary festivals, and exhibitions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:border-amber-500 w-44 sm:w-56"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`mb-4 p-3.5 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback({ type: '', text: '' })} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center text-xs text-stone-500">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                <th className="py-3 px-3">Cover</th>
                <th className="py-3 px-3">Event Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date & Schedule</th>
                <th className="py-3 px-3">Venue</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="w-14 h-10 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                      {evt.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">🎭</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{evt.title}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                      {evt.description || 'Cultural festival'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {evt.category || 'Festival'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    <div>📅 {new Date(evt.startDate).toLocaleDateString()}</div>
                    {evt.endDate && (
                      <div className="text-[11px] text-stone-400">
                        to {new Date(evt.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-stone-700">
                    <div className="font-medium">{evt.venue || 'TBA'}</div>
                    <div className="text-[11px] text-stone-400">{evt.address || 'Delhi'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        evt.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${evt.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {evt.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/events/${evt.slug}`}
                        target="_blank"
                        className="px-2 py-1 text-[11px] text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(evt)}
                        className="px-2 py-1 text-[11px] text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="px-2 py-1 text-[11px] text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer font-medium"
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

      {/* Modal: Create / Edit Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold font-serif text-stone-900">
                {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event / Festival'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Qutb Festival 2026"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900 bg-white"
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. India Habitat Centre"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Address / Landmark</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Lodhi Road, New Delhi"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artists, ticketing, timings, cultural highlights..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-700">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-700">Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-70"
                >
                  {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
