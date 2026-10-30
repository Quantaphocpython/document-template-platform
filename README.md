# BÀI KIỂM TRA THỰC HÀNH KỸ THUẬT - FULLSTACK DEVELOPER
**Ứng viên**: Trần Hoàng Quân  
**Vị trí ứng tuyển**: Fullstack Developer  
**Đề bài**: Xây dựng thư viện mẫu tài liệu tích hợp trong ứng dụng văn phòng  
**Công cụ quản lý gói (Package Manager)**: `pnpm` (Workspace Monorepo)  
**Kiến trúc phần mềm**: Feature-Driven Architecture + Pure Data Access Layer + Shared Core Package  

---

## 📁 CẤU TRÚC TỔNG THỂ WORKSPACE

Hệ thống được tổ chức thành 2 sản phẩm hoàn chỉnh, độc lập và có khả năng chạy thực tế theo đúng yêu cầu bài test, áp dụng kiến trúc chuẩn hóa:

```
preview-product/
├── pnpm-workspace.yaml             # Cấu hình PNPM Monorepo Workspace (apps/* & packages/*)
├── turbo.json                      # Cấu hình Turborepo Pipeline (build, test, lint, dev)
├── package.json                    # Workspace scripts (pnpm dev:doc, dev:slide, test, build, lint)
│
├── docs/                           # TÀI LIỆU TOÀN CỤC WORKSPACE
│   └── RECRUITMENT_TEST.md         # Toàn văn đề bài kiểm tra tuyển dụng nguyên gốc
│
├── packages/                       # THƯ VIỆN CHIA SẺ DÙNG CHUNG (SHARED WORKSPACE PACKAGES)
│   └── core/                       # @preview/core: HttpClient, Abstract Classes, Routes, Enums, Utils
│       ├── src/
│       │   ├── abstracts/          # BaseStorageRepository (server), BaseCatalogService (universal)
│       │   ├── constants/          # APP_ROUTES, API_ROUTES, MimeType, HTTP constants
│       │   ├── http/               # HttpClient tập trung (GET/POST/PUT/DELETE, URL params, downloadBlob)
│       │   ├── types/              # BaseEntity, BaseTemplateItem, CategoryMeta
│       │   ├── utils/              # buildUrlWithParams, createAttachmentHeaders, file/date utils
│       │   ├── index.ts            # Client-safe exports
│       │   └── server.ts           # Server-only exports (fs, path)
│       └── package.json            # Subpath exports: "." và "./server"
│
├── apps/
│   ├── project-1-doc-template/     # [SẢN PHẨM 1] THƯ VIỆN MẪU VĂN BẢN (DOCX & RICH TEXT)
│   │   ├── docs/                   # TÀI LIỆU KỸ THUẬT & QUẢN TRỊ ĐẦY ĐỦ (SRS, STRUCTURE, ROADMAP...)
│   │   ├── public/                 # Ảnh thumbnail vector SVG tự dựng cho 5 bộ mẫu
│   │   ├── src/
│   │   │   ├── app/                # Thin Routing Shells (Next.js App Router) & API Routes
│   │   │   ├── features/           # Feature Modules: editor/, templates/ (screens, components, hooks)
│   │   │   ├── services/           # Pure Data Access Layer (BaseApiService, Interceptors, Path Params)
│   │   │   ├── shared/             # Shadcn/UI (kebab-case) & utilities
│   │   │   ├── data/               # 5 bộ dữ liệu biểu mẫu văn phòng chuẩn hóa
│   │   │   ├── server/services/    # Business Logic, Quản lý Storage, Export file DOCX
│   │   │   └── types/              # Enums (TemplateCategory, DocumentStatus...) & types
│   │   ├── storage/                # Kho lưu trữ mẫu gốc (Read-only) và tài liệu người dùng
│   │   ├── tests/                  # Bộ kiểm thử tự động (Copy-on-Create, Immutability, DOCX Export)
│   │   └── README.md               # Báo cáo chi tiết Sản phẩm 1
│   │
│   └── project-2-slide-template/   # [SẢN PHẨM 2] THƯ VIỆN MẪU TRÌNH CHIẾU (POWERPOINT PPTX)
│       ├── docs/                   # TÀI LIỆU KỸ THUẬT & QUẢN TRỊ ĐẦY ĐỦ (SRS, STRUCTURE, ROADMAP...)
│       ├── public/                 # Bộ 15 slide preview tỉ lệ chuẩn 16:9 Cinema & Thumbnails
│       ├── src/
│       │   ├── app/                # Thin Routing Shells (Next.js App Router) & API Routes
│       │   ├── features/           # Feature Modules: presentations/ (screens, components, hooks)
│       │   ├── services/           # Pure Data Access Layer (BaseApiService, Interceptors, Path Params)
│       │   ├── shared/             # Shadcn/UI (kebab-case) & utilities
│       │   ├── data/               # 3 bộ template PowerPoint hoàn chỉnh
│       │   ├── server/services/    # Quản lý file PPTX, Copy-on-Create, Stream download
│       │   └── types/              # Enums (SlideCategory, SlideLayoutType...) & types
│       ├── storage/                # Kho file PPTX gốc (Read-only) và bản trình chiếu người dùng
│       ├── tests/                  # Bộ kiểm thử tự động (Slide Deck Model, Clone PPTX, OpenXML bytes)
│       └── README.md               # Báo cáo chi tiết Sản phẩm 2
│
└── README.md                       # Tài liệu tổng quan này
```

