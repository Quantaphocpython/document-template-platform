# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS - SOFTWARE REQUIREMENTS SPECIFICATION)
## SẢN PHẨM 1: THƯ VIỆN MẪU VĂN BẢN (DOCUMENT TEMPLATE LIBRARY)

* **Phiên bản tài liệu**: 1.0.0  
* **Trạng thái**: Approved & Implemented  
* **Tác giả**: Engineering Team  
* **Hệ thống mục tiêu**: Bộ ứng dụng văn phòng tích hợp (Integrated Office Suite)  

---

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích tài liệu
Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này mô tả toàn diện các yêu cầu nghiệp vụ, yêu cầu chức năng (Functional Requirements), yêu cầu phi chức năng (Non-Functional Requirements) và các ràng buộc kiến trúc cho **Hệ thống Thư viện Mẫu Văn bản (Document Template Library)**. Tài liệu đóng vai trò là kim chỉ nam cho quá trình thiết kế hệ thống, lập trình, kiểm thử và bàn giao sản phẩm.

### 1.2. Phạm vi sản phẩm
Hệ thống là một phân hệ web application hoàn chỉnh cho phép người dùng trong doanh nghiệp:
- Khám phá, tìm kiếm và phân loại các biểu mẫu văn phòng chuẩn hóa (Hợp đồng, Đơn từ, Biên bản, Báo cáo, Đề xuất).
- Xem trước trực quan biểu mẫu với độ trung thực cao mô phỏng khổ giấy in A4 chuẩn.
- Khởi tạo tài liệu làm việc mới dựa trên mẫu được chọn theo nguyên tắc **Copy-on-Create (Bảo toàn 100% mẫu gốc)**.
- Trực tiếp soạn thảo, tùy biến nội dung tài liệu bằng trình biên tập Rich Text Editor tích hợp.
- Xuất bản và tải xuống tài liệu dưới dạng file Microsoft Word (`.docx`) giữ nguyên cấu trúc văn bản.

### 1.3. Định nghĩa & Thuật ngữ (Definitions & Acronyms)
| Thuật ngữ | Diễn giải |
| :--- | :--- |
| **Template (Mẫu gốc)** | Tập dữ liệu biểu mẫu chuẩn do quản trị viên hoặc hệ thống cung cấp, mang tính bất biến (Read-only) đối với người dùng cuối. |
| **User Document** | Bản ghi tài liệu do người dùng tạo ra sau khi chọn một Template, mang ID độc lập và có toàn quyền chỉnh sửa/lưu trữ. |
| **Copy-on-Create** | Cơ chế sao chép độc lập toàn bộ nội dung template ngay khi người dùng nhấn tạo tài liệu mới, cắt đứt hoàn toàn liên kết tham chiếu (dereferencing) để bảo vệ mẫu gốc. |
| **Immutability** | Tính bất biến: Đảm bảo dữ liệu và file gốc không thể bị sửa đổi, ghi đè hoặc can thiệp bởi bất kỳ hành động nào của người dùng. |
| **OpenXML (DOCX)** | Định dạng tài liệu văn bản chuẩn nén theo cấu trúc XML của Microsoft Office Word (`.docx`). |

---

## 2. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)

### 2.1. Phối cảnh hệ thống
```
┌────────────────────────────────────────────────────────┐
│                   GIAO DIỆN NGƯỜI DÙNG                 │
│  - Template Gallery (Tìm kiếm, Lọc danh mục, Grid card)│
│  - Preview Modal (Mô phỏng giấy A4)                    │
│  - Rich Text Editor (Khung giấy in ấn + Toolbar chuẩn) │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / RESTful API
┌──────────────────────────▼─────────────────────────────┐
│                 BACKEND API & DOMAIN LAYER             │
│  - Template Controller (/api/templates)                │
│  - Document Controller (/api/documents)                │
│  - Template Service & Document Service                 │
│  - Docx Export Service (OpenXML Packing)               │
└──────────────────────────┬─────────────────────────────┘
                           │ Physical I/O
┌──────────────────────────▼─────────────────────────────┐
│                  STORAGE REPOSITORY                    │
│  - storage/templates/ (Read-only master templates)     │
│  - storage/documents/ (Read-write user documents)      │
└────────────────────────────────────────────────────────┘
```

