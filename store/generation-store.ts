/**
 * Generation state management
 * Tracks current generation progress and history
 */

import { Design } from "@/types/design";

interface GenerationState {
  currentGeneration: Design | null;
  isGenerating: boolean;
  progress: number;
}

// Placeholder store
export const generationStore: GenerationState = {
  currentGeneration: null,
  isGenerating: false,
  progress: 0,
};
