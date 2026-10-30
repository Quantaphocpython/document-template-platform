import { DocumentEditorScreen } from '@/features/editor/screens/document-editor-screen';
import { documentService } from '@/server/services/document.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = documentService.getDocumentById(id);
  return {
    title: document
      ? `${document.title} | Trình Soạn Thảo Văn Bản`
      : 'Tài Liệu Không Tồn Tại',
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = documentService.getDocumentById(id);

  if (!document) {
    notFound();
  }

  return <DocumentEditorScreen initialDocument={document} />;
}