### 2.2. Đối tượng người dùng (User Personas)
1. **Nhân sự / Pháp chế (HR & Legal Officers)**: Cần tìm kiếm và ban hành các biểu mẫu hợp đồng lao động, đơn từ chuẩn mực pháp lý.
2. **Quản lý dự án (Project Managers)**: Sử dụng các mẫu biên bản họp nội bộ, báo cáo tuần/tháng để cập nhật tiến độ công việc.
3. **Nhân viên văn phòng (End Users)**: Điền đơn xin nghỉ phép hoặc đề xuất sáng kiến mà không lo làm sai lệch hoặc xóa mất biểu mẫu của phòng ban.

### 2.3. Ràng buộc thiết kế & Công nghệ (Constraints)
- **Môi trường thực thi**: Node.js v20+ với trình quản lý gói `pnpm`.
- **Ngôn ngữ**: TypeScript 100% type-safe từ client đến server.
- **Frontend / Backend**: Next.js 15 App Router (Single-port deployment), tối ưu cài đặt chỉ bằng 1 câu lệnh cho việc khởi chạy và kiểm thử.
- **Styling**: Tailwind CSS với Design System Component thống nhất (tuân thủ nghiêm ngặt quy tắc Variant của Button).
- **Tính khả chuyển (Portability)**: Hệ thống sử dụng file-based repository trong thư mục `storage/`, độc lập hoàn toàn, không bắt buộc người dùng hoặc đội ngũ triển khai phải cài đặt thêm hệ quản trị CSDL ngoài.

---

## 3. CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### FR-1: Duyệt & Phân loại Danh mục Biểu mẫu (Template Catalog)
- **FR-1.1**: Hệ thống phải hiển thị danh mục các nhóm biểu mẫu: Hợp đồng & Pháp lý (`contract`), Nhân sự & Hành chính (`hr`), Biên bản & Hội họp (`meeting`), Báo cáo & Đánh giá (`report`), Đề xuất & Kế hoạch (`proposal`).
- **FR-1.2**: Mỗi mẫu phải hiển thị thẻ card gồm: Ảnh thumbnail SVG minh họa, tên đầy đủ, mô tả ngắn gọn, badge danh mục, danh sách tags và phiên bản (version).
- **FR-1.3**: Có huy hiệu (badge) đếm số lượng mẫu thực tế thuộc từng nhóm danh mục.

### FR-2: Tìm kiếm & Lọc Thời gian Thực (Real-time Search & Filter)
- **FR-2.1**: Cho phép tìm kiếm toàn văn theo từ khóa xuất hiện trong: Tiêu đề biểu mẫu, Mô tả, Tags phân loại hoặc Tên danh mục.
- **FR-2.2**: Cung cấp nút xóa từ khóa nhanh (`X`) trên thanh tìm kiếm.
- **FR-2.3**: Khi không có biểu mẫu nào khớp kết quả, hiển thị Empty State thân thiện kèm nút "Xóa bộ lọc tìm kiếm" để reset trạng thái.

### FR-3: Xem Trước Biểu Mẫu (Template Preview)
- **FR-3.1**: Cho phép người dùng nhấp vào ảnh hoặc nút "Xem trước" để mở cửa sổ Modal xem chi tiết.
- **FR-3.2**: Modal phải render cấu trúc văn bản thực tế trên giao diện mô phỏng khổ giấy in A4 (210mm x 297mm).
- **FR-3.3**: Hiển thị rõ ràng metadata: Tác giả biên soạn, Ngày cập nhật gần nhất, Mã định danh mẫu, Phiên bản và Thông báo bảo vệ tính bất biến.
- **FR-3.4**: Có nút hành động nổi bật "Sử dụng mẫu này" ngay trong Modal.

### FR-4: Cơ chế Khởi tạo Tài liệu Độc lập (Copy-on-Create & Immutability)
- **FR-4.1**: Khi người dùng nhấn "Sử dụng mẫu" hoặc "Dùng mẫu", hệ thống phải tạo ra một đối tượng `UserDocument` mới với mã UUID duy nhất (`doc-...`).
- **FR-4.2**: Nội dung HTML của template phải được nhân bản sâu (Deep Copy), loại bỏ hoàn toàn mọi tham chiếu bộ nhớ chung.
- **FR-4.3**: Mẫu gốc tại `storage/templates/` và `src/data/templates.ts` phải được giữ nguyên 100%, không bị sửa đổi, ghi đè hoặc thay đổi thời gian sửa đổi (mtime).
- **FR-4.4**: Sau khi tạo thành công, hệ thống tự động chuyển hướng người dùng sang trang Trình soạn thảo của tài liệu mới.

