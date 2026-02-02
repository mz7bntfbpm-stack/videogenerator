import { describe, it, expect } from 'vitest';
import { scenesToCSV } from '../src/utils/export';

describe('scenesToCSV', () => {
  it('converts scenes to CSV with proper escaping', () => {
    const scenes = [
      { id: 'scene-1', title: 'Intro', prompt: 'Welcome', duration: 5, transition: 'Fade' },
      { id: 'scene-2', title: 'Second, Scene', prompt: 'Explain "why"', duration: 8, transition: 'Slide' },
    ];
    const csv = scenesToCSV(scenes as any);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('id,title,prompt,duration,transition');
    expect(lines[1]).toContain('scene-1');
    expect(lines[2]).toContain('scene-2');
  });
});
