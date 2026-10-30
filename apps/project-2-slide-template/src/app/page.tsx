import { PresentationGalleryScreen } from '@/features/presentations/screens/presentation-gallery-screen';

export const metadata = {
  title: 'Thư Viện Mẫu Bài Thuyết Trình | Presentation Template Library',
  description:
    'Khám phá và xem trước các bộ mẫu PowerPoint tỉ lệ 16:9, tạo bản trình chiếu độc lập và tải file PPTX.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PresentationGalleryScreen />
    </main>
  );
}
