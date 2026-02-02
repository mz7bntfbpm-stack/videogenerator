import React, { useEffect, useRef, useState } from 'react';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
  defaultPlaybackRate?: number;
};

export function VideoPlayer({ src, poster, onEnded, onTimeUpdate, autoplay = false, muted = false, className, defaultPlaybackRate = 1 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(defaultPlaybackRate);
  // reflect prop changes to playback rate when parent changes defaultPlaybackRate
  useEffect(() => {
    setPlaybackRate(defaultPlaybackRate);
  }, [defaultPlaybackRate]);
  // aria live region text for accessibility announcements
  const [ariaLiveText, setAriaLiveText] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => { setPlaying(true); setAriaLiveText('Playing'); };
    const onPause = () => { setPlaying(false); setAriaLiveText('Paused'); };
    const onTime = () => {
      const d = video.duration || 0;
      const t = video.currentTime || 0;
      setProgress(d ? (t / d) * 100 : 0);
      onTimeUpdate?.(t, d);
      setAriaLiveText(`Time ${Math.round(t)} of ${Math.round(d)} seconds`);
    };
    const onLoaded = () => setDuration(video.duration || 0);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded || (() => {}));
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [onEnded, onTimeUpdate]);

  useEffect(() => {
    if (!videoRef.current) return;
    if ( autoplay ) {
      videoRef.current.play().catch(() => {});
    }
  }, [autoplay]);

  // Keep playbackRate in sync with internal state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Pointer-based scrubbing: update currentTime while dragging the progress bar
  useEffect(() => {
    const onMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const bar = progressBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(Math.max((ev.clientX - rect.left) / rect.width, 0), 1);
      if (videoRef.current && duration > 0) {
        videoRef.current.currentTime = ratio * duration;
      }
      setProgress(ratio * 100);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, duration]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const v = videoRef.current;
    if (v && duration > 0) {
      v.currentTime = ratio * duration;
    }
    setProgress(ratio * 100);
  };

  // ARIA live region predicted updates on state changes
  useEffect(() => {
    // announce play/pause based on current state after time updates
  }, [ariaLiveText]);
  // Fullscreen toggle
  const toggleFullscreen = () => {
    const el = videoContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Progress bar keyboard navigation: ArrowLeft/ArrowRight to scrub time
  const handleProgressKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v || duration <= 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(v.currentTime + 1, duration);
      v.currentTime = next;
      setProgress((next / duration) * 100);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(v.currentTime - 1, 0);
      v.currentTime = prev;
      setProgress((prev / duration) * 100);
    }
  };

  return (
    <div className={`video-player ${className ?? ''}`} aria-label="Video Player">
        <div ref={videoContainerRef} className="video-container" style={{ background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div className="controls" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button data-testid="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <div ref={progressBarRef} data-testid="seek-bar" onPointerDown={(e) => {
            const bar = progressBarRef.current;
            if (!bar) return;
            const rect = bar.getBoundingClientRect();
            const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            if (videoRef.current && duration > 0) videoRef.current.currentTime = ratio * duration;
            setProgress(ratio * 100);
            setDragging(true);
            setAriaLiveText(`Scrub to ${Math.round(ratio * duration)} seconds`);
            try { (e.currentTarget as any).setPointerCapture?.(e.pointerId); } catch {}
          }} onPointerMove={(e)=>{ if (dragging){/* handled by global pointermove listener */}}} style={{ flex: 1, height: 8, background: '#555', borderRadius: 4, position: 'relative', cursor: 'pointer' }} aria-label="Seek bar" role="slider" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} tabIndex={0} onKeyDown={handleProgressKeyDown}>
            <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: '#4f46e5', borderRadius: 4 }} />
          </div>
          {/* Playback speed control */}
          <select
            aria-label="Playback rate"
            value={playbackRate}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPlaybackRate(v);
              if (videoRef.current) videoRef.current.playbackRate = v;
            }}
            style={{ background: '#111', color: '#fff', border: '1px solid #555', borderRadius: 6, padding: '6px 8px' }}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
          <button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '6px 10px', borderRadius: 6, marginLeft: 6 }}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <span style={{ color: '#fff', fontSize: 12 }}>{Math.round(progress)}%</span>
          <div data-testid="aria-live-live" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
            {ariaLiveText}
          </div>
        </div>
      </div>
    </div>
  );
}
