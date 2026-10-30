import { NextRequest, NextResponse } from 'next/server';
import { createAttachmentHeaders, MimeType, sanitizeFileName } from '@preview/core';
import { documentService } from '@/server/services/document.service';
import { docxExportService } from '@/server/services/docx-export.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = documentService.getDocumentById(id);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy tài liệu "${id}" để xuất file`,
        },
        { status: 404 }
      );
    }

    const docxBuffer = await docxExportService.generateDocxBuffer(document);
    const safeTitle = sanitizeFileName(document.title, 'tai_lieu');
    const filename = `${safeTitle}.docx`;

    const uint8Array = new Uint8Array(docxBuffer);
    const headers = createAttachmentHeaders(filename, MimeType.DOCX, uint8Array.length);

    return new NextResponse(uint8Array, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error('Error exporting DOCX:', error);
    const message = error instanceof Error ? error.message : 'Lỗi khi tạo file DOCX';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
