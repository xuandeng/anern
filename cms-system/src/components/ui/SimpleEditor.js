'use client';

import { useRef, useEffect } from 'react';

const SimpleEditor = ({ value = '', onChange, placeholder = '开始写作...', disabled = false }) => {
  const textareaRef = useRef();

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
  }, [value]);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = before + selectedText + after;
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    textarea.value = newValue;
    textarea.focus();
    
    const newStart = start + before.length;
    const newEnd = newStart + selectedText.length;
    textarea.setSelectionRange(newStart, newEnd);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const toolbarButtons = [
    { label: 'B', action: () => insertText('**', '**'), title: '粗体' },
    { label: 'I', action: () => insertText('*', '*'), title: '斜体' },
    { label: 'H1', action: () => insertText('# '), title: '标题1' },
    { label: 'H2', action: () => insertText('## '), title: '标题2' },
    { label: 'H3', action: () => insertText('### '), title: '标题3' },
    { label: '列表', action: () => insertText('- '), title: '无序列表' },
    { label: '链接', action: () => insertText('[', '](url)'), title: '链接' },
    { label: '图片', action: () => insertText('![', '](image-url)'), title: '图片' },
    { label: '引用', action: () => insertText('> '), title: '引用' },
    { label: '代码', action: () => insertText('`', '`'), title: '代码' },
  ];

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            disabled={disabled}
            title={button.title}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {button.label}
          </button>
        ))}
      </div>
      
      {/* 编辑区域 */}
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[300px] p-4 border-0 resize-y focus:outline-none focus:ring-0 disabled:bg-gray-100 font-mono text-sm"
        defaultValue={value}
      />
      
      {/* 预览提示 */}
      <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-300">
        支持 Markdown 格式。使用工具栏按钮快速插入格式。
      </div>
    </div>
  );
};

export default SimpleEditor;