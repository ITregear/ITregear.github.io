// Import all images from thoughts/images directory using Vite's glob import
// This ensures they are included in the build and get proper URLs
const thoughtsImages = import.meta.glob('/src/assets/thoughts/images/*', { 
  eager: true, 
  import: 'default' 
}) as Record<string, string>;

// Create a mapping from filename to imported URL
const imageMap = new Map<string, string>();

Object.entries(thoughtsImages).forEach(([path, url]) => {
  const filename = path.split('/').pop();
  if (filename) {
    imageMap.set(filename, url);
  }
});

// Helper function to get the proper image URL for a filename
export function getThoughtsImageUrl(filename: string): string | null {
  return imageMap.get(filename) || null;
}

// Helper function to get all available image filenames (for debugging)
export function getAvailableImageFilenames(): string[] {
  return Array.from(imageMap.keys());
}

// Export the raw image map for advanced usage
export { imageMap as thoughtsImageMap };
