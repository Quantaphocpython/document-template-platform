# ĐỀ BÀI & YÊU CẦU CHI TIẾT - SẢN PHẨM 1
## THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE LIBRARY)

Trích xuất từ email đề bài kiểm tra tuyển dụng vị trí **Fullstack Developer**.

---

## 1. MỤC TIÊU BÀI TOÁN

Xây dựng chức năng thư viện mẫu văn bản có thể chạy thử thực tế, cho phép người dùng tìm kiếm, xem trước và sử dụng mẫu để tạo tài liệu mới.

---

## 2. CHI TIẾT CÁC YÊU CẦU KỸ THUẬT & CHỨC NĂNG

### A. Giao diện thư viện
1. Hiển thị danh sách mẫu dưới dạng lưới hoặc danh sách có hình xem trước.
2. Mỗi mẫu có tên, ảnh thumbnail, mô tả ngắn và danh mục.
3. Có chức năng tìm kiếm và lọc theo danh mục.
4. Có trang hoặc cửa sổ xem trước mẫu.
5. Có nút sử dụng mẫu để tạo tài liệu mới.

### B. Luồng sử dụng mẫu
1. Người dùng chọn một template.
2. Hệ thống tạo tài liệu mới dựa trên mẫu đó.
3. Người dùng có thể thay đổi nội dung trong phạm vi trình soạn thảo được tích hợp.
4. Có thể lưu hoặc tải xuống tài liệu kết quả theo định dạng được hỗ trợ.
5. **Việc tạo tài liệu mới không được làm thay đổi file template gốc.** (Cơ chế Template Immutability).

### C. Dữ liệu và quản lý mẫu
1. Thiết kế cấu trúc dữ liệu cho template, bao gồm ID, tên, danh mục, mô tả, đường dẫn file và ảnh xem trước.
2. Có ít nhất 5 mẫu dữ liệu thử nghiệm.
3. Có thể bổ sung mẫu mới mà không cần viết lại giao diện thư viện.

### D. Xử lý kỹ thuật
1. Có xử lý trạng thái tải dữ liệu (Loading state), lỗi (Error state) và trường hợp không tìm thấy mẫu (Empty state).
2. Giao diện dễ sử dụng, có khả năng mở rộng.
3. Nếu hỗ trợ DOCX, cần kiểm tra việc giữ nguyên định dạng cơ bản của tài liệu.

---

## 3. ĐỐI CHIẾU THỰC HIỆN TRONG DỰ ÁN

| Hạng mục đề bài | Thành phần mã nguồn thực hiện | Tài liệu kỹ thuật chi tiết |
| :--- | :--- | :--- |
| **Giao diện thư viện & Lưới thẻ** | `src/components/templates/TemplateGallery.tsx`<br>`src/components/templates/TemplateCard.tsx` | [SRS.md](SRS.md#fr-1) |
| **Tìm kiếm & Lọc danh mục** | `src/components/templates/CategoryFilter.tsx`<br>Tích hợp `usehooks-ts` (`useDebounceValue`) | [SRS.md](SRS.md#fr-2) |
| **Xem trước mẫu A4** | `src/components/templates/TemplatePreviewModal.tsx` | [SRS.md](SRS.md#fr-3) |
| **Bảo vệ mẫu gốc (Copy-on-Create)** | `src/server/services/document.service.ts`<br>`src/server/services/storage.service.ts` | [ARCHITECTURE.md](ARCHITECTURE.md#2) |
| **Trình soạn thảo văn bản** | `src/components/editor/DocumentEditor.tsx`<br>`src/components/editor/EditorToolbar.tsx` | [SRS.md](SRS.md#fr-5) |
| **Xuất file Word DOCX** | `src/server/services/docx-export.service.ts`<br>`src/app/api/documents/[id]/export/route.ts` | [API_SPEC.md](API_SPEC.md#export) |
| **5 biểu mẫu ban đầu** | `src/data/templates.ts` | [PLAN.md](PLAN.md) |