---

## ⚡ HƯỚNG DẪN KHỞI CHẠY & KIỂM THỬ BẰNG PNPM

Dự án được quản lý bằng **pnpm workspace**. Bạn có thể cài đặt và kiểm thử toàn bộ dự án từ thư mục gốc chỉ bằng một lệnh duy nhất:

### 1. Cài đặt toàn bộ dependencies (chỉ 1 lệnh tại thư mục gốc):
```bash
pnpm install
```

### 2. Khởi chạy ứng dụng:
* **Chạy Sản phẩm 1 (Thư viện mẫu văn bản)**:
  ```bash
  pnpm dev:doc
  # Hoặc: cd project-1-doc-template && pnpm dev
  # -> Mở trình duyệt: http://localhost:3000
  ```

* **Chạy Sản phẩm 2 (Thư viện mẫu trình chiếu)**:
  ```bash
  pnpm dev:slide
  # Hoặc: cd project-2-slide-template && pnpm dev
  # -> Mở trình duyệt: http://localhost:3001 (hoặc cổng do Next.js tự gán)
  ```

### 3. Chạy kiểm thử tự động toàn bộ Workspace (Automated Tests):
```bash
pnpm -r test
```
*Tất cả bài test kiểm tra nạp dữ liệu, tìm kiếm/lọc, tính bất biến (Immutability) và cấu trúc nhị phân file Word/PowerPoint đều vượt qua 100%.*

### 4. Kiểm tra Typecheck & ESLint:
```bash
pnpm -r lint
```

### 5. Build kiểm tra sản phẩm xuất xưởng (Production Build):
```bash
pnpm -r build
```

---

## 📑 MỤC LỤC TÀI LIỆU KỸ THUẬT (DOCUMENTATION INDEX)

Tất cả tài liệu được chuẩn bị đầy đủ, chuẩn mực trước và sau khi triển khai mã nguồn:

