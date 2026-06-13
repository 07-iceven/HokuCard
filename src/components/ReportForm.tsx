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
  const processImageFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
    if (files.length !== fileList.length) {
      alert('部分文件格式不支持，仅支持 JPG 和 PNG 格式，已过滤不支持的文件。');
    }
    if (files.length === 0) return;

    const newImages = await Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }));

    updateKey('images', [...(config.images || []), ...newImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files);
    }
  };

  // 拖拽上传支持
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  // 移出当前图片
  const removeImage = (index: number) => {
    const newImages = [...(config.images || [])];
    newImages.splice(index, 1);
    updateKey('images', newImages);
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
        stamp: 'none',
        lineHeight: 1.6,
        fontSize: 'lg'
      });
    } else if (type === 'daily') {
      onChange({
        ...config,
        paperType: 'washi',
        gridType: 'grid',
        fontType: 'sans',
        alignment: 'left',
        stamp: 'none',
        lineHeight: 1.6,
        fontSize: 'lg'
      });
    } else {
      onChange({
        ...config,
        paperType: 'wheat',
        gridType: 'blank',
        fontType: 'serif',
        alignment: 'center',
        stamp: 'none',
        lineHeight: 1.6,
        fontSize: 'lg'
      });
    }
  };

  // 重置
  const resetForm = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    onChange({
      title: '',
      subtitle: '',
      content: '',
      projectName: '',
      reporter: '',
      date: formattedDate,
      images: [],
      paperType: 'washi',
      gridType: 'blank',
      fontType: 'sans',
      alignment: 'left',
      stamp: 'none',
      lineHeight: 1.6,
      fontSize: 'lg',
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
    <div className="w-full flex flex-col h-full">
      <div className="flex-1 p-6 space-y-6">
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
              className="px-2 py-2 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] hover:border-stone-300 active:scale-[0.98] transition-all rounded text-center truncate font-serif shadow-sm"
            >
             竹纸风
            </button>
            <button
              type="button"
              onClick={() => loadPreset('daily')}
              className="px-2 py-2 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] hover:border-stone-300 active:scale-[0.98] transition-all rounded text-center truncate font-mono shadow-sm"
            >
              和纸风
            </button>
            <button
              type="button"
              onClick={() => loadPreset('creative')}
              className="px-2 py-2 text-xs text-stone-600 bg-white border border-[#E0E0DE] hover:bg-[#F9F9F7] hover:border-stone-300 active:scale-[0.98] transition-all rounded text-center truncate shadow-sm"
            >
              麦金风
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
                className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-[#A18A73] hover:bg-stone-200 transition-colors active:scale-95"
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
            <span>汇报标题</span>
            <span className="text-[10px] text-stone-400 font-mono">{config.title.length}/30</span>
          </label>
          <input
            type="text"
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
          {config.images && config.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {config.images.map((img, index) => (
                <div key={index} className="relative border border-[#E0E0DE] rounded p-2 flex items-center justify-between bg-white/40">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Attachment preview ${index + 1}`} 
                      className="w-8 h-8 rounded border object-cover shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] text-stone-500 truncate font-sans">插图 {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors active:scale-95"
                    title="移除图片"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
              JPG, PNG (支持多选)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {stamps.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => updateKey('stamp', st.id)}
                className={`py-2 text-xs rounded transition-all flex items-center justify-center border hover:shadow-sm ${
                  config.stamp === st.id
                    ? 'border-[#C84B31] text-[#C84B31] bg-[#FDF5F4] font-medium shadow-sm ring-1 ring-[#C84B31]/20'
                    : 'border-[#E0E0DE] text-stone-500 hover:bg-white hover:border-stone-300'
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
                  className={`h-10 rounded relative border flex items-center justify-center transition-all shadow-sm ${p.color} ${
                    config.paperType === p.id 
                      ? 'ring-2 ring-stone-400 ring-offset-1 scale-[1.05] z-10' 
                      : 'hover:scale-[1.02] hover:shadow-md'
                  }`}
                >
                  <span className={`text-xs font-medium ${p.id === 'minimal-dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 2. 对齐方式 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                排列对齐
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#F5F5F3] p-1 rounded border border-[#E0E0DE]">
                {(['left', 'center'] as AlignmentType[]).map((al) => (
                  <button
                    key={al}
                    type="button"
                    onClick={() => updateKey('alignment', al)}
                    className={`py-1.5 text-xs tracking-wide rounded capitalize transition-all ${
                      config.alignment === al
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {al === 'left' ? '左对齐' : '居中'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 字体质感 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                字体字形
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#F5F5F3] p-1 rounded border border-[#E0E0DE]">
                {(['sans', 'serif'] as FontType[]).map((ft) => (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => updateKey('fontType', ft)}
                    className={`py-1.5 text-xs tracking-wide rounded capitalize transition-all ${
                      config.fontType === ft
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {ft === 'sans' ? '无衬' : '宋体'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 4. 底纹选择 */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                底纹网格
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#F5F5F3] p-1 rounded border border-[#E0E0DE]">
                {(['blank', 'grid', 'dotted'] as GridType[]).map((gt) => (
                  <button
                    key={gt}
                    type="button"
                    onClick={() => updateKey('gridType', gt)}
                    className={`py-1.5 text-xs tracking-wide rounded capitalize transition-all ${
                      config.gridType === gt
                        ? 'bg-white text-stone-800 border border-[#E0E0DE] font-medium shadow-sm'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {gt === 'blank' ? '空白' : gt === 'grid' ? '方格' : '点阵'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. 自定义 DPI 导出设置 */}
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
                  {![72, 150, 200, 300, 450, 600].includes(config.exportDpi || 300) && (
                    <option value={config.exportDpi}>{config.exportDpi} DPI (自定义)</option>
                  )}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[9px]">
                  ▼
                </div>
              </div>

              <div className="w-24 shrink-0 flex items-center border border-[#E0E0DE] bg-white rounded overflow-hidden">
                <input
                  type="number"
                  value={config.exportDpi || 300}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      updateKey('exportDpi', val);
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
      </form>
      </div>
      <div className="sticky bottom-0 z-10 p-6 bg-[#FCFCFB] border-t border-[#ECECEC] flex items-center space-x-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center justify-center space-x-2 px-4 py-3 border border-[#E0E0DE] hover:bg-stone-50 text-stone-600 rounded text-sm tracking-wider transition-colors active:scale-95 bg-white shadow-sm hover:shadow"
          title="清空重置表单"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重置</span>
        </button>
        
        <button
          type="button"
          disabled={isDownloading}
          onClick={onDownload}
          className={`flex-grow flex items-center justify-center space-x-2.5 px-6 py-3 rounded text-sm font-semibold tracking-widest uppercase transition-all shadow-sm ${
            !isDownloading
              ? 'bg-[#2E2E2E] hover:bg-black text-white cursor-pointer active:scale-[0.98] hover:shadow-md'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>{isDownloading ? '卡片高清晰画质刻画中...' : '一键导出 (PNG)'}</span>
        </button>
      </div>
    </div>
  );
};
