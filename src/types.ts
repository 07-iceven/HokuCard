export type PaperType = 'washi' | 'canvas' | 'bamboo' | 'sakura' | 'wheat' | 'minimal-dark';

export type GridType = 'blank' | 'grid' | 'ruled';

export type FontType = 'sans' | 'serif' | 'mono';

export type AlignmentType = 'left' | 'center';

export type StampType = 'none' | 'done' | 'seen' | 'confirm' | 'urgent' | 'checked';

export interface CardConfig {
  title: string;
  subtitle: string;
  content: string;
  projectName: string;
  reporter: string;
  date: string;
  imageSrc: string | null;
  paperType: PaperType;
  gridType: GridType;
  fontType: FontType;
  alignment: AlignmentType;
  stamp: StampType;
  showBorder: boolean;
  lineHeight: number; // 1.6 to 2.0
  fontSize: 'sm' | 'base' | 'lg';
  exportDpi?: number; // Custom output resolution DPI (e.g. 72, 150, 300, 600)
}
