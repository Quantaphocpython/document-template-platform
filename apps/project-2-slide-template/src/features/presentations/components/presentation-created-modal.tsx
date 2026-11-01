'use client';

import { presentationApiService } from '@/services/presentations/presentation-api.service';
import { UserPresentation } from '@/types';
import { formatFileSize } from 'core';
import {
  CheckCircle2,
  Download,
  FileCheck,
} from 'lucide-react';
import React from 'react';
import { Button, ButtonSize, ButtonVariant, Modal, PortalProps } from 'ui';

export interface PresentationCreatedModalProps extends PortalProps<UserPresentation> {
  presentation?: UserPresentation | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const PresentationCreatedModal: React.FC<PresentationCreatedModalProps> = ({
  presentation: propPresentation,
  isOpen: propIsOpen,
  onClose: propOnClose,
  data,
  onDismiss,
}) => {
  const presentation = data || propPresentation;
  const isOpen = propIsOpen ?? true;
  const onClose = onDismiss || propOnClose || (() => {});
  if (!presentation) return null;

  const handleDownload = () => {
    presentationApiService.downloadPptx(presentation.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bản Trình Chiếu Đã Được Khởi Tạo"
      description="Hệ thống đã tạo bản sao độc lập từ mẫu gốc thành công (Copy-on-Create)"
      maxWidth="3xl"
    >
      <div className="flex flex-col gap-5 text-foreground">
        {/* Success Banner */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-accent/40 border border-primary/20">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm shadow-primary/25">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              Tạo bản sao PowerPoint thành công!
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tệp trình chiếu mới hoàn toàn tách biệt với mẫu gốc (Đảm bảo Template Immutability).
            </p>
          </div>
        </div>

        {/* Presentation Metadata Box */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Tiêu đề bài trình chiếu:</span>
            <span className="font-semibold text-foreground">{presentation.title}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Khởi tạo từ bộ mẫu:</span>
            <span className="text-foreground font-medium">{presentation.clonedFromTemplateTitle}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Mã định danh bản sao (Instance ID):</span>
            <span className="font-mono text-primary">{presentation.id}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Số lượng slide:</span>
            <span className="text-foreground font-medium">{presentation.totalSlides} trang (16:9 Cinema)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Dung lượng tệp (.pptx):</span>
            <span className="font-mono text-foreground font-semibold">{formatFileSize(presentation.fileSizeBytes)}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Thời gian tạo:</span>
            <span className="text-muted-foreground">{new Date(presentation.createdAt).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        {/* Primary Download Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground">
              File đã sẵn sàng để tải về máy tính và chỉnh sửa trong PowerPoint.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={onClose}
            >
              Đóng lại
            </Button>
            <Button
              variant={ButtonVariant.DEFAULT}
              size={ButtonSize.SM}
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Tải file .pptx
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
