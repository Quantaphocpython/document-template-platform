# SẢN PHẨM 1: THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE LIBRARY)

Ứng dụng thư viện mẫu văn bản thông minh tích hợp trong bộ ứng dụng văn phòng, phát triển bằng Next.js 15, TypeScript và Tailwind CSS.

---

## Tính Năng Chính

1. **Thư viện mẫu phong phú & Trực quan**:
   - Hiển thị danh sách mẫu tài liệu chuẩn văn phòng dưới dạng lưới thẻ (Grid card).
   - Mỗi mẫu đều có hình ảnh xem trước (Thumbnail), tên, mô tả ngắn, danh mục và thẻ phân loại (Tags).
   - Có sẵn tối thiểu **5 bộ mẫu dữ liệu chuẩn**:
     1. Hợp đồng lao động chuẩn (Employment Contract)
     2. Đơn xin nghỉ phép (Leave Request Form)
     3. Biên bản cuộc họp nội bộ (Meeting Minutes)
     4. Báo cáo tiến độ dự án tuần/tháng (Project Progress Report)
     5. Đề xuất dự án & kế hoạch kinh doanh (Project Proposal)

2. **Tìm kiếm & Phân loại linh hoạt**:
   - Tìm kiếm thời gian thực theo từ khóa (tiêu đề, mô tả, tags).
   - Lọc nhanh theo danh mục (Hợp đồng, Nhân sự, Biên bản, Báo cáo, Đề xuất).
   - Xử lý trạng thái tải (Loading Skeleton), trạng thái rỗng (Empty state) khi không tìm thấy kết quả.

3. **Xem trước (Preview) chi tiết**:
   - Modal xem trước định dạng chuẩn A4.
   - Hiển thị đầy đủ thông tin metadata, ngày cập nhật và nội dung định dạng thực tế.

4. **Tạo tài liệu mới (Copy-on-Create & Template Immutability)**:
   - Khi chọn "Sử dụng mẫu này", hệ thống thực hiện sao chép sâu (Deep Clone) nội dung sang một tài liệu người dùng mới với định danh riêng.
   - **Bảo đảm 100% mẫu gốc không bị thay đổi hoặc ghi đè**.

5. **Trình soạn thảo văn bản Google Docs A4 (Document Editor)**:
   - Trình soạn thảo văn bản mô phỏng trang A4 trực quan (`794px × 1123px`, lề `25.4mm`).
   - Tích hợp công nghệ phân trang thời gian thực **`tiptap-a4-pagination`**:
     - Tự động tách trang A4 khi nội dung dài tràn trang.
     - Tự động ngắt hàng bảng biểu thông minh giữa các trang, lặp lại tiêu đề bảng (`repeat header row`).
     - Đường phân cách `.page-break-gap` bóng đổ chuẩn Google Docs.
   - Thanh công cụ Google Docs Toolbar: Font family, Cỡ chữ, Căn lề, Tiêu đề (H1, H2, H3), In đậm, In nghiêng, Gạch chân, Màu chữ, Highlight, Bảng biểu, In ấn.
   - Hỗ trợ đổi 3 chế độ xem: Khổ chuẩn Standard A4, Khổ rộng Wide, và Khổ tối đa Full screen.
   - Tự động lưu bản nháp và hiển thị số lượng trang tài liệu thời gian thực.

6. **Tải xuống & Xuất bản (Export DOCX)**:
   - Cho phép tải về tài liệu dưới định dạng **DOCX** giữ nguyên cấu trúc văn bản, bảng biểu phân cột chuẩn xác (DXA).
   - Tự động giải mã 100% HTML entities tiếng Việt (`html-entities`), đảm bảo tệp Word tải về hiển thị dấu tiếng Việt sạch sẽ, chuẩn mực thể thức hành chính (Nghị định 30/2020/NĐ-CP).

---

## Công Nghệ Sử Dụng (Tech Stack)

- **Frontend & Backend**: Next.js 15 (App Router), React 19, TypeScript
- **Rich Text & Pagination**: TipTap Core (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`...) & `tiptap-a4-pagination`
- **Styling**: Tailwind CSS
- **Iconography**: Lucide React
- **Document Generation**: `docx` library & `html-entities` (xử lý OpenXML Word document)
- **Kiến trúc**: Layered Feature-Driven Architecture (UI $\rightarrow$ API Routes $\rightarrow$ Service Layer $\rightarrow$ File/Memory Storage)

---

## Hướng Dẫn Cài Đặt & Chạy Thử

### Yêu cầu môi trường:
- Node.js version 18+ (khuyên dùng Node 20+)
- Trình quản lý gói `pnpm`

### Các bước khởi chạy:
```bash
# 1. Di chuyển vào thư mục dự án
cd project-1-doc-template

# 2. Cài đặt các gói phụ thuộc bằng pnpm
pnpm install

# 3. Chạy môi trường phát triển (Development mode)
pnpm dev

# 4. Chạy kiểm thử tự động
pnpm test
```

Mở trình duyệt và truy cập: `http://localhost:3000`

---

## Danh Mục Tài Liệu Kỹ Thuật

Toàn bộ tài liệu kỹ thuật chi tiết đã được chuẩn bị sẵn sàng trong thư mục `docs/`:
- **[SRS.md](docs/SRS.md)**: Đặc tả yêu cầu phần mềm chi tiết (Functional & Non-Functional Requirements, Ma trận kiểm chứng).
- **[STRUCTURE.md](docs/STRUCTURE.md)**: Cấu trúc mã nguồn, sơ đồ phân lớp và sơ đồ tuần tự luồng dữ liệu (Sequence Diagram).
- **[ROADMAP.md](docs/ROADMAP.md)**: Lộ trình phát triển 4 giai đoạn từ MVP đến Enterprise, ma trận quản trị rủi ro.
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Kiến trúc hệ thống & cơ chế Immutability (Copy-on-Create).
- **[API_SPEC.md](docs/API_SPEC.md)**: Đặc tả toàn bộ API Routes & Contracts.
- **[REQUIREMENTS.md](docs/REQUIREMENTS.md)**: Tổng hợp yêu cầu nghiệp vụ và tiêu chuẩn kỹ thuật phân hệ văn bản.
- **[PLAN.md](docs/PLAN.md)**: Kế hoạch triển khai & Checklist tính năng.

---

## Cơ Chế Bảo Vệ Mẫu Gốc (Template Immutability)

Xem chi tiết tại [ARCHITECTURE.md](docs/ARCHITECTURE.md).
- Toàn bộ mẫu gốc tại `src/data/` và `storage/templates/` là **Read-Only**.
- Khi người dùng chọn mẫu, hệ thống cấp phát một `documentId` mới độc lập.
- Tất cả thay đổi của người dùng chỉ lưu vào `storage/documents/{documentId}` và không thể ghi ngược vào template gốc.
