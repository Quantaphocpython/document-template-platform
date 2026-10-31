'use client';

import React from 'react';
import { Calendar, FileText, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { Template } from '@/types';
import { formatDate } from 'core';
import { Badge, BadgeVariant, Button, ButtonSize, ButtonVariant, Modal, PortalProps } from 'ui';

export interface TemplatePreviewModalData {
  template: Template;
  onUseTemplate: (template: Template) => void;
  isCreating?: boolean;
}

export interface TemplatePreviewModalProps extends PortalProps<TemplatePreviewModalData> {
  template?: Template | null;
  isOpen?: boolean;
  onClose?: () => void;
  onUseTemplate?: (template: Template) => void;
  isCreating?: boolean;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template: propTemplate,
  isOpen: propIsOpen,
  onClose: propOnClose,
  onUseTemplate: propOnUseTemplate,
  isCreating: propIsCreating,
  data,
  onDismiss,
}) => {
  const template = data?.template || propTemplate;
  const isOpen = propIsOpen ?? true;
  const onClose = onDismiss || propOnClose || (() => {});
  const onUseTemplate = data?.onUseTemplate || propOnUseTemplate || (() => {});
  const isCreating = data?.isCreating ?? propIsCreating ?? false;

  if (!template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xem Trước Biểu Mẫu"
      description="Xem cấu trúc định dạng thực tế trước khi áp dụng vào tài liệu mới"
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-6">
        {/* Template Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant={BadgeVariant.BLUE}>{template.categoryName}</Badge>
              <span className="text-xs text-slate-400 font-mono">ID: {template.id}</span>
              <span className="text-xs text-slate-400 font-medium">• v{template.version}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{template.title}</h2>
            <p className="text-xs text-slate-600 max-w-2xl">{template.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <Button
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.MD}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.MD}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Sử dụng mẫu này
            </Button>
          </div>
        </div>

        {/* Immutability Notice Box */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Bảo vệ mẫu gốc:</strong> Khi sử dụng mẫu này, hệ thống sẽ tạo một tài liệu bản sao hoàn toàn mới độc lập. Mẫu văn bản gốc của hệ thống sẽ không bị thay đổi.
          </span>
        </div>

        {/* Paper Sheet Preview (A4 Simulating Document) */}
        <div className="flex justify-center p-4 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          <div className="w-full max-w-[700px] min-h-[500px] bg-white p-8 md:p-12 shadow-md rounded-sm border border-slate-200">
            {/* Metadata Header */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 pb-3 mb-6">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Tác giả: {template.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Cập nhật: {formatDate(template.updatedAt)}</span>
              </div>
            </div>

            {/* Template HTML Content Container */}
            <div
              className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: template.contentHtml }}
            />
          </div>
        </div>

        {/* Tags Footer */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs text-slate-500 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Từ khóa liên quan:
          </span>
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Modal>
  );
};

