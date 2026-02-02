"use client";
import React from 'react';

type Scene = {
  id: string;
  title: string;
  duration: number;
  color?: string;
};

export function Timeline({ scenes, activeIndex = -1 }: { scenes: Scene[]; activeIndex?: number }) {
  const scale = 14; // px per second
  const total = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);

  return (
    <div className="timeline" aria-label="Storyboard timeline" style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', height: 40 }}>
        {scenes.map((s, idx) => (
          <div key={s.id} aria-label={s.title} style={{ width: Math.max(30, s.duration * scale), height: '100%', border: '1px solid #cbd5e1', borderRadius: 6, background: s.color ?? '#e5e7eb', marginRight: 8, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 6, top: 6, fontSize: 12 }}>{s.title || 'Scene'}</span>
            {idx === activeIndex && (
              <span style={{ position: 'absolute', bottom: 0, left: 0, height: 4, width: '100%', background: 'rgba(99,102,241,0.8)' }} />
            )}
          </div>
        ))}
      </div>
      <div className="text-sm text-slate-600 mt-2">Total: {total}s</div>
    </div>
  );
}
