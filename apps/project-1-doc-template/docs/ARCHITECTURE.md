# KIẾN TRÚC HỆ THỐNG - SẢN PHẨM 1: THƯ VIỆN MẪU VĂN BẢN

## 1. Tổng quan Kiến trúc

Hệ thống được thiết kế theo mô hình phân lớp rõ ràng (Layered Architecture) bên trong ứng dụng Fullstack Next.js:

```
┌────────────────────────────────────────────────────────┐
│                   GIAO DIỆN NGƯỜI DÙNG                 │
│  - Template Gallery (Grid, Search, Filter)             │
│  - Template Preview Modal                              │
│  - Document Editor (A4 Paper UI, Rich Toolbar)         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│                   API ROUTE HANDLERS                   │
│  - /api/templates       (List & Search)                │
│  - /api/templates/[id]  (Detail & Preview)             │
│  - /api/documents       (Create from Template - Clone) │
│  - /api/documents/[id]  (Get & Update content)         │
│  - /api/documents/[id]/export (Export DOCX / File)     │
└──────────────────────────┬─────────────────────────────┘
                           │ Service Calls
┌──────────────────────────▼─────────────────────────────┐
│                   BUSINESS LOGIC LAYER                 │
│  - TemplateService (Read-only queries, validation)     │
│  - DocumentService (Clone isolation, Save, Metadata)   │
│  - DocxExportService (Convert content to DOCX format)  │
└──────────────────────────┬─────────────────────────────┘
                           │ Storage Operations
┌──────────────────────────▼─────────────────────────────┐
│                    STORAGE REPOSITORY                  │
│  - Template Store: storage/templates/ (Read-only)      │
│  - Document Store: storage/documents/ (Read-Write)     │
│  - In-memory / JSON Cache / Database layer             │
└────────────────────────────────────────────────────────┘
```

---

## 2. Nguyên tắc Bất biến của Template (Template Immutability & Copy-on-Create)

Một trong những yêu cầu kỹ thuật then chốt của bài toán là: **"Việc tạo tài liệu mới không được làm thay đổi file template gốc"**.

### Cơ chế bảo đảm:
1. **Phân quyền & Tách biệt Vật lý (Physical Isolation)**:
   - Thư mục `storage/templates/` được đánh dấu là Read-Only đối với các thao tác người dùng. Không có API nào của người dùng có quyền ghi đè hoặc chỉnh sửa tài nguyên tại thư mục này.
   - Thư mục `storage/documents/` là nơi lưu trữ các tài liệu do người dùng tạo.
2. **Deep Copy khi khởi tạo (Copy-on-Create)**:
   - Khi người dùng bấm "Sử dụng mẫu", `DocumentService` thực hiện clone sâu (Deep Clone) nội dung template.
   - Sinh một `documentId` duy nhất (UUID v4) độc lập với `templateId`.
   - Lưu trữ bản sao mới với thuộc tính `clonedFromTemplateId: template.id` để truy vết nguồn gốc mà không giữ liên kết tham chiếu (dereferenced).
3. **Mọi thao tác chỉnh sửa chỉ tác động lên bản sao**:
   - Trình soạn thảo chỉ gửi request lưu lên `/api/documents/:documentId`.
   - File template gốc giữ nguyên checksum, kích thước và nội dung ban đầu.

---

## 3. Mô hình Dữ liệu (Data Models)

### `Template` (Mẫu tài liệu gốc)
```typescript
export interface Template {
  id: string;               // Mã định danh mẫu, ví dụ: 'tpl-employment-contract'
  title: string;            // Tên hiển thị của mẫu
  description: string;      // Mô tả ngắn gọn
  category: TemplateCategory; // Danh mục (vd: 'contract', 'hr', 'report'...)
  thumbnailUrl: string;     // Ảnh đại diện xem trước
  version: string;          // Phiên bản template (vd: '1.0.0')
  tags: string[];           // Danh sách từ khóa tìm kiếm
  contentHtml: string;      // Nội dung mẫu dạng HTML có định dạng
  sampleDocxPath?: string;  // Đường dẫn file DOCX gốc (nếu có)
  createdAt: string;        // Ngày tạo
  updatedAt: string;        // Ngày cập nhật
}
```

