import { documentService } from '@/server/services/document.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const document = documentService.getDocumentById(id);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy tài liệu có mã "${id}"`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi máy chủ khi lấy dữ liệu tài liệu',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, contentHtml, status } = body;

    const updatedDocument = documentService.updateDocument(id, {
      title,
      contentHtml,
      status,
    });

    return NextResponse.json({
      success: true,
      data: updatedDocument,
      message: 'Đã lưu thay đổi tài liệu thành công',
    });
  } catch (error: unknown) {
    console.error('Error updating document:', error);
    const message =
      error instanceof Error ? error.message : 'Không thể cập nhật tài liệu';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
