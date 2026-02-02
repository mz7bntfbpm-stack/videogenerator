'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';
import { useTemplates, useDeleteTemplate, useCreateTemplate, useUpdateTemplate, useStyles, useCreateVideo } from '@/hooks';
import type { Template, TemplateFilters, CreateTemplateInput, AspectRatio } from '@/types';

export default function TemplatesPage() {
  const [filters, setFilters] = useState<TemplateFilters>({});
  const { data: templatesData, isLoading, refetch } = useTemplates(filters);
  const { data: styles } = useStyles();
  const deleteTemplate = useDeleteTemplate();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const createVideo = useCreateVideo();
  
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUse, setShowUse] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Form states
  const [createForm, setCreateForm] = useState<CreateTemplateInput>({
    title: '',
    basePrompt: '',
    defaultStyle: 'clean-motion',
    defaultAspectRatio: '16:9',
    defaultDuration: 30,
    isPublic: false,
  });
  
  const [useForm, setUseForm] = useState({
    title: '',
    prompt: '',
  });

  const templates = templatesData?.items || [];

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate.mutateAsync(createForm);
      setShowCreate(false);
      setCreateForm({
        title: '',
        basePrompt: '',
        defaultStyle: 'clean-motion',
        defaultAspectRatio: '16:9',
        defaultDuration: 30,
        isPublic: false,
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    try {
      await updateTemplate.mutateAsync({ 
        id: selectedTemplate.id, 
        data: {
          title: selectedTemplate.title,
          basePrompt: selectedTemplate.basePrompt,
          defaultStyle: selectedTemplate.defaultStyle,
          defaultAspectRatio: selectedTemplate.defaultAspectRatio,
          defaultDuration: selectedTemplate.defaultDuration,
        }
      });
      setShowEdit(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate.mutateAsync(selectedTemplate.id);
      setShowDelete(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleUseTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    try {
      await createVideo.mutateAsync({
        title: useForm.title,
        prompt: useForm.prompt,
        styleId: selectedTemplate.defaultStyle,
        aspectRatio: selectedTemplate.defaultAspectRatio,
        duration: selectedTemplate.defaultDuration,
        templateId: selectedTemplate.id,
      });
      setShowUse(false);
      setUseForm({ title: '', prompt: '' });
    } catch (error) {
      console.error('Failed to create video from template:', error);
    }
  };

  const styleOptions = styles?.map(s => ({ value: s.id, label: s.name })) || [];
  const aspectOptions = [
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
    { value: '1:1', label: '1:1' },
  ];
  const durationOptions = [
    { value: '15', label: '15s' },
    { value: '30', label: '30s' },
    { value: '60', label: '60s' },
    { value: '120', label: '120s' },
  ];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prompt Templates</h1>
            <p className="mt-2 text-slate-600">Create and manage reusable templates for faster video generation.</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>New Template</Button>
        </div>

        {/* Top Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Input 
              placeholder="Search templates..." 
              className="max-w-xs" 
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Filter by Style</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.style || 'all'}
                onChange={(e) => setFilters({ ...filters, style: e.target.value === 'all' ? undefined : e.target.value })}
              >
                <option value="all">All Styles</option>
                {styleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Button variant="secondary" onClick={() => refetch()}>Apply Filters</Button>
          </div>
        </div>

        {/* Templates List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-slate-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="w-48 h-5 bg-slate-200 rounded" />
                      <div className="w-full h-4 bg-slate-200 rounded" />
                      <div className="flex gap-4 mt-3">
                        <div className="w-24 h-5 bg-slate-200 rounded" />
                        <div className="w-24 h-5 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">No templates found.</p>
              <Button onClick={() => setShowCreate(true)}>Create First Template</Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {templates.map((template) => (
                <div key={template.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{template.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{template.basePrompt}</p>
                      <div className="flex gap-4 mt-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          Style: {template.defaultStyle}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          Aspect: {template.defaultAspectRatio}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          Duration: {template.defaultDuration}s
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                          Used {template.usageCount} times
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setUseForm({ title: `Video from ${template.title}`, prompt: template.basePrompt });
                          setShowUse(true);
                        }}
                      >
                        Use Template
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setSelectedTemplate(template); setShowEdit(true); }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700" 
                        onClick={() => { setSelectedTemplate(template); setShowDelete(true); }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Template" size="lg">
        <form className="space-y-4" onSubmit={handleCreateTemplate}>
          <Input 
            label="Template Title" 
            placeholder="e.g., Weekly Update Template" 
            required
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Prompt</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={3} 
              placeholder="Use {placeholders} for variables..."
              required
              value={createForm.basePrompt}
              onChange={(e) => setCreateForm({ ...createForm, basePrompt: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Default Style"
              options={styleOptions.length > 0 ? styleOptions : [{ value: 'clean-motion', label: 'Clean Motion' }]}
              value={createForm.defaultStyle}
              onChange={(e) => setCreateForm({ ...createForm, defaultStyle: e.target.value })}
            />
            <Select
              label="Default Aspect"
              options={aspectOptions}
              value={createForm.defaultAspectRatio}
              onChange={(e) => setCreateForm({ ...createForm, defaultAspectRatio: e.target.value as AspectRatio })}
            />
            <Select
              label="Default Duration"
              options={durationOptions}
              value={String(createForm.defaultDuration)}
              onChange={(e) => setCreateForm({ ...createForm, defaultDuration: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" disabled={createTemplate.isPending}>
              {createTemplate.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Template Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Template" size="lg">
        {selectedTemplate && (
          <form className="space-y-4" onSubmit={handleUpdateTemplate}>
            <Input 
              label="Template Title" 
              value={selectedTemplate.title}
              onChange={(e) => setSelectedTemplate({ ...selectedTemplate, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Prompt</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={3}
                value={selectedTemplate.basePrompt}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, basePrompt: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Default Style"
                options={styleOptions}
                value={selectedTemplate.defaultStyle}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, defaultStyle: e.target.value })}
              />
              <Select
                label="Default Aspect"
                options={aspectOptions}
                value={selectedTemplate.defaultAspectRatio}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, defaultAspectRatio: e.target.value as AspectRatio })}
              />
              <Select
                label="Default Duration"
                options={durationOptions}
                value={String(selectedTemplate.defaultDuration)}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, defaultDuration: Number(e.target.value) })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
              <Button type="submit" disabled={updateTemplate.isPending}>
                {updateTemplate.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Template?" size="sm">
        <div className="space-y-4">
          <p className="text-slate-600">Are you sure you want to delete this template? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteTemplate} disabled={deleteTemplate.isPending}>
              {deleteTemplate.isPending ? 'Deleting...' : 'Delete Template'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Use Template Modal */}
      <Modal isOpen={showUse} onClose={() => setShowUse(false)} title="Create Video from Template" size="lg">
        {selectedTemplate && (
          <form className="space-y-4" onSubmit={handleUseTemplate}>
            <Input 
              label="Video Title" 
              value={useForm.title}
              onChange={(e) => setUseForm({ ...useForm, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prompt</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={3}
                value={useForm.prompt}
                onChange={(e) => setUseForm({ ...useForm, prompt: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded">
                <span className="text-slate-500">Style:</span>
                <span className="ml-2 font-medium">{selectedTemplate.defaultStyle}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <span className="text-slate-500">Aspect:</span>
                <span className="ml-2 font-medium">{selectedTemplate.defaultAspectRatio}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <span className="text-slate-500">Duration:</span>
                <span className="ml-2 font-medium">{selectedTemplate.defaultDuration}s</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowUse(false)}>Cancel</Button>
              <Button type="submit" disabled={createVideo.isPending}>
                {createVideo.isPending ? 'Creating...' : 'Create Video'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </PageShell>
  );
}