### Bộ tài liệu Sản phẩm 1 (Thư viện mẫu văn bản):
1. **[SRS.md](apps/project-1-doc-template/docs/SRS.md)**: Đặc tả yêu cầu phần mềm đầy đủ (Functional & Non-Functional Requirements, Ma trận kiểm chứng).
2. **[STRUCTURE.md](apps/project-1-doc-template/docs/STRUCTURE.md)**: Sơ đồ cây thư mục chi tiết, cấu trúc Feature-Driven, trách nhiệm từng phân lớp và sơ đồ tuần tự (Sequence Diagram).
3. **[ROADMAP.md](apps/project-1-doc-template/docs/ROADMAP.md)**: Lộ trình phát triển 4 giai đoạn từ MVP đến Enterprise, ma trận quản trị rủi ro.
4. **[ARCHITECTURE.md](apps/project-1-doc-template/docs/ARCHITECTURE.md)**: Kiến trúc hệ thống và cơ chế bảo vệ tính bất biến của mẫu gốc (Immutability).
5. **[API_SPEC.md](apps/project-1-doc-template/docs/API_SPEC.md)**: Đặc tả API Routes (`/api/templates`, `/api/documents`, `/api/documents/:id/export`).
6. **[PLAN.md](apps/project-1-doc-template/docs/PLAN.md)**: Kế hoạch triển khai ban đầu và checklist kiểm thử.

### Bộ tài liệu Sản phẩm 2 (Thư viện mẫu trình chiếu):
1. **[SRS.md](apps/project-2-slide-template/docs/SRS.md)**: Đặc tả yêu cầu phần mềm đầy đủ cho phân hệ slide thuyết trình.
2. **[STRUCTURE.md](apps/project-2-slide-template/docs/STRUCTURE.md)**: Sơ đồ cấu trúc Feature-Driven, Slide Deck data model và luồng xử lý stream download.
3. **[ROADMAP.md](apps/project-2-slide-template/docs/ROADMAP.md)**: Lộ trình phát triển sản phẩm & kế hoạch tích hợp In-browser Slide Editor (Canvas Fabric.js & Microsoft WOPI Enterprise theo yêu cầu mục III.2.D đề bài).
4. **[ARCHITECTURE.md](apps/project-2-slide-template/docs/ARCHITECTURE.md)**: Kiến trúc Slide Deck Cinema 16:9, Filmstrip Carousel và giải pháp nhân bản tệp vật lý.
5. **[API_SPEC.md](apps/project-2-slide-template/docs/API_SPEC.md)**: Đặc tả API Routes (`/api/templates`, `/api/presentations`, download PPTX).
6. **[PLAN.md](apps/project-2-slide-template/docs/PLAN.md)**: Kế hoạch triển khai và tiêu chí nghiệm thu.

---

## 🌟 ĐỐI CHIẾU TIÊU CHÍ VÀ TÍNH NĂNG ĐÃ HOÀN THÀNH

| Yêu cầu đề bài | Sản phẩm 1 (Văn bản) | Sản phẩm 2 (Trình chiếu) | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Giao diện thư viện** | Dạng lưới thẻ (Grid card), Thumbnail SVG, tên, mô tả, danh mục, tags. | Lưới thẻ 16:9, Thumbnail bìa, tổng số slide, danh mục. | ✅ Đã hoàn thành 100% |
| **Tìm kiếm & Phân loại** | Tìm kiếm thời gian thực theo từ khóa; Lọc danh mục với badge số lượng. | Tìm kiếm thời gian thực; Lọc phân loại bộ slide. | ✅ Đã hoàn thành 100% |
| **Xem trước (Preview)** | Modal xem trước mô phỏng khổ giấy in A4, hiển thị định dạng thực tế. | Trình duyệt Slide Deck Cinema 16:9 kèm Filmstrip thumbnail cuộn chọn slide. | ✅ Đã hoàn thành 100% |
| **Bảo vệ mẫu gốc (Immutability)** | Cơ chế Copy-on-Create: Nhân bản nội dung sang UUID mới, mẫu gốc Read-only. | Cơ chế Copy-on-Create: Nhân bản vật lý file PPTX, mẫu gốc Read-only. | ✅ Đã hoàn thành 100% (Có Unit Test) |
| **Chỉnh sửa / Sử dụng** | Trình soạn thảo văn bản tích hợp (Toolbar H1/H2/H3, Bold, Italic, Table...). | Luồng tạo bản sao độc lập, hiển thị thông số và sẵn sàng tải về. | ✅ Đã hoàn thành 100% |
| **Tải xuống / Xuất file** | Xuất và tải xuống file Microsoft Word **.docx** nguyên bản. | Tải xuống file PowerPoint **.pptx** mở được trên Office/Keynote/Google Slides. | ✅ Đã hoàn thành 100% |
| **Bộ dữ liệu mẫu** | **5 bộ mẫu chuẩn**: Hợp đồng lao động, Đơn nghỉ phép, Biên bản họp, Báo cáo tiến độ, Đề xuất dự án. | **3 bộ slide chuẩn (15 slides)**: Pitch Deck gọi vốn, Báo cáo quý doanh nghiệp, Kế hoạch ra mắt sản phẩm. | ✅ Đã hoàn thành 100% |
| **Xử lý trạng thái UX** | Skeleton loading, Empty state (khi không tìm thấy), Toast thông báo, 404 page. | Skeleton loading, Empty state, Filmstrip navigation, Modal xác nhận. | ✅ Đã hoàn thành 100% |

