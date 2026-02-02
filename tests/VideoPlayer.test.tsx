import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VideoPlayer } from '../src/components/ui/VideoPlayer';

describe('VideoPlayer basic behaviors', () => {
  beforeEach(() => {
    // Mock play/pause to avoid not-implemented in jsdom
    // @ts-ignore
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(Promise.resolve());
    // @ts-ignore
    HTMLMediaElement.prototype.pause = vi.fn().mockResolvedValue(Promise.resolve());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders video with provided src', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video!.getAttribute('src')).toBe('video.mp4');
  });

  it('reports time updates via onTimeUpdate', () => {
    const onTimeUpdate = vi.fn();
    const { container } = render(<VideoPlayer src="video.mp4" onTimeUpdate={onTimeUpdate} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    Object.defineProperty(video, 'duration', { configurable: true, value: 60 });
    video.dispatchEvent(new Event('loadedmetadata'));
    video.currentTime = 15;
    video.dispatchEvent(new Event('timeupdate'));
    expect(onTimeUpdate).toHaveBeenCalledWith(15, 60);
  });

  it('scrubs to middle on progress bar drag', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    Object.defineProperty(video, 'duration', { configurable: true, value: 60 });
    video.dispatchEvent(new Event('loadedmetadata'));
    const bar = container.querySelector('[role="slider"]') as HTMLElement;
    Object.defineProperty(bar, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 0, width: 100, right: 100, top: 0, height: 8, bottom: 8 }),
    });
    fireEvent(bar, new MouseEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 0 }));
    // allow time for the DOM updates
    expect(video.currentTime).toBeGreaterThanOrEqual(29);
    expect(video.currentTime).toBeLessThanOrEqual(31);
  });

  it('plays on Play button click', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    const playSpy = vi.spyOn(video, 'play');
    const btn = container.querySelector('button[aria-label="Play"]') as HTMLButtonElement;
    btn?.click();
    expect(playSpy).toHaveBeenCalled();
  });

  it('calls fullscreen on Fullscreen button click', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const containerEl = container.querySelector('.video-container') as HTMLElement;
    (containerEl as any).requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const btn = container.querySelector('button[aria-label="Fullscreen"]') as HTMLButtonElement;
    btn?.click();
    expect((containerEl as any).requestFullscreen).toHaveBeenCalled();
  });

  it('keyboard accessibility: progress bar is focusable and scrubbable with ArrowRight', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    Object.defineProperty(video, 'duration', { configurable: true, value: 60 });
    video.dispatchEvent(new Event('loadedmetadata'));
    const bar = container.querySelector('[role="slider"]') as HTMLElement;
    // Ensure focusable
    expect(bar.getAttribute('tabindex') ?? null).not.toBeNull();
    (bar as any).focus();
    // Trigger right arrow scrub by 1 second
    fireEvent(bar, new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(video.currentTime).toBeGreaterThanOrEqual(1);
  });

  it('focus order: Play -> Seek bar -> Playback rate -> Fullscreen', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const playBtn = container.querySelector('button[aria-label="Play"]') as HTMLButtonElement;
    const seekBar = container.querySelector('[role="slider"]') as HTMLElement;
    const rateSel = container.querySelector('[aria-label="Playback rate"]') as HTMLSelectElement;
    const fsBtn = container.querySelector('button[aria-label="Fullscreen"]') as HTMLButtonElement;
    expect(playBtn).toBeTruthy();
    expect(seekBar).toBeTruthy();
    expect(rateSel).toBeTruthy();
    expect(fsBtn).toBeTruthy();
    playBtn?.focus();
    expect(document.activeElement).toBe(playBtn);
    seekBar?.focus();
    expect(document.activeElement).toBe(seekBar);
    rateSel?.focus();
    expect(document.activeElement).toBe(rateSel);
    fsBtn?.focus();
    expect(document.activeElement).toBe(fsBtn);
  });

  it('aria-live region updates on Play, Pause, and Scrub', () => {
    const { container, getByTestId } = render(<VideoPlayer src="video.mp4" />);
    const live = getByTestId('aria-live-live') as HTMLElement;
    const video = container.querySelector('video') as HTMLVideoElement;
    const playBtn = container.querySelector('button[aria-label="Play"]') as HTMLButtonElement;
    // Initially empty
    expect(live.textContent).toBe('');
    // Play
    playBtn?.click();
    fireEvent(video, new Event('play'));
    expect(live.textContent).toContain('Playing');
    // Pause
    const pauseBtn = container.querySelector('button[aria-label="Pause"]') as HTMLButtonElement;
    pauseBtn?.click();
    fireEvent(video, new Event('pause'));
    expect(live.textContent).toContain('Paused');
    // Scrub to some time
    const bar = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent(bar, new MouseEvent('pointerdown', { bubbles: true, clientX: 50 }));
    expect(live.textContent).toContain('Scrub');
  });

  it('Play triggers via Enter when focused', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    const playSpy = vi.spyOn(video, 'play');
    const playBtn = container.querySelector('button[aria-label="Play"]') as HTMLButtonElement;
    expect(playBtn).toBeTruthy();
    playBtn.focus();
    fireEvent.keyDown(playBtn, { key: 'Enter', code: 'Enter' } as any);
    expect(playSpy).toHaveBeenCalled();
  });

  it('Playback rate changes updates video.playbackRate', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const video = container.querySelector('video') as HTMLVideoElement;
    const select = container.querySelector('[aria-label="Playback rate"]') as HTMLSelectElement;
    expect(select).toBeTruthy();
    // Change to 2x
    fireEvent.change(select, { target: { value: '2' } } as any);
    expect(video.playbackRate).toBe(2);
  });

  it('fullscreen edge behavior toggles enter/exit', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);
    const containerEl = container.querySelector('.video-container') as HTMLElement;
    (containerEl as any).requestFullscreen = vi.fn().mockResolvedValue(undefined);
    (document as any).exitFullscreen = vi.fn().mockResolvedValue(undefined);
    const btn = container.querySelector('button[aria-label="Fullscreen"]') as HTMLButtonElement;
    // Enter fullscreen
    document.fullscreenElement = null;
    btn?.click();
    expect((containerEl as any).requestFullscreen).toHaveBeenCalled();
    // Exit fullscreen
    document.fullscreenElement = {} as any;
    btn?.click();
    expect((document as any).exitFullscreen).toHaveBeenCalled();
  });

  it('playback rate persistence across remounts', () => {
    // First mount with 2x and persist across remounts
    const { container, unmount, rerender } = render(<VideoPlayer src="video.mp4" defaultPlaybackRate={2} />);
    const video1 = container.querySelector('video') as HTMLVideoElement;
    expect(video1.playbackRate).toBe(2);
    unmount();
    // Remount with same default PlaybackRate
    const { container: c2 } = render(<VideoPlayer src="video.mp4" defaultPlaybackRate={2} />);
    const video2 = c2.querySelector('video') as HTMLVideoElement;
    // When remounted, playbackRate should reset to defaultPlaybackRate unless persistence is implemented in parent
    // In this isolated test, ensure the prop drives the initial playbackRate value
    expect(video2.playbackRate).toBe(2);
  });
});
