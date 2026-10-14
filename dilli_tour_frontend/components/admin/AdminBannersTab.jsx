'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import bannerService from '../../services/banner.service';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function AdminBannersTab() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Upload vs URL mode
  const [imageSourceType, setImageSourceType] = useState('upload'); // 'upload' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);

  const initialForm = {
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    displayOrder: 0,
    theme: 'LIGHT',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerService.getAll({ all: 'true' });
      if (res?.success) {
        setBanners(res.data || []);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load banners.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ ...initialForm, displayOrder: banners.length + 1 });
    setImageSourceType('upload');
    setSelectedFile(null);
    setFilePreview('');
    setUploadProgress('');
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '',
      displayOrder: banner.displayOrder ?? 0,
      theme: banner.theme || 'LIGHT',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    // If it's a local upload, default to upload mode, else url mode
    const isLocalUpload = banner.imageUrl && banner.imageUrl.includes('/uploads/');
    setImageSourceType(isLocalUpload ? 'upload' : 'url');
    setSelectedFile(null);
    setFilePreview('');
    setUploadProgress('');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });
    setUploadProgress('');

    try {
      let finalImageUrl = formData.imageUrl;

      // If user selected a local file in upload mode, upload it first
      if (imageSourceType === 'upload' && selectedFile) {
        setUploadProgress('Uploading image to server...');
        const uploadRes = await bannerService.uploadImage(selectedFile);
        if (uploadRes?.success && uploadRes?.data?.imageUrl) {
          finalImageUrl = uploadRes.data.imageUrl;
        } else {
          throw new Error(uploadRes?.message || 'Failed to upload image file.');
        }
      }

      if (!finalImageUrl && !editingBanner) {
        throw new Error('Please select an image file to upload or provide an image URL.');
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
      };

      if (editingBanner) {
        await bannerService.update(editingBanner.id, payload);
        setFeedback({ type: 'success', text: 'Banner updated successfully.' });
      } else {
        await bannerService.create(payload);
        setFeedback({ type: 'success', text: 'Banner created successfully.' });
      }

      setModalOpen(false);
      await loadBanners();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.data?.message || err.message || 'Failed to save banner.' });
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to deactivate "${title || 'this banner'}"?`)) return;
    try {
      await bannerService.delete(id);
      setFeedback({ type: 'success', text: 'Banner deactivated successfully.' });
      await loadBanners();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to deactivate banner.' });
    }
  };

  // Preview helper for modal
  const currentPreviewUrl =
    imageSourceType === 'upload'
      ? filePreview || (editingBanner ? resolveImageUrl(formData.imageUrl) : '')
      : resolveImageUrl(formData.imageUrl);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Manage Home Hero Banners</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Create hero banners by <span className="font-semibold text-stone-700">uploading local images</span> or <span className="font-semibold text-stone-700">providing image URLs</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Preview on Home →
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Add Banner</span>
          </button>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`p-3 rounded-xl text-xs mb-6 flex items-center justify-between ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-stone-400 hover:text-stone-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center text-xs text-stone-500">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500">
          No banners found. Click &quot;+ Add Banner&quot; to upload your first banner!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const isLocal = banner.imageUrl && banner.imageUrl.includes('/uploads/');
            return (
              <div
                key={banner.id}
                className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col transition-all hover:shadow-md"
              >
                <div className="relative h-44 w-full bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(banner.imageUrl)}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase shadow-xs ${
                        banner.isActive ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    {banner.theme && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/70 backdrop-blur-xs text-white">
                        {banner.theme}
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-stone-900/70 backdrop-blur-xs text-amber-300">
                      {isLocal ? '📁 Local Upload' : '🔗 URL'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
                      <span>Order: #{banner.displayOrder}</span>
                      {banner.linkUrl && <span className="text-stone-400 font-normal">Link configured</span>}
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 leading-snug">
                      {banner.title || 'Untitled Banner'}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {banner.subtitle || 'No subtitle provided.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-[11px] text-stone-400 truncate max-w-[150px]" title={banner.imageUrl}>
                      {banner.imageUrl}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(banner)}
                        className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="px-2.5 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create / Edit Banner */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold font-serif text-stone-900">
                {editingBanner ? 'Edit Home Banner' : 'Create New Home Banner'}
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
              {/* Image Source Selector: Local Upload vs URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2">Banner Image Source *</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => setImageSourceType('upload')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageSourceType === 'upload'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <span>📁 Upload Local File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceType('url')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageSourceType === 'url'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <span>🔗 Image URL</span>
                  </button>
                </div>

                {/* Option 1: File Upload */}
                {imageSourceType === 'upload' && (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-4 text-center transition-colors bg-stone-50/50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="banner-file-input"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="banner-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1 text-stone-600"
                      >
                        <span className="text-2xl">🖼️</span>
                        <span className="font-semibold text-xs text-amber-700">Click to choose image file</span>
                        <span className="text-[11px] text-stone-400">PNG, JPG, WEBP, GIF, SVG up to 10MB</span>
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-between p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                        <div className="truncate text-[11px] flex items-center gap-1.5">
                          <span className="font-semibold">Selected:</span>
                          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                          <span className="text-stone-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveSelectedFile}
                          className="text-amber-800 hover:text-red-600 font-bold px-1"
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: Image URL input */}
                {imageSourceType === 'url' && (
                  <div>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /uploads/banners/..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Paste an external image URL or existing uploaded path.
                    </p>
                  </div>
                )}

                {/* Image Live Preview */}
                {currentPreviewUrl && (
                  <div className="mt-3">
                    <span className="block text-[11px] font-semibold text-stone-500 mb-1">Image Preview:</span>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentPreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Experience Dilwalon Ki Dilli"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Explore ancient heritage and vibrant bazaars across Delhi..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Redirect / Link URL</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="e.g. /circuits or /categories/spiritual-circuits"
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
                  <label className="block font-semibold text-stone-700 mb-1">Theme</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900 bg-white"
                  >
                    <option value="LIGHT">LIGHT (for dark banner images)</option>
                    <option value="DARK">DARK (for light banner images)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-700">Active (Visible on Home Slider)</span>
                </label>
              </div>

              {uploadProgress && (
                <div className="p-2 bg-amber-50 text-amber-800 text-[11px] rounded-lg animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  <span>{uploadProgress}</span>
                </div>
              )}

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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-70 flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{saving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
