import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/server/services/template.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const templates = templateService.getTemplates({ category, search });
    const categories = templateService.getCategories();

    return NextResponse.json({
      success: true,
      data: {
        templates,
        categories,
        total: templates.length,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Không thể tải danh sách biểu mẫu',
      },
      { status: 500 }
    );
  }
}
