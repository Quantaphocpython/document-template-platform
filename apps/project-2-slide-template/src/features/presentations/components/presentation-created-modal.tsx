'use client';

import React from 'react';
import {
  Download,
  CheckCircle2,
  FileCheck,
  Info,
} from 'lucide-react';
import { UserPresentation } from '@/types';
import { formatFileSize } from 'core';
import { Button, ButtonSize, ButtonVariant, Modal, PortalProps } from 'ui';
import { presentationApiService } from '@/services/presentations/presentation-api.service';

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
      description="Hệ thống đã tạo bản sao độc lập từ mẫu gốc thành công"
      maxWidth="3xl"
    >
      <div className="flex flex-col gap-6 text-slate-200">
        {/* Success Banner */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 text-sm">
              Tạo bản sao PowerPoint thành công!
            </h4>
            <p className="text-xs text-emerald-400/90 mt-0.5">
              Tệp trình chiếu mới hoàn toàn tách biệt với mẫu gốc (Đảm bảo Template Immutability).
            </p>
          </div>
        </div>

        {/* Presentation Metadata Box */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span className="text-slate-400">Tiêu đề bài trình chiếu:</span>
            <span className="font-semibold text-white">{presentation.title}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span className="text-slate-400">Khởi tạo từ bộ mẫu:</span>
            <span className="text-indigo-300 font-medium">{presentation.clonedFromTemplateTitle}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span className="text-slate-400">Mã định danh bản sao (Instance ID):</span>
            <span className="font-mono text-slate-300">{presentation.id}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span className="text-slate-400">Số lượng slide:</span>
            <span className="text-slate-300 font-medium">{presentation.totalSlides} trang (16:9 HD)</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span className="text-slate-400">Dung lượng tệp (.pptx):</span>
            <span className="font-mono text-emerald-400">{formatFileSize(presentation.fileSizeBytes)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-400">Thời gian tạo:</span>
            <span className="text-slate-300">{new Date(presentation.createdAt).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        {/* Primary Download Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/60">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-xs text-indigo-200">
              File đã sẵn sàng để tải về máy tính và chỉnh sửa.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
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
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải file PPTX về máy
            </Button>
          </div>
        </div>

        {/* Technical Architecture & Future In-Browser Editor Roadmap */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Info className="w-4 h-4" />
            <span>Kiến Trúc Kỹ Thuật &amp; Định Hướng Tích Hợp Trực Tuyến:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Do tính chất phức tạp của định dạng OpenXML (.pptx) chuẩn ECMA-376 với hàng trăm vector layers, kiến trúc phân tách luồng tạo bản sao độc lập (Copy-on-Create) và tải file nhị phân trực tiếp đảm bảo tối đa hiệu năng, độ tin cậy và tính tương thích trên mọi phần mềm văn phòng.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-slate-300 space-y-1">
            <p><strong>Lộ trình tích hợp trình biên tập trực tuyến (Roadmap):</strong></p>
            <p>1. <em>Canvas Engine (Fabric.js/Konva):</em> Render từng layer slide lên HTML5 Canvas cho phép kéo thả trực quan.</p>
            <p>2. <em>Microsoft Office for the Web (WOPI Protocol):</em> Nhúng trực tiếp iframe PowerPoint Online thông qua WOPI Host chuẩn doanh nghiệp.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

