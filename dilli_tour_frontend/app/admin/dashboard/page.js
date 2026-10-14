'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '../../../services/auth.service';
import adminService from '../../../services/admin.service';
import bannerService from '../../../services/banner.service';
import AdminPlacesTab from '../../../components/admin/AdminPlacesTab';
import AdminCategoriesTab from '../../../components/admin/AdminCategoriesTab';
import AdminCircuitsTab from '../../../components/admin/AdminCircuitsTab';
import AdminEventsTab from '../../../components/admin/AdminEventsTab';
import AdminBannersTab from '../../../components/admin/AdminBannersTab';
import AdminItinerariesTab from '../../../components/admin/AdminItinerariesTab';
import AdminGalleriesTab from '../../../components/admin/AdminGalleriesTab';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'banners' | 'team'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'EDITOR' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');

  // Protect page & load initial data
  useEffect(() => {
    const initDashboard = async () => {
      if (!authService.isAuthenticated()) {
        router.replace('/admin/login');
        return;
      }

      try {
        setLoading(true);
        // Get current user profile
        const meRes = await authService.getMe();
        if (meRes?.success && meRes?.data) {
          setUser(meRes.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('delhi_tourism_user', JSON.stringify(meRes.data));
          }
        } else {
          authService.logout();
          router.replace('/admin/login');
          return;
        }

        // Load stats, banners, and users concurrently
        const [statsRes, bannersRes, usersRes] = await Promise.allSettled([
          adminService.getStats(),
          bannerService.getAll({ all: 'true' }),
          adminService.getAllUsers(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStats(statsRes.value.data);
        }

        if (bannersRes.status === 'fulfilled' && bannersRes.value?.success) {
          setBanners(bannersRes.value.data || []);
        }

        if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
          setUsers(usersRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('delhi_tourism_user');
      }
      router.replace('/admin/login');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');
    setAddUserLoading(true);

    try {
      const res = await adminService.createUser(newUser);
      if (res?.success) {
        setAddUserSuccess(`Admin account created for ${newUser.name}`);
        setNewUser({ name: '', email: '', password: '', role: 'EDITOR' });
        // Refresh users
        const updatedUsers = await adminService.getAllUsers();
        if (updatedUsers?.success) {
          setUsers(updatedUsers.data || []);
        }
        setTimeout(() => {
          setShowAddUserModal(false);
          setAddUserSuccess('');
        }, 1500);
      }
    } catch (err) {
      setAddUserError(err?.data?.message || err?.message || 'Failed to create admin user.');
    } finally {
      setAddUserLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-16">
      {/* Top Banner / Admin Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* User Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-stone-900 leading-tight">
                    {user?.name || 'Administrator'}
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    {user?.role || 'ADMIN'}
                  </span>
                </div>
                <p className="text-xs text-stone-500">{user?.email}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                <span>Live Site</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-stone-100 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              📊 Overview & Stats
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'places'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              📍 Places ({stats?.totalPlaces ?? 0})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              🏛️ Categories ({stats?.totalCategories ?? 0})
            </button>
            <button
              onClick={() => setActiveTab('circuits')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'circuits'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              🧭 Circuits ({stats?.totalCircuits ?? 0})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              🎭 Events ({stats?.totalEvents ?? 0})
            </button>
            <button
              onClick={() => setActiveTab('itineraries')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'itineraries'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              🗺️ Itineraries
            </button>
            <button
              onClick={() => setActiveTab('galleries')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'galleries'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              📸 Media Galleries
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'banners'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              🖼️ Home Banners ({banners.length})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'team'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              👥 Admin Team ({users.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">🏛️</div>
                <div className="text-2xl font-bold font-serif text-stone-900">
                  {stats?.totalCategories ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Categories</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">📍</div>
                <div className="text-2xl font-bold font-serif text-stone-900">
                  {stats?.totalPlaces ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Places</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">🧭</div>
                <div className="text-2xl font-bold font-serif text-stone-900">
                  {stats?.totalCircuits ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Circuits</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">🎭</div>
                <div className="text-2xl font-bold font-serif text-stone-900">
                  {stats?.totalEvents ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Events</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">🗺️</div>
                <div className="text-2xl font-bold font-serif text-stone-900">
                  {stats?.totalItineraries ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Itineraries</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-2xl font-bold font-serif text-amber-600">
                  {stats?.featuredPlaces ?? 0}
                </div>
                <div className="text-xs font-medium text-stone-500 mt-0.5">Featured Places</div>
              </div>
            </div>

            {/* Quick Content Navigation */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h2 className="text-base font-bold font-serif text-stone-900 mb-4">
                Content Management Shortcuts
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('places')}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-amber-50 hover:border-amber-200 transition-all text-left group cursor-pointer"
                >
                  <span className="text-lg">📍</span>
                  <div className="font-semibold text-sm text-stone-800 group-hover:text-amber-800 mt-1">
                    Manage Places
                  </div>
                  <div className="text-[11px] text-stone-500">Add, edit, assign categories</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('circuits')}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-amber-50 hover:border-amber-200 transition-all text-left group cursor-pointer"
                >
                  <span className="text-lg">🧭</span>
                  <div className="font-semibold text-sm text-stone-800 group-hover:text-amber-800 mt-1">
                    Manage Circuits
                  </div>
                  <div className="text-[11px] text-stone-500">Curate themed routes & stops</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-amber-50 hover:border-amber-200 transition-all text-left group cursor-pointer"
                >
                  <span className="text-lg">🏛️</span>
                  <div className="font-semibold text-sm text-stone-800 group-hover:text-amber-800 mt-1">
                    Manage Categories
                  </div>
                  <div className="text-[11px] text-stone-500">Edit pillars & display order</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-amber-50 hover:border-amber-200 transition-all text-left group cursor-pointer"
                >
                  <span className="text-lg">🎭</span>
                  <div className="font-semibold text-sm text-stone-800 group-hover:text-amber-800 mt-1">
                    Manage Events
                  </div>
                  <div className="text-[11px] text-stone-500">Publish festivals & dates</div>
                </button>
              </div>
            </div>

            {/* Tables: Recent Places & Circuits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Places */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-serif text-base text-stone-900">Recent Places</h3>
                  <Link href="/places" target="_blank" className="text-xs text-amber-700 font-semibold hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="divide-y divide-stone-100">
                  {stats?.recentPlaces && stats.recentPlaces.length > 0 ? (
                    stats.recentPlaces.map((place) => (
                      <div key={place.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm text-stone-900">{place.name}</div>
                          <div className="text-xs text-stone-500">
                            {new Date(place.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {place.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Featured
                            </span>
                          )}
                          <Link
                            href={`/places/${place.slug}`}
                            target="_blank"
                            className="text-xs text-stone-600 hover:text-stone-900 underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500 py-4">No recent places recorded.</p>
                  )}
                </div>
              </div>

              {/* Recent Circuits */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-serif text-base text-stone-900">Recent Circuits</h3>
                  <Link href="/circuits" target="_blank" className="text-xs text-amber-700 font-semibold hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="divide-y divide-stone-100">
                  {stats?.recentCircuits && stats.recentCircuits.length > 0 ? (
                    stats.recentCircuits.map((circuit) => (
                      <div key={circuit.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm text-stone-900">{circuit.name}</div>
                          <div className="text-xs text-stone-500">
                            {new Date(circuit.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {circuit.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Featured
                            </span>
                          )}
                          <Link
                            href={`/circuits/${circuit.slug}`}
                            target="_blank"
                            className="text-xs text-stone-600 hover:text-stone-900 underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500 py-4">No recent circuits recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLACES CRUD */}
        {activeTab === 'places' && <AdminPlacesTab />}

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && <AdminCategoriesTab />}

        {/* TAB 4: CIRCUITS CRUD */}
        {activeTab === 'circuits' && <AdminCircuitsTab />}

        {/* TAB 5: EVENTS CRUD */}
        {activeTab === 'events' && <AdminEventsTab />}

        {/* TAB 6: ITINERARIES CRUD */}
        {activeTab === 'itineraries' && <AdminItinerariesTab />}

        {/* TAB 7: GALLERIES CRUD */}
        {activeTab === 'galleries' && <AdminGalleriesTab />}

        {/* TAB 8: HOME BANNERS CRUD */}
        {activeTab === 'banners' && <AdminBannersTab />}

        {/* TAB 3: ADMIN TEAM */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-900">Admin Team Members</h2>
                <p className="text-xs text-stone-500">Authorized personnel who can access this dashboard and API.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>+ Add Admin User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((adminUser) => (
                    <tr key={adminUser.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {adminUser.name}
                        {adminUser.email === user?.email && (
                          <span className="ml-2 text-[10px] text-amber-700 font-normal">(You)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{adminUser.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          adminUser.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : adminUser.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {adminUser.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          adminUser.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${adminUser.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          {adminUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(adminUser.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Admin User */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold font-serif text-stone-900">
                  Create New Admin User
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  ✕
                </button>
              </div>

              {addUserError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
                  {addUserError}
                </div>
              )}
              {addUserSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
                  {addUserSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="editor@delhitourism.dev"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-stone-900 bg-white"
                  >
                    <option value="EDITOR">EDITOR (Read & update content)</option>
                    <option value="ADMIN">ADMIN (Full content management)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full access + user admin)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addUserLoading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-70"
                  >
                    {addUserLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
