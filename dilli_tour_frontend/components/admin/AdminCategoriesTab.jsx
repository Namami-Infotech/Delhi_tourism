'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import categoryService from '../../services/category.service';

export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const initialForm = {
    name: '',
    shortDescription: '',
    description: '',
    image: '',
    icon: '',
    displayOrder: 0,
    isFeatured: false,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      if (res?.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load categories.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ ...initialForm, displayOrder: categories.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      shortDescription: cat.shortDescription || '',
      description: cat.description || '',
      image: cat.image || '',
      icon: cat.icon || '',
      displayOrder: cat.displayOrder ?? 0,
      isFeatured: !!cat.isFeatured,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
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
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
        setFeedback({ type: 'success', text: `Category "${formData.name}" updated successfully.` });
      } else {
        await categoryService.create(payload);
        setFeedback({ type: 'success', text: `Category "${formData.name}" created successfully.` });
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await categoryService.delete(id);
      setFeedback({ type: 'success', text: `Category "${name}" deactivated successfully.` });
      await loadCategories();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate category.' });
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Manage Tourism Categories</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Curate pillars of Delhi Tourism (Spiritual, Heritage, Culinary, Monuments, etc.)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:border-amber-500 w-44 sm:w-56"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ Add Category</span>
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
        <div className="py-12 flex justify-center text-xs text-stone-500">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">No categories found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Category Name</th>
                <th className="py-3 px-3">Slug</th>
                <th className="py-3 px-3">Places Linked</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-amber-700">
                    #{cat.displayOrder}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900 flex items-center gap-2">
                      {cat.name}
                      {cat.icon && (
                        <span className="text-[10px] font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-600">
                          {cat.icon}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                      {cat.shortDescription || 'No short description.'}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-stone-500">
                    {cat.slug}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {cat.places?.length || 0} places
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        cat.isFeatured
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}
                    >
                      {cat.isFeatured ? '★ Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cat.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/categories/${cat.slug}`}
                        target="_blank"
                        className="px-2 py-1 text-[11px] text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="px-2 py-1 text-[11px] text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Modal: Create / Edit Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold font-serif text-stone-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
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
                <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heritage Circuits"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. monument, food"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief summary for catalog cards"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Complete category overview..."
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
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
