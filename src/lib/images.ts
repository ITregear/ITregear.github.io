// Thoughts images for Next.js static export
const thoughtsImageMap = new Map<string, string>([
  ['507_movements_and_collins_sharks.png', '/thoughts-images/507_movements_and_collins_sharks.png'],
  ['demo_day_side_by_side.png', '/thoughts-images/demo_day_side_by_side.png'],
  ['fusion-v3b.jpg', '/thoughts-images/fusion-v3b.jpg'],
  ['kaikaku-vertical-product-map.png', '/thoughts-images/kaikaku-vertical-product-map.png'],
  ['Robot.png', '/thoughts-images/Robot.png'],
])

// Helper function to get the proper image URL for a filename
export function getThoughtsImageUrl(filename: string): string | null {
  return thoughtsImageMap.get(filename) || null
}

// Helper function to get all available image filenames (for debugging)
export function getAvailableImageFilenames(): string[] {
  return Array.from(thoughtsImageMap.keys())
}

// Export the raw image map for advanced usage
export { thoughtsImageMap }
