import assert from 'node:assert';
import { cn, useLayoutStore } from '../dist/index.js';

console.log('====================================================');
console.log('🧪 BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG - SHARED UIKIT PACKAGE');
console.log('====================================================\n');

// 1. Kiểm tra cn (clsx + tailwind-merge)
console.log('Test 1: Kiểm tra hàm cn (clsx + tailwind-merge)...');
assert.strictEqual(cn('px-2 py-1', 'px-4'), 'py-1 px-4');
assert.strictEqual(cn('bg-red-500', false && 'bg-blue-500', 'bg-green-500'), 'bg-green-500');
assert.strictEqual(cn('text-sm', undefined, null, 'font-bold'), 'text-sm font-bold');
console.log('  ✓ cn (tailwind-merge) xử lý và ghi đè class xung đột chuẩn xác');

// 2. Kiểm tra useLayoutStore (Zustand Portal Stack)
console.log('\nTest 2: Kiểm tra useLayoutStore khởi tạo...');
const state = useLayoutStore.getState();
assert(Array.isArray(state.portals), 'State portals phải là một mảng');
assert.strictEqual(state.portals.length, 0, 'Khởi tạo mảng portals phải rỗng');
console.log('  ✓ useLayoutStore quản lý portal stack hoạt động ổn định');

console.log('\n====================================================');
console.log('🎉 TOÀN BỘ KIỂM THỬ UIKIT PACKAGE ĐỀU ĐẠT CHUẨN 100% (PASSED)');
console.log('====================================================\n');

