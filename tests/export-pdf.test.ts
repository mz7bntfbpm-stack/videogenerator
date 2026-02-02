import { describe, it, expect } from 'vitest';
import { generatePDF } from '../src/utils/export-pdf';

describe('PDF export (generatePDF)', () => {
  it('generates non-empty PDF bytes for sample scenes', async () => {
    const scenes = [
      { id: 'scene-1', title: 'Intro', prompt: 'Welcome', duration: 5, transition: 'Fade' },
      { id: 'scene-2', title: 'End', prompt: 'Thanks', duration: 3, transition: 'Slide' },
    ];
    const bytes = await generatePDF(scenes as any);
    expect(bytes.length).toBeGreaterThan(0);
  });
});
