"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from './Modal';

type Cmd = {
  id: string;
  label: string;
  description?: string;
};

type PaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmdId: string) => void;
};

const COMMANDS: Cmd[] = [
  { id: 'createVideo', label: 'Create Video', description: 'Start a new video generation' },
  { id: 'publishAll', label: 'Publish All', description: 'Publish all storyboard videos' },
  { id: 'exportPack', label: 'Export Pack', description: 'Export data package (videos + templates)' },
  { id: 'exportPromptBundle', label: 'Export Prompt Bundle', description: 'Export storyboard prompts' },
  { id: 'openMyVideos', label: 'My Videos', description: 'Open video library' },
  { id: 'openTemplates', label: 'Templates', description: 'Open templates' },
  { id: 'openUsage', label: 'Usage', description: 'Open usage analytics' },
  { id: 'openAccount', label: 'Account', description: 'Open account settings' },
];

export function CommandPalette({ isOpen, onClose, onCommand }: PaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || (c.description ?? '').toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!isOpen) setQuery('');
    // reset selected index when opened
  }, [isOpen]);

  // Ensure focus on open
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) onCommand(filtered[selectedIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Keyboard navigation helpers could be added here later

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Command Palette" size="md">
      <div className="space-y-3" onKeyDown={handleKeyDown}>
        <input
          ref={inputRef}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Search commands..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
        />
        <div className="max-h-60 overflow-y-auto border-t pt-2 border-slate-200">
          {filtered.map((c, idx) => (
            <button
              key={c.id}
              className={`w-full text-left px-2 py-2 rounded ${idx === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
              onClick={() => onCommand(c.id)}
              aria-selected={idx === selectedIndex}
              role="option"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              {c.description && <div className="text-xs text-slate-600">{c.description}</div>}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-2 py-2 text-sm text-slate-500">No results</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
