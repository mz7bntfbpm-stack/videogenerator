"use client";
import React from 'react';

type Scene = {
  id: string;
  title: string;
  duration: number;
  color?: string;
};

export function Timeline({ scenes }: { scenes: Scene[] }) {
  const scale = 14; // px per second
  const total = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);

  return (
    <div className="timeline" aria-label="Storyboard timeline" style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', height: 40 }}>
        {scenes.map((s) => (
          <div key={s.id} aria-label={s.title} style={{ width: Math.max(30, s.duration * scale), height: '100%', border: '1px solid #cbd5e1', borderRadius: 6, background: s.color ?? '#e5e7eb', marginRight: 8, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 6, top: 6, fontSize: 12 }}>{s.title || 'Scene'}</span>
          </div>
        ))}
      </div>
      <div className="text-sm text-slate-600 mt-2">Total: {total}s</div>
    </div>
  );
}
