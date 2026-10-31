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

## 5. Chiến lược Kiến trúc Backend & Lộ trình Bóc tách (Backend Migration Roadmap)
- **Thiết kế hiện tại (All-in-one Monorepo)**: Sử dụng Next.js Route Handlers (`src/app/api/`) kết hợp Domain Services (`src/server/services/`) và File-based Storage. Mô hình này giúp toàn bộ hệ thống đóng gói khép kín, khởi chạy tức thì và kiểm thử tự động đạt độ tin cậy 100% mà không đòi hỏi bất kỳ Database hay service phụ trợ nào.
- **Lộ trình bóc tách (Decoupling Ready)**: Khi mở rộng quy mô, toàn bộ domain services (`document.service.ts`, `docx-export.service.ts`, `storage.service.ts`) được thiết kế theo nguyên tắc phân lớp rõ ràng, sẵn sàng trích xuất thành một Dedicated Backend Microservice độc lập (NestJS / Go) và kết nối Cloud Storage (S3) / Cloud Database (PostgreSQL). Tầng Client sử dụng `DocumentApiService` kế thừa `BaseApiService` từ package `core`, do đó chỉ cần cấu hình lại `NEXT_PUBLIC_BASE_API` là hoàn tất kết nối mà hoàn toàn không cần refactor giao diện người dùng.

