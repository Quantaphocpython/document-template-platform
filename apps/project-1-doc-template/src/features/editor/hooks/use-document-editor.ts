import { documentApiService } from '@/services/documents/document-api.service';
import { UserDocument } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorInstance } from '../components/rich-text-editor';

export function useDocumentEditor(initialDocument: UserDocument) {
  const [documentData, setDocumentData] = useState<UserDocument>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`doc_${initialDocument.id}`);
        if (cached) {
          const parsed = JSON.parse(cached) as UserDocument;
          if (parsed && parsed.contentHtml) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read cached document:', e);
      }
    }
    return initialDocument;
  });

  const [title, setTitle] = useState(() => documentData.title || initialDocument.title);
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

    const localDoc: UserDocument = {
      ...documentData,
      title,
      contentHtml: updatedContent,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`doc_${documentData.id}`, JSON.stringify(localDoc));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    }

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
    } catch {
      setDocumentData(localDoc);
      setHasUnsavedChanges(false);
      setToastMessage({
        type: 'success',
        text: 'Đã lưu thành công vào bộ nhớ trình duyệt!',
      });
    } finally {
      setIsSaving(false);
    }
  }, [documentData, title]);

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