### FR-5: Trình Soạn Thảo Văn Bản Tích Hợp (Document Editor)
- **FR-5.1**: Trình soạn thảo hiển thị trên layout giấy in A4 có đổ bóng và căn lề tiêu chuẩn.
- **FR-5.2**: Thanh công cụ Toolbar mô phỏng Google Docs cung cấp đầy đủ các thao tác định dạng văn phòng:
  - Chọn phông chữ (Font Family Selector): Be Vietnam Pro, Times New Roman, Arial, Roboto, Inter, JetBrains Mono với dropdown Radix UI xem trước.
  - Cấp độ tiêu đề: H1 (18pt), H2 (14pt), H3 (13pt), Văn bản thường (Paragraph - 13pt).
  - Tăng giảm cỡ chữ từng point (pt) trực tiếp trên thanh công cụ.
  - Định dạng ký tự: In đậm (Bold), In nghiêng (Italic), Gạch chân (Underline), Gạch ngang (Strike), Khối code (<>).
  - Bộ chọn màu chữ & màu nền đánh dấu (Color / Highlight Pickers).
  - Căn lề: Căn trái (Left), Căn giữa (Center), Căn phải (Right), Căn đều hai bên (Justify).
  - Danh sách: Danh sách dấu chấm (Bullet list), Danh sách đánh số thứ tự (Numbered list), Trích dẫn (Blockquote).
  - Chèn bảng biểu: Tạo bảng có định dạng header xám chuyên nghiệp.
  - Chế độ xem trang: Chuyển đổi linh hoạt giữa Khổ giấy A4 (Standard - 816px), Bản rộng (Wide - 1100px) và Toàn màn hình (Full - 1500px).
  - Hoàn tác / Làm lại (Undo / Redo), In tài liệu (Print preview).
- **FR-5.3**: Tiêu đề tài liệu cho phép người dùng nhấp để chỉnh sửa trực tiếp.
- **FR-5.4**: Hiển thị nhãn trạng thái lưu trực quan ("Đã lưu" màu xanh / "Chưa lưu" màu hổ phách).
- **FR-5.5**: Thanh điều hướng tối giản với nút quay lại biểu tượng mũi tên gọn gàng, loại bỏ các biểu ngữ thông báo gây xao nhãng.
- **FR-5.6**: Cơ chế phân trang đa trang tự động (Google Docs-style Multi-page A4 Layout): Tích hợp thư viện phân trang `tiptap-a4-pagination`, tự động đo đạc và chia nội dung thành các trang A4 riêng biệt (Trang 1, Trang 2...), tự động tách dòng bảng biểu và lặp lại header bảng ở trang tiếp theo, hiển thị dải ngăn cách trang (.page-break-gap) trực quan, đảm bảo văn bản luôn nằm gọn gàng trên nền giấy trắng in ấn.


### FR-6: Lưu Trữ & Cập Nhật Tài Liệu (Document Persistence)
- **FR-6.1**: Khi người dùng nhấn "Lưu tài liệu", hệ thống gửi yêu cầu `PUT /api/documents/:id` để ghi dữ liệu xuống `storage/documents/:id.json`.
- **FR-6.2**: Hiển thị thông báo Toast xác nhận trạng thái lưu thành công hoặc thông báo lỗi nếu có gián đoạn mạng.

### FR-7: Xuất Bản File Microsoft Word (Export DOCX)
- **FR-7.1**: Cho phép người dùng nhấn "Tải DOCX" để tải về file `.docx` tiêu chuẩn.
- **FR-7.2**: Quá trình xuất file phải tự động lưu các chỉnh sửa mới nhất trước khi tải.
- **FR-7.3**: File `.docx` sinh ra phải có cấu trúc OpenXML hợp lệ, mở chuẩn xác trên Microsoft Word, Google Docs, LibreOffice:
  - Tự động giải mã 100% các thực thể HTML entities tiếng Việt (`decode(text)`).
  - Phân tích cú pháp inline tags bằng Tokenizer tuần tự, triệt tiêu lỗi lọt thẻ `strong>` hoặc mã HTML rác.
  - Tự động tính toán bề rộng cột bảng biểu theo đơn vị DXA tỷ lệ chính xác (8500 DXA printable width), đảm bảo các cột văn bản không bị co rúm chữ.
  - Tự động nhận diện và ánh xạ căn lề (Trái, Giữa, Phải, Căn đều).
  - Tuân thủ thể thức văn bản hành chính Việt Nam (Nghị định 30/2020/NĐ-CP): Font Times New Roman, lề trang A4 (trái 3cm, phải 2cm, trên/dưới 2.54cm).

