import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPlayer } from '../src/components/ui/VideoPlayer';

describe('Dashboard end-to-end skeleton (Video Preview)', () => {
  it('renders VideoPlayer preview and can play', () => {
    const { container } = render(<VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video).not.toBeNull();
    const playSpy = vi.spyOn(video, 'play').mockResolvedValue(Promise.resolve());
    const btn = container.querySelector('button[aria-label="Play"]') as HTMLButtonElement;
    btn?.click();
    expect(playSpy).toHaveBeenCalled();
  });
});