### `UserDocument` (Tài liệu người dùng tạo từ mẫu)
```typescript
export interface UserDocument {
  id: string;               // UUID duy nhất cho tài liệu người dùng
  title: string;            // Tên tài liệu (mặc định lấy theo template, user có thể đổi)
  clonedFromTemplateId: string; // Tham chiếu ID template ban đầu
  category: TemplateCategory;
  contentHtml: string;      // Nội dung đang được người dùng chỉnh sửa
  status: 'draft' | 'saved' | 'exported';
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Xử lý Trạng thái & Ngoại lệ (Error Handling & UX States)
- **Loading State**: Sử dụng hiệu ứng Skeleton shimmer khi danh sách template hoặc nội dung preview đang tải.
- **Empty State**: Khi tìm kiếm hoặc lọc không có kết quả, hiển thị thông báo thân thiện và nút "Xóa bộ lọc".
- **Not Found (404)**: Xử lý rõ ràng khi người dùng truy cập ID mẫu hoặc tài liệu không tồn tại.
- **Save Feedback**: Toast thông báo "Đã lưu tài liệu thành công" hoặc cảnh báo khi có sự cố mạng.
- **Export DOCX**: Chuyển đổi cấu trúc tài liệu sang file binary Word (.docx) kèm header/footer/style chuẩn và trả về dạng stream download.

---

## 5. Kiến Trúc Bộ Xuất File Word & Trình Soạn Thảo Văn Bản (DOCX Engine & Google Docs Editor)

### A. Google Docs Toolbar & Rich Text Canvas (TipTap Engine)
- **Cấu trúc Toolbar gắn liền (Pinned Under Header)**: Thanh công cụ bám sát ngay dưới thanh điều hướng với khoảng cách 0px, loại bỏ hoàn toàn khoảng trống thừa.
- **Tính năng định dạng nâng cao**:
  - **Font Family Selector**: Hỗ trợ xem trước và chọn các font hành chính phổ biến: Be Vietnam Pro, Times New Roman, Arial, Roboto, Inter, JetBrains Mono.
  - **Headings & Hierarchy**: Tiêu đề chính (H1 - 18pt), Tiêu đề phụ (H2 - 14pt), Đề mục (H3 - 13pt), Văn bản thường (Normal - 13pt).
  - **Font Size Controls**: Tăng/giảm kích thước font từng điểm (pt).
  - **Formatting Controls**: In đậm (B), In nghiêng (I), Gạch chân (U), Gạch ngang (S), Khối code (<>).
  - **Color & Highlight Pickers**: Bộ chọn màu chữ và màu nền đánh dấu (Highlighter) với bảng màu tiêu chuẩn văn phòng.
  - **Alignment & Spacing**: Căn trái, Căn giữa, Căn phải, Căn đều hai bên (Justify).
  - **Lists & Tables**: Danh sách dấu chấm (Bullet list), Danh sách số (Ordered list), Trích dẫn (Blockquote), Chèn và căn chỉnh bảng biểu.
  - **View Mode Switcher**: Cho phép linh hoạt chuyển đổi giữa 3 chế độ xem: Khổ giấy in ấn A4 chuẩn (Standard - 816px), Bản rộng (Wide - 1100px) và Toàn màn hình (Full - 1500px).
- **Hệ thống Dropdown chuẩn mực**: Tích hợp `@radix-ui/react-dropdown-menu` thông qua component dùng chung `DropdownMenu` trong `packages/ui`, thay thế hoàn toàn thẻ select mặc định của trình duyệt.
- **Cơ chế Phân trang đa trang tự động (Google Docs-style A4 Multi-page Engine)**:
  - Tích hợp thư viện chuyên biệt `tiptap-a4-pagination` dựa trên cơ chế ProseMirror Decorations (non-destructive).
  - Tự động đo đạc chiều cao khối văn bản trong thời gian thực: khi văn bản vượt quá chiều cao một trang A4 chuẩn (1123px ở 96 DPI, lề 25.4mm), hệ thống tự động sinh dải ngăn cách trang `.page-break-gap` (màu nền canvas kèm viền bóng đổ 3D sắc nét).
  - **Tự động tách hàng bảng biểu (Smart Table Row Splitting)**: Đối với các bảng biểu dài (như danh sách Action Items trong Biên bản cuộc họp), hệ thống tự động tách rời giữa các dòng `<tr>`, lặp lại hàng tiêu đề `<thead>` ở đầu trang tiếp theo và đẩy các dòng dữ liệu cùng phần chữ ký sang **Trang 2**, loại bỏ hoàn toàn hiện tượng tràn văn bản ra ngoài tờ giấy trắng.
  - Toàn bộ nội dung phân trang hiển thị trực quan 1:1, đồng thời giữ sạch 100% cấu trúc HTML lưu trữ và file DOCX tải về.


### B. Kiến Trúc Xử Lý Xuất DOCX (DocxExportService)
Nhằm khắc phục triệt để các lỗi rò rỉ mã HTML và sai lệch tỷ lệ hiển thị trên Microsoft Word:
1. **Giải mã thực thể HTML toàn diện (`html-entities`)**: Toàn bộ chuỗi văn bản được đưa qua hàm `decode(text)` và chuẩn hóa Unicode NFC (`normalize('NFC')`), giải mã sạch sẽ 100% các ký tự tiếng Việt dạng thực thể (`&Ecirc;` -> `Ê`, `&agrave;` -> `à`, `&amp;` -> `&`,...).
2. **Bộ phân tách thẻ tuần tự (Token-based Parser)**: Chuyển đổi mã HTML thành các token tuần tự (`tokens = html.split(/(<[^>]+>)/g)`). Parser theo dõi trạng thái thẻ đóng/mở (`<strong>`, `<b>`, `<em>`, `<i>`, `<u>`, `<s>`, `<span style="color:...">`), triệt tiêu hoàn toàn lỗi lọt chuỗi `strong>` hoặc thẻ HTML thô vào trang Word.
3. **Phân bổ tỷ lệ cột bảng biểu theo đơn vị OpenXML DXA**:
   - Trích xuất chính xác thuộc tính `width: X%` từ style của từng ô `<th>`/`<td>` (ví dụ: 8%, 44%, 24%, 24% của Biên bản họp; 50% - 50% của phần ký tên).
   - Dựa trên độ rộng vùng in chuẩn của trang A4 (`PRINTABLE_WIDTH_DXA = 8500 DXA`), hệ thống tính toán chính xác kích thước DXA cho từng cột trong `columnWidths` và từng `TableCell`. Cột văn bản dài hiển thị rộng thoáng, không còn hiện tượng bị bóp nghẹt chữ.
4. **Chuẩn hóa thể thức văn bản hành chính Việt Nam (Nghị định 30/2020/NĐ-CP)**:
   - Font mặc định: Times New Roman.
   - Cỡ chữ chuẩn: Tiêu đề 17-18pt, Đề mục 13-14pt, Nội dung 13pt, Bảng biểu 10-11pt.
   - Khoảng cách dòng: 1.25 - 1.5 lines (`spacing: { line: 360, before: 60, after: 60 }`).
   - Căn lề trang A4 chuẩn: Lề trên 2.54cm (1440 dxa), lề dưới 2.54cm, lề trái 3cm (1700 dxa), lề phải 2cm (1134 dxa).

---

## 6. Chiến lược Kiến trúc Backend & Lộ trình Bóc tách (Backend Migration Roadmap)
- **Thiết kế hiện tại (All-in-one Monorepo)**: Sử dụng Next.js Route Handlers (`src/app/api/`) kết hợp Domain Services (`src/server/services/`) và File-based Storage. Mô hình này giúp toàn bộ hệ thống đóng gói khép kín, khởi chạy tức thì và kiểm thử tự động đạt độ tin cậy 100% mà không đòi hỏi bất kỳ Database hay service phụ trợ nào.
- **Lộ trình bóc tách (Decoupling Ready)**: Khi mở rộng quy mô, toàn bộ domain services (`document.service.ts`, `docx-export.service.ts`, `storage.service.ts`) được thiết kế theo nguyên tắc phân lớp rõ ràng, sẵn sàng trích xuất thành một Dedicated Backend Microservice độc lập (NestJS / Go) và kết nối Cloud Storage (S3) / Cloud Database (PostgreSQL). Tầng Client sử dụng `DocumentApiService` kế thừa `BaseApiService` từ package `core`, do đó chỉ cần cấu hình lại `NEXT_PUBLIC_BASE_API` là hoàn tất kết nối mà hoàn toàn không cần refactor giao diện người dùng.

