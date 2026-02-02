"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from './Modal';

type Cmd = {
  id: string;
  label: string;
  description?: string;
  category: string;
  shortcut?: string;
};

type PaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmdId: string) => void;
};

const CATEGORIES = {
  GENERAL: 'General',
  NAVIGATION: 'Navigation',
  STORYBOARD: 'Storyboard',
  EXPORT: 'Export',
};

const COMMANDS: Cmd[] = [
  { id: 'createVideo', label: 'Create Video', description: 'Start a new video generation', category: CATEGORIES.GENERAL, shortcut: '⌘C' },
  { id: 'openMyVideos', label: 'My Videos', description: 'Open video library', category: CATEGORIES.NAVIGATION, shortcut: '⌘G V' },
  { id: 'openTemplates', label: 'Templates', description: 'Open templates', category: CATEGORIES.NAVIGATION, shortcut: '⌘G T' },
  { id: 'openUsage', label: 'Usage', description: 'Open usage analytics', category: CATEGORIES.NAVIGATION, shortcut: '⌘G U' },
  { id: 'openAccount', label: 'Account', description: 'Open account settings', category: CATEGORIES.NAVIGATION, shortcut: '⌘G A' },
  { id: 'addScene', label: 'Add Scene', description: 'Add new scene to storyboard', category: CATEGORIES.STORYBOARD, shortcut: '⌘N' },
  { id: 'deleteScene', label: 'Delete Scene', description: 'Delete selected scene', category: CATEGORIES.STORYBOARD, shortcut: '⌫' },
  { id: 'duplicateScene', label: 'Duplicate Scene', description: 'Duplicate selected scene', category: CATEGORIES.STORYBOARD, shortcut: '⌘D' },
  { id: 'publishAll', label: 'Publish All', description: 'Publish all storyboard videos', category: CATEGORIES.STORYBOARD, shortcut: '⌘⏎' },
  { id: 'autoGenerate', label: 'Auto-Generate Scenes', description: 'Generate scenes from prompt', category: CATEGORIES.STORYBOARD },
  { id: 'exportPack', label: 'Export Pack', description: 'Export data package (videos + templates)', category: CATEGORIES.EXPORT, shortcut: '⌘E' },
  { id: 'exportPromptBundle', label: 'Export Prompt Bundle', description: 'Export storyboard prompts', category: CATEGORIES.EXPORT, shortcut: '⌘⇧E' },
];

export function CommandPalette({ isOpen, onClose, onCommand }: PaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || (c.description ?? '').toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, Cmd[]> = {};
    filtered.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filtered]);

  const flattenedCommands = useMemo(() => {
    return Object.values(grouped).flat();
  }, [grouped]);

  useEffect(() => {
    if (!isOpen) setQuery('');
    setSelectedIndex(0);
  }, [isOpen]);

  // Ensure focus on open
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flattenedCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flattenedCommands[selectedIndex]) onCommand(flattenedCommands[selectedIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Keyboard navigation helpers could be added here later

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Command Palette" size="md">
      <div className="space-y-3" onKeyDown={handleKeyDown}>
        <input
          ref={inputRef}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Search commands... (⌘K)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
        />
        <div className="max-h-80 overflow-y-auto border-t pt-2 border-slate-200">
          {Object.entries(grouped).map(([category, commands]) => (
            <div key={category} className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {category}
              </div>
              {commands.map((c) => {
                const idx = globalIndex++;
                return (
                  <button
                    key={c.id}
                    className={`w-full text-left px-2 py-2 rounded flex items-center justify-between ${idx === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                    onClick={() => onCommand(c.id)}
                    aria-selected={idx === selectedIndex}
                    role="option"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{c.label}</div>
                      {c.description && <div className="text-xs text-slate-600">{c.description}</div>}
                    </div>
                    {c.shortcut && (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {c.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {flattenedCommands.length === 0 && (
            <div className="px-2 py-2 text-sm text-slate-500">No results</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
