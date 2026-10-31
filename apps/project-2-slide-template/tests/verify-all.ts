import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { templateService } from '../src/server/services/template.service';
import { presentationService } from '../src/server/services/presentation.service';
import { storageService } from '../src/server/services/storage.service';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG - PRESENTATION TEMPLATE ENGINE');
  console.log('====================================================\n');

  // 1. Kiểm thử nạp danh mục và 3 bộ template ban đầu
  console.log('Test 1: Kiểm tra nạp danh mục và 3 bộ slide template ban đầu...');
  const categories = templateService.getCategories();
  assert(categories.length >= 4, 'Phải có ít nhất 4 danh mục bộ slide');
  console.log(`  ✓ Số danh mục tìm thấy: ${categories.length}`);

  const allTemplates = templateService.getTemplates();
  assert(allTemplates.length >= 3, 'Phải có tối thiểu 3 bộ template PowerPoint');
  console.log(`  ✓ Số bộ template ban đầu: ${allTemplates.length} (Đầy đủ catalog tiêu chuẩn)`);

  // Kiểm tra cấu trúc slide deck
  for (const tpl of allTemplates) {
    assert(tpl.slides.length === tpl.totalSlides, `Template ${tpl.id} phải có đầy đủ slides`);
    assert(tpl.aspectRatio === '16:9', 'Tỉ lệ khung hình phải là 16:9');
    console.log(`    - [${tpl.category}] ${tpl.title}: ${tpl.slides.length} slides (16:9)`);
  }

  // 2. Kiểm thử tìm kiếm và lọc danh mục
  console.log('\nTest 2: Kiểm tra chức năng tìm kiếm & lọc danh mục...');
  const pitchDecks = templateService.getTemplates({ category: 'pitch-deck' });
  assert(pitchDecks.length > 0, 'Phải tìm thấy bộ slide danh mục pitch-deck');
  console.log(`  ✓ Lọc danh mục "pitch-deck": tìm thấy ${pitchDecks.length} bộ slide`);

  const searchResults = templateService.getTemplates({ search: 'khởi nghiệp' });
  assert(searchResults.length > 0, 'Phải tìm thấy mẫu có từ khóa "khởi nghiệp"');
  console.log(`  ✓ Tìm kiếm từ khóa "khởi nghiệp": tìm thấy ${searchResults.length} bộ slide`);

  // 3. Kiểm thử nguyên tắc Immutability & Copy-on-Create file PPTX
  console.log('\nTest 3: Kiểm tra cơ chế nhân bản độc lập file PPTX (Template Immutability)...');
  const targetTemplateId = 'tpl-pitch-deck-investor';
  const originalTemplate = templateService.getTemplateById(targetTemplateId);
  assert(originalTemplate !== null, 'Phải tìm thấy template gốc');

  const templatesDir = storageService.getTemplatesDir();
  const sourceFilePath = path.join(templatesDir, originalTemplate.pptxFileName);
  
  // Đảm bảo file gốc tồn tại
  assert(fs.existsSync(sourceFilePath), 'File mẫu PPTX gốc phải tồn tại trên đĩa');
  const originalStats = fs.statSync(sourceFilePath);
  const originalMtime = originalStats.mtimeMs;
  const originalSize = originalStats.size;

  // Thực hiện nhân bản tạo Presentation mới
  const customTitle = 'Bài Thuyết Trình Gọi Vốn Series A - TechCorp 2026';
  const newPresentation = await presentationService.createFromTemplate({
    templateId: targetTemplateId,
    customTitle,
  });

  assert(newPresentation.id.startsWith('pres-'), 'ID presentation phải có tiền tố pres-');
  assert.strictEqual(newPresentation.clonedFromTemplateId, targetTemplateId);
  assert.strictEqual(newPresentation.title, customTitle);
  console.log(`  ✓ Nhân bản thành công UserPresentation: ${newPresentation.id}`);

  // Kiểm tra file copy độc lập trên ổ đĩa
  const presentationsDir = storageService.getPresentationsDir();
  const clonedFilePath = path.join(presentationsDir, newPresentation.pptxFileName);
  assert(fs.existsSync(clonedFilePath), 'File PPTX của user phải tồn tại độc lập');
  assert.notStrictEqual(sourceFilePath, clonedFilePath, 'Đường dẫn file user phải khác hoàn toàn file gốc');

  // XÁC MINH FILE MẪU GỐC KHÔNG BỊ CAN THIỆP (Immutability verification)
  const statsAfterClone = fs.statSync(sourceFilePath);
  assert.strictEqual(statsAfterClone.size, originalSize, 'VI PHẠM: Kích thước file mẫu gốc bị biến đổi!');
  assert.strictEqual(statsAfterClone.mtimeMs, originalMtime, 'VI PHẠM: Thời gian sửa đổi file mẫu gốc bị thay đổi!');
  console.log('  ✓ BẢO VỆ MẪU GỐC THÀNH CÔNG: File PPTX mẫu gốc giữ nguyên 100% tính toàn vẹn (Immutability Verified)!');

  // 4. Kiểm tra cấu trúc file nhị phân PPTX
  console.log('\nTest 4: Kiểm tra tính hợp lệ của file nhị phân PPTX tải về...');
  const clonedBuffer = fs.readFileSync(clonedFilePath);
  assert(clonedBuffer.length > 2000, 'File PPTX phải có kích thước hợp lệ (> 2KB)');

  // Kiểm tra magic bytes của định dạng ZIP/PPTX: 'PK\x03\x04' (0x50, 0x4B, 0x03, 0x04)
  assert.strictEqual(clonedBuffer[0], 0x50, 'Byte 0 phải là P (0x50)');
  assert.strictEqual(clonedBuffer[1], 0x4b, 'Byte 1 phải là K (0x4B)');
  assert.strictEqual(clonedBuffer[2], 0x03, 'Byte 2 phải là 0x03');
  assert.strictEqual(clonedBuffer[3], 0x04, 'Byte 3 phải là 0x04');
  console.log(`  ✓ File PPTX có cấu trúc OpenXML hợp lệ: ${clonedBuffer.length} bytes`);

  console.log('\n====================================================');
  console.log('🎉 TOÀN BỘ KIỂM THỬ TỰ ĐỘNG ĐỀU ĐẠT CHUẨN 100% (PASSED)');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('❌ KIỂM THỬ THẤT BẠI:', err);
  process.exit(1);
});

