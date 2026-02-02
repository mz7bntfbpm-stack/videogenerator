'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

const steps = [
  {
    number: '1',
    title: 'Write your video prompt',
    description: 'Describe what you want to create in natural language. Our AI understands context, tone, and style preferences.',
    bullets: ['Natural language input', 'Style suggestions', 'Aspect ratio selection'],
  },
  {
    number: '2',
    title: 'Choose style and aspect ratio',
    description: 'Select from curated styles and configure the perfect aspect ratio for your target platform.',
    bullets: ['Curated visual styles', 'Platform-optimized ratios', 'Duration control'],
  },
  {
    number: '3',
    title: 'Generate, review, and download',
    description: 'Watch your video come to life. Review, make adjustments, and download when ready.',
    bullets: ['Fast generation', 'Easy revisions', 'Multiple format exports'],
  },
];

const features = [
  {
    title: 'Fast prompt-to-video',
    description: 'Turn your ideas into polished videos in minutes, not hours. Our AI handles the heavy lifting.',
  },
  {
    title: 'Curated styles',
    description: 'Choose from a library of professionally designed visual styles that match your brand.',
  },
  {
    title: 'Reusable templates',
    description: 'Save your best prompts as templates and reuse them across campaigns with one click.',
  },
  {
    title: 'Organized library',
    description: 'Keep all your videos organized with smart filtering, search, and collection features.',
  },
];

const exampleVideos = [
  {
    title: 'Social launch for a product drop',
    style: 'Energetic Edit',
    aspect: '9:16 Vertical',
    duration: '15 secs',
    description: 'Fast-paced product reveal with motion graphics and call-to-action overlays.',
  },
  {
    title: 'Feature explainer for SaaS product',
    style: 'Clean Motion',
    aspect: '16:9 Horizontal',
    duration: '45 secs',
    description: 'Step-by-step feature walkthrough with screen recordings and annotations.',
  },
  {
    title: 'Talking head recap for weekly update',
    style: 'AI Avatar',
    aspect: '16:9 Horizontal',
    duration: '2 mins',
    description: 'AI-generated presenter summarizing key highlights and upcoming plans.',
  },
];

