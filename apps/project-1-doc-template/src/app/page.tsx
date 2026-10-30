import { TemplateGalleryScreen } from '@/features/templates/screens/template-gallery-screen';

export const metadata = {
  title: 'Thư Viện Biểu Mẫu Văn Bản | Office Template Library',
  description:
    'Khám phá và sử dụng biểu mẫu văn bản chuẩn văn phòng, hỗ trợ tạo bản sao độc lập và xuất file DOCX.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <TemplateGalleryScreen />
    </main>
  );
}
