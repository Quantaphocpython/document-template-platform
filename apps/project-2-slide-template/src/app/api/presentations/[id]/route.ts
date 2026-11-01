import { NextRequest, NextResponse } from 'next/server';
import { presentationService } from '@/server/services/presentation.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const presentation = await presentationService.getPresentationById(id);

    if (!presentation) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy bản trình chiếu có mã "${id}"`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: presentation,
    });
  } catch (error: unknown) {
    console.error('Error getting presentation:', error);
    const message = error instanceof Error ? error.message : 'Lỗi lấy thông tin bản trình chiếu';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

