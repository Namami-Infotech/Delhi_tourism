/**
 * Application constants for Delhi Tourism Platform.
 */

export const APP_CONFIG = {
  name: 'Delhi Tourism',
  description: 'Explore the Heart of India',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://delhitourism.com',
  social: {
    twitter: '@DelhiTourism',
    facebook: 'DelhiTourismOfficial',
    instagram: '@delhitourism',
  },
};

export const API_ENDPOINTS = {
  categories: '/categories',
  circuits: '/circuits',
  places: '/places',
  itineraries: '/itineraries',
  events: '/events',
  galleries: '/galleries',
  search: '/search',
  banners: '/banners',
  home: '/home',
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
  },
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
};

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Categories', href: '/categories' },
  { name: 'Circuits', href: '/circuits' },
  { name: 'Places', href: '/places' },
  { name: 'Itineraries', href: '/itineraries' },
  { name: 'Events', href: '/events' },
  { name: 'About Delhi', href: '/about' },
];

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
};

export const PLACE_FEATURES = [
  'Historical',
  'Spiritual',
  'Architectural',
  'Family Friendly',
  'Photography',
  'Food Nearby',
  'Shopping Nearby',
  'Accessibility',
];

export const EVENT_CATEGORIES = [
  'Arts & Culture',
  'Music & Dance',
  'Festivals',
  'Food & Culinary',
  'Heritage',
  'Spiritual',
  'Family & Kids',
  'Workshops',
];

export const MAP_PROVIDERS = {
  GOOGLE: 'google',
  MAPBOX: 'mapbox',
};