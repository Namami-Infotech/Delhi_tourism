'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import circuitService from '../../services/circuit.service';
import categoryService from '../../services/category.service';

export default function AdminCircuitsTab() {
  const [circuits, setCircuits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const initialForm = {
    name: '',
    categoryId: '',
    tagline: '',
    shortDescription: '',
    description: '',
    coverImage: '',
    duration: '',
    bestTime: '',
    displayOrder: 0,
    isFeatured: false,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const [circuitsRes, catsRes] = await Promise.all([
        circuitService.getAll(),
        categoryService.getAll(),
      ]);
      if (circuitsRes?.success) setCircuits(circuitsRes.data || []);
      if (catsRes?.success) setCategories(catsRes.data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load circuits.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCircuit(null);
    setFormData({
      ...initialForm,
      categoryId: categories[0]?.id || '',
      displayOrder: circuits.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (circuit) => {
    setEditingCircuit(circuit);
    setFormData({
      name: circuit.name || '',
      categoryId: circuit.categoryId || '',
      tagline: circuit.tagline || '',
      shortDescription: circuit.shortDescription || '',
      description: circuit.description || '',
      coverImage: circuit.coverImage || '',
      duration: circuit.duration || '',
      bestTime: circuit.bestTime || '',
      displayOrder: circuit.displayOrder ?? 0,
      isFeatured: !!circuit.isFeatured,
      isActive: circuit.isActive !== undefined ? circuit.isActive : true,
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
        categoryId: parseInt(formData.categoryId),
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      if (editingCircuit) {
        await circuitService.update(editingCircuit.id, payload);
        setFeedback({ type: 'success', text: `Circuit "${formData.name}" updated successfully.` });
      } else {
        await circuitService.create(payload);
        setFeedback({ type: 'success', text: `Circuit "${formData.name}" created successfully.` });
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save circuit.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await circuitService.delete(id);
      setFeedback({ type: 'success', text: `Circuit "${name}" deactivated successfully.` });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate circuit.' });
    }
  };

  const filteredCircuits = circuits.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Manage Thematic Circuits</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Curate multi-stop themed routes across historic and spiritual Delhi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search circuits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:border-amber-500 w-44 sm:w-56"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ Add Circuit</span>
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
        <div className="py-12 flex justify-center text-xs text-stone-500">Loading circuits...</div>
      ) : filteredCircuits.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">No circuits found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                <th className="py-3 px-3">Cover</th>
                <th className="py-3 px-3">Circuit Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Duration & Season</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCircuits.map((circuit) => (
                <tr key={circuit.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="w-14 h-10 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                      {circuit.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={circuit.coverImage} alt={circuit.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">🧭</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{circuit.name}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                      {circuit.tagline || circuit.shortDescription || 'No description'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {circuit.category?.name || 'Assigned Category'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    <div>⏱ {circuit.duration || 'Flexible'}</div>
                    <div className="text-[11px] text-stone-400">🗓 {circuit.bestTime || 'Year-round'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        circuit.isFeatured
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}
                    >
                      {circuit.isFeatured ? '★ Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        circuit.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${circuit.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {circuit.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/circuits/${circuit.slug}`}
                        target="_blank"
                        className="px-2 py-1 text-[11px] text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(circuit)}
                        className="px-2 py-1 text-[11px] text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(circuit.id, circuit.name)}
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

      {/* Modal: Create / Edit Circuit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold font-serif text-stone-900">
                {editingCircuit ? `Edit Circuit: ${editingCircuit.name}` : 'Create New Thematic Circuit'}
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
                  <label className="block font-semibold text-stone-700 mb-1">Circuit Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Echoes of Delhi"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Parent Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Hero subheading for cards..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 1 full day / 2 days"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Best Time / Season</label>
                  <input
                    type="text"
                    value={formData.bestTime}
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    placeholder="e.g. October to March"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
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

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Historic significance, story of this circuit..."
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
                  {saving ? 'Saving...' : editingCircuit ? 'Update Circuit' : 'Create Circuit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
