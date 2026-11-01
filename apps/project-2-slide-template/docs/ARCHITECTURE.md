# KIẾN TRÚC HỆ THỐNG - SẢN PHẨM 2: THƯ VIỆN MẪU TRÌNH CHIẾU

## 1. Tổng quan Kiến trúc

```
┌────────────────────────────────────────────────────────┐
│                   GIAO DIỆN NGƯỜI DÙNG                 │
│  - Presentation Gallery (Grid, Search, Filter)         │
│  - Slide Deck Preview (16:9 Cinema, Filmstrip carousel)│
│  - Presentation Creation & Download Modal / Page       │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│                   API ROUTE HANDLERS                   │
│  - /api/templates       (List, Categories, Search)     │
│  - /api/templates/[id]  (Get full slide deck metadata) │
│  - /api/presentations   (Clone & Create presentation)  │
│  - /api/presentations/[id]/download (Download PPTX)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Service Calls
┌──────────────────────────▼─────────────────────────────┐
│                   BUSINESS LOGIC LAYER                 │
│  - SlideTemplateService (Read-only catalog & previews) │
│  - PresentationService  (Clone PPTX, Isolation, Meta)  │
│  - PPTXStreamService    (Serve binary PPTX files)      │
└──────────────────────────┬─────────────────────────────┘
                           │ Storage Operations
┌──────────────────────────▼─────────────────────────────┐
│                    STORAGE REPOSITORY                  │
│  - Master Templates: storage/templates/ (Read-only)    │
│  - User Presentations: storage/presentations/          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Nguyên tắc Bất biến của Template (Template Immutability)

- Khi người dùng chọn "Tạo bản trình chiếu mới" từ template `tpl-investor-pitch`:
  1. Hệ thống đọc file gốc từ kho tài nguyên mẫu (`storage/templates/tpl-investor-pitch.pptx`).
  2. Tạo bản sao vật lý sang thư mục của người dùng: `storage/presentations/{newPresentationId}.pptx` sử dụng cơ chế File Stream Copy (hoặc Copy-on-Write).
  3. Mọi thao tác tải về, sửa đổi sau này chỉ tác động lên file mới, template gốc giữ nguyên 100% tính toàn vẹn (checksum không thay đổi).

---

## 3. Mô hình Dữ liệu (Data Models)

### `SlideTemplate`
```typescript
export interface SlideItem {
  id: string;
  slideNumber: number;
  title: string;
  previewImageUrl: string; // Ảnh render độ phân giải cao tỉ lệ 16:9
  layoutType: 'cover' | 'agenda' | 'content' | 'chart' | 'conclusion';
}

export interface SlideTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  totalSlides: number;
  thumbnailUrl: string;
  aspectRatio: '16:9' | '4:3';
  slides: SlideItem[];
  pptxFilePath: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### `UserPresentation`
