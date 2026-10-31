'use client';

import { UserDocument } from '@/types';
import { APP_ROUTES, formatDateTime } from 'core';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Badge,
  BadgeVariant,
  Button,
  ButtonSize,
  ButtonVariant,
  confirmModal,
} from 'ui';
import { EditorToolbar } from '../components/editor-toolbar';
import { useDocumentEditor } from '../hooks/use-document-editor';

export interface DocumentEditorScreenProps {
  initialDocument: UserDocument;
}

export const DocumentEditorScreen: React.FC<DocumentEditorScreenProps> = ({
  initialDocument,
}) => {
  const router = useRouter();
  const {
    documentData,
    title,
    setTitle,
    isSaving,
    isExporting,
    toastMessage,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    editorRef,
    handleFormat,
    handleInsertTable,
    handleSave,
    handleExportDocx,
  } = useDocumentEditor(initialDocument);

  const handleBackToGallery = () => {
    if (hasUnsavedChanges) {
      confirmModal.show({
        title: 'Thay đổi chưa lưu',
        message:
          'Bạn có những thay đổi chưa lưu. Bạn có chắc chắn muốn thoát về thư viện không?',
        variant: 'warning',
        confirmText: 'Rời đi',
        cancelText: 'Ở lại chỉnh sửa',
        onConfirm: () => router.push(APP_ROUTES.HOME),
      });
      return;
    }
    router.push(APP_ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-white" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Editor Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={handleBackToGallery}
            title="Quay lại thư viện mẫu"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Thư viện
          </Button>

          <div className="h-5 w-px bg-slate-200" />

          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="text-sm font-semibold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all w-full max-w-md truncate"
              placeholder="Nhập tên tài liệu..."
              title="Nhấp để đổi tên tài liệu"
            />
            {hasUnsavedChanges ? (
              <Badge variant={BadgeVariant.AMBER}>Chưa lưu</Badge>
            ) : (
              <Badge variant={BadgeVariant.GREEN}>Đã lưu</Badge>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden md:inline-block text-xs text-slate-400">
            Cập nhật: {formatDateTime(documentData.updatedAt)}
          </span>

          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.SM}
            onClick={handleExportDocx}
            isLoading={isExporting}
            title="Tải tài liệu về máy tính định dạng Microsoft Word (.docx)"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Tải DOCX
          </Button>

          <Button
            variant={ButtonVariant.DEFAULT}
            size={ButtonSize.SM}
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            Lưu tài liệu
          </Button>
        </div>
      </header>

      {/* Editor Formatting Toolbar */}
      <EditorToolbar
        onFormat={handleFormat}
        onInsertTable={handleInsertTable}
      />

      {/* Workspace Sheet Area */}
      <main className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center justify-start">
        {/* Immutability Banner */}
        <div className="w-full max-w-[800px] mb-4 flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Bản sao tài liệu độc lập:</strong> Mọi chỉnh sửa tại đây
              hoàn toàn không ảnh hưởng đến mẫu gốc &ldquo;
              {documentData.clonedFromTemplateTitle}&rdquo;.
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-600 shrink-0">
            ID: {documentData.id}
          </span>
        </div>

        {/* Paper Document Canvas (Standard A4 Dimension: 210mm x 297mm proportion) */}
        <div className="w-full max-w-[800px] min-h-[1050px] bg-white shadow-xl rounded-sm border border-slate-200/90 p-8 sm:p-14 md:p-16 mb-12">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => setHasUnsavedChanges(true)}
            className="prose prose-slate max-w-none min-h-[900px] focus:outline-none font-serif leading-relaxed text-slate-900"
            style={{
              fontSize: '15px',
              lineHeight: '1.7',
            }}
          />
        </div>
      </main>
    </div>
  );
};
