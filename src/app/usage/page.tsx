'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useUsageStats, useVideos } from '@/hooks';

export default function UsagePage() {
  const { data: usageStats, isLoading: statsLoading } = useUsageStats();
  const { data: videosData, isLoading: videosLoading } = useVideos();

  const videos = videosData?.items || [];

  // Calculate recent activity
  const videosThisWeek = videos.filter(v => {
    const created = new Date(v.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created > weekAgo;
  }).length;

  const videosThisMonth = videos.filter(v => {
    const created = new Date(v.createdAt);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return created > monthAgo;
  }).length;

  const videosWithFiles = videos.filter(v => v.fileUrl).length;

  const stats = usageStats ? [
    { label: 'Total Videos', value: usageStats.totalVideos },
    { label: 'Queued', value: usageStats.queuedVideos },
    { label: 'Processing', value: usageStats.processingVideos },
    { label: 'Completed', value: usageStats.completedVideos },
    { label: 'Failed', value: usageStats.failedVideos },
  ] : [];

  const recentActivity = [
    { label: 'Videos in Last 7 Days', value: videosThisWeek },
    { label: 'Videos in Last 30 Days', value: videosThisMonth },
    { label: 'Videos with Files', value: videosWithFiles },
  ];

  const styleBreakdown = usageStats ? Object.entries(usageStats.styleBreakdown).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
    count,
  })) : [];

  const aspectBreakdown = usageStats ? Object.entries(usageStats.aspectBreakdown).map(([name, count]) => ({
    name: name === '16:9' ? '16:9 (Horizontal)' : name === '9:16' ? '9:16 (Vertical)' : '1:1 (Square)',
    count,
  })) : [];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Usage Overview</h1>
          <p className="mt-2 text-slate-600">Track your video generation activity and usage patterns.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statsLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center animate-pulse">
                <div className="w-12 h-8 bg-slate-200 rounded mx-auto mb-2" />
                <div className="w-24 h-4 bg-slate-200 rounded mx-auto" />
              </div>
            ))
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="w-16 h-8 bg-slate-200 rounded mb-2" />
                <div className="w-32 h-4 bg-slate-200 rounded" />
              </div>
            ))
          ) : (
            recentActivity.map((item) => (
              <div key={item.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-sm text-slate-600 mt-1">{item.label}</div>
              </div>
            ))
          )}
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">By Video Style</h2>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : styleBreakdown.length === 0 ? (
              <p className="text-slate-500">No style data available.</p>
            ) : (
              <div className="space-y-3">
                {styleBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="text-sm font-medium text-slate-900">{item.count} videos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">By Aspect Ratio</h2>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : aspectBreakdown.length === 0 ? (
              <p className="text-slate-500">No aspect ratio data available.</p>
            ) : (
              <div className="space-y-3">
                {aspectBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="text-sm font-medium text-slate-900">{item.count} videos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/my-videos">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">🎬</div>
                <h3 className="font-medium text-slate-900">My Videos</h3>
                <p className="text-sm text-slate-600 mt-1">Manage all your generated videos</p>
              </div>
            </Link>
            <Link href="/templates">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-medium text-slate-900">Templates</h3>
                <p className="text-sm text-slate-600 mt-1">Create and manage prompt templates</p>
              </div>
            </Link>
            <Link href="/dashboard">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">➕</div>
                <h3 className="font-medium text-slate-900">Create Video</h3>
                <p className="text-sm text-slate-600 mt-1">Start a new video generation</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
