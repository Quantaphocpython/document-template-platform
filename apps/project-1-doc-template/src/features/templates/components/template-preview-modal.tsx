'use client';

import { Calendar, CheckCircle2, FileText, ShieldCheck, Tag } from 'lucide-react';
import React from 'react';
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
      <div className="flex flex-col gap-5">
        {/* Template Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-accent/35 border border-primary/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={BadgeVariant.BLUE}>{template.categoryName}</Badge>
              <span className="text-[11px] text-muted-foreground font-mono">ID: {template.id}</span>
              <span className="text-[11px] text-muted-foreground font-medium">• v{template.version}</span>
            </div>
            <h2 className="text-base font-semibold text-foreground">{template.title}</h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">{template.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Sử dụng mẫu này
            </Button>
          </div>
        </div>

        {/* Immutability Notice Box */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-accent/20 border border-primary/15 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground font-medium">Bảo vệ mẫu gốc (Template Immutability):</strong> Hệ thống sẽ tự động tạo một bản sao độc lập (Copy-on-Create). Mẫu văn bản gốc hoàn toàn được giữ nguyên vẹn.
          </span>
        </div>

        {/* Paper Sheet Preview (A4 Simulating Document) */}
        <div className="flex justify-center p-4 sm:p-6 bg-muted/40 rounded-2xl border border-border overflow-x-auto">
          <div className="w-full max-w-[700px] min-h-[500px] bg-white p-8 sm:p-12 shadow-sm rounded-sm border border-border">
            {/* Metadata Header */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-100 pb-3 mb-6">
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
              className="w-full text-zinc-900 leading-relaxed font-sans text-[15px]"
              dangerouslySetInnerHTML={{ __html: template.contentHtml }}
            />
          </div>
        </div>

        {/* Tags & Action Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Từ khóa liên quan:
            </span>
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary/80 text-secondary-foreground px-2.5 py-1 rounded-md border border-secondary font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.SM}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              isLoading={isCreating}
              onClick={() => onUseTemplate(template)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Sử dụng mẫu này
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
