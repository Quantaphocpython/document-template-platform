import { documentApiService } from '@/services/documents/document-api.service';
import { UserDocument } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

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

  const editorRef = useRef<HTMLDivElement>(null);

  // Set initial content on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = documentData.contentHtml;
    }
  }, [documentData.contentHtml]);

  // Handle format execution
  const handleFormat = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setHasUnsavedChanges(true);
  }, []);

  // Handle inserting a structured 3x3 table
  const handleInsertTable = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: bold;">STT</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: bold;">Nội Dung Công Việc</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: bold;">Ghi Chú</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">01</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Nhập nội dung 1...</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Hoàn thành</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">02</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Nhập nội dung 2...</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Đang xử lý</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, tableHtml);
    setHasUnsavedChanges(true);
  }, []);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Save
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    const updatedContent = editorRef.current.innerHTML;

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
        text: 'Đã lưu tài liệu thành công vào bộ nhớ hệ thống!',
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
    if (hasUnsavedChanges && editorRef.current) {
      await handleSave();
    }

    try {
      await documentApiService.downloadDocx(documentData.id, title);
      setToastMessage({
        type: 'success',
        text: 'Đã tải xuống file Microsoft Word (.docx) thành công!',
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
    editorRef,
    handleFormat,
    handleInsertTable,
    handleSave,
    handleExportDocx,
  };
}
