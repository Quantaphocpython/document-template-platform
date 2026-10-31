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

### B. Hướng kiến trúc mở rộng trong tương lai:
1. **Giải pháp 1: Tích hợp Canvas-based Editor (Fabric.js / Konva.js)**:
   - Chuyển đổi các slide thành các đối tượng JSON (Text, Image, Shape).
   - Cho phép người dùng kéo thả, thay đổi màu sắc, thêm chữ trực tiếp trên Canvas.
   - Khi lưu, sử dụng `pptxgenjs` để render lại thành file PPTX chuẩn tải về.
2. **Giải pháp 2: Tích hợp Web Presentation Engine (Reveal.js)**:
   - Dùng Reveal.js / Marp để hiển thị slide dưới dạng HTML5/CSS3.
   - Tối ưu cho người dùng thích viết slide bằng Markdown / Rich Text.
3. **Giải pháp 3: Tích hợp Microsoft Office for the Web qua giao thức WOPI (Web Application Open Platform Interface)**:
   - Kiến trúc chuẩn doanh nghiệp (Enterprise Standard).
   - Nhúng trực tiếp iframe PowerPoint Online của Microsoft thông qua WOPI host do Backend cung cấp. Đảm bảo tính tương thích 100% không làm suy giảm chất lượng slide.

