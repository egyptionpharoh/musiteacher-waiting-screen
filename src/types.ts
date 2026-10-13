export interface WorkshopConfig {
  title: string;
  description: string;
  presenterName: string;
  presenterTitle: string;
  presenterAvatar: string;
  durationSeconds: number;
  bgType: 'image' | 'video' | 'default';
  bgUrl: string;
  videoVolume: number;
  isMuted: boolean;
  overlayOpacity: number;
  tickerMessages: string[];
  tickerSpeed: number; // seconds for full scroll
  tickerBgColor: string;
  tickerTextColor: string;
  motivationalMessages: string[];
  activeTemplateName: string;
}

export type AppMode = 'audience' | 'admin';