import React, { useRef } from 'react';
import { CardConfig, PaperType, GridType, FontType, AlignmentType, StampType } from '../types';
import { Image, Upload, Calendar, RotateCcw, Sparkles, X, Plus } from 'lucide-react';

interface ReportFormProps {
  config: CardConfig;
  onChange: (config: CardConfig) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({ config, onChange, onDownload, isDownloading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 一键更新部分键值
  const updateKey = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  // 处理图片文件上传
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件。');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateKey('imageSrc', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // 拖拽上传支持
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // 移出当前图片
  const removeImage = () => {
    updateKey('imageSrc', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 设置当前系统日期
  const setToToday = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    updateKey('date', formattedDate);
  };

  // 一键应用日系示范模版
  const loadPreset = (type: 'weekly' | 'daily' | 'creative') => {
    if (type === 'weekly') {
      onChange({
        ...config,
        paperType: 'bamboo',
        gridType: 'grid',
        fontType: 'serif',
        alignment: 'left',
        stamp: 'seen',
        showBorder: true,
        lineHeight: 1.8,
        fontSize: 'base'
      });
    } else if (type === 'daily') {
      onChange({
        ...config,
        paperType: 'washi',
        gridType: 'ruled',
        fontType: 'mono',
        alignment: 'left',
        stamp: 'confirm',
        showBorder: true,
        lineHeight: 1.7,
        fontSize: 'sm'
      });
    } else {
      onChange({
        ...config,
        paperType: 'wheat',
        gridType: 'blank',
        fontType: 'serif',
        alignment: 'center',
        stamp: 'checked',
        showBorder: false,
        lineHeight: 1.9,
        fontSize: 'lg'
      });
    }
  };

  // 重置
  const resetForm = () => {
    onChange({
      title: '',
      subtitle: '',
      content: '',
      projectName: '',
      reporter: '',
      date: '2026.06.13',
      imageSrc: null,
      paperType: 'washi',
      gridType: 'blank',
      fontType: 'sans',
      alignment: 'left',
      stamp: 'none',
      showBorder: true,
      lineHeight: 1.7,
      fontSize: 'base',
      exportDpi: 300
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 纸张颜色展示与选项
  const papers: { id: PaperType; name: string; color: string; label: string }[] = [
    { id: 'washi', name: '和纸', color: 'bg-[#FBFBFA] border-[#DEDCD8]', label: '白' },
    { id: 'canvas', name: '消墨', color: 'bg-[#F4F5F6] border-[#DFE2E3]', label: '墨' },
    { id: 'bamboo', name: '竹', color: 'bg-[#F3F5F0] border-[#D8DDD6]', label: '竹' },
    { id: 'sakura', name: '落樱', color: 'bg-[#FAF3F3] border-[#E8DCDD]', label: '樱' },
    { id: 'wheat', name: '麦穗', color: 'bg-[#FAF6F0] border-[#E8DFD5]', label: '麦' },
    { id: 'minimal-dark', name: '墨黑', color: 'bg-[#1C1C1D] border-[#333334]', label: '黑' },
  ];

  const stamps: { id: StampType; label: string }[] = [
    { id: 'none', label: '无' },
    { id: 'seen', label: '已阅' },
    { id: 'done', label: '完了' },
    { id: 'confirm', label: '确认' },
    { id: 'urgent', label: '至急' },
    { id: 'checked', label: '检查' },
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
      
      {/* 预设推荐栏 */}
      <div className="bg-white/50 border border-[#E9E9E7] rounded-md p-4 flex flex-col space-y-2.5">
        <label className="text-[11px] font-medium tracking-wider text-stone-400 uppercase flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>美学模板推荐</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => loadPreset('weekly')}
            className="px-2 py-1.5 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] active:scale-[0.98] transition-all rounded text-center truncate font-serif"
          >
            周报（竹纸风）
          </button>
          <button
            type="button"
            onClick={() => loadPreset('daily')}
            className="px-2 py-1.5 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] active:scale-[0.98] transition-all rounded text-center truncate font-mono"
          >
            日报（和纸风）
          </button>
          <button
            type="button"
            onClick={() => loadPreset('creative')}
            className="px-2 py-1.5 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] active:scale-[0.98] transition-all rounded text-center truncate"
          >
            随笔（麦金风）
          </button>
        </div>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* 项目主题 & 日期 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase">
              所属项目
            </label>
            <input
              type="text"
              value={config.projectName}
              onChange={(e) => updateKey('projectName', e.target.value)}
              className="w-full px-3 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs tracking-wider outline-none transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase flex items-center justify-between">
              <span>汇报日期</span>
              <button 
                type="button" 
                onClick={setToToday}
                className="text-[9px] text-[#A18A73] hover:underline"
              >
                今日
              </button>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={config.date}
                onChange={(e) => updateKey('date', e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs font-mono outline-none transition-colors"
              />
              <Calendar className="w-3.5 h-3.5 absolute right-2.5 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 汇报标题 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase flex items-center justify-between">
            <span>汇报标题 <span className="text-red-500">*</span></span>
            <span className="text-[10px] text-stone-400 font-mono">{config.title.length}/30</span>
          </label>
          <input
            type="text"
            required
            maxLength={30}
            value={config.title}
            onChange={(e) => updateKey('title', e.target.value)}
            className="w-full px-3 py-2.5 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs tracking-wide font-medium outline-none transition-colors"
          />
        </div>

        {/* 汇报副标题 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase flex items-center justify-between">
            <span>副标题</span>
            <span className="text-[10px] text-stone-400 font-mono">{config.subtitle.length}/40</span>
          </label>
          <input
            type="text"
            maxLength={40}
            value={config.subtitle}
            onChange={(e) => updateKey('subtitle', e.target.value)}
            className="w-full px-3 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs outline-none transition-colors"
          />
        </div>

        {/* 汇报内容 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase flex items-center justify-between">
            <span>汇报内容</span>
            <span className="text-[10px] text-stone-400 font-mono">{config.content.length}/500</span>
          </label>
          <textarea
            rows={5}
            maxLength={500}
            value={config.content}
            onChange={(e) => updateKey('content', e.target.value)}
            className="w-full px-3 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs outline-none transition-colors leading-relaxed tracking-wide resize-y min-h-[120px]"
          />
        </div>

        {/* 图片附件上传 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase">
            汇报插图 (选填)
          </label>
          {config.imageSrc ? (
            <div className="relative border border-[#E0E0DE] rounded p-2 flex items-center justify-between bg-white/40">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <img 
                  src={config.imageSrc} 
                  alt="Attachment preview" 
                  className="w-8 h-8 rounded border object-cover shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] text-stone-500 truncate font-sans">插图.png (已装载)</span>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                title="移除图片"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#CACAC7] hover:border-stone-400 rounded-md p-4 flex flex-col items-center justify-center space-y-1.5 bg-white/40 cursor-pointer hover:bg-[#FDFDFD]/90 transition-all group"
            >
              <Upload className="w-5.5 h-5.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
              <div className="text-[11px] text-stone-500 tracking-wide text-center">
                点击或拖拽手机/电脑本地图片至此
              </div>
              <div className="text-[9px] text-stone-400 font-mono uppercase">
                JPG, PNG, GIF
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* 汇报人及签名 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase">
            汇报人名称
          </label>
          <input
            type="text"
            value={config.reporter}
            onChange={(e) => updateKey('reporter', e.target.value)}
            className="w-full px-3 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs tracking-wider outline-none transition-colors"
          />
        </div>

        {/* 日本朱砂手签印章 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium tracking-widest text-[#7E7E7A] uppercase">
            手书朱砂签章
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {stamps.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => updateKey('stamp', st.id)}
                className={`py-1.5 text-xs rounded transition-all flex items-center justify-center border ${
                  config.stamp === st.id
                    ? 'border-[#C84B31] text-[#C84B31] bg-[#FDF5F4] font-medium'
                    : 'border-[#E0E0DE] text-stone-500 hover:bg-stone-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* 间隙(Ma)与日式风格控制板 */}
        <div className="border-t border-[#ECECEC] pt-4.5 space-y-4">
          <h3 className="text-xs font-semibold text-stone-800 tracking-wider">
            排版美学调节
          </h3>

          {/* 1. 纸质色调调色板 */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              纸张材质
            </span>
            <div className="grid grid-cols-6 gap-2">
              {papers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateKey('paperType', p.id)}
                  title={p.name}
                  className={`h-8 rounded relative border flex items-center justify-center transition-all ${p.color} ${
                    config.paperType === p.id 
                      ? 'ring-2 ring-stone-400 ring-offset-1 scale-[1.05]' 
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  <span className={`text-[10px] ${p.id === 'minimal-dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 2. 底纹选择 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                底纹网格
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#F5F5F3] p-0.5 rounded border border-[#E0E0DE]">
                {(['blank', 'grid', 'ruled'] as GridType[]).map((gt) => (
                  <button
                    key={gt}
                    type="button"
                    onClick={() => updateKey('gridType', gt)}
                    className={`py-1 text-[10px] tracking-wide rounded capitalize transition-all ${
                      config.gridType === gt
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {gt === 'blank' ? '空白' : gt === 'grid' ? '方格' : '横线'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 字体质感 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                字体字形
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#F5F5F3] p-0.5 rounded border border-[#E0E0DE]">
                {(['sans', 'serif', 'mono'] as FontType[]).map((ft) => (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => updateKey('fontType', ft)}
                    className={`py-1 text-[10px] tracking-wide rounded capitalize transition-all ${
                      config.fontType === ft
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {ft === 'sans' ? '无衬' : ft === 'serif' ? '宋体' : '等宽'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 4. 对齐方式 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                排列对齐
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#F5F5F3] p-0.5 rounded border border-[#E0E0DE]">
                {(['left', 'center'] as AlignmentType[]).map((al) => (
                  <button
                    key={al}
                    type="button"
                    onClick={() => updateKey('alignment', al)}
                    className={`py-1 text-[10px] tracking-wide rounded capitalize transition-all ${
                      config.alignment === al
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {al === 'left' ? '左对齐' : '居中'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 极细卡片外框 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                极窄外部描边
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#F5F5F3] p-0.5 rounded border border-[#E0E0DE]">
                <button
                  type="button"
                  onClick={() => updateKey('showBorder', true)}
                  className={`py-1 text-[10px] tracking-wide rounded capitalize transition-all ${
                    config.showBorder
                      ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  显示 (1px)
                </button>
                <button
                  type="button"
                  onClick={() => updateKey('showBorder', false)}
                  className={`py-1 text-[10px] tracking-wide rounded capitalize transition-all ${
                    !config.showBorder
                      ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  无界
                </button>
              </div>
            </div>
          </div>

          {/* 6. 行距与字号 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-400">
                  行距
                </span>
                <span className="text-[10px] font-mono text-stone-500">{config.lineHeight}x</span>
              </div>
              <input
                type="range"
                min="1.6"
                max="2.0"
                step="0.1"
                value={config.lineHeight}
                onChange={(e) => updateKey('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-stone-500 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 row-span-1">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                主内容字号
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#F5F5F3] p-0.5 rounded border border-[#E0E0DE]">
                {(['sm', 'base', 'lg'] as ('sm' | 'base' | 'lg')[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateKey('fontSize', sz)}
                    className={`py-1 text-[10px] tracking-wide rounded uppercase transition-all ${
                      config.fontSize === sz
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {sz === 'sm' ? '小' : sz === 'base' ? '中' : '大'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. 自定义 DPI 导出设置 */}
          <div className="border-t border-[#ECECEC] pt-4.5 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7E7E7A] block font-medium">
              自定义导出分辨率
            </span>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <select
                  value={config.exportDpi || 300}
                  onChange={(e) => updateKey('exportDpi', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-stone-700 bg-white border border-[#E0E0DE] focus:border-stone-500 rounded text-xs tracking-wider outline-none transition-colors appearance-none pr-8 cursor-pointer"
                >
                  <option value={72}>72 DPI (极速预览 / 体积微小)</option>
                  <option value={150}>150 DPI (普通质量 / 快速传输)</option>
                  <option value={200}>200 DPI (清晰画质 / 屏幕适配)</option>
                  <option value={300}>300 DPI (高清印刷 / 默认高质量)</option>
                  <option value={450}>450 DPI (超高清 / 纤毫毕现)</option>
                  <option value={600}>600 DPI (极致印刷级 / 4K幅面)</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[9px]">
                  ▼
                </div>
              </div>

              <div className="w-24 shrink-0 flex items-center border border-[#E0E0DE] bg-white rounded overflow-hidden">
                <input
                  type="number"
                  min="50"
                  max="1200"
                  value={config.exportDpi || 300}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      updateKey('exportDpi', Math.max(50, Math.min(1200, val)));
                    }
                  }}
                  className="w-full px-1.5 py-2 text-xs font-mono text-center text-stone-700 outline-none"
                />
                <span className="text-[9px] text-[#A18A73] font-mono pr-2 select-none">DPI</span>
              </div>
            </div>
            <p className="text-[9px] text-[#A18A73] font-sans tracking-wide leading-relaxed">
              * 目前设定为 {config.exportDpi || 300} DPI（导出画面将自动放大 {((config.exportDpi || 300) / 100).toFixed(1)} 倍输出，获得无可挑剔的清晰度）。
            </p>
          </div>

        </div>

        {/* 底部重置与生成 */}
        <div className="pt-4 flex items-center space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center justify-center space-x-2 px-3 py-2.5 border border-[#E0E0DE] hover:bg-stone-50 text-stone-600 rounded text-xs tracking-wider transition-colors active:scale-95"
            title="清空重置表单"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置</span>
          </button>
          
          <button
            type="button"
            disabled={isDownloading || !config.title}
            onClick={onDownload}
            className={`flex-grow flex items-center justify-center space-x-2.5 px-6 py-2.5 rounded text-xs font-semibold tracking-widest uppercase transition-all ${
              config.title
                ? 'bg-[#2E2E2E] hover:bg-black text-white cursor-pointer active:scale-[0.98]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{isDownloading ? '卡片高清晰画质刻画中...' : '一键下载汇报卡片 (PNG)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
