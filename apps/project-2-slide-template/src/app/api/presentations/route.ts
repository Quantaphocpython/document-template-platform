import { NextRequest, NextResponse } from 'next/server';
import { presentationService } from '@/server/services/presentation.service';

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

    const newPresentation = await presentationService.createFromTemplate({
      templateId,
      customTitle,
    });

    return NextResponse.json(
      {
        success: true,
        data: newPresentation,
        message: 'Đã tạo bản trình chiếu mới thành công từ bộ mẫu gốc',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating presentation:', error);
    const message = error instanceof Error ? error.message : 'Không thể tạo bản trình chiếu mới';
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
    const list = presentationService.listPresentations();
    return NextResponse.json({
      success: true,
      data: list,
      total: list.length,
    });
  } catch (error: unknown) {
    console.error('Error listing presentations:', error);
    const message = error instanceof Error ? error.message : 'Lỗi tải danh sách bản trình chiếu';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

