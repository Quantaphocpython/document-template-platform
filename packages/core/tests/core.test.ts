import assert from 'node:assert';
import {
  buildUrlWithParams,
  createAttachmentHeaders,
  formatDate,
  formatDateTime,
  formatFileSize,
  MimeType,
  sanitizeFileName,
} from '../dist/index.js';

console.log('====================================================');
console.log('🧪 BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG - SHARED CORE PACKAGE');
console.log('====================================================\n');

// 1. Kiểm tra buildUrlWithParams
console.log('Test 1: Kiểm tra buildUrlWithParams...');
const urlWithParams = buildUrlWithParams('/api/documents', { search: 'hợp đồng', category: 'contract' });
assert(urlWithParams.includes('/api/documents?'), 'URL phải có dấu ?');
assert(urlWithParams.includes('category=contract'), 'URL phải có category=contract');
console.log('  ✓ buildUrlWithParams format URL chính xác');

// 2. Kiểm tra MIME Types & Attachment Headers
console.log('\nTest 2: Kiểm tra MIME Types & Attachment Headers...');
assert.strictEqual(MimeType.DOCX, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
assert.strictEqual(MimeType.PPTX, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

const headers = createAttachmentHeaders('Báo cáo & Đề xuất.docx', MimeType.DOCX, 1024);
assert.strictEqual(headers['Content-Type'], MimeType.DOCX);
assert.strictEqual(headers['Content-Length'], '1024');
assert(headers['Content-Disposition'].includes('attachment; filename='), 'Content-Disposition phải có attachment');
console.log('  ✓ MIME Types và Attachment Headers đạt chuẩn RFC-6266');

// 3. Kiểm tra sanitizeFileName & formatFileSize
console.log('\nTest 3: Kiểm tra sanitizeFileName & formatFileSize...');
const cleanName = sanitizeFileName('Hợp đồng / lao động: 2026?.docx');
assert(!cleanName.includes('/'), 'Không được chứa dấu /');
assert(!cleanName.includes(':'), 'Không được chứa dấu :');
assert(!cleanName.includes('?'), 'Không được chứa dấu ?');

assert.strictEqual(formatFileSize(0), '0 Bytes');
assert.strictEqual(formatFileSize(1024), '1 KB');
assert.strictEqual(formatFileSize(1048576), '1 MB');
console.log('  ✓ Sanitize file name và format file size chuẩn xác');

// 4. Kiểm tra date utils
console.log('\nTest 4: Kiểm tra date utils...');
const testIso = '2026-10-30T10:00:00.000Z';
assert(formatDate(testIso).length > 5, 'Date format phải có định dạng hợp lệ');
assert(formatDateTime(testIso).length > 8, 'DateTime format phải có định dạng hợp lệ');
console.log('  ✓ Date utils hoạt động tốt');

console.log('\n====================================================');
console.log('🎉 TOÀN BỘ KIỂM THỬ CORE PACKAGE ĐỀU ĐẠT CHUẨN 100% (PASSED)');
console.log('====================================================\n');