```typescript
export interface UserPresentation {
  id: string;                    // UUID bản trình chiếu mới
  title: string;                  // Tên bài thuyết trình do user đặt
  clonedFromTemplateId: string;   // Tham chiếu template gốc
  filePath: string;               // Đường dẫn tới file PPTX độc lập
  fileSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Phân tích Giới hạn Kỹ thuật & Lộ trình Tích hợp Slide Editor Trực tuyến (In-browser Slide Editor Roadmap)

Trong quá trình thiết kế hệ thống xử lý tệp tin trình chiếu PowerPoint đa nền tảng:
> *"Do tính chất đặc thù của định dạng OpenXML (.pptx), việc phân tách rõ ràng giữa luồng xem trước trực quan, tạo bản sao độc lập và tải tệp tin nhị phân chuẩn ECMA-376 mang lại độ tin cậy và hiệu năng cao nhất, đồng thời thiết lập sẵn nền tảng để tích hợp trình soạn thảo chuyên sâu."*

### A. Giới hạn kỹ thuật hiện tại của việc dựng Slide Editor trên Web:
1. **Độ phức tạp của định dạng OpenXML (.pptx)**: Định dạng PPTX bao gồm hàng trăm thành phần (Vector shapes, smart art, gradient, animations, typography, master layouts). Việc render và parse hai chiều (round-trip parsing) PPTX trên trình duyệt đòi hỏi thư viện chuyên dụng rất lớn.
2. **Khác biệt về Font & Layout**: Trình duyệt và Microsoft PowerPoint có engine hiển thị text và kerning khác nhau, dẫn đến hiện tượng tràn chữ nếu không có engine render đồng nhất.

### B. Hướng kiến trúc & Hiện trạng Tích hợp:
1. **Đã triển khai: Trình chiếu Slide Deck Cinema 16:9 với Hệ thống Điều Hướng Toàn Diện**:
   - Module `SlideDeckModal` cung cấp trải nghiệm trình chiếu thuyết trình mượt mà, trực quan chuẩn Cinema HD:
     - **Hai hệ thống chuyển slide nổi bật**: Nút mũi tên nổi kích thước lớn (`ChevronLeft` / `ChevronRight`) trực tiếp hai bên màn chiếu + Bộ nút điều hướng thanh công cụ `< Slide trước` và `Slide tiếp theo >`.
     - **Chế độ Lưới Tổng Quan (Overview Grid Mode)**: Phím tắt `ESC` hoặc nút "Tổng quan" mở toàn cảnh tất cả các slide trong bộ để nhấp chuyển tức thì.
     - **Chế độ Toàn Màn Hình (Fullscreen Mode)**: Phím tắt `F` hoặc nút phóng to.
     - **Hỗ trợ phím tắt**: Phím mũi tên trái/phải (`←` / `→`), Phím cách (Space).
     - Đồng bộ hai chiều (bi-directional synchronization) giữa slide đang phát với tiêu đề, mô tả và thanh trượt Filmstrip Carousel bên dưới.
   - Ảnh thumbnail ngoài Gallery Card được đồng bộ chuẩn xác với trang slide bìa (`slide-1.svg`).
   - Toàn bộ giao diện dùng chung Design System từ package `packages/ui` (`Button`, `Badge`, `Modal`, `Card`), loại bỏ hoàn toàn các class style ghi đè thủ công.
2. **Đã tích hợp: Fabric.js HTML5 Canvas 2D Engine (Interactive Vector Slide Canvas)**:
   - Sử dụng thư viện tiêu chuẩn công nghiệp **Fabric.js (`fabric` v7)**:
     - Render slide trực tiếp lên thẻ HTML5 `<canvas>` với context đồ họa 2D tăng tốc phần cứng.
     - Các thành phần trên slide được biểu diễn dưới dạng các đối tượng vector tương tác (`FabricObject`, `Textbox`, `Rect`, `Group`).
     - Tự động ngắt dòng và co giãn chữ thông qua `Fabric.Textbox`, giải quyết triệt để lỗi tràn dòng của DOM/CSS thông thường.
     - Thanh công cụ Canvas cho phép: Thêm Textbox mới, Thêm Shape/Card vector, Bounding box chỉnh sửa với tay nắm xoay/scale góc, Xóa đối tượng đã chọn, và Xuất ảnh chất lượng cao 2x DPI PNG trực tiếp từ Canvas (`canvas.toDataURL`).
     - Quản lý vòng đời chặt chẽ (`canvas.dispose()`) đảm bảo không rò rỉ bộ nhớ khi chuyển đổi giữa các slide.
3. **Giải pháp mở rộng dài hạn: Microsoft Office for the Web qua giao thức WOPI (Web Application Open Platform Interface)**:
   - Kiến trúc chuẩn doanh nghiệp (Enterprise Standard).
   - Nhúng trực tiếp iframe PowerPoint Online của Microsoft thông qua WOPI host do Backend cung cấp. Đảm bảo tính tương thích 100% không làm suy giảm chất lượng slide.

---

## 5. Chiến lược Kiến trúc Backend & Lộ trình Bóc tách (Backend Migration Roadmap)
- **Thiết kế hiện tại (All-in-one Monorepo)**: Backend hiện được tích hợp trực tiếp qua Next.js Route Handlers (`src/app/api/`) và Domain Services (`src/server/services/`). Thiết kế này tối ưu hóa khả năng tự cấp tự túc của Monorepo, giúp khởi chạy tức thì và kiểm thử tự động đạt độ tin cậy 100% mà không đòi hỏi bất kỳ Database hay service phụ trợ nào.
- **Lộ trình bóc tách (Decoupling Ready)**: Khi mở rộng quy mô, toàn bộ domain services (`presentation.service.ts`, `pptx-generator.service.ts`, `storage.service.ts`) được thiết kế tách rời hoàn toàn, sẵn sàng trích xuất thành một Dedicated Backend Microservice độc lập (NestJS / Go) và kết nối Cloud Storage (S3) / Cloud Database (PostgreSQL). Tầng Client sử dụng `PresentationApiService` kế thừa `BaseApiService` từ package `core`, do đó chỉ cần cấu hình lại `NEXT_PUBLIC_BASE_API` là hoàn tất kết nối mà hoàn toàn không cần refactor giao diện người dùng.