---

## 🔒 NGUYÊN TẮC BẢO TOÀN MẪU GỐC (TEMPLATE IMMUTABILITY)

Để đáp ứng tuyệt đối yêu cầu cốt lõi: *"Việc tạo tài liệu mới không được làm thay đổi file template gốc"*:
1. **Phân vùng lưu trữ vật lý**:
   - `storage/templates/`: Vùng lưu trữ mẫu gốc, chỉ được cấp quyền Read-Only bởi hệ thống nghiệp vụ.
   - `storage/documents/` và `storage/presentations/`: Vùng lưu trữ tài nguyên của người dùng.
2. **Cơ chế Deep Copy / File Stream Copy khi khởi tạo (Copy-on-Create)**:
   - Khi người dùng nhấn "Sử dụng mẫu", backend tạo một bản ghi hoặc bản sao file mới với UUID độc lập.
   - Mọi thao tác chỉnh sửa (Save, Edit, Export) chỉ được phép trỏ tới ID của người dùng.
   - File template gốc giữ nguyên 100% nội dung, hash SHA-256 và thời gian chỉnh sửa (được kiểm chứng qua bài test `pnpm -r test`).

---

## 🛠️ THƯ VIỆN BÊN THỨ 3 & GIẤY PHÉP (THIRD-PARTY LICENSES)

Theo yêu cầu mục IV đề bài, toàn bộ thư viện sử dụng đều thuộc mã nguồn mở tiêu chuẩn:
- **Next.js & React**: Giấy phép MIT.
- **Tailwind CSS**: Giấy phép MIT.
- **Shadcn/UI & Radix UI**: Giấy phép MIT (Dialog, Slot, Tabs, Tooltip, Separator...).
- **Lucide React**: Giấy phép ISC.
- **docx**: Giấy phép MIT (Tạo tài liệu OpenXML Word).
- **pptxgenjs**: Giấy phép MIT (Tạo tài liệu OpenXML PowerPoint).
- **tsx**: Giấy phép MIT (Thực thi kiểm thử TypeScript tốc độ cao).
- **usehooks-ts**: Giấy phép MIT.

---

## 🤖 TUYÊN BỐ MINH BẠCH VỀ AI & MÃ NGUỒN MỞ

- **AI Support**: Dự án có sự hỗ trợ của trợ lý AI (Google DeepMind Antigravity) trong việc scaffold cấu trúc dự án, sinh mã SVG minh họa và tối ưu hóa các kịch bản kiểm thử tự động.
- Toàn bộ tư duy kiến trúc, phân chia tầng dữ liệu, mô hình Copy-on-Create và đặc tả API được ứng viên định hướng và kiểm soát chất lượng chặt chẽ.