---

## 4. CÁC YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

### NFR-1: Hiệu năng & Tốc độ Phản hồi (Performance)
- Thời gian phản hồi của các API endpoints (`GET /api/templates`, `GET /api/documents/:id`) không vượt quá 100ms trên môi trường máy chủ cục bộ.
- Ô tìm kiếm phản hồi ngay lập tức, hỗ trợ mượt mà khi người dùng gõ từ khóa.
- Thời gian sinh và tải file DOCX không vượt quá 1 giây đối với tài liệu thông thường.

### NFR-2: Tính Toàn vẹn Dữ liệu & Bất biến (Data Integrity & Immutability)
- Tuyệt đối không xảy ra hiện tượng "Dirty Write" làm thay đổi biểu mẫu ban đầu.
- Bản ghi `UserDocument` phải lưu trữ trường `clonedFromTemplateId` để truy vết nguồn gốc nhưng độc lập hoàn toàn về mặt lưu trữ.

### NFR-3: Trải nghiệm Người dùng (UX / UI Design)
- Áp dụng hiệu ứng Shimmer Skeleton khi dữ liệu đang tải, tránh tình trạng màn hình trắng hoặc giật layout (CLS).
- Thiết kế Responsive tương thích tốt từ màn hình Desktop (1920x1080, 1440x900) đến Tablet/Mobile.
- Hệ thống nút bấm tuân thủ nghiêm ngặt Design System: Sử dụng variant (`default`, `secondary`, `outline`, `ghost`) và size (`sm`, `md`, `lg`, `icon`), không ghi đè custom style tùy tiện.

### NFR-4: Khả năng Bảo trì & Mở rộng (Maintainability & Extensibility)
- Cho phép bổ sung thêm biểu mẫu mới vào hệ thống thông qua `templateService.addTemplate()` hoặc thêm vào file cấu hình mà không cần phải chỉnh sửa hay biên dịch lại mã nguồn giao diện.
- Kiến trúc phân lớp rành mạch: `Presentation Layer` $\rightarrow$ `API Handlers` $\rightarrow$ `Domain Services` $\rightarrow$ `Storage Repository`.

---

## 5. MA TRẬN KIỂM CHỨNG & TIÊU CHÍ NGHIỆM THU (VERIFICATION MATRIX)

| Mã yêu cầu | Hạng mục kiểm chứng | Phương pháp kiểm tra | Kết quả đạt được |
| :--- | :--- | :--- | :---: |
| **FR-1** | 5 mẫu ban đầu, đầy đủ metadata, tags | Automated Test (`tests/verify-all.ts`) | **PASSED** (6 danh mục, 5 mẫu) |
| **FR-2** | Lọc theo category, tìm kiếm theo từ khóa | Automated Test (`tests/verify-all.ts`) | **PASSED** (Filter & Search OK) |
| **FR-3** | Preview A4 Modal trung thực | Automated Component Build & Typecheck | **PASSED** (Modal A4 Paper OK) |
| **FR-4** | Copy-on-Create, Immutability mẫu gốc | Automated Test (`tests/verify-all.ts`) | **PASSED** (File gốc nguyên vẹn) |
| **FR-5** | Rich Text Editor & Toolbar chuẩn | Component Code & Static Linting | **PASSED** (H1-H3, Table, Styles) |
| **FR-6** | Lưu tài liệu xuống storage/documents/ | Automated Integration Test | **PASSED** (UUID độc lập) |
| **FR-7** | Xuất file binary Word DOCX chuẩn | Automated Test (`tests/verify-all.ts`) | **PASSED** (PK zip magic bytes OK) |
| **FR-7.4** | Giải mã Entities & Bảng phân cột DOCX | Automated Test (`tests/verify-all.ts`) | **PASSED** (Clean entities & DXA widths) |

