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
import { RichTextEditor } from '../components/rich-text-editor';
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
    wordCount,
    charCount,
    handleEditorReady,
    handleContentUpdate,
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-foreground text-background border border-border'
              : 'bg-destructive text-destructive-foreground'
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
      <header className="shrink-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-xs px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.ICON}
            onClick={handleBackToGallery}
            title="Quay lại thư viện mẫu"
            aria-label="Quay lại thư viện mẫu"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="h-5 w-px bg-border" />

          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="text-sm font-semibold text-foreground bg-transparent hover:bg-muted/40 focus:bg-card px-2.5 py-1 rounded-lg border border-transparent hover:border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all w-full max-w-md truncate"
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

        {/* Right: Stats & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Word & Character Statistics */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted text-[11px] text-muted-foreground font-mono">
            <span>{wordCount} từ</span>
            <span>•</span>
            <span>{charCount} ký tự</span>
          </div>

          <span className="hidden xl:inline-block text-xs text-muted-foreground">
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

      {/* Google Docs Style Editor Workspace (Toolbar directly attached, A4 Canvas) */}
      <RichTextEditor
        initialContent={documentData.contentHtml}
        onUpdate={handleContentUpdate}
        onEditorReady={handleEditorReady}
      />
    </div>
  );
};
