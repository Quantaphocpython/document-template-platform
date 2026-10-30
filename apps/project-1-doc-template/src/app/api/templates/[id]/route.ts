import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/server/services/template.service';

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
          error: `Không tìm thấy mẫu biểu với mã: "${id}"`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template detail:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi máy chủ khi tải chi tiết biểu mẫu',
      },
      { status: 500 }
    );
  }
}

