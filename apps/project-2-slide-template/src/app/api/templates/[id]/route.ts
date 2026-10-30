import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/server/services/template.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = templateService.getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy bộ slide có mã "${id}"`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error: unknown) {
    console.error('Error fetching template details:', error);
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ khi lấy chi tiết bộ slide';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

