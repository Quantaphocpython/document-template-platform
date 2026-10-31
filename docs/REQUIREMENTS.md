# BẢNG TỔNG HỢP TOÀN BỘ YÊU CẦU NỀN TẢNG (CONSOLIDATED REQUIREMENTS SPECIFICATION)
## DOCUMENT & PRESENTATION TEMPLATE PLATFORM (ENTERPRISE MONOREPO)

Tài liệu này tập hợp và hợp nhất **toàn bộ yêu cầu chức năng (Functional Requirements), yêu cầu phi chức năng (Non-Functional Requirements) và tiêu chuẩn kỹ thuật** của cả hai phân hệ ứng dụng trong nền tảng:
1. **Sản phẩm 1**: Thư viện Mẫu Văn bản (`apps/project-1-doc-template`)
2. **Sản phẩm 2**: Thư viện Mẫu Trình chiếu PowerPoint (`apps/project-2-slide-template`)
3. **Nền tảng hạ tầng dùng chung**: Turborepo Workspace & Shared Packages (`packages/core`, `packages/ui`)

---

## PHẦN I: MA TRẬN ĐỐI CHIẾU TIÊU CHUẨN TÍNH NĂNG (FEATURE MATRIX)

| Mã yêu cầu | Hạng mục yêu cầu | Sản phẩm 1 (Văn bản DOCX) | Sản phẩm 2 (Slide PPTX) | Trạng thái kiểm chứng |
| :---: | :--- | :--- | :--- | :---: |
| **REQ-01** | **Giao diện thư viện (Gallery View)** | • Hiển thị lưới thẻ biểu mẫu (Responsive Grid Card).<br>• Hiển thị Thumbnail vector SVG, tên, mô tả ngắn, danh mục phân loại, tags. | • Hiển thị lưới thẻ bài trình chiếu tỷ lệ 16:9.<br>• Hiển thị Thumbnail bìa đại diện, tên, mô tả, danh mục, tổng số slide. | **Đạt 100%** |
| **REQ-02** | **Bộ lọc & Tìm kiếm (Filter & Search)** | • Lọc tức thì theo danh mục nghiệp vụ (`contract`, `proposal`, `report`, `administrative`...).<br>• Tìm kiếm toàn văn (tiêu đề, mô tả, tags) với cơ chế Debounce. | • Lọc theo danh mục bộ slide (`pitch-deck`, `quarterly-review`, `product-launch`).<br>• Tìm kiếm thời gian thực theo từ khóa bài thuyết trình. | **Đạt 100%** |
| **REQ-03** | **Trải nghiệm Xem trước (Preview)** | • Modal xem trước kích thước và tỷ lệ khổ giấy in ấn chuẩn **A4**.<br>• Hiển thị cấu trúc nội dung thực tế, metadata và ngày cập nhật. | • Trình chiếu **Cinema Preview** tỷ lệ 16:9 độ phân giải HD.<br>• Thanh cuộn **Filmstrip Carousel** bên dưới cho phép nhấp xem chi tiết từng slide trong bộ. | **Đạt 100%** |
| **REQ-04** | **Bảo vệ mẫu gốc (Template Immutability)** | • **Cơ chế Copy-on-Create**: Sao chép sâu (Deep Clone) nội dung sang thực thể mới với UUID độc lập (`doc-...`).<br>• Mẫu gốc (`tpl-...`) luôn ở trạng thái bất biến (Read-only). | • **Cơ chế Physical File Clone**: Nhân bản vật lý file PPTX sang `storage/presentations/{id}.pptx` và ghi metadata riêng.<br>• File master trong `storage/templates/` là Read-only tuyệt đối. | **Đạt 100%**<br>*(Automated Tests Verified)* |
| **REQ-05** | **Khởi tạo & Chỉnh sửa (Usage & Edit)** | • Trình soạn thảo văn bản Rich Text Editor tích hợp.<br>• Đầy đủ Toolbar: Tiêu đề H1/H2/H3, In đậm, In nghiêng, Danh sách, Bảng biểu, Căn lề.<br>• Đổi tên tài liệu và lưu trạng thái (Auto-save / Saved). | • Luồng tạo bản trình chiếu mới độc lập.<br>• Modal xác nhận hiển thị đầy đủ thông số kỹ thuật (Tên, Mã ID, Số slide, Dung lượng file). | **Đạt 100%** |
| **REQ-06** | **Tải xuống / Xuất bản (Export / Download)** | • Phân tích cú pháp HTML blocks $\rightarrow$ docx Paragraphs / Tables $\rightarrow$ Xuất file Word (`.docx`) chuẩn OpenXML.<br>• Cấu trúc file nhị phân hợp lệ (Magic bytes `PK\x03\x04`). | • Tải trực tiếp file Microsoft PowerPoint (`.pptx`) nhị phân chuẩn OpenXML.<br>• Tương thích 100% với Microsoft PowerPoint, Google Slides, Keynote. | **Đạt 100%**<br>*(Automated Tests Verified)* |
| **REQ-07** | **Bộ dữ liệu mẫu chuẩn (Initial Catalog)** | • Tối thiểu **5 bộ biểu mẫu chuẩn**: Hợp đồng lao động, Đơn nghỉ phép, Biên bản cuộc họp, Báo cáo tiến độ, Bản đề xuất dự án.<br>• Cho phép nạp thêm mẫu mới mà không cần sửa giao diện. | • Tối thiểu **3 bộ template slide chuyên nghiệp** (gồm 15 slides 16:9): Pitch Deck gọi vốn, Báo cáo quý doanh nghiệp, Kế hoạch ra mắt sản phẩm.<br>• Mở rộng danh mục linh hoạt. | **Đạt 100%** |
| **REQ-08** | **Xử lý trạng thái UX (State Handling)** | • Trạng thái tải: Skeleton loading shimmer.<br>• Trạng thái rỗng: Empty state khi tìm kiếm không có kết quả.<br>• Phản hồi người dùng: Toast notifications, 404 Page thân thiện. | • Trạng thái tải: Skeleton loading shimmer 16:9.<br>• Trạng thái rỗng: Empty state trực quan.<br>• Điều hướng slide mượt mà, modal xác nhận thông minh. | **Đạt 100%** |
| **REQ-09** | **Kiến trúc mở rộng Editor trực tuyến** | — | • Báo cáo phân tích kỹ thuật về giới hạn của định dạng OpenXML trên web.<br>• Thiết kế lộ trình tích hợp trình biên tập slide trực tiếp qua Canvas (Fabric.js) và Microsoft WOPI Protocol. | **Đạt 100%** |

