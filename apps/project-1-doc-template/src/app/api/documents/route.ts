import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/server/services/document.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, customTitle } = body;

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu trường bắt buộc: templateId',
        },
        { status: 400 }
      );
    }

    // Creates new independent document via Copy-on-Create
    const newDocument = documentService.createFromTemplate({
      templateId,
      customTitle,
    });

    return NextResponse.json(
      {
        success: true,
        data: newDocument,
        message: 'Đã tạo tài liệu mới thành công từ mẫu gốc',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating document:', error);
    const message = error instanceof Error ? error.message : 'Không thể tạo tài liệu mới';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const docs = documentService.listUserDocuments();
    return NextResponse.json({
      success: true,
      data: docs,
      total: docs.length,
    });
  } catch (error) {
    console.error('Error listing user documents:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi tải danh sách tài liệu',
      },
      { status: 500 }
    );
  }
}