const faqs = [
  {
    question: 'How long can my videos be?',
    answer: 'Videos can range from 15 seconds to 5 minutes depending on your plan. Most social media content works best under 60 seconds.',
  },
  {
    question: 'How long does processing usually take?',
    answer: 'Most videos are generated within 2-5 minutes. Complex prompts or longer durations may take up to 10 minutes.',
  },
  {
    question: 'Which video formats can I export?',
    answer: 'We support MP4, WebM, and MOV formats with resolutions from 720p to 4K depending on your plan.',
  },
  {
    question: 'Who owns the videos I generate?',
    answer: 'You retain full ownership of all videos you create. We do not claim any rights to your content.',
  },
  {
    question: 'Do I need an account to try the demo?',
    answer: 'You can try the sample video generator without an account. Create a free account to save and export videos.',
  },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [samplePrompt, setSamplePrompt] = useState('');
  const [sampleTitle, setSampleTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);

  const handleGenerateSample = () => {
    setIsGenerating(true);
    setPreviewText(null);
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewText('Simulated preview: Your video would appear here after processing.');
    }, 2000);
  };

  return (
    <PageShell>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                AI-powered video creation for modern storytellers
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Transform your ideas into polished, publish-ready videos in minutes.
                No editing skills required—just describe what you want and watch it come to life.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" onClick={() => {}}>
                  Get started in minutes
                </Button>
                <Button variant="outline" size="lg">
                  Watch sample workflow
                </Button>
              </div>
            </div>

            {/* Sample Video Panel */}
            <div className="mt-16 lg:mt-0">
              <div className="rounded-xl bg-slate-50 p-6 shadow-lg border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Try a quick prompt
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Video title"
                    placeholder="Enter a title"
                    value={sampleTitle}
                    onChange={(e) => setSampleTitle(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Text prompt
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      rows={3}
                      placeholder="Describe your video..."
                      value={samplePrompt}
                      onChange={(e) => setSamplePrompt(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Style</label>
                      <select className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Clean Motion</option>
                        <option>Energetic Edit</option>
                        <option>AI Avatar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Aspect</label>
                      <select className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>16:9</option>
                        <option>9:16</option>
                        <option>1:1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Duration</label>
                      <select className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>15s</option>
                        <option>30s</option>
                        <option>60s</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleGenerateSample} disabled={isGenerating}>
                    {isGenerating ? 'Processing...' : 'Generate a sample video'}
                  </Button>
                  {previewText && (
                    <div className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      {previewText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                From prompt to publish-ready in three simple steps
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  <ul className="space-y-1">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-500">
                        <svg className="w-4 h-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Tiles */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Videos */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                See the kind of videos you can create
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                From social media clips to explainer videos, our AI adapts to your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exampleVideos.map((video) => (
                <div key={video.title} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="h-40 bg-slate-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 mb-2">{video.title}</h3>
                    <div className="flex gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {video.style}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {video.aspect}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {video.duration}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                How VideoGenerator fits into your content pipeline
              </h2>
            </div>
            <div className="space-y-12 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Create from scratch</h3>
                <p className="text-slate-600 mb-4">
                  Start with a blank canvas and let our AI bring your vision to life.
                  Describe your idea in plain language and watch as it transforms into a compelling video.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Natural language prompts that understand context</li>
                  <li>Smart style recommendations based on your content type</li>
                  <li>Real-time preview as you iterate on your prompt</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Re-use prompt templates</h3>
                <p className="text-slate-600 mb-4">
                  Save your best-performing prompts as templates and apply them across campaigns.
                  Maintain consistency while scaling your content production.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>One-click template application</li>
                  <li>Customizable placeholder variables</li>
                  <li>Team sharing and collaboration features</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Monitor and manage results</h3>
                <p className="text-slate-600 mb-4">
                  Keep track of all your generated videos in one organized library.
                  Filter, search, and manage your content with powerful organization tools.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Smart filtering by style, aspect ratio, and status</li>
                  <li>Bulk actions for efficient workflow management</li>
                  <li>Usage analytics to optimize your content strategy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-indigo-600 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-2xl font-medium text-white leading-relaxed">
              &ldquo;VideoGenerator has transformed how we create social content.
              What used to take our team hours now takes minutes, and the quality is consistently impressive.&rdquo;
            </blockquote>
            <p className="mt-4 text-indigo-200">
              — Growth marketer at a DTC brand
            </p>
          </div>
        </section>

        {/* Usage Snapshot */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Your account at a glance
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-3xl font-bold text-indigo-600">128</div>
                <div className="text-sm text-slate-600 mt-1">Total videos created</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-3xl font-bold text-amber-600">6</div>
                <div className="text-sm text-slate-600 mt-1">Queued / Processing</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-3xl font-bold text-emerald-600">102</div>
                <div className="text-sm text-slate-600 mt-1">Completed videos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-lg font-semibold text-slate-900">Explainer</div>
                <div className="text-sm text-slate-600 mt-1">Top-performing style</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-lg font-semibold text-slate-900">9:16</div>
                <div className="text-sm text-slate-600 mt-1">Most-used aspect ratio</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center">
                <div className="text-3xl font-bold text-slate-700">86</div>
                <div className="text-sm text-slate-600 mt-1">Videos with file links</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    className="w-full px-5 py-4 text-left flex items-center justify-between focus:outline-none"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <span className="font-medium text-slate-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-slate-500 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-4 text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
              Ready to see your ideas on screen?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of creators who are transforming their content workflow with AI video generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Create a free account</Button>
              <Button variant="outline" size="lg">Log in to your workspace</Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-x-2 mb-4 md:mb-0">
                <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                <span className="text-lg font-bold text-white">VideoGenerator</span>
              </div>
              <div className="flex gap-8 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-center md:text-left">
              &copy; 2026 VideoGenerator. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
