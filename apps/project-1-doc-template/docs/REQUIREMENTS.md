# YÊU CẦU NGHIỆP VỤ & ĐẶC TẢ TÍNH NĂNG - SẢN PHẨM 1
## THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE LIBRARY)

Tài liệu này tổng hợp các yêu cầu nghiệp vụ và tiêu chuẩn kỹ thuật áp dụng cho phân hệ **Thư viện Mẫu Văn bản**.

---

## 1. MỤC TIÊU SẢN PHẨM

Xây dựng chức năng thư viện mẫu văn bản độc lập, cho phép người dùng tìm kiếm, xem trước định dạng chuẩn A4, và sử dụng mẫu để tạo tài liệu mới với trình soạn thảo trực quan cùng tính năng xuất tệp tin DOCX.

---

## 2. CHI TIẾT CÁC YÊU CẦU KỸ THUẬT & CHỨC NĂNG

### A. Giao diện thư viện (Gallery Interface)
1. Hiển thị danh sách mẫu dưới dạng lưới (Grid responsive) có hình xem trước vector SVG.
2. Mỗi mẫu hiển thị rõ tên, ảnh thumbnail, mô tả ngắn và danh mục phân loại.
3. Chức năng tìm kiếm toàn văn và lọc tức thì theo danh mục.
4. Cửa sổ xem trước mẫu chuẩn kích thước và tỷ lệ A4.
5. Nút sử dụng mẫu để tạo phiên bản tài liệu mới.

### B. Luồng sử dụng mẫu (Template Usage Workflow)
1. Người dùng chọn một biểu mẫu văn bản mong muốn.
2. Hệ thống tạo tài liệu mới dựa trên mẫu đó theo nguyên tắc Copy-on-Create.
3. Người dùng có thể thay đổi nội dung linh hoạt trong phạm vi trình soạn thảo Rich Text tích hợp.
4. Cho phép lưu trữ bản nháp và xuất tệp tin kết quả định dạng Microsoft Word (`.docx`).
5. **Việc tạo và chỉnh sửa tài liệu mới tuyệt đối không làm thay đổi file template gốc** (Cơ chế Template Immutability).

### C. Quản lý dữ liệu mẫu (Data Management)
1. Cấu trúc dữ liệu chuẩn hóa cho template: ID, tên, danh mục, mô tả, đường dẫn tệp tin và ảnh xem trước.
2. Cung cấp bộ biểu mẫu khởi tạo phong phú (tối thiểu 5 biểu mẫu văn phòng thông dụng).
3. Cho phép bổ sung mẫu mới vào hệ thống mà không cần tái cấu trúc giao diện thư viện.

### D. Xử lý kỹ thuật & Độ tin cậy (Technical Quality)
1. Xử lý toàn diện các trạng thái giao diện: Đang tải (Loading skeleton), Lỗi (Error alert) và Không tìm thấy (Empty state).
2. Giao diện thân thiện, dễ sử dụng, cấu trúc mã nguồn theo Feature-Driven Architecture có khả năng mở rộng cao.
3. Đảm bảo cấu trúc nhị phân và định dạng OpenXML hợp lệ khi xuất tệp tin DOCX.

---

## 3. ĐỐI CHIẾU TRIỂN KHAI MÃ NGUỒN

| Yêu cầu nghiệp vụ cốt lõi | Thành phần mã nguồn thực hiện | Tài liệu kỹ thuật chi tiết |
| :--- | :--- | :--- |
| **Giao diện thư viện & Lưới thẻ** | `src/features/templates/screens/template-gallery-screen.tsx`<br>`src/features/templates/components/template-card.tsx` | [SRS.md](SRS.md#fr-1) |
| **Tìm kiếm & Lọc danh mục** | `src/features/templates/components/category-filter.tsx`<br>Tích hợp `usehooks-ts` (`useDebounceValue`) | [SRS.md](SRS.md#fr-2) |
| **Xem trước mẫu A4** | `src/features/templates/components/template-preview-modal.tsx` | [SRS.md](SRS.md#fr-3) |
| **Bảo vệ mẫu gốc (Copy-on-Create)** | `src/server/services/document.service.ts`<br>`src/server/services/storage.service.ts` | [ARCHITECTURE.md](ARCHITECTURE.md#2) |
| **Trình soạn thảo văn bản Google Docs A4** | `src/features/editor/screens/document-editor-screen.tsx`<br>`src/features/editor/components/rich-text-editor.tsx`<br>`src/features/editor/components/editor-toolbar.tsx` | [SRS.md](SRS.md#fr-5) |
| **Xuất file Word DOCX** | `src/server/services/docx-export.service.ts`<br>`src/app/api/documents/[id]/export/route.ts` | [API_SPEC.md](API_SPEC.md#export) |
| **Bộ biểu mẫu tiêu chuẩn** | `src/data/templates.ts` | [PLAN.md](PLAN.md) |
