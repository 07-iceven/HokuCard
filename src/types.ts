export type PaperType = 'washi' | 'canvas' | 'bamboo' | 'sakura' | 'wheat' | 'minimal-dark';

export type GridType = 'blank' | 'grid' | 'dotted';

export type FontType = 'sans' | 'serif';

export type AlignmentType = 'left' | 'center';

export type StampType = 'none' | 'done' | 'seen' | 'confirm' | 'urgent' | 'checked';

export interface CardConfig {
  title: string;
  subtitle: string;
  content: string;
  projectName: string;
  reporter: string;
  date: string;
  images: string[];
  paperType: PaperType;
  gridType: GridType;
  fontType: FontType;
  alignment: AlignmentType;
  stamp: StampType;
  lineHeight: number; // 1.6 to 2.0
  fontSize: 'sm' | 'base' | 'lg';
  exportDpi?: number; // Custom output resolution DPI (e.g. 72, 150, 300, 600)
}
