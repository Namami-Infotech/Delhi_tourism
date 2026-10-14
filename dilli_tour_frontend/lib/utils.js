/**
 * Utility functions for Delhi Tourism Platform.
 */

/**
 * Combines class names conditionally.
 * Usage: cn('base-class', condition && 'conditional-class', 'always-class')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a date string into readable format.
 */
export function formatDate(dateString, options = {}) {
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return date.toLocaleDateString('en-IN', defaultOptions);
}

/**
 * Truncates text to specified length with ellipsis.
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generates a placeholder image URL.
 */
export function getPlaceholderImage(width = 400, height = 300, text = 'Image') {
  return `https://via.placeholder.com/${width}x${height}/d4821e/ffffff?text=${encodeURIComponent(text)}`;
}

/**
 * Validates email format.
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounces a function call.
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Formats location for display.
 */
export function formatLocation(address, locality) {
  if (locality && address && address.includes(locality)) {
    return address;
  }
  return [locality, address].filter(Boolean).join(', ');
}