'use client';

import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code,
  FileText,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Maximize2,
  Minus,
  Palette,
  Printer,
  Quote,
  RemoveFormatting,
  RotateCcw,
  RotateCw,
  StretchHorizontal,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
} from 'lucide-react';
import React from 'react';
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

export type EditorViewMode = 'standard' | 'wide' | 'full';

export interface EditorToolbarProps {
  editor: Editor | null;
  viewMode?: EditorViewMode;
  onViewModeChange?: (mode: EditorViewMode) => void;
}

const FONT_FAMILIES = [
  { name: 'Be Vietnam Pro', font: 'Be Vietnam Pro, sans-serif' },
  { name: 'Times New Roman', font: 'Times New Roman, serif' },
  { name: 'Arial', font: 'Arial, Helvetica, sans-serif' },
  { name: 'Roboto', font: 'Roboto, sans-serif' },
  { name: 'Inter', font: 'Inter, sans-serif' },
  { name: 'JetBrains Mono', font: 'JetBrains Mono, monospace' },
];

const TEXT_COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#1d4ed8',
  '#047857',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', // light yellow
  '#bbf7d0', // light green
  '#bfdbfe', // light blue
  '#fed7aa', // light orange
  '#fbcfe8', // light pink
  '#e9d5ff', // light purple
  '#e2e8f0', // light grey
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  viewMode = 'wide',
  onViewModeChange,
}) => {
  if (!editor) return null;

  // Determine current heading/style
  const getCurrentStyleLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Tiêu đề chính (H1)';
    if (editor.isActive('heading', { level: 2 })) return 'Tiêu đề phụ (H2)';
    if (editor.isActive('heading', { level: 3 })) return 'Tiêu đề nhỏ (H3)';
    return 'Văn bản thường';
  };

  // Determine current font family
  const getCurrentFontFamily = () => {
    for (const item of FONT_FAMILIES) {
      if (editor.isActive('textStyle', { fontFamily: item.font }) || editor.isActive('textStyle', { fontFamily: item.name })) {
        return item.name;
      }
    }
    return 'Be Vietnam Pro';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-card/95 backdrop-blur-md px-3 sm:px-4 py-1.5 flex flex-wrap items-center gap-1 text-foreground overflow-x-auto no-scrollbar">
      {/* Group 1: History & Print */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Hoàn tác (Ctrl+Z)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Làm lại (Ctrl+Y)"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          title="In tài liệu (Ctrl+P)"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 2: Style & Font Family (Using Shared DropdownMenu) */}
      <div className="flex items-center gap-1">
        {/* Paragraph / Heading Style Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-between gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-muted text-foreground border border-transparent hover:border-border transition-colors cursor-pointer min-w-[120px]"
              title="Định dạng văn bản / Tiêu đề"
            >
              <span className="truncate">{getCurrentStyleLabel()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className="flex items-center justify-between"
            >
              <span className="text-xs">Văn bản thường</span>
              {getCurrentStyleLabel() === 'Văn bản thường' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-bold">Tiêu đề chính (H1)</span>
              {editor.isActive('heading', { level: 1 }) && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="flex items-center justify-between"
            >
              <span className="text-xs font-semibold">Tiêu đề phụ (H2)</span>
              {editor.isActive('heading', { level: 2 }) && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="flex items-center justify-between"
            >
              <span className="text-[11px] font-semibold text-muted-foreground">Tiêu đề nhỏ (H3)</span>
              {editor.isActive('heading', { level: 3 }) && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-between gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-muted text-foreground border border-transparent hover:border-border transition-colors cursor-pointer min-w-[130px]"
              title="Phông chữ"
            >
              <span className="truncate">{getCurrentFontFamily()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {FONT_FAMILIES.map((font) => (
              <DropdownMenuItem
                key={font.name}
                onClick={() => editor.chain().focus().setFontFamily(font.font).run()}
                className="flex items-center justify-between"
              >
                <span style={{ fontFamily: font.font }} className="text-xs">
                  {font.name}
                </span>
                {getCurrentFontFamily() === font.name && (
                  <Check className="w-3.5 h-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 3: Text Formats (B, I, U, S, Code) */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('bold')
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Đậm (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('italic')
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Nghiêng (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('underline')
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('strike')
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Gạch ngang (Strikethrough)"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('code')
              ? 'bg-primary/15 text-primary font-bold'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Mã nguồn trực tuyến"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 4: Text Color & Highlight Color (Shared Dropdowns) */}
      <div className="flex items-center gap-0.5">
        {/* Text Color Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              title="Màu văn bản"
            >
              <Palette className="w-3.5 h-3.5" />
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2 w-48">
            <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 px-1">Màu văn bản</div>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <DropdownMenuSeparator className="my-2" />
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="w-full text-center text-xs py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Mặc định
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Highlight Color Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              title="Màu đánh dấu (Highlight)"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2 w-44">
            <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 px-1">Màu tô dạ quang</div>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                  className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <DropdownMenuSeparator className="my-2" />
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="w-full text-center text-xs py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Bỏ đánh dấu
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 5: Text Alignment */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive({ textAlign: 'left' })
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Căn trái (Ctrl+Shift+L)"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive({ textAlign: 'center' })
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Căn giữa (Ctrl+Shift+E)"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive({ textAlign: 'right' })
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Căn phải (Ctrl+Shift+R)"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive({ textAlign: 'justify' })
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Căn đều hai bên (Ctrl+Shift+J)"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 6: Lists, Quotes & Dividers */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('bulletList')
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('orderedList')
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer',
            editor.isActive('blockquote')
              ? 'bg-primary/15 text-primary'
              : 'text-foreground/80 hover:text-foreground'
          )}
          title="Trích dẫn"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          title="Đường phân cách ngang"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Group 7: Table & Formatting Reset */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-muted text-foreground border border-transparent hover:border-border transition-colors cursor-pointer"
              title="Bảng biểu"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Bảng</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              Chèn bảng (3x3)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 4, cols: 4, withHeaderRow: true })
                  .run()
              }
            >
              Chèn bảng (4x4)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
            >
              Thêm hàng phía dưới
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
            >
              Thêm cột bên phải
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              className="text-destructive focus:text-destructive"
            >
              Xóa bảng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          title="Xóa toàn bộ định dạng"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: View Mode Toggle (Standard A4 / Wide / Full Width) */}
      <div className="ml-auto flex items-center gap-1 shrink-0 pl-2 border-l border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-muted text-foreground border border-transparent hover:border-border transition-colors cursor-pointer"
              title="Chế độ hiển thị trang"
            >
              {viewMode === 'full' ? (
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
              ) : viewMode === 'wide' ? (
                <StretchHorizontal className="w-3.5 h-3.5 text-primary" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-primary" />
              )}
              <span className="hidden md:inline">
                {viewMode === 'full' ? 'Toàn màn hình' : viewMode === 'wide' ? 'Mở rộng (Wide)' : 'Trang A4'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onViewModeChange?.('wide')}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-xs">Mở rộng (Wide)</div>
                <div className="text-[10px] text-muted-foreground">Tối ưu không gian hiển thị rộng rãi</div>
              </div>
              {viewMode === 'wide' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onViewModeChange?.('full')}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-xs">Toàn màn hình (Full Width)</div>
                <div className="text-[10px] text-muted-foreground">Tràn viền 100% không giới hạn</div>
              </div>
              {viewMode === 'full' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onViewModeChange?.('standard')}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-xs">Trang A4 tiêu chuẩn</div>
                <div className="text-[10px] text-muted-foreground">Khổ giấy 816px chuẩn in ấn</div>
              </div>
              {viewMode === 'standard' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