---

## PHẦN II: CHI TIẾT YÊU CẦU SẢN PHẨM 1 (THƯ VIỆN MẪU VĂN BẢN)

### 1. Yêu cầu chức năng (Functional Requirements - FR)
- **FR-1.1**: Người dùng có thể duyệt danh sách các biểu mẫu tài liệu hiển thị dạng Grid Card.
- **FR-1.2**: Mỗi card hiển thị rõ hình xem trước (SVG vector), tiêu đề, mô tả ngắn, danh mục phân loại và các thẻ tags.
- **FR-2.1**: Cho phép tìm kiếm toàn văn thời gian thực (real-time debounced search) theo tiêu đề, mô tả hoặc tags.
- **FR-2.2**: Lọc danh mục với 6 nhóm phân loại: Tất cả (`all`), Hợp đồng (`contract`), Đơn từ (`form`), Biên bản (`minutes`), Báo cáo (`report`), Đề xuất (`proposal`).
- **FR-3.1**: Cho phép mở cửa sổ modal xem trước mô phỏng khổ giấy in A4 (chiều rộng 794px, padding 48px chuẩn tỷ lệ).
- **FR-4.1 (Immutability)**: Khi người dùng nhấp "Sử dụng mẫu này", hệ thống thực thi thuật toán Copy-on-Create:
  - Tạo mới `UserDocument` với UUID riêng (`doc-...`).
  - Sao chép toàn bộ nội dung HTML ban đầu từ mẫu sang tài liệu người dùng.
  - Template gốc trong `src/data/templates.ts` và `storage/templates/` tuyệt đối không bị biến đổi.
