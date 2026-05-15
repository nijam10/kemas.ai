/**
 * 3D Preview state management
 * Tracks rotation, zoom, and preview settings
 */

interface PreviewState {
  rotation: number;
  zoom: number;
  autoRotate: boolean;
}

// Placeholder store
export const previewStore: PreviewState = {
  rotation: 0,
  zoom: 1,
  autoRotate: false,
};
