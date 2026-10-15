'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import placeService from '../../services/place.service';
import categoryService from '../../services/category.service';

export default function AdminPlacesTab() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Form State
  const initialForm = {
    name: '',
    locality: '',
    address: '',
    shortDescription: '',
    description: '',
    openingTime: '',
    closingTime: '',
    openDays: '',
    ticketInformation: '',
    website: '',
    coverImage: '',
    imageUrl: '',
    icon: '',
    isFeatured: false,
    isActive: true,
    categoryIds: [],
    features: [],
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const [placesRes, catsRes] = await Promise.all([
        placeService.getAll(),
        categoryService.getAll(),
      ]);
      if (placesRes?.success) setPlaces(placesRes.data || []);
      if (catsRes?.success) setCategories(catsRes.data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load places.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPlace(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name || '',
      locality: place.locality || '',
      address: place.address || '',
      shortDescription: place.shortDescription || '',
      description: place.description || '',
      openingTime: place.openingTime || '',
      closingTime: place.closingTime || '',
      openDays: place.openDays || '',
      ticketInformation: place.ticketInformation || '',
      website: place.website || '',
      coverImage: place.coverImage || '',
      imageUrl: place.imageUrl || place.coverImage || '',
      icon: place.icon || '',
      isFeatured: !!place.isFeatured,
      isActive: place.isActive !== undefined ? place.isActive : true,
      categoryIds: place.categories ? place.categories.map((c) => c.category?.id || c.categoryId).filter(Boolean) : [],
      features: place.features ? place.features.map((f) => ({ feature: f.feature, description: f.description || '' })) : [],
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
        coverImage: formData.imageUrl || formData.coverImage,
      };

      if (editingPlace) {
        await placeService.update(editingPlace.id, payload);
        setFeedback({ type: 'success', text: `Place "${formData.name}" updated successfully.` });
      } else {
        await placeService.create(payload);
        setFeedback({ type: 'success', text: `Place "${formData.name}" created successfully.` });
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save place.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await placeService.delete(id);
      setFeedback({ type: 'success', text: `Place "${name}" deactivated successfully.` });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate place.' });
    }
  };

  const toggleFeatured = async (place) => {
    try {
      await placeService.update(place.id, { isFeatured: !place.isFeatured });
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update featured status.' });
    }
  };

  const filteredPlaces = places.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.locality?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Manage Tourist Places</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add, update details, assign categories, manage photos and features.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search places..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:border-amber-500 w-44 sm:w-56"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ Add Place</span>
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

      {/* Places Table */}
      {loading ? (
        <div className="py-12 flex justify-center text-xs text-stone-500">Loading places...</div>
      ) : filteredPlaces.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">No places match your query.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                <th className="py-3 px-3">Thumbnail</th>
                <th className="py-3 px-3">Name & Locality</th>
                <th className="py-3 px-3">Categories</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPlaces.map((place) => (
                <tr key={place.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                      {place.imageUrl || place.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={place.imageUrl || place.coverImage}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">📍</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      {place.name}
                      {place.icon && (
                        <span className="text-[10px] font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-600">
                          {place.icon}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500">{place.locality || 'Delhi'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {place.categories && place.categories.length > 0 ? (
                        place.categories.map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-amber-50 text-amber-800 border border-amber-200/60"
                          >
                            {c.category?.name || 'Category'}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400 text-[11px]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(place)}
                      title="Click to toggle featured"
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${
                        place.isFeatured
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {place.isFeatured ? '★ Featured' : '☆ Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        place.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${place.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {place.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/places/${place.slug}`}
                        target="_blank"
                        className="px-2 py-1 text-[11px] text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(place)}
                        className="px-2 py-1 text-[11px] text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(place.id, place.name)}
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

      {/* Place Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold font-serif text-stone-900">
                {editingPlace ? `Edit Place: ${editingPlace.name}` : 'Create New Tourist Place'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Place Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Qutb Minar"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Locality / Area</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Mehrauli, South Delhi"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Netaji Subhash Marg, Lal Qila, New Delhi"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. fort, mosque, landmark, temple"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Open Days</label>
                  <input
                    type="text"
                    value={formData.openDays}
                    onChange={(e) => setFormData({ ...formData, openDays: e.target.value })}
                    placeholder="Monday to Saturday"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    placeholder="09:00"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    placeholder="17:30"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tickets / Entry</label>
                  <input
                    type="text"
                    value={formData.ticketInformation}
                    onChange={(e) => setFormData({ ...formData, ticketInformation: e.target.value })}
                    placeholder="Indians: ₹35 | Free"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Assign Categories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 border border-stone-200 rounded-lg max-h-36 overflow-y-auto">
                  {categories.map((cat) => {
                    const isChecked = formData.categoryIds.includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, categoryIds: [...formData.categoryIds, cat.id] });
                            } else {
                              setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter((id) => id !== cat.id),
                              });
                            }
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary for cards..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Historical context, architectural features, highlights..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {/* Features & In-Depth Details */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-stone-800">
                    Key Features & In-Depth Content ({formData.features?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        features: [...(formData.features || []), { feature: '', description: '' }],
                      })
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg cursor-pointer"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {formData.features && formData.features.length > 0 ? (
                    formData.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat.feature}
                            onChange={(e) => {
                              const updated = [...formData.features];
                              updated[fIdx].feature = e.target.value;
                              setFormData({ ...formData, features: updated });
                            }}
                            placeholder="Feature Title (e.g. Complete history, Photography)..."
                            className="flex-1 px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.features.filter((_, idx) => idx !== fIdx);
                              setFormData({ ...formData, features: updated });
                            }}
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 cursor-pointer font-bold"
                            title="Remove feature"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={feat.description || ''}
                          onChange={(e) => {
                            const updated = [...formData.features];
                            updated[fIdx].description = e.target.value;
                            setFormData({ ...formData, features: updated });
                          }}
                          placeholder="Detailed content, facts, or guidelines for this feature..."
                          className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white font-light"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 italic">No custom features added yet.</p>
                  )}
                </div>
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
                  <span className="font-semibold text-stone-700">Active (Publicly Visible)</span>
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
                  {saving ? 'Saving...' : editingPlace ? 'Update Place' : 'Create Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
