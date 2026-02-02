// Real PDF exporter using pdf-lib (production-grade path for Flow B)
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type SceneRow = {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  transition: string;
};

export async function generatePDF(scenes: SceneRow[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let page = pdfDoc.addPage();
  const { height } = page.getSize();
  let y = height - 40;
  page.drawText('Storyboard Export', { x: 40, y, size: 20, font, color: rgb(0, 0, 0) });
  y -= 28;
  const lineHeight = 16;
  for (const s of scenes) {
    const line = `Scene ${s.id} - ${s.title} (${s.duration}s) - ${s.transition}`;
    page.drawText(line, { x: 40, y, size: 12, font, color: rgb(0, 0, 0) });
    y -= lineHeight;
    if (y < 40) {
      page = pdfDoc.addPage();
      y = height - 40;
    }
  }
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function downloadPDFFromBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
