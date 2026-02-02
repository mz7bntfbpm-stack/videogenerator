'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { mockApi } from '@/lib/mockApi';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Timeline } from '@/components/ui/Timeline';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { getCurrentStoryboard, setCurrentStoryboard } from '@/lib/storyboardStore';
import { useToast } from '@/lib/toast';
import { useState, useEffect } from 'react';
import { useVideos, useCreateVideo, useUsageStats, useTemplates, useStyles, useDeleteVideo, useUpdateVideo } from '@/hooks';
import type { CreateVideoInput, Video } from '@/types';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'info';
    case 'queued': return 'warning';
    case 'failed': return 'error';
    default: return 'default';
  }
};

type Scene = { id: string; title: string; prompt: string; duration: number; transition: string };

export default function DashboardPage() {
  const { data: videosData, isLoading: videosLoading } = useVideos();
  const { data: templatesData } = useTemplates();
  const { data: usageStats } = useUsageStats();
  const { data: styles } = useStyles();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const createVideo = useCreateVideo();
  const deleteVideo = useDeleteVideo();
  const updateVideo = useUpdateVideo();
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  
  const [formData, setFormData] = useState<CreateVideoInput>({
    title: '',
    prompt: '',
    styleId: 'clean-motion',
    aspectRatio: '16:9',
    duration: 30,
  });

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVideo.mutateAsync(formData);
      afterCreateVideo();
      setFormData({ title: '', prompt: '', styleId: 'clean-motion', aspectRatio: '16:9', duration: 30 });
    } catch (error) {
      console.error('Failed to create video:', error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    try {
      await deleteVideo.mutateAsync(selectedVideo.id);
      setShowDelete(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleUpdateTitle = async () => {
    if (!selectedVideo || !editingTitle) return;
    try {
      await updateVideo.mutateAsync({ id: selectedVideo.id, data: { title: editingTitle } });
      setShowDetails(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Failed to update video:', error);
    }
  };

  const recentVideos = videosData?.items.slice(0, 5) || [];
  const quickTemplates = templatesData?.items.slice(0, 3) || [];
  
  const stats = usageStats ? [
    { label: 'Total Videos', value: usageStats.totalVideos },
    { label: 'In Progress', value: usageStats.processingVideos },
    { label: 'Completed', value: usageStats.completedVideos },
    { label: 'Queued', value: usageStats.queuedVideos },
  ] : [];

  const styleOptions = styles?.map(s => ({ value: s.id, label: s.name })) || [];
  const aspectOptions = [
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
    { value: '1:1', label: '1:1' },
  ];
  const durationOptions = [
    { value: '15', label: '15 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '60 seconds' },
    { value: '120', label: '2 minutes' },
  ];

  // Storyboard (crazy feature) state
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [timelineResizing, setTimelineResizing] = useState<{ id: string; initialDuration: number; startX: number } | null>(null);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [sceneSearchQuery, setSceneSearchQuery] = useState('');
  
  // Undo/Redo state
  const [history, setHistory] = useState<Scene[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const maxHistorySize = 50;
  
  // Filtered scenes based on search
  const filteredScenes = useMemo(() => {
    if (!sceneSearchQuery) return scenes;
    const query = sceneSearchQuery.toLowerCase();
    return scenes.filter(s => 
      s.title?.toLowerCase().includes(query) || 
      s.prompt?.toLowerCase().includes(query)
    );
  }, [scenes, sceneSearchQuery]);
  
  const addToHistory = (newScenes: Scene[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newScenes);
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setScenes(history[historyIndex - 1]);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setScenes(history[historyIndex + 1]);
    }
  };
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  const addScene = () => {
    const s: Scene = {
      id: 'scene-' + Date.now(),
      title: '',
      prompt: '',
      duration: 5,
      transition: 'Fade',
    };
    const newScenes = [...scenes, s];
    addToHistory(newScenes);
    setScenes(newScenes);
    setSelectedSceneId(s.id);
  };
  
  const deleteScene = (id: string) => {
    const newScenes = scenes.filter(s => s.id !== id);
    addToHistory(newScenes);
    setScenes(newScenes);
    if (selectedSceneId === id) setSelectedSceneId(null);
  };
  
  const duplicateScene = (id: string) => {
    const sceneToDuplicate = scenes.find(s => s.id === id);
    if (!sceneToDuplicate) return;
    const index = scenes.findIndex(s => s.id === id);
    const newScene: Scene = {
      ...sceneToDuplicate,
      id: 'scene-' + Date.now(),
      title: sceneToDuplicate.title ? sceneToDuplicate.title + ' (Copy)' : '',
    };
    const newScenes = [...scenes.slice(0, index + 1), newScene, ...scenes.slice(index + 1)];
    addToHistory(newScenes);
    setScenes(newScenes);
  };
  
  const updateScene = (id: string, patch: Partial<Scene>) => {
    const newScenes = scenes.map(s => s.id === id ? { ...s, ...patch } : s);
    addToHistory(newScenes);
    setScenes(newScenes);
  };
  
  const moveScene = (fromIndex: number, toIndex: number) => {
    const newScenes = [...scenes];
    const [removed] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, removed);
    addToHistory(newScenes);
    setScenes(newScenes);
  };
  
  const totalStoryboardDuration = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);

  const onAutoGenerate = async () => {
    const generated = await mockApi.generateStoryboard(formData.prompt || '');
    // Normalize: ensure duration is number
    setScenes(generated.map(s => ({ ...s, duration: s.duration ?? 5 })));
  };

  const TIMELINE_SCALE = 14; // px per second

  const onTimelineMouseDown = (e: React.MouseEvent, sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    setTimelineResizing({ id: sceneId, initialDuration: scene.duration, startX: (e as any).clientX ?? 0 });
  };

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      if (!timelineResizing) return;
      const deltaPx = ev.clientX - timelineResizing.startX;
      const deltaSec = deltaPx / TIMELINE_SCALE;
      const newDuration = Math.max(1, Math.round(timelineResizing.initialDuration + deltaSec));
      setScenes((prev) => prev.map((s) => (s.id === timelineResizing.id ? { ...s, duration: newDuration } : s)));
    };
    const onUp = () => {
      if (timelineResizing) {
        addToHistory(scenes);
        setTimelineResizing(null);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [timelineResizing]);

  // Custom event listeners for command palette
  useEffect(() => {
    const handleAddScene = () => addScene();
    const handleDeleteScene = () => {
      if (selectedSceneId) deleteScene(selectedSceneId);
      else showToast('No scene selected', 'warning');
    };
    const handleDuplicateScene = () => {
      if (selectedSceneId) duplicateScene(selectedSceneId);
      else showToast('No scene selected', 'warning');
    };
    const handleAutoGenerate = () => onAutoGenerate();
    const handleCreateVideo = () => {
      setFormData({ title: 'Palette Video', prompt: 'Describe your video from palette', styleId: 'clean-motion', aspectRatio: '16:9', duration: 30 });
      showToast('Form pre-filled', 'success');
    };
    const handleUndo = () => undo();
    const handleRedo = () => redo();

    window.addEventListener('vg-palette-add-scene', handleAddScene);
    window.addEventListener('vg-palette-delete-scene', handleDeleteScene);
    window.addEventListener('vg-palette-duplicate-scene', handleDuplicateScene);
    window.addEventListener('vg-palette-auto-generate', handleAutoGenerate);
    window.addEventListener('vg-palette-create-video', handleCreateVideo);
    window.addEventListener('vg-palette-undo', handleUndo);
    window.addEventListener('vg-palette-redo', handleRedo);

    return () => {
      window.removeEventListener('vg-palette-add-scene', handleAddScene);
      window.removeEventListener('vg-palette-delete-scene', handleDeleteScene);
      window.removeEventListener('vg-palette-duplicate-scene', handleDuplicateScene);
      window.removeEventListener('vg-palette-auto-generate', handleAutoGenerate);
      window.removeEventListener('vg-palette-create-video', handleCreateVideo);
      window.removeEventListener('vg-palette-undo', handleUndo);
      window.removeEventListener('vg-palette-redo', handleRedo);
    };
  }, [selectedSceneId]);

  // Toast hook
  const { showToast } = useToast();

  // Voiceover for selected video
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playingVoiceover, setPlayingVoiceover] = useState(false);
  const [voiceLang, setVoiceLang] = useState<string>('en-US');
  const playVoiceover = (text: string, lang?: string) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const utt = new SpeechSynthesisUtterance(text);
    const langPrefix = (lang || voiceLang).split('-')[0];
    const v = voices.find(voice => voice.lang?.startsWith(langPrefix)) || voices.find(voice => voice.lang?.startsWith(voiceLang)) || voices[0];
    if (v) utt.voice = v;
    setPlayingVoiceover(true);
    utt.onend = () => setPlayingVoiceover(false);
    synth.speak(utt);
  };

  // Voices loader
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const loadVoices = () => {
        const v = synth.getVoices();
        setVoices(v);
      };
      loadVoices();
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  // Export Pack
  const exportPack = () => {
    const videos = mockApi.getVideos();
    const templates = mockApi.getTemplates();
    const pack = { videos, templates, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoGenerator_Pack.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const publishAllFromPalette = async () => {
    const scenes = getCurrentStoryboard();
    if (!scenes.length) {
      showToast('No storyboard loaded for publishing', 'warning');
      return;
    }
    try {
      const videos = await mockApi.publishStoryboard(scenes);
      showToast(`Published ${videos.length} videos`, 'success');
    } catch (e) {
      showToast('Failed to publish storyboard', 'error');
    }
  };

  // Palette command handler (11-14)
  const handlePaletteCommand = (cmd: string) => {
    switch (cmd) {
      case 'openMyVideos': window.location.href = '/my-videos'; break;
      case 'openTemplates': window.location.href = '/templates'; break;
      case 'openUsage': window.location.href = '/usage'; break;
      case 'openAccount': window.location.href = '/account'; break;
      case 'exportPack': exportPack(); break;
      case 'exportPromptBundle': {
        const scenesForBundle = scenes.map((s) => ({ sceneTitle: s.title || s.id, prompt: s.prompt, duration: s.duration }));
        mockApi.generatePromptBundle(scenes).then((bundle) => {
          const payload = { bundleName: bundle.bundleName, items: bundle.items };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = bundle.bundleName + '.json';
          document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        });
        break;
      }
      case 'publishAll': publishAllFromPalette(); break;
      default: break;
    }
  };

  // Achievements (simple placeholders)
  const totalVideos = videosData?.items.length ?? 0;
  const achievements = [
    { id: 'a1', label: 'First Video', unlocked: totalVideos >= 1 },
    { id: 'a2', label: 'Template Pro', unlocked: (templatesData?.items.length ?? 0) >= 1 },
    { id: 'a3', label: 'Pack Exporter', unlocked: false },
  ];

  // Trigger a toast after a successful video creation
  // (hook into the mutateAsync promise below)
  const afterCreateVideo = () => {
    if (showToast) showToast('Video created', 'success');
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Create videos, track progress, and manage your content.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create & Recent */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create New Video Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Video</h2>
              <form className="space-y-4" onSubmit={handleCreateVideo}>
                <Input 
                  label="Video Title" 
                  placeholder="Enter a title for your video" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Text Prompt</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Describe what you want to create..."
                    required
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    label="Style"
                    options={styleOptions.length > 0 ? styleOptions : [{ value: 'clean-motion', label: 'Clean Motion' }]}
                    value={formData.styleId}
                    onChange={(e) => setFormData({ ...formData, styleId: e.target.value })}
                  />
                  <Select
                    label="Aspect Ratio"
                    options={aspectOptions}
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                  />
                  <Select
                    label="Duration"
                    options={durationOptions}
                    value={String(formData.duration)}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto" 
                  disabled={createVideo.isPending}
                >
                  {createVideo.isPending ? 'Creating...' : 'Generate Video'}
                </Button>
              </form>
            </div>

            {/* Storyboard Timeline (Killer) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Storyboard Timeline</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} title="Undo (⌘Z)">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                  </Button>
                  <Button onClick={addScene}>Add Scene</Button>
                  <Button variant="secondary" onClick={onAutoGenerate}>Auto-Generate</Button>
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search scenes by title or prompt..."
                  value={sceneSearchQuery}
                  onChange={(e) => setSceneSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="timeline" style={{ overflowX: 'auto' }} aria-label="Storyboard timeline">
                <div style={{ display: 'flex', alignItems: 'stretch', height: 40 }}>
                  {filteredScenes.map((scene) => {
                    const width = Math.max(30, scene.duration * 14);
                    return (
                      <div
                        key={scene.id}
                        role="group"
                        aria-label={scene.title || 'scene'}
                        style={{ width, height: '100%', border: '1px solid #cbd5e1', borderRadius: 6, background: '#e8f0ff', display: 'inline-block', marginRight: 8, position: 'relative' }}
                        title={`Duration ${scene.duration}s`}
                      >
                        <div style={{ position: 'absolute', left: 6, top: 6, fontSize: 12, color: '#1f2937' }}>{scene.title || 'Scene'}</div>
                        <div
                          onMouseDown={(e) => onTimelineMouseDown(e, scene.id)}
                          style={{ position: 'absolute', right: -4, top: 0, width: 8, height: '100%', cursor: 'ew-resize', background: '#374151' }}
                          aria-label="resize"
                          role="button"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Timeline details */}
              <div className="mt-2 text-sm text-slate-600">Total: {filteredScenes.reduce((a, s) => a + s.duration, 0)}s</div>
            </div>

            {/* Video Preview - quick playback of a sample video */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Video Preview</h2>
              <VideoPlayer
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://dummyimage.com/640x360/111/fff.png&text=Preview"
              />
            </div>
              {scenes.length === 0 ? (
                <p className="text-sm text-slate-600">No scenes yet. Add scenes to outline your video structure.</p>
              ) : (
                <div className="space-y-3">
                  {filteredScenes.map((scene, index) => {
                    const actualIndex = scenes.findIndex(s => s.id === scene.id);
                    return (
                      <div
                        key={scene.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedSceneId(scene.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          const actualIndex = scenes.findIndex(s => s.id === scene.id);
                          setDropTargetIndex(actualIndex);
                        }}
                        onDrop={() => {
                          if (draggedSceneId && dropTargetIndex !== null) {
                            const fromIndex = scenes.findIndex(s => s.id === draggedSceneId);
                            if (fromIndex !== -1 && fromIndex !== dropTargetIndex) {
                              moveScene(fromIndex, dropTargetIndex);
                            }
                          }
                          setDraggedSceneId(null);
                          setDropTargetIndex(null);
                        }}
                        onDragEnd={() => {
                          setDraggedSceneId(null);
                          setDropTargetIndex(null);
                        }}
                        className={`grid grid-cols-12 gap-3 items-center p-2 rounded border transition-colors ${selectedSceneId === scene.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <div className="col-span-1 flex items-center justify-center text-slate-400 cursor-move">⋮⋮</div>
                      <input
                        className="col-span-3 border rounded px-2 py-1 bg-white"
                        placeholder="Scene title"
                        value={scene.title}
                        onClick={() => setSelectedSceneId(scene.id)}
                        onChange={(e)=>updateScene(scene.id, { title: e.target.value })}
                      />
                      <input
                        className="col-span-1 border rounded px-2 py-1 bg-white"
                        type="number"
                        value={scene.duration}
                        onClick={() => setSelectedSceneId(scene.id)}
                        onChange={(e)=>updateScene(scene.id, { duration: Number(e.target.value) })}
                      />
                      <select
                        className="col-span-2 border rounded px-2 py-1 bg-white"
                        value={scene.transition}
                        onClick={() => setSelectedSceneId(scene.id)}
                        onChange={(e)=>updateScene(scene.id, { transition: e.target.value })}
                      >
                        <option>Fade</option><option>Slide</option><option>Wipe</option>
                      </select>
                      <input
                        className="col-span-4 border rounded px-2 py-1 bg-white"
                        placeholder="Prompt"
                        value={scene.prompt}
                        onClick={() => setSelectedSceneId(scene.id)}
                        onChange={(e)=>updateScene(scene.id, { prompt: e.target.value })}
                      />
                      <div className="col-span-1 flex items-center gap-1">
                        <button
                          onClick={() => duplicateScene(scene.id)}
                          className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                          title="Duplicate scene"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                        <button
                          onClick={() => deleteScene(scene.id)}
                          className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          title="Delete scene"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4"><Timeline scenes={scenes.map(s => ({ id: s.id, title: s.title || 'Scene', duration: s.duration, color: '#dbeafe' }))} activeIndex={scenes.findIndex(s => s.id === selectedSceneId)} /></div>
              <div className="mt-3 text-sm text-slate-600">Total storyboard duration: {totalStoryboardDuration}s</div>
              <div className="mt-4 flex gap-2">
                <Button onClick={exportPack}>Export Pack</Button>
                {selectedSceneId && (
                  <div className="flex gap-2 ml-auto">
                    <Button variant="secondary" size="sm" onClick={() => duplicateScene(selectedSceneId)}>Duplicate Scene</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteScene(selectedSceneId)}>Delete Scene</Button>
                  </div>
                )}
              </div>
            </div>

        {/* Recent Videos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Videos</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            {videosLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 animate-pulse">
                      <div className="space-y-2">
                        <div className="w-48 h-4 bg-slate-200 rounded" />
                        <div className="w-32 h-3 bg-slate-200 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
            ) : (
                <div className="space-y-3">
              {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div>
                        <h3 className="font-medium text-slate-900">{video.title}</h3>
                        <p className="text-sm text-slate-500">{new Date(video.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(video.status)}>{video.status}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => { 
                          setSelectedVideo(video); 
                          setEditingTitle(video.title);
                          setShowDetails(true); 
                        }}>View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Usage & Templates */}
          <div className="space-y-6">
            {/* Usage Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Usage Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-slate-50">
                    <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                    <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((a) => (
                  <div key={a.id} className="p-3 rounded bg-slate-50 flex items-center justify-between">
                    <span>{a.label}</span>
                    <span className={`text-xs ${a.unlocked ? 'text-green-700' : 'text-slate-500'}`}>
                      {a.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Quick Templates</h2>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
              {quickTemplates.length > 0 ? (
                <div className="space-y-3">
                  {quickTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm font-medium text-slate-700">{template.title}</span>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            title: `Video from ${template.title}`,
                            prompt: template.basePrompt,
                            styleId: template.defaultStyle,
                            aspectRatio: template.defaultAspectRatio,
                            duration: template.defaultDuration,
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <p className="text-sm">No templates yet</p>
                  <p className="text-xs mt-1">Create your first template</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onCommand={handlePaletteCommand} />

      {/* Video Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Video Details"
        size="md"
      >
        {selectedVideo && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 w-24">Title</label>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button size="sm" onClick={handleUpdateTitle} disabled={updateVideo.isPending}>
                {updateVideo.isPending ? 'Saving...' : 'Save'}
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600">Voice</label>
                <select
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value)}
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => playVoiceover(selectedVideo.prompt, voiceLang)} disabled={playingVoiceover}>
                {playingVoiceover ? 'Speaking…' : 'Play Voiceover'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Style:</span>
                <span className="ml-2 text-slate-900">{selectedVideo.styleId}</span>
              </div>
              <div>
                <span className="text-slate-500">Aspect Ratio:</span>
                <span className="ml-2 text-slate-900">{selectedVideo.aspectRatio}</span>
              </div>
              <div>
                <span className="text-slate-500">Duration:</span>
                <span className="ml-2 text-slate-900">{selectedVideo.duration}s</span>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <Badge variant={getStatusVariant(selectedVideo.status)} className="ml-2">{selectedVideo.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Prompt</label>
              <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-md">
                {selectedVideo.prompt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="secondary" size="sm">Refresh Status</Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setFormData({
                    title: `${selectedVideo.title} (Copy)`,
                    prompt: selectedVideo.prompt,
                    styleId: selectedVideo.styleId,
                    aspectRatio: selectedVideo.aspectRatio,
                    duration: selectedVideo.duration,
                  });
                  setShowDetails(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Duplicate & Edit
              </Button>
              {selectedVideo.fileUrl && (
                <Button variant="secondary" size="sm" asChild>
                  <a href={selectedVideo.fileUrl} download>Download</a>
                </Button>
              )}
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => { setShowDelete(true); setShowDetails(false); }}
                disabled={deleteVideo.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Video?" size="sm">
        <div className="space-y-4">
          <p className="text-slate-600">Are you sure you want to delete this video? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteVideo} disabled={deleteVideo.isPending}>
              {deleteVideo.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
