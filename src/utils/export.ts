// Lightweight utilities for exporting storyboard/video data
export type SceneRow = {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  transition: string;
};

function escapeCSVValue(val: string | number): string {
  const s = String(val);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function scenesToCSV(scenes: SceneRow[]): string {
  const header = 'id,title,prompt,duration,transition\n';
  const rows = scenes.map((s) => [s.id, s.title, s.prompt, s.duration, s.transition].map(escapeCSVValue).join(','))
    .join('\n');
  return header + rows;
}
