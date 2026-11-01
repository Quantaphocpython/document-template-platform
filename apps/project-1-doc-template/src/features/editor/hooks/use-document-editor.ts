import { documentApiService } from '@/services/documents/document-api.service';
import { UserDocument } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorInstance } from '../components/rich-text-editor';

export function useDocumentEditor(initialDocument: UserDocument) {
  const [documentData, setDocumentData] =
    useState<UserDocument>(initialDocument);
  const [title, setTitle] = useState(initialDocument.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editorInstanceRef = useRef<EditorInstance | null>(null);

  // Compute text statistics
  const updateStats = useCallback((editor: EditorInstance) => {
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  }, []);

  // Handle editor instance registration
  const handleEditorReady = useCallback((editor: EditorInstance) => {
    editorInstanceRef.current = editor;
    updateStats(editor);
  }, [updateStats]);

  // Handle content changes from TipTap
  const handleContentUpdate = useCallback(() => {
    setHasUnsavedChanges(true);
    if (editorInstanceRef.current) {
      updateStats(editorInstanceRef.current);
    }
  }, [updateStats]);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Save document
  const handleSave = useCallback(async () => {
    if (!editorInstanceRef.current) return;
    setIsSaving(true);
    const updatedContent = editorInstanceRef.current.getHTML();

    try {
      const updated = await documentApiService.updateDocument(documentData.id, {
        title,
        contentHtml: updatedContent,
        status: 'saved',
      });

      setDocumentData(updated);
      setHasUnsavedChanges(false);
      setToastMessage({
        type: 'success',
        text: 'Đã lưu tài liệu thành công vào hệ thống!',
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Có lỗi khi lưu tài liệu.';
      setToastMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  }, [documentData.id, title]);

  // Handle Export DOCX
  const handleExportDocx = useCallback(async () => {
    setIsExporting(true);
    if (hasUnsavedChanges && editorInstanceRef.current) {
      await handleSave();
    }

    try {
      await documentApiService.downloadDocx(documentData.id, title);
      setToastMessage({
        type: 'success',
        text: 'Đã xuất file Microsoft Word (.docx) thành công!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tải file DOCX.';
      setToastMessage({ type: 'error', text: msg });
    } finally {
      setIsExporting(false);
    }
  }, [documentData.id, title, hasUnsavedChanges, handleSave]);

  return {
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
    editorInstanceRef,
    handleEditorReady,
    handleContentUpdate,
    handleSave,
    handleExportDocx,
  };
}
