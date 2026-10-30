import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { createAttachmentHeaders, MimeType, sanitizeFileName } from '@preview/core';
import { presentationService } from '@/server/services/presentation.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fileResult = presentationService.getPresentationFilePath(id);

    if (!fileResult) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy file trình chiếu của mã "${id}"`,
        },
        { status: 404 }
      );
    }

    const { filePath, presentation } = fileResult;
    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    // Sanitize filename for download
    const safeTitle = sanitizeFileName(presentation.title, 'presentation');
    const downloadFileName = `${safeTitle}.pptx`;
    const headers = createAttachmentHeaders(downloadFileName, MimeType.PPTX, uint8Array.length);

    return new NextResponse(uint8Array, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error('Error downloading presentation PPTX:', error);
    const message = error instanceof Error ? error.message : 'Lỗi tải xuống file PPTX';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
