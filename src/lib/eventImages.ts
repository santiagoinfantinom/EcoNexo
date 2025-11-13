/**
 * Helper function to get default image URL for events based on category
 * Ensures all events have images even if image_url is not provided
 */
export function getDefaultEventImage(category: string): string {
  // Normalize category name (handle different languages and formats)
  const normalizedCategory = category.toLowerCase().trim();
  
  // Map categories to default Unsplash images
  if (
    normalizedCategory.includes('medio ambiente') ||
    normalizedCategory.includes('environment') ||
    normalizedCategory.includes('umwelt') ||
    normalizedCategory === 'environment'
  ) {
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
  }
  
  if (
    normalizedCategory.includes('educación') ||
    normalizedCategory.includes('education') ||
    normalizedCategory.includes('bildung') ||
    normalizedCategory === 'education'
  ) {
    return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop';
  }
  
  if (
    normalizedCategory.includes('salud') ||
    normalizedCategory.includes('health') ||
    normalizedCategory.includes('gesundheit') ||
    normalizedCategory === 'health'
  ) {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
  }
  
  if (
    normalizedCategory.includes('océanos') ||
    normalizedCategory.includes('oceans') ||
    normalizedCategory.includes('ozeane') ||
    normalizedCategory === 'oceans'
  ) {
    return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop';
  }
  
  if (
    normalizedCategory.includes('alimentación') ||
    normalizedCategory.includes('food') ||
    normalizedCategory.includes('ernährung') ||
    normalizedCategory === 'food'
  ) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop';
  }
  
  if (
    normalizedCategory.includes('comunidad') ||
    normalizedCategory.includes('community') ||
    normalizedCategory.includes('gemeinschaft') ||
    normalizedCategory === 'community'
  ) {
    return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop';
  }
  
  // Default fallback image (nature/community)
  return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop';
}

/**
 * Ensures an event has an image URL, using default if not provided
 */
export function ensureEventImage(event: { image_url?: string | null; category: string; website?: string }): string {
  // If event has explicit image_url, use it
  if (event.image_url) {
    return event.image_url;
  }
  
  // If event has website, use website preview as fallback
  if (event.website) {
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(event.website)}?w=800`;
  }
  
  // Otherwise, use default image based on category
  return getDefaultEventImage(event.category);
}


