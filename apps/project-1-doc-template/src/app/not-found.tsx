import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button, ButtonSize, ButtonVariant } from '@/shared/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy tài liệu</h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        Tài liệu bạn yêu cầu không tồn tại trên hệ thống hoặc đã bị di chuyển.
      </p>
      <Link href="/">
        <Button variant={ButtonVariant.DEFAULT} size={ButtonSize.MD}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay về Thư viện Biểu mẫu
        </Button>
      </Link>
    </div>
  );
}
