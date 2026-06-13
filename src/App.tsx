import { useState, useRef, useEffect } from 'react';
import { CardConfig } from './types';
import { ReportForm } from './components/ReportForm';
import { ReportCard } from './components/ReportCard';
import { Sparkles, Image as ImageIcon, Download, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

const INITIAL_CONFIG: CardConfig = {
  title: '',
  subtitle: '',
  content: '',
  projectName: '',
  reporter: '',
  date: '2026.06.13',
  imageSrc: null,
  paperType: 'washi',
  gridType: 'grid',
  fontType: 'sans',
  alignment: 'left',
  stamp: 'none',
  showBorder: true,
  lineHeight: 1.7,
  fontSize: 'base',
  exportDpi: 300
};

export default function App() {
  const [config, setConfig] = useState<CardConfig>(INITIAL_CONFIG);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 默认装载当前日期
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    setConfig(prev => ({
      ...prev,
      date: formattedDate
    }));
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    // 动态载入 html2canvas
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = cardRef.current;
      
      // 高清截图配置
      const customScale = (config.exportDpi || 300) / 100;
      const canvas = await html2canvas(element, {
        scale: customScale, // 根据自定义 DPI 设定缩放倍数
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      
      const fileDate = config.date.replace(/\./g, '');
      const cleanTitle = config.title ? config.title.substring(0, 8) : '報告';
      link.download = `${fileDate}_${cleanTitle}_card.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 显示下载成功提示
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);

    } catch (e) {
      console.error('Image rendering failed:', e);
      alert('导出失败。请检查图片路径或浏览器设置。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div id="app" className="h-screen bg-[#F5F5F3] text-stone-800 flex flex-col font-sans select-none antialiased overflow-hidden">
      
      {/* 极简顶栏 */}
      <header className="border-b border-[#E3E3E0] bg-[#FCFCFB] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center space-x-3">
          {/* 日系几何Logo：纯色扁平框线 */}
          <img src="/logo.svg" alt="HokuCard" className="w-7 h-7" />
          <div>
            <h1 className="text-sm font-semibold tracking-widest text-stone-900">
              HokuCard
            </h1>
          </div>
        </div>

        {/* 极简装饰格言已移除 */}
      </header>

      {/* 主页面布局 */}
      <main className="flex-grow flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* 左侧控制板块：占1/3 宽度 (35% lg) */}
        <div className="w-full lg:w-[38%] border-b lg:border-b-0 lg:border-r border-[#E3E3E0] bg-[#FCFCFB] p-6 lg:overflow-y-auto no-scrollbar shrink-0 flex flex-col">
          <ReportForm
            config={config}
            onChange={setConfig}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        </div>

        {/* 右侧展示板块：灰色背景，中间完美居中卡片 (62% lg) */}
        <div className="w-full lg:flex-grow bg-[#EFEFED] p-4 sm:p-8 flex items-center justify-center lg:overflow-hidden relative min-h-[400px] lg:min-h-0 shrink-0">
          
          {/* 背景日系小浮水印 */}
          <div className="absolute top-6 left-8 pointer-events-none hidden md:block">
            <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase font-mono block">
              PREVIEW STAGE
            </span>
            <span className="text-[9px] text-stone-300 font-serif block mt-1">
              实时画面
            </span>
          </div>

          <div className="w-full flex flex-col items-center py-4">
            {/* 卡片容器：在此增加稍微精致的大阴影将它与预览舞台区隔。但卡片内部依然保持扁平 */}
            <div className="w-full max-w-xl shadow-[0_3px_24px_rgba(30,30,30,0.06)] rounded-[4px] relative bg-transparent overflow-hidden transition-all duration-300">
              <ReportCard 
                config={config} 
                cardRef={cardRef} 
              />
            </div>
          </div>

        </div>

      </main>

      {/* 质感 Toast 提示 */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4.5 py-3 rounded border border-stone-800 text-xs tracking-wider shadow-xl flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>汇报卡片下载成功。解像度 {config.exportDpi || 300}DPI 已经完美渲染！</span>
        </div>
      )}

    </div>
  );
}
