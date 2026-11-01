# KẾ HOẠCH TRIỂN KHAI - SẢN PHẨM 1: THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE LIBRARY)

## 1. Mục tiêu sản phẩm
Xây dựng một ứng dụng thư viện mẫu văn bản hoàn chỉnh, cho phép người dùng:
1. Duyệt, tìm kiếm và lọc danh mục các mẫu tài liệu văn phòng (Hợp đồng, Đơn từ, Biên bản, Báo cáo, Công văn...).
2. Xem trước mẫu (Metadata + Thumbnail + Bản xem trước nội dung tài liệu).
3. Sử dụng mẫu để sinh ra tài liệu mới độc lập (nguyên tắc: **Template Immutability** - không can thiệp, không sửa đổi template gốc).
4. Mở tài liệu mới trong trình soạn thảo trực quan (Rich Text Editor).
5. Lưu trữ và xuất/tải xuống tài liệu (DOCX / HTML / in ấn).
6. Có sẵn ít nhất 5 bộ dữ liệu mẫu thực tế, dễ dàng mở rộng thêm mẫu mới qua file cấu hình hoặc database.

---

## 2. Các yêu cầu kỹ thuật & Kiến trúc cần đạt
- **Framework**: Next.js 15+ (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS (đảm bảo clean, responsive, hiện đại).
- **Trình soạn thảo văn bản**: Tiptap Editor hoặc Custom Rich Text Document Editor với thanh công cụ (Toolbar: Heading, Bold, Italic, List, Table, Align, v.v.).
- **Quản lý dữ liệu & Immutability**:
  - Dữ liệu Template: Read-only, lưu trữ định danh, metadata, nội dung gốc.
  - Dữ liệu Document do người dùng tạo: Tách biệt hoàn toàn, định danh UUID riêng biệt (`cloned_from_template_id`).
  - Mọi thao tác lưu/sửa chỉ ghi vào Document của người dùng, bảo toàn 100% Template gốc.
- **Xử lý trạng thái UX**:
  - Loading skeleton khi tải danh sách/xem trước.
  - Empty state khi không tìm thấy kết quả tìm kiếm/lọc.
  - Error state và Toast thông báo thao tác thành công/thất bại.

---

## 3. Lộ trình triển khai (Implementation Phases)

### Giai đoạn 1: Chuẩn bị Cấu trúc & Dữ liệu Mẫu (Seed Data)
- [x] Thiết kế TypeScript Interfaces cho `Template`, `Category`, `UserDocument`, `DocumentMeta`.
- [x] Tạo 5 bộ dữ liệu mẫu chuẩn văn phòng:
  1. Hợp đồng lao động chuẩn (Employment Contract).
  2. Đơn xin nghỉ phép (Leave Request Form).
  3. Biên bản cuộc họp nội bộ (Meeting Minutes).
  4. Báo cáo tiến độ dự án tuần/tháng (Project Progress Report).
  5. Đề xuất dự án & kế hoạch kinh doanh (Project Proposal).
- [x] Tạo thư mục `storage/templates/` và `storage/documents/` để quản lý nội dung và file mẫu.

### Giai đoạn 2: Xây dựng Backend API Service
- [x] `GET /api/templates`: Lấy danh sách mẫu (hỗ trợ search keyword, category, pagination).
- [x] `GET /api/templates/:id`: Lấy chi tiết mẫu để preview.
- [x] `POST /api/documents`: Khởi tạo tài liệu mới từ một template (Copy-on-Create pattern).
- [x] `GET /api/documents/:id`: Lấy thông tin & nội dung tài liệu đang soạn thảo.
- [x] `PUT /api/documents/:id`: Lưu tài liệu đã chỉnh sửa.
- [x] `GET /api/documents/:id/export`: Xuất tài liệu ra file DOCX chuẩn.

### Giai đoạn 3: Xây dựng Giao diện Người dùng (UI/UX)
- [x] Layout chính: Header chuyên nghiệp, thanh điều hướng, badge đếm mẫu.
- [x] Bộ lọc danh mục (Tabs / Pills) & Ô tìm kiếm từ khóa với debounce.
- [x] Template Grid: Các thẻ card mẫu hiển thị thumbnail trực quan, tên, mô tả, tag danh mục.
- [x] Preview Modal: Xem trước toàn bộ nội dung mẫu, metadata, ngày cập nhật, nút hành động "Sử dụng mẫu này".
- [x] Document Editor View:
  - Header editor: Tên tài liệu có thể đổi, nút Lưu, nút Tải xuống DOCX, trạng thái Lưu (Auto-save / Manual save).
  - Rich Text Toolbar: Thanh công cụ Google Docs chuyên nghiệp (Font, Cỡ chữ, Căn lề, Màu chữ, Danh sách, Bảng).
  - Khung soạn thảo văn bản mô phỏng trang A4 trực quan với công nghệ phân trang tự động `tiptap-a4-pagination` và 3 chế độ xem (Standard / Wide / Full).

### Giai đoạn 4: Kiểm thử, Tối ưu & Hoàn thiện Tài liệu
- [x] Kiểm tra tính toàn vẹn: Đảm bảo sau khi chỉnh sửa tài liệu, template gốc hoàn toàn không bị ảnh hưởng (Unit test kiểm chứng 100%).
- [x] Kiểm tra các trạng thái biên: Không có kết quả tìm kiếm, template ID không tồn tại, lỗi lưu.
- [x] Viết tài liệu README, Architecture, SRS, API spec chuẩn bị cho việc chuyển giao, tích hợp và triển khai hệ thống.

