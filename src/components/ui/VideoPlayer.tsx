import React, { useEffect, useRef, useState } from 'react';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
};

export function VideoPlayer({ src, poster, onEnded, onTimeUpdate, autoplay = false, muted = false, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [dragging, setDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      const d = video.duration || 0;
      const t = video.currentTime || 0;
      setProgress(d ? (t / d) * 100 : 0);
      onTimeUpdate?.(t, d);
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

  // Scrubbing via dragging on the progress bar (pointer events)
  // no-op placeholder for historical reference

  return (
    <div className={`video-player ${className ?? ''}`} aria-label="Video Player">
      <div className="video-container" style={{ background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div className="controls" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <div ref={progressBarRef} onPointerDown={(e) => {
            const bar = progressBarRef.current;
            if (!bar) return;
            const rect = bar.getBoundingClientRect();
            const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            if (videoRef.current && duration > 0) videoRef.current.currentTime = ratio * duration;
            setProgress(ratio * 100);
            setDragging(true);
            try { (e.currentTarget as any).setPointerCapture?.(e.pointerId); } catch {}
          }} onPointerMove={(e)=>{ if (dragging){/* handled by global pointermove listener */}}} style={{ flex: 1, height: 8, background: '#555', borderRadius: 4, position: 'relative', cursor: 'pointer' }} aria-label="Seek bar" role="slider" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
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
          <span style={{ color: '#fff', fontSize: 12 }}>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
