# ĐẶC TẢ SẢN PHẨM & TIÊU CHUẨN KỸ THUẬT NỀN TẢNG (PRODUCT SPECIFICATION)
## DOCUMENT & PRESENTATION TEMPLATE PLATFORM (ENTERPRISE EDITION)

Tài liệu này đóng vai trò là đặc tả yêu cầu sản phẩm (Product Requirements Document - PRD) và tiêu chuẩn kỹ thuật cốt lõi cho **Nền tảng Quản trị & Tự động hóa Mẫu Tài liệu Văn phòng Đa phương tiện**.

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Nền tảng được xây dựng nhằm giải quyết bài toán quản trị tập trung, chuẩn hóa văn bản biểu mẫu và tăng tốc độ soạn thảo tài liệu trong môi trường doanh nghiệp. Hệ thống được tổ chức theo mô hình **Turborepo Monorepo** bao gồm hai phân hệ sản phẩm chuyên biệt và hai gói thư viện dùng chung:

1. **Sản phẩm 1 - Document Template Library (`apps/project-1-doc-template`)**: Phân hệ thư viện mẫu văn bản hành chính/hợp đồng, tích hợp trình soạn thảo trực tiếp định dạng A4 và xuất file Word (`.docx`).
2. **Sản phẩm 2 - Slide Presentation Library (`apps/project-2-slide-template`)**: Phân hệ thư viện mẫu trình chiếu thuyết trình tỉ lệ chuẩn 16:9, tích hợp rạp chiếu Cinema Preview đa slide và tạo bản sao PowerPoint (`.pptx`) độc lập.
3. **Thư viện dùng chung (`packages/core` & `packages/ui`)**:
   - `core`: Centralized HTTP Client, Lớp cơ sở trừu tượng Data Access Layer, Route constants, File/URL utilities.
   - `ui`: UIKit hoàn chỉnh độc lập, Tailwind-merge, Design System Tokens, Custom Portal System (Zustand-based).

---

## 2. PHÂN HỆ 1: THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE ENGINE)

### 2.1. Mục tiêu sản phẩm
Cung cấp giải pháp chọn lọc biểu mẫu văn bản, xem trước trực quan chuẩn trang in A4, và cho phép chỉnh sửa trực tiếp nội dung trước khi xuất bản thành tệp tin Word tiêu chuẩn mà không làm biến đổi dữ liệu mẫu gốc.

### 2.2. Đặc tả tính năng
- **Catalog & Phân loại thông minh**: Hiển thị lưới biểu mẫu đa dạng kèm thumbnail vector SVG sắc nét, lọc theo danh mục (`contract`, `proposal`, `report`, `administrative`...) và tìm kiếm toàn văn thời gian thực (debounced).
- **Xem trước chuẩn khổ in A4 (A4 Print Preview)**: Modal hiển thị mô phỏng trực quan tờ giấy A4 với bố cục căn lề, tiêu đề, con dấu và bảng biểu tiêu chuẩn.
- **Trình soạn thảo trực quan (In-browser Editor)**: Tích hợp thanh công cụ định dạng Rich Text (Bold, Italic, Headings, List, Table, Alignment, Color) cùng tính năng Auto-save thông minh.
- **Cơ chế sao chép độc lập (Copy-on-Create Immutability)**:
  - Khi người dùng nhấn "Sử dụng mẫu", hệ thống thực hiện sao chép sâu (Deep Clone) nội dung sang một thực thể tài liệu mới với UUID riêng (`doc-...`).
  - Mọi thao tác chỉnh sửa, lưu trữ hoặc xóa chỉ tác động trên bản sao của người dùng. Mẫu gốc (`tpl-...`) luôn ở trạng thái bất biến (Read-only).
- **Xuất file Word OpenXML (.docx)**: Chuyển đổi trực tiếp các khối nội dung Rich Text/HTML thành cấu trúc tệp OpenXML chuẩn quốc tế (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`).

---

## 3. PHÂN HỆ 2: THƯ VIỆN MẪU TRÌNH CHIẾU (SLIDE PRESENTATION ENGINE)

### 3.1. Mục tiêu sản phẩm
Cung cấp thư viện các bộ slide thuyết trình chuyên nghiệp định dạng Microsoft PowerPoint, hỗ trợ người dùng xem toàn bộ slide deck với trải nghiệm rạp chiếu Cinema 16:9 trước khi khởi tạo bản trình chiếu riêng.

### 3.2. Đặc tả tính năng
- **Bộ mẫu Slide Deck chuẩn doanh nghiệp**: Các bộ mẫu PowerPoint chất lượng cao gồm 5 slide chuyên biệt theo chủ đề: Pitch Deck gọi vốn, Báo cáo hiệu suất định kỳ (Quarterly Review), Chiến lược ra mắt sản phẩm (Product Launch / GTM).
- **Trải nghiệm Cinema Modal & Filmstrip Carousel**: Khung chiếu tỉ lệ chuẩn 16:9 với độ phân giải HD, tích hợp dải trượt filmstrip bên dưới cho phép nhấp chọn xem chi tiết từng slide trong bộ.
- **Sao chép nhị phân độc lập (Physical File Cloning)**:
  - Nhân bản vật lý tệp master `.pptx` sang thư mục người dùng `storage/presentations/{id}.pptx` kèm theo file metadata `{id}.json`.
  - Tệp master trong `storage/templates/` được phân quyền Read-only và kiểm tra tính toàn vẹn (checksum).
- **Stream download chuẩn RFC-6266**: Tải file PowerPoint trực tiếp về máy tính với HTTP Content-Disposition attachment và Content-Type chuẩn ECMA-376.

---

## 4. TIÊU CHUẨN KỸ THUẬT & KIẾN TRÚC HỆ THỐNG

### 4.1. Kiến trúc phân tầng
- **Thin Routing Shells**: Next.js App Router chỉ đóng vai trò điều hướng mỏng nhẹ, chuyển tiếp trạng thái trực tiếp xuống Feature Screens.
- **Feature-Driven Architecture**: Mã nguồn chia theo từng phân hệ nghiệp vụ (`templates/`, `editor/`, `presentations/`), tự đóng gói components, hooks và screens riêng.
- **Pure Data Access Layer**: Tầng API được trừu tượng hóa qua `BaseApiService` kế thừa `HttpClient` từ package `core`, hỗ trợ Bearer Token, Offline Guard và chuẩn hóa xử lý lỗi.
- **Zero-External-Database Architecture**: Sử dụng File-based Storage Engine lưu trữ file JSON và OpenXML vật lý, giúp toàn bộ hệ thống khởi chạy tức thì (Zero-Configuration).

### 4.2. Độ tin cậy & Kiểm thử
- 100% các chức năng cốt lõi (Nạp danh mục, Tìm kiếm/Lọc, Sao chép độc lập, Tính bất biến của Mẫu gốc, Xuất file Word/PowerPoint chuẩn OpenXML) đều được kiểm thử tự động qua bộ test script `pnpm test`.

