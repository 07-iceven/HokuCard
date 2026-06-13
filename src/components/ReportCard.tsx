import React from 'react';
import { CardConfig } from '../types';

interface ReportCardProps {
  config: CardConfig;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ReportCard: React.FC<ReportCardProps> = ({ config, cardRef }) => {
  const {
    title,
    subtitle,
    content,
    projectName,
    reporter,
    date,
    imageSrc,
    paperType,
    gridType,
    fontType,
    alignment,
    stamp,
    showBorder,
    lineHeight,
    fontSize,
  } = config;

  // 纸张颜色与文字颜色选择
  const paperStyles: Record<string, { bg: string; text: string; subText: string; accent: string; border: string }> = {
    washi: {
      bg: '#FBFBFA',
      text: '#2D2D2D',
      subText: '#7A7A75',
      accent: '#AF8F6F',
      border: '#DEDCD8',
    },
    canvas: {
      bg: '#F4F5F6',
      text: '#333333',
      subText: '#7A8082',
      accent: '#5E7A8A',
      border: '#DFE2E3',
    },
    bamboo: {
      bg: '#F3F5F0',
      text: '#2E3A2F',
      subText: '#758277',
      accent: '#607A66',
      border: '#D8DDD6',
    },
    sakura: {
      bg: '#FAF3F3',
      text: '#402E2E',
      subText: '#877373',
      accent: '#B08888',
      border: '#E8DCDD',
    },
    wheat: {
      bg: '#FAF6F0',
      text: '#3B3128',
      subText: '#85786E',
      accent: '#A18A73',
      border: '#E8DFD5',
    },
    'minimal-dark': {
      bg: '#1C1C1D',
      text: '#E0E0DB',
      subText: '#8E8E93',
      accent: '#D0A160',
      border: '#333334',
    },
  };

  const currentStyle = paperStyles[paperType] || paperStyles.washi;

  // 字体配置
  const fontClass = {
    sans: 'font-sans tracking-wide',
    serif: 'font-serif tracking-widest leading-relaxed',
    mono: 'font-mono tracking-normal',
  }[fontType];

  // 字号大小
  const sizeMap = {
    sm: 'text-[13px]',
    base: 'text-[15px]',
    lg: 'text-[17px]',
  };

  // 获取网格背景类
  const getGridClass = () => {
    if (gridType === 'grid') return 'japanese-grid';
    if (gridType === 'ruled') return 'japanese-ruled';
    return '';
  };

  // 绘制鲜红手盖印章
  const renderStamp = () => {
    if (stamp === 'none') return null;

    // 根据不同印章类型渲染不一样的日系图形
    switch (stamp) {
      case 'done': // 椭圆
        return (
          <div 
            id="stamp-done"
            className="hanko-stamp flex items-center justify-center rounded-[50%/50%] border-3 px-3 py-1 text-red-600 font-serif font-bold text-sm select-none"
            style={{ 
              transform: 'rotate(-4deg)', 
              borderColor: '#CD2E2E', 
              color: '#CD2E2E',
            }}
          >
            完了
          </div>
        );
      case 'seen': // 经典朱文原型
        return (
          <div 
            id="stamp-seen"
            className="hanko-stamp flex items-center justify-center rounded-full border-2 w-10 h-10 text-red-600 font-serif font-bold text-md select-none"
            style={{ 
              transform: 'rotate(8deg)', 
              borderColor: '#CD2E2E', 
              color: '#CD2E2E',
            }}
          >
            済
          </div>
        );
      case 'confirm': // 双线实框极简矩形
        return (
          <div 
            id="stamp-confirm"
            className="hanko-stamp flex items-center justify-center border-2 px-2.5 py-0.5 text-red-600 font-serif font-bold text-sm tracking-wider select-none"
            style={{ 
              transform: 'rotate(2deg)', 
              borderColor: '#CD2E2E', 
              color: '#CD2E2E',
              borderRadius: '2px'
            }}
          >
            確認
          </div>
        );
      case 'urgent': // 极简菱形
        return (
          <div 
            id="stamp-urgent"
            className="hanko-stamp flex items-center justify-center border-2 w-11 h-11 text-red-600 font-serif font-bold text-xs select-none"
            style={{ 
              transform: 'rotate(-8deg) rotate(45deg)', 
              borderColor: '#CD2E2E', 
              color: '#CD2E2E',
              borderRadius: '1px'
            }}
          >
            <span style={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>至急</span>
          </div>
        );
      case 'checked': // 带星号的极简圆形
        return (
          <div 
            id="stamp-checked"
            className="hanko-stamp flex flex-col items-center justify-center rounded-full border-2 w-9 h-9 text-red-600 font-serif font-bold text-xs select-none"
            style={{ 
              transform: 'rotate(6deg)', 
              borderColor: '#CD2E2E', 
              color: '#CD2E2E',
            }}
          >
            <span>検</span>
          </div>
        );
      default:
        return null;
    }
  };

  // 根据换行符切分汇报内容并渲染
  const paragraphs = content && content.trim() ? content.split('\n') : [];

  return (
    <div
      ref={cardRef}
      id="report-card"
      className={`w-full max-w-xl h-auto mx-auto flex flex-col justify-between relative transition-all duration-300 pointer-events-auto ${fontClass}`}
      style={{
        backgroundColor: currentStyle.bg,
        color: currentStyle.text,
        border: showBorder ? `1px solid ${currentStyle.border}` : 'none',
        borderRadius: '4px',
        // 留白(Ma)的极致体现，卡片内部宽裕
        padding: '2.5rem 2.25rem 2.25rem 2.25rem',
      }}
    >
      {/* 极简网格背景层 */}
      <div 
        className={`absolute inset-0 pointer-events-none rounded-[4px] ${getGridClass()}`} 
        style={{ opacity: paperType === 'minimal-dark' ? 0.04 : 0.65 }}
      />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* 卡片页眉：项目分类 + 极细横线与日期 */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest pb-3"
             style={{ 
               color: currentStyle.subText,
               borderBottom: `1px solid ${paperType === 'minimal-dark' ? '#333334' : 'rgba(175, 160, 145, 0.18)'}`
             }}>
          {projectName ? (
            <div className="font-medium flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentStyle.accent }} />
              <span>{projectName}</span>
            </div>
          ) : (
            <div />
          )}
          <div className="font-mono">{date || '2026.06.13'}</div>
        </div>

        {/* 标题 & 副标题区 */}
        <div className={`mt-8 mb-6 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide" style={{ lineHeight: 1.3 }}>
            {title || '无标题报告书'}
          </h1>
          {subtitle && (
            <p className="text-xs mt-2.5 font-normal tracking-wider opacity-75" style={{ color: currentStyle.subText }}>
              —— {subtitle}
            </p>
          )}
        </div>

        {/* 核心内容区 */}
        <div className="flex-grow flex flex-col mt-2">
          {/* 文本渲染 */}
          {paragraphs.length > 0 && (
            <div 
              className={`flex-grow ${sizeMap[fontSize]} ${alignment === 'center' ? 'text-center' : 'text-left'}`}
              style={{ 
                lineHeight: lineHeight,
                color: currentStyle.text,
              }}
            >
              {paragraphs.map((p, index) => {
                // 检测是否像是一个列表项（比如以 - 或 * 或 序号. 或者是：1、 开头）
                const isListItem = /^[-\*\•\d+前第]\s*|^[①②③④⑤]|^[A-Za-z]\./.test(p.trim());
                
                // 对于无序列表符号（-、*、•），在显示时将其移除，仅保留自定义的点
                let displayText = p;
                if (/^[-\*\•]\s*/.test(p.trim())) {
                  displayText = p.trim().replace(/^[-\*\•]\s*/, '');
                }

                return (
                  <p 
                    key={index}
                    className={`relative ${
                      isListItem ? 'pl-4 md:pl-5 font-normal' : 'font-light'
                    } ${index !== paragraphs.length - 1 ? 'mb-4' : ''}`}
                  >
                    {isListItem && (
                      <span 
                        className="absolute left-0 top-0 text-[10px]" 
                        style={{ color: currentStyle.accent }}
                      >
                        ▪
                      </span>
                    )}
                    {displayText}
                  </p>
                );
              })}
            </div>
          )}

          {/* 本地预览图片：如果有上传图片，则优雅呈现 */}
          {imageSrc && (
            <div id="image-container" className="mt-6 w-full flex justify-center">
              <div 
                className="overflow-hidden border w-full transition-all duration-300"
                style={{ 
                  borderColor: currentStyle.border,
                  borderRadius: '3px',
                  backgroundColor: paperType === 'minimal-dark' ? '#252526' : '#F0EFEA',
                  padding: '4.5px'
                }}
              >
                <img
                  id="preview-image"
                  src={imageSrc}
                  alt="Attachment Preview"
                  className="w-full h-auto block grayscale-20 contrast-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 页脚：汇报人姓名 + 日式印章印油氛围 */}
      <div 
        className="relative z-10 flex items-end justify-between mt-8 pt-4"
        style={{ 
          borderTop: `1px solid ${paperType === 'minimal-dark' ? '#29292a' : 'rgba(175, 160, 145, 0.12)'}`
        }}
      >
        <div />

        {/* 汇报人与印章组合区 */}
        <div className="flex items-center space-x-4 relative pr-1">
          {reporter && (
            <div className="text-right flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-widest block opacity-50" style={{ color: currentStyle.subText }}>
                報告者
              </span>
              <span className="text-sm font-medium tracking-widest mt-0.5">
                {reporter}
                <span className="text-xs font-light opacity-50 ml-1">拝</span>
              </span>
            </div>
          )}

          {/* 印章浮动叠加，还原实体印泥压在名字上的感觉 */}
          {stamp !== 'none' && (
            <div className={reporter ? "absolute -right-3 -top-2 flex items-center justify-center scale-90 origin-bottom-right" : "relative flex items-center justify-center scale-90"}>
              {renderStamp()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
