import { DocumentEditorScreen } from '@/features/editor/screens/document-editor-screen';
import { documentService } from '@/server/services/document.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ template?: string }>;
}

export async function generateMetadata({ params, searchParams }: DocumentPageProps) {
  const { id } = await params;
  const sParams = searchParams ? await searchParams : {};
  const document = documentService.getDocumentById(id, sParams.template);
  return {
    title: document
      ? `${document.title} | Trình Soạn Thảo Văn Bản`
      : 'Tài Liệu Không Tồn Tại',
  };
}

export default async function DocumentPage({ params, searchParams }: DocumentPageProps) {
  const { id } = await params;
  const sParams = searchParams ? await searchParams : {};
  const document = documentService.getDocumentById(id, sParams.template);

  if (!document) {
    notFound();
  }

  return <DocumentEditorScreen initialDocument={document} />;
}
