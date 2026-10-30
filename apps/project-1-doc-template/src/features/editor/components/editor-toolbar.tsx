'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
} from 'lucide-react';

export interface EditorToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertTable: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormat,
  onInsertTable,
}) => {
  const handleAction = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    onFormat(command, value);
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-xs">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
        <button
          type="button"
          onClick={(e) => handleAction(e, 'undo')}
          title="Hoàn tác (Ctrl+Z)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'redo')}
          title="Làm lại (Ctrl+Y)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
        <button
          type="button"
          onClick={(e) => handleAction(e, 'formatBlock', '<h1>')}
          title="Tiêu đề 1"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'formatBlock', '<h2>')}
          title="Tiêu đề 2"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'formatBlock', '<h3>')}
          title="Tiêu đề 3"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Text Styles */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
        <button
          type="button"
          onClick={(e) => handleAction(e, 'bold')}
          title="In đậm (Ctrl+B)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'italic')}
          title="In nghiêng (Ctrl+I)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'underline')}
          title="Gạch chân (Ctrl+U)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
        <button
          type="button"
          onClick={(e) => handleAction(e, 'justifyLeft')}
          title="Căn trái"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'justifyCenter')}
          title="Căn giữa"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'justifyRight')}
          title="Căn phải"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'justifyFull')}
          title="Căn đều hai bên"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
        <button
          type="button"
          onClick={(e) => handleAction(e, 'insertUnorderedList')}
          title="Danh sách gạch đầu dòng"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'insertOrderedList')}
          title="Danh sách đánh số"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Insert Table & Clear formatting */}
      <div className="flex items-center gap-0.5 pl-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onInsertTable();
          }}
          title="Chèn bảng biểu (3 cột x 3 hàng)"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(e, 'removeFormat')}
          title="Xóa định dạng"
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

