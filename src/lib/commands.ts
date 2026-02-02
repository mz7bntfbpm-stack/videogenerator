import { mockApi } from './mockApi';
import { getCurrentStoryboard, setCurrentStoryboard } from './storyboardStore';
import { ToastProvider, useToast } from './toast';

export async function runCommand(cmd: string): Promise<any> {
  switch (cmd) {
    case 'Publish All': {
      const scenes = getCurrentStoryboard();
      if (!scenes.length) throw new Error('No storyboard loaded');
      const videos = await mockApi.publishStoryboard(scenes);
      return videos;
    }
    case 'Export Pack': {
      // Trigger implicit export by calling existing API
      // The Dashboard component holds the real export implementation; this is a placeholder for future extension
      return null;
    }
    default:
      return null;
  }
}