- **FR-5.1**: Điều hướng người dùng vào màn hình soạn thảo văn bản (`/documents/[id]`).
- **FR-5.2**: Trình soạn thảo văn bản hỗ trợ thanh công cụ: Tiêu đề H1/H2/H3, Đậm, Nghiêng, Gạch chân, Căn lề trái/phải/giữa, Danh sách số/chấm, Chèn bảng biểu và Đổi tên tài liệu.
- **FR-6.1**: Người dùng có thể xuất file Microsoft Word (`.docx`) qua endpoint `GET /api/documents/:id/export`.
- **FR-6.2**: File DOCX tải về có đầy đủ cấu trúc đoạn văn, tiêu đề in đậm, bảng biểu và margins chuẩn trang in.

### 2. Yêu cầu dữ liệu khởi tạo (Seed Data)
Cung cấp sẵn 5 biểu mẫu chuẩn:
1. `tpl-employment-contract`: Hợp đồng lao động xác định thời hạn (chuẩn Bộ luật Lao động).
2. `tpl-leave-request`: Đơn xin nghỉ phép tiêu chuẩn nhân sự.
3. `tpl-meeting-minutes`: Biên bản cuộc họp ban điều hành nội bộ.
4. `tpl-project-report`: Báo cáo tiến độ dự án tuần/tháng (bảng phân tích tiến độ, rủi ro).
5. `tpl-project-proposal`: Bản đề xuất dự án kinh doanh mới (ngân sách, lộ trình).

---

## PHẦN III: CHI TIẾT YÊU CẦU SẢN PHẨM 2 (THƯ VIỆN MẪU TRÌNH CHIẾU)

### 1. Yêu cầu chức năng (Functional Requirements - FR)
- **FR-1.1**: Hiển thị danh mục bộ template PowerPoint dạng lưới card tỉ lệ 16:9.
- **FR-1.2**: Mỗi card hiển thị ảnh bìa, tên bộ slide, số lượng trang slide, danh mục và mô tả.
- **FR-2.1**: Tìm kiếm bộ slide theo từ khóa và phân loại theo 4 nhóm: Tất cả (`all`), Gọi vốn & Khởi nghiệp (`pitch-deck`), Báo cáo & Đánh giá định kỳ (`quarterly-review`), Chiến lược & Ra mắt sản phẩm (`product-launch`).
- **FR-3.1**: Trình chiếu **Slide Deck Cinema Modal** tỉ lệ chuẩn 16:9:
  - Màn chiếu chính lớn hiển thị trang slide đang chọn.
  - Bộ nút điều hướng Trước / Sau và bộ đếm trang (`Slide X / 5`).
- **FR-3.2**: Thanh trượt **Filmstrip Carousel** bên dưới:
  - Hiển thị danh sách thumbnail thu nhỏ của toàn bộ các slide con trong bộ.
  - Cho phép nhấp chọn bất kỳ slide nào để chuyển nhanh trên màn chiếu lớn.
- **FR-4.1 (Immutability)**: Khi người dùng nhấn "Tạo bản trình chiếu mới":
  - Backend thực hiện sao chép tệp nhị phân vật lý độc lập (`fs.copyFileSync`) từ `storage/templates/` sang `storage/presentations/{id}.pptx`.
  - Khởi tạo file metadata `{id}.json` lưu trữ thông số bài thuyết trình của người dùng.
  - Mẫu master PPTX gốc giữ nguyên 100% dung lượng, hash SHA-256 và mtime.
