'use client';

import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';
import { createPageLayout, Pagination } from 'tiptap-a4-pagination';
import 'tiptap-a4-pagination/styles.css';
import { EditorToolbar, EditorViewMode } from './editor-toolbar';

export interface EditorInstance {
  getContent: () => string;
  getHTML: () => string;
  getText: () => string;
}

export interface RichTextEditorProps {
  initialContent: string;
  onUpdate: (html: string) => void;
  onEditorReady?: (editor: EditorInstance) => void;
}

const WIDTH_CLASSES: Record<EditorViewMode, string> = {
  standard: 'max-w-[794px] w-full',
  wide: 'max-w-[1100px] w-full',
  full: 'max-w-[1500px] w-full',
};

const a4Layout = createPageLayout({
  size: 'A4',
  marginTop: 25.4,
  marginBottom: 25.4,
  gap: 24,
});

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent,
  onUpdate,
  onEditorReady,
}) => {
  const [viewMode, setViewMode] = useState<EditorViewMode>('standard');
  const [pageCount, setPageCount] = useState<number>(1);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Pagination.configure({
        pageSelector: '.a4-page-sheet',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[920px] leading-relaxed text-[#171717] font-sans selection:bg-primary/20',
        style: 'font-size: 13pt; line-height: 1.6;',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onUpdate(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setPageLayout(a4Layout);
  }, [editor]);

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (!editor) return;
    const updatePageCount = () => {
      const storage = editor.storage as unknown as { pagination?: { pageCount?: number } };
      const count = storage?.pagination?.pageCount ?? 1;
      setPageCount(Math.max(1, count));
    };

    editor.on('transaction', updatePageCount);
    editor.on('update', updatePageCount);
    const timer = setTimeout(updatePageCount, 150);

    return () => {
      editor.off('transaction', updatePageCount);
      editor.off('update', updatePageCount);
      clearTimeout(timer);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !onEditorReady) return;
    const adapter: EditorInstance = {
      getContent: () => editor.getHTML(),
      getHTML: () => editor.getHTML(),
      getText: () => editor.getText(),
    };
    onEditorReady(adapter);
  }, [editor, onEditorReady]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
      {/* Google Docs Toolbar - Pinned directly under header with 0px gap */}
      <div className="shrink-0 z-20 border-b border-border bg-card/95 backdrop-blur-md shadow-2xs">
        <EditorToolbar
          editor={editor}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Google Docs Canvas (Centered Document Sheet with Multi-page A4 Pagination) */}
      <div className="flex-1 w-full bg-[#f8f9fa] dark:bg-[#0e0e0e] flex flex-col items-center py-6 px-4 overflow-y-auto">
        {/* Page Count Indicator Pill */}
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground font-medium bg-card/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border shadow-2xs select-none">
          <span>Khổ giấy A4 (210mm × 297mm)</span>
          <span>•</span>
          <span className="font-semibold text-primary">
            Tài liệu gồm {pageCount} trang
          </span>
        </div>

        {/* Real Multi-page A4 Sheet Container */}
        <div
          className={`a4-page-sheet relative ${WIDTH_CLASSES[viewMode]} transition-all duration-200`}
          style={{
            width: viewMode === 'standard' ? `${a4Layout.pageWidth}px` : undefined,
            maxWidth: '100%',
            padding: '25.4mm',
            minHeight: `${pageCount * (a4Layout.pageHeight + a4Layout.gap) - a4Layout.gap}px`,
            backgroundColor: '#ffffff',
            color: '#171717',
            boxShadow:
              '0 1px 3px 1px rgba(60,64,67,0.15), 0 2px 8px 4px rgba(60,64,67,0.08)',
            border: '1px solid #dadce0',
            borderRadius: '2px',
            marginBottom: '4rem',
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
