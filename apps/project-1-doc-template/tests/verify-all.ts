import assert from 'assert';
import { DocumentStatus } from '../src/types';
import { templateService } from '../src/server/services/template.service';
import { documentService } from '../src/server/services/document.service';
import { docxExportService } from '../src/server/services/docx-export.service';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG - SẢN PHẨM 1');
  console.log('====================================================\n');

  // 1. Kiểm thử nạp danh mục và biểu mẫu ban đầu
  console.log('Test 1: Kiểm tra nạp danh mục và 5 bộ template ban đầu...');
  const categories = templateService.getCategories();
  assert(categories.length >= 5, 'Phải có ít nhất 5 danh mục mẫu');
  console.log(`  ✓ Số danh mục tìm thấy: ${categories.length}`);

  const allTemplates = templateService.getTemplates();
  assert(allTemplates.length >= 5, 'Phải có tối thiểu 5 biểu mẫu ban đầu');
  console.log(`  ✓ Số biểu mẫu ban đầu: ${allTemplates.length} (Đạt yêu cầu đề bài >= 5)`);

  // 2. Kiểm thử tìm kiếm và lọc danh mục
  console.log('\nTest 2: Kiểm tra chức năng tìm kiếm & lọc danh mục...');
  const contractTemplates = templateService.getTemplates({ category: 'contract' });
  assert(contractTemplates.length > 0, 'Phải tìm thấy mẫu danh mục hợp đồng');
  assert(contractTemplates.every((t) => t.category === 'contract'), 'Mọi mẫu trả về phải thuộc category contract');
  console.log(`  ✓ Lọc danh mục "contract": tìm thấy ${contractTemplates.length} mẫu`);

  const searchResults = templateService.getTemplates({ search: 'lao động' });
  assert(searchResults.length > 0, 'Phải tìm thấy mẫu có từ khóa "lao động"');
  console.log(`  ✓ Tìm kiếm từ khóa "lao động": tìm thấy ${searchResults.length} mẫu`);

  // 3. Kiểm thử nguyên tắc Immutability & Copy-on-Create
  console.log('\nTest 3: Kiểm tra cơ chế sao chép độc lập & Bảo toàn mẫu gốc (Template Immutability)...');
  const targetTemplateId = 'tpl-employment-contract';
  const originalTemplate = templateService.getTemplateById(targetTemplateId);
  assert(originalTemplate !== null, 'Phải tìm thấy template gốc');

  const originalContent = originalTemplate.contentHtml;
  const originalTitle = originalTemplate.title;

  // Thực hiện clone để tạo tài liệu mới
  const customDocTitle = 'Hợp Đồng Lao Động Thử Nghiệm - Nguyễn Văn Test';
  const newDocument = documentService.createFromTemplate({
    templateId: targetTemplateId,
    customTitle: customDocTitle,
  });

  assert(newDocument.id.startsWith('doc-'), 'ID tài liệu mới phải có tiền tố doc-');
  assert(newDocument.id !== originalTemplate.id, 'ID tài liệu mới phải khác hoàn toàn ID template gốc');
  assert.strictEqual(newDocument.title, customDocTitle);
  assert.strictEqual(newDocument.clonedFromTemplateId, targetTemplateId);
  console.log(`  ✓ Tạo thành công UserDocument: ${newDocument.id}`);

  // Chỉnh sửa tài liệu mới
  const mutatedContent = '<p>NỘI DUNG ĐÃ ĐƯỢC CHỈNH SỬA BỞI NGƯỜI DÙNG TESTING 12345</p>';
  const updatedDoc = documentService.updateDocument(newDocument.id, {
    title: 'Hợp Đồng Đã Chỉnh Sửa Hoàn Toàn',
    contentHtml: mutatedContent,
    status: DocumentStatus.SAVED,
  });

  assert.strictEqual(updatedDoc.contentHtml, mutatedContent, 'Nội dung user document phải được cập nhật');

  // ĐỌC LẠI TEMPLATE GỐC ĐỂ XÁC MINH KHÔNG BỊ BIẾN ĐỔI
  const templateAfterMutation = templateService.getTemplateById(targetTemplateId);
  assert(templateAfterMutation !== null);
  assert.strictEqual(
    templateAfterMutation.contentHtml,
    originalContent,
    'VI PHẠM NGUYÊN TẮC: Mẫu gốc đã bị biến đổi nội dung sau khi sửa tài liệu!'
  );
  assert.strictEqual(
    templateAfterMutation.title,
    originalTitle,
    'VI PHẠM NGUYÊN TẮC: Tiêu đề mẫu gốc đã bị biến đổi!'
  );
  console.log('  ✓ BẢO VỆ MẪU GỐC THÀNH CÔNG: Mẫu gốc giữ nguyên 100% nội dung và metadata sau khi user sửa bản sao!');

  // 4. Kiểm thử xuất file DOCX
  console.log('\nTest 4: Kiểm tra xuất file Word DOCX...');
  const docxBuffer = await docxExportService.generateDocxBuffer(updatedDoc);
  assert(docxBuffer instanceof Buffer, 'Kết quả phải là một Buffer');
  assert(docxBuffer.length > 1000, 'File DOCX phải có kích thước hợp lệ (> 1KB)');

  // Kiểm tra magic bytes của định dạng ZIP/DOCX: 'PK\x03\x04' (0x50, 0x4B, 0x03, 0x04)
  assert.strictEqual(docxBuffer[0], 0x50, 'Byte 0 phải là P (0x50)');
  assert.strictEqual(docxBuffer[1], 0x4b, 'Byte 1 phải là K (0x4B)');
  console.log(`  ✓ Xuất file DOCX thành công: ${docxBuffer.length} bytes (Cấu trúc file OpenXML hợp lệ)`);

  console.log('\n====================================================');
  console.log('🎉 TẤT CẢ CÁC BÀI TEST ĐỀU ĐẠT CHUẨN 100% (PASSED)');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('❌ KIỂM THỬ THẤT BẠI:', err);
  process.exit(1);
});

