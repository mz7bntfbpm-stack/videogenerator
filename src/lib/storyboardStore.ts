import type { Scene } from '@/types';

let currentStoryboard: Scene[] = [];

export function setCurrentStoryboard(scenes: Scene[]) {
  currentStoryboard = scenes;
}

export function getCurrentStoryboard(): Scene[] {
  return currentStoryboard;
}
