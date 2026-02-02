'use client';

import React, { useState } from 'react';
import { TopNav } from './TopNav';
import { AuthModalContainer } from './AuthModalContainer';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useState, useEffect } from 'react';
import { navigate } from 'next/navigation';

interface PageShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function PageShell({ children, pageTitle }: PageShellProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  // Keyboard shortcut: Ctrl/Cmd + K to open Command Palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setPaletteOpen((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav
        onLogin={openLogin}
        onSignUp={openSignUp}
        user={null}
      />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <AuthModalContainer
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onCommand={(cmd) => {
        // Dispatch actions from palette to global navigation / actions
        switch (cmd) {
          case 'openMyVideos': window.location.href = '/my-videos'; break;
          case 'openTemplates': window.location.href = '/templates'; break;
          case 'openUsage': window.location.href = '/usage'; break;
          case 'openAccount': window.location.href = '/account'; break;
          case 'exportPack': {
            const evt = new CustomEvent('vg-palette-export-pack');
            window.dispatchEvent(evt);
            break;
          }
          case 'publishAll': {
            const evt = new CustomEvent('vg-palette-publish-all');
            window.dispatchEvent(evt);
            break;
          }
          case 'exportPromptBundle': {
            const evt = new CustomEvent('vg-palette-export-prompt-bundle');
            window.dispatchEvent(evt);
            break;
          }
          case 'addScene': {
            const evt = new CustomEvent('vg-palette-add-scene');
            window.dispatchEvent(evt);
            break;
          }
          case 'deleteScene': {
            const evt = new CustomEvent('vg-palette-delete-scene');
            window.dispatchEvent(evt);
            break;
          }
          case 'duplicateScene': {
            const evt = new CustomEvent('vg-palette-duplicate-scene');
            window.dispatchEvent(evt);
            break;
          }
          case 'autoGenerate': {
            const evt = new CustomEvent('vg-palette-auto-generate');
            window.dispatchEvent(evt);
            break;
          }
          case 'createVideo': {
            const evt = new CustomEvent('vg-palette-create-video');
            window.dispatchEvent(evt);
            break;
          }
          case 'undo': {
            const evt = new CustomEvent('vg-palette-undo');
            window.dispatchEvent(evt);
            break;
          }
          case 'redo': {
            const evt = new CustomEvent('vg-palette-redo');
            window.dispatchEvent(evt);
            break;
          }
          default:
            break;
        }
      }} />
    </div>
  );
}
