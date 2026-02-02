'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';
import { useVideos, useDeleteVideo, useStyles, useUpdateVideo } from '@/hooks';
import type { Video, VideoFilters, VideoStatus } from '@/types';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'info';
    case 'queued': return 'warning';
    case 'failed': return 'error';
    default: return 'default';
  }
};

export default function MyVideosPage() {
  const [filters, setFilters] = useState<VideoFilters>({});
  const [sortBy, setSortBy] = useState('createdAt');
  
  const { data: videosData, isLoading, refetch } = useVideos(filters);
  const { data: styles } = useStyles();
  const deleteVideo = useDeleteVideo();
  const updateVideo = useUpdateVideo();
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  const videos = videosData?.items || [];

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

  const handleApplyFilters = () => {
    refetch();
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Videos</h1>
          <p className="mt-2 text-slate-600">Manage all your AI-generated videos in one place.</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-slate-700 mr-2">Status</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value as VideoStatus })}
              >
                <option value="all">All</option>
                <option value="queued">Queued</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mr-2">Style</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.styleId || 'all'}
                onChange={(e) => setFilters({ ...filters, styleId: e.target.value === 'all' ? undefined : e.target.value })}
              >
                <option value="all">All Styles</option>
                {styles?.map((style) => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mr-2">Aspect Ratio</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.aspectRatio || 'all'}
                onChange={(e) => setFilters({ ...filters, aspectRatio: e.target.value === 'all' ? undefined : e.target.value as any })}
              >
                <option value="all">All</option>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mr-2">Sort By</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="status">Status</option>
              </select>
            </div>
            <Button variant="secondary" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>

        {/* Video List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 bg-slate-200 rounded" />
                    <div className="space-y-2">
                      <div className="w-48 h-4 bg-slate-200 rounded" />
                      <div className="w-32 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-slate-200 rounded" />
                    <div className="w-20 h-8 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">No videos found matching your filters.</p>
              <Button variant="secondary" onClick={() => { setFilters({}); refetch(); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover rounded" />
                      ) : (
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{video.title}</h3>
                      <div className="flex gap-2 mt-1 text-xs text-slate-500">
                        <span>{video.duration}s</span>
                        <span>•</span>
                        <span>{video.styleId}</span>
                        <span>•</span>
                        <span>{video.aspectRatio}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(video.status)}>{video.status}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { 
                        setSelectedVideo(video); 
                        setEditingTitle(video.title);
                        setShowDetails(true); 
                      }}
                    >
                      View
                    </Button>
                    {video.fileUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={video.fileUrl} download>Download</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Details Modal */}
      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Video Details" size="md">
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
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Style:</span> <span className="ml-2 text-slate-900">{selectedVideo.styleId}</span></div>
              <div><span className="text-slate-500">Aspect Ratio:</span> <span className="ml-2 text-slate-900">{selectedVideo.aspectRatio}</span></div>
              <div><span className="text-slate-500">Duration:</span> <span className="ml-2 text-slate-900">{selectedVideo.duration}s</span></div>
              <div><span className="text-slate-500">Status:</span> <Badge variant={getStatusVariant(selectedVideo.status)} className="ml-2">{selectedVideo.status}</Badge></div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Prompt</label>
              <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-md max-h-32 overflow-y-auto">
                {selectedVideo.prompt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => refetch()}>Refresh Status</Button>
              <Button variant="secondary" size="sm">Duplicate & Edit</Button>
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