- **FR-5.1**: Hiển thị modal thông báo khởi tạo thành công với các thông số: Tiêu đề, Mã bản sao, Số slide, Dung lượng tệp và Thời gian tạo.
- **FR-6.1**: Cho phép tải tệp `.pptx` nhị phân hợp lệ về máy tính qua endpoint `GET /api/presentations/:id/download`.
- **FR-7.1**: Cung cấp báo cáo kiến trúc kỹ thuật và lộ trình tích hợp trình biên tập slide trực tuyến (Canvas & WOPI Protocol).

### 2. Yêu cầu dữ liệu khởi tạo (Seed Data)
Cung cấp sẵn 3 bộ slide chất lượng cao (gồm 15 slide vector 16:9):
1. `tpl-pitch-deck-investor`: Pitch Deck Gọi Vốn Đầu Tư Khởi Nghiệp (5 slides: Cover, Problem & Solution, Market Size, Traction, Team).
2. `tpl-quarterly-review`: Báo Cáo Hiệu Suất & Đánh Giá Hoạt Động Định Kỳ (5 slides: Cover, KPI Highlights, Financials, Challenges, Roadmap).
3. `tpl-product-launch`: Chiến Lược Ra Mắt Sản Phẩm Mới (5 slides: Cover, Target Audience, GTM Plan, Marketing Channels, Timeline).

---

## PHẦN IV: YÊU CẦU NỀN TẢNG HẠ TẦNG DÙNG CHUNG (SHARED INFRASTRUCTURE)

### 1. Kiến trúc Monorepo & Quản trị gói
- **Monorepo**: Tổ chức dự án theo mô hình Turborepo (`apps/*` và `packages/*`).
- **Package Manager**: Quản lý gói bằng `pnpm` (Workspace Monorepo).
- **Shared Package `core`**:
  - Centralized HTTP Client bọc Axios (hỗ trợ Bearer Token, Offline Guard, URL Params).
  - Lớp cơ sở trừu tượng Data Access Layer: `BaseStorageRepository`, `BaseCatalogService`.
  - Centralized Route Constants (`APP_ROUTES`, `API_ROUTES`) và Enums (`MimeType`).
  - Tiện ích dùng chung (`buildUrlWithParams`, `createAttachmentHeaders`, `sanitizeFileName`, `formatFileSize`).
- **Shared Package `ui`**:
  - UIKit chuẩn hóa Design System Tokens (CVA, Tailwind-merge, Radix UI).
  - Base components: `Button`, `Badge`, `Card`, `Dialog`, `Modal`, `Input`, `Separator`, `Skeleton`, `Tabs`, `Tooltip`.
  - Custom Portal System (Zustand-based): Quản lý Stacking Portals, Stacking Context Z-index và Exit Animations.
  - Imperative Helpers: `confirmModal.show()`, `confirmModal.danger()`, `toast.success()`, `toast.error()`.

### 2. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)
- **NFR-1 (Zero-Configuration)**:
  - Hệ thống sử dụng **File-based Storage Engine** (JSON + OpenXML vật lý), tuyệt đối không yêu cầu người dùng phải cài đặt bất kỳ cơ sở dữ liệu bên ngoài nào (như PostgreSQL, MySQL, MongoDB).
  - Khởi chạy ngay lập tức chỉ với lệnh `pnpm install` và `pnpm dev`.
- **NFR-2 (Serverless & Cloud Compatibility)**:
  - `BaseStorageRepository` hỗ trợ tự động nhận diện môi trường Serverless (Vercel) với cơ chế fallback `/tmp/storage`, tránh lỗi quyền ghi đĩa `EROFS`.
- **NFR-3 (Automated Quality Assurance)**:
  - Bộ kiểm thử tự động kiểm tra trọn vẹn 100% các tiêu chí: Catalog count, Filter/Search, Template Immutability (bảo vệ mẫu gốc), Magic bytes OpenXML DOCX/PPTX.
- **NFR-4 (Clean Code & TypeScript Strictness)**:
  - 100% TypeScript Strict mode, 0 lint errors, 0 lint warnings.
  - Xóa bỏ triệt để mọi unused imports và các file bridge re-export thừa thãi.

