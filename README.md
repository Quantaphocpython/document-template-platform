# DOCUMENT TEMPLATE PLATFORM (MONOREPO)
Hệ thống thư viện mẫu tài liệu văn phòng (Văn bản DOCX & Bài thuyết trình PPTX).

* **Công nghệ cốt lõi**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Turborepo
* **Kiến trúc phần mềm**: Feature-Driven Architecture + Pure Data Access Layer + Shared Packages (`core`, `ui`)
* **Package Manager**: `pnpm` (Workspace Monorepo)  

---

## CẤU TRÚC TỔNG THỂ WORKSPACE

Hệ thống được tổ chức thành 2 sản phẩm hoàn chỉnh, độc lập và có khả năng chạy thực tế theo mô hình kiến trúc chuẩn hóa cấp doanh nghiệp:

```
preview-product/
├── pnpm-workspace.yaml             # Cấu hình PNPM Monorepo Workspace (apps/* & packages/*)
├── turbo.json                      # Cấu hình Turborepo Pipeline (build, test, lint, dev)
├── package.json                    # Workspace scripts (pnpm dev:doc, dev:slide, test, build, lint)
│
├── docs/                           # TÀI LIỆU TOÀN CỤC WORKSPACE
│   ├── REQUIREMENTS.md             # Bảng tổng hợp toàn bộ yêu cầu nền tảng (Consolidated Specs)
│   ├── ROADMAP.md                  # Lộ trình phát triển nền tảng tổng thể (Master Roadmap)
│   └── PRODUCT_SPEC.md             # Đặc tả sản phẩm & tiêu chuẩn kỹ thuật nền tảng
│
├── packages/                       # THƯ VIỆN CHIA SẺ DÙNG CHUNG (SHARED WORKSPACE PACKAGES)
│   ├── core/                       # core: HttpClient, Abstract Classes, Routes, Enums, Utils
│   │   ├── src/
│   │   │   ├── abstracts/          # BaseStorageRepository (server), BaseCatalogService (universal)
│   │   │   ├── constants/          # APP_ROUTES, API_ROUTES, MimeType, HTTP constants
│   │   │   ├── http/               # HttpClient tập trung (GET/POST/PUT/DELETE, URL params, downloadBlob)
│   │   │   ├── types/              # BaseEntity, BaseTemplateItem, CategoryMeta
│   │   │   ├── utils/              # buildUrlWithParams, createAttachmentHeaders, file/date utils
│   │   │   ├── index.ts            # Client-safe exports
│   │   │   └── server.ts           # Server-only exports (fs, path)
│   │   └── package.json            # Subpath exports: "." và "./server"
│   │
│   └── ui/                         # ui: Base UI Components & Design System
│       ├── src/
│       │   ├── components/         # Button, Badge, Card, Dialog, Modal, Input, Tabs, Tooltip, Portal...
│       │   ├── hooks/              # usePortal, useCloseAllPortals, useClosePortalById
│       │   ├── store/              # layout.store (Portal Stack & Exit Animation)
│       │   ├── types/              # PortalProps, PortalInstance, Component Props
│       │   ├── utils/              # cn (clsx + tailwind-merge), toast, confirmModal
│       │   └── index.ts            # Entry point xuất toàn bộ UIKit
│       └── package.json            # Thư viện UI độc lập cho toàn bộ Monorepo
│
├── apps/
│   ├── project-1-doc-template/     # [SẢN PHẨM 1] THƯ VIỆN MẪU VĂN BẢN (DOCX & RICH TEXT)
│   │   ├── docs/                   # TÀI LIỆU KỸ THUẬT & QUẢN TRỊ ĐẦY ĐỦ (SRS, STRUCTURE, ROADMAP...)
│   │   ├── public/                 # Ảnh thumbnail vector SVG tự dựng cho 5 bộ mẫu
│   │   ├── src/
│   │   │   ├── app/                # Thin Routing Shells (Next.js App Router) & API Routes
│   │   │   ├── features/           # Feature Modules: editor/, templates/ (screens, components, hooks)
│   │   │   ├── services/           # Pure Data Access Layer (BaseApiService, Interceptors, Path Params)
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

## HƯỚNG DẪN KHỞI CHẠY & KIỂM THỬ BẰNG PNPM

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

### 3. Xem & Thử nghiệm Swagger API Documentation (OpenAPI 3.0):
Cả hai ứng dụng đều tích hợp sẵn giao diện **Swagger UI tương tác trực tiếp**:
* **Sản phẩm 1 (Mẫu văn bản)**: `http://localhost:3000/api-docs` (OpenAPI Spec JSON: `/api/openapi.json`)
* **Sản phẩm 2 (Mẫu slide)**: `http://localhost:3001/api-docs` (OpenAPI Spec JSON: `/api/openapi.json`)
*(Hỗ trợ tính năng **"Try it out"** cho phép gọi thử API, kiểm tra request/response schema trực tiếp trên trình duyệt).*

### 4. Chạy kiểm thử tự động toàn bộ Workspace (Automated Tests):
```bash
pnpm test
```
*Tất cả kiểm thử tự động kiểm tra nạp dữ liệu, tìm kiếm/lọc, tính bất biến (Immutability) và cấu trúc nhị phân file Word/PowerPoint đều vượt qua 100%.*

### 5. Kiểm tra Typecheck & ESLint:
```bash
pnpm lint
```

### 6. Build kiểm tra sản phẩm xuất xưởng (Production Build):
```bash
pnpm build
```

---

## MỤC LỤC TÀI LIỆU KỸ THUẬT (DOCUMENTATION INDEX)

Tất cả tài liệu được chuẩn bị đầy đủ, chuẩn mực trước và sau khi triển khai mã nguồn:

### Tài liệu chung toàn nền tảng (Platform Master Docs):
- **[REQUIREMENTS.md](docs/REQUIREMENTS.md)**: Bảng tổng hợp toàn bộ yêu cầu nền tảng (Consolidated Requirements Specification).
- **[ROADMAP.md](docs/ROADMAP.md)**: Lộ trình phát triển nền tảng tổng thể (Master Platform Roadmap).
- **[PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)**: Đặc tả sản phẩm & tiêu chuẩn kỹ thuật nền tảng (Product Specification).

### Bộ tài liệu Phân hệ 1 (Thư viện mẫu văn bản):
1. **[SRS.md](apps/project-1-doc-template/docs/SRS.md)**: Đặc tả yêu cầu phần mềm đầy đủ (Functional & Non-Functional Requirements, Ma trận kiểm chứng).
2. **[STRUCTURE.md](apps/project-1-doc-template/docs/STRUCTURE.md)**: Sơ đồ cây thư mục chi tiết, cấu trúc Feature-Driven, trách nhiệm từng phân lớp và sơ đồ tuần tự (Sequence Diagram).
3. **[ROADMAP.md](apps/project-1-doc-template/docs/ROADMAP.md)**: Lộ trình phát triển 4 giai đoạn từ MVP đến Enterprise, ma trận quản trị rủi ro.
4. **[ARCHITECTURE.md](apps/project-1-doc-template/docs/ARCHITECTURE.md)**: Kiến trúc hệ thống và cơ chế bảo vệ tính bất biến của mẫu gốc (Immutability).
5. **[API_SPEC.md](apps/project-1-doc-template/docs/API_SPEC.md)**: Đặc tả API Routes (`/api/templates`, `/api/documents`, `/api/documents/:id/export`).
6. **[REQUIREMENTS.md](apps/project-1-doc-template/docs/REQUIREMENTS.md)**: Yêu cầu nghiệp vụ & đặc tả tính năng phân hệ văn bản.
7. **[PLAN.md](apps/project-1-doc-template/docs/PLAN.md)**: Kế hoạch triển khai và checklist tính năng.

### Bộ tài liệu Phân hệ 2 (Thư viện mẫu trình chiếu):
1. **[SRS.md](apps/project-2-slide-template/docs/SRS.md)**: Đặc tả yêu cầu phần mềm đầy đủ cho phân hệ slide thuyết trình.
2. **[STRUCTURE.md](apps/project-2-slide-template/docs/STRUCTURE.md)**: Sơ đồ cấu trúc Feature-Driven, Slide Deck data model và luồng xử lý stream download.
3. **[ROADMAP.md](apps/project-2-slide-template/docs/ROADMAP.md)**: Lộ trình phát triển sản phẩm & kế hoạch tích hợp In-browser Slide Editor (Canvas Fabric.js & Microsoft WOPI Enterprise).
4. **[ARCHITECTURE.md](apps/project-2-slide-template/docs/ARCHITECTURE.md)**: Kiến trúc Slide Deck Cinema 16:9, Filmstrip Carousel và giải pháp nhân bản tệp vật lý.
5. **[API_SPEC.md](apps/project-2-slide-template/docs/API_SPEC.md)**: Đặc tả API Routes (`/api/templates`, `/api/presentations`, download PPTX).
6. **[REQUIREMENTS.md](apps/project-2-slide-template/docs/REQUIREMENTS.md)**: Yêu cầu nghiệp vụ & đặc tả tính năng phân hệ trình chiếu.
7. **[PLAN.md](apps/project-2-slide-template/docs/PLAN.md)**: Kế hoạch triển khai và tiêu chí nghiệm thu.

---

## ĐỐI CHIẾU TIÊU CHUẨN TÍNH NĂNG ĐÃ HOÀN THÀNH

| Tiêu chuẩn tính năng | Phân hệ 1 (Văn bản) | Phân hệ 2 (Trình chiếu) | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Giao diện thư viện** | Dạng lưới thẻ (Grid card), Thumbnail SVG, tên, mô tả, danh mục, tags. | Lưới thẻ 16:9, Thumbnail bìa, tổng số slide, danh mục. | Đã hoàn thành 100% |
| **Tìm kiếm & Phân loại** | Tìm kiếm thời gian thực theo từ khóa; Lọc danh mục với badge số lượng. | Tìm kiếm thời gian thực; Lọc phân loại bộ slide. | Đã hoàn thành 100% |
| **Xem trước (Preview)** | Modal xem trước mô phỏng khổ giấy in A4, hiển thị định dạng thực tế. | Trình duyệt Slide Deck Cinema 16:9 kèm Filmstrip thumbnail cuộn chọn slide. | Đã hoàn thành 100% |
| **Bảo vệ mẫu gốc (Immutability)** | Cơ chế Copy-on-Create: Nhân bản nội dung sang UUID mới, mẫu gốc Read-only. | Cơ chế Copy-on-Create: Nhân bản vật lý file PPTX, mẫu gốc Read-only. | Đã hoàn thành 100% (Có Unit Test) |
| **Chỉnh sửa / Sử dụng** | Trình soạn thảo văn bản tích hợp (Toolbar H1/H2/H3, Bold, Italic, Table...). | Luồng tạo bản sao độc lập, hiển thị thông số và sẵn sàng tải về. | Đã hoàn thành 100% |
| **Tải xuống / Xuất file** | Xuất và tải xuống file Microsoft Word **.docx** nguyên bản. | Tải xuống file PowerPoint **.pptx** mở được trên Office/Keynote/Google Slides. | Đã hoàn thành 100% |
| **Bộ dữ liệu mẫu** | **5 bộ mẫu chuẩn**: Hợp đồng lao động, Đơn nghỉ phép, Biên bản họp, Báo cáo tiến độ, Đề xuất dự án. | **3 bộ slide chuẩn (15 slides)**: Pitch Deck gọi vốn, Báo cáo quý doanh nghiệp, Kế hoạch ra mắt sản phẩm. | Đã hoàn thành 100% |
| **Xử lý trạng thái UX** | Skeleton loading, Empty state (khi không tìm thấy), Toast thông báo, 404 page. | Skeleton loading, Empty state, Filmstrip navigation, Modal xác nhận. | Đã hoàn thành 100% |

---

## NGUYÊN TẮC BẢO TOÀN MẪU GỐC (TEMPLATE IMMUTABILITY)

Để đáp ứng tuyệt đối yêu cầu cốt lõi: *"Việc tạo tài liệu mới không được làm thay đổi file template gốc"*:
1. **Phân vùng lưu trữ vật lý**:
   - `storage/templates/`: Vùng lưu trữ mẫu gốc, chỉ được cấp quyền Read-Only bởi hệ thống nghiệp vụ.
   - `storage/documents/` và `storage/presentations/`: Vùng lưu trữ tài nguyên của người dùng.
2. **Cơ chế Deep Copy / File Stream Copy khi khởi tạo (Copy-on-Create)**:
   - Khi người dùng nhấn "Sử dụng mẫu", backend tạo một bản ghi hoặc bản sao file mới với UUID độc lập.
   - Mọi thao tác chỉnh sửa (Save, Edit, Export) chỉ được phép trỏ tới ID của người dùng.
   - File template gốc giữ nguyên 100% nội dung, hash SHA-256 và thời gian chỉnh sửa (được kiểm chứng qua kiểm thử tự động `pnpm test`).

---

## THƯ VIỆN BÊN THỨ 3 & GIẤY PHÉP (THIRD-PARTY LICENSES)

Toàn bộ thư viện sử dụng đều thuộc mã nguồn mở tiêu chuẩn:
- **Next.js & React**: Giấy phép MIT.
- **Tailwind CSS**: Giấy phép MIT.
- **TipTap Core & Extensions**: Giấy phép MIT (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`...).
- **tiptap-a4-pagination**: Giấy phép MIT (Phân trang A4 tự động và tách bảng chuẩn Google Docs).
- **Fabric.js**: Giấy phép MIT (`fabric` v7 - HTML5 Canvas 2D Engine cho Slide Editor).
- **Shadcn/UI & Radix UI**: Giấy phép MIT (Dialog, Slot, Tabs, Tooltip, Separator, Dropdown-Menu...).
- **Lucide React**: Giấy phép ISC.
- **docx**: Giấy phép MIT (Tạo tài liệu OpenXML Word).
- **pptxgenjs**: Giấy phép MIT (Tạo tài liệu OpenXML PowerPoint).
- **tsx**: Giấy phép MIT (Thực thi kiểm thử TypeScript tốc độ cao).
- **usehooks-ts**: Giấy phép MIT.

---

## MINH BẠCH CÔNG CỤ & SỬ DỤNG AI (AI DISCLOSURE)

Theo quy định tại **Mục IV Đề bài Tuyển dụng** (*"Nếu sử dụng thư viện mã nguồn mở hoặc AI hỗ trợ lập trình, vui lòng nêu rõ trong tài liệu bàn giao"*):
- Dự án sử dụng mô hình lập trình hiện đại kết hợp giữa kỹ sư phần mềm và trợ lý lập trình trí tuệ nhân tạo (AI Pair Programming Assistant) để tối ưu hóa tốc độ triển khai, rà soát cấu trúc kiến trúc Monorepo, tự động sinh bộ kiểm thử biên dạng nhị phân và chuẩn hóa tài liệu kỹ thuật SRS/Architecture.
- Toàn bộ quyết định kiến trúc, lựa chọn thư viện chuẩn (`tiptap`, `fabric`, `docx`, `pptxgenjs`), thiết kế hệ thống bảo vệ mẫu gốc (Copy-on-Create) và tối ưu hóa trải nghiệm người dùng đều được định hướng, kiểm soát và xác thực tính đúng đắn chặt chẽ 100%.

---

## BẢNG ĐỐI CHIẾU HỒ SƠ BÀN GIAO (DELIVERY CHECKLIST - MỤC V ĐỀ BÀI)

| Hạng mục bàn giao theo Đề bài | Vị trí trong Repository | Trạng thái nghiệm thu |
| :--- | :--- | :---: |
| **1. Source code hai sản phẩm** | `apps/project-1-doc-template`<br>`apps/project-2-slide-template`<br>`packages/core`, `packages/ui` | **Đầy đủ 100%** (Chạy thực tế) |
| **2. Hướng dẫn cài đặt và chạy thử** | [`README.md`](README.md#hướng-dẫn-khởi-chạy--kiểm-thử-bằng-pnpm) | **Đầy đủ 100%** (Chỉ 1 lệnh `pnpm install`) |
| **3. File README mô tả kiến trúc & công nghệ** | [`README.md`](README.md)<br>[`apps/project-1-doc-template/README.md`](apps/project-1-doc-template/README.md)<br>[`apps/project-2-slide-template/README.md`](apps/project-2-slide-template/README.md) | **Đầy đủ 100%** (Chi tiết từng phân lớp) |
| **4. Tài liệu API & Cấu trúc dữ liệu** | [`apps/project-1-doc-template/docs/API_SPEC.md`](apps/project-1-doc-template/docs/API_SPEC.md)<br>[`apps/project-2-slide-template/docs/API_SPEC.md`](apps/project-2-slide-template/docs/API_SPEC.md)<br>Swagger UI trực tiếp: `/api-docs` | **Đầy đủ 100%** (OpenAPI 3.0 Specs) |
| **5. Bộ dữ liệu & Template mẫu kiểm thử** | **5 mẫu văn bản**: `apps/project-1-doc-template/src/data/templates.ts`<br>**3 bộ slide (15 slides 16:9)**: `apps/project-2-slide-template/src/data/templates.ts` | **Đầy đủ 100%** (Chuẩn OpenXML) |
| **6. Phần hoàn thành, chưa làm & Giới hạn** | [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)<br>[`docs/ROADMAP.md`](docs/ROADMAP.md)<br>[`apps/project-2-slide-template/docs/ARCHITECTURE.md`](apps/project-2-slide-template/docs/ARCHITECTURE.md) | **Đầy đủ 100%** (Ma trận đối chiếu chi tiết) |
| **7. Video quay màn hình demo chức năng** | File video đính kèm khi gửi email phản hồi (theo hướng dẫn nộp bài) | **Ứng viên đính kèm email** |

---

## TRIẾT LÝ PHÁT TRIỂN & CHUẨN MỰC KỸ THUẬT

- **Kiến trúc bền vững**: Định hướng Domain-Driven & Feature-Driven giúp hệ thống dễ dàng mở rộng, cô lập nghiệp vụ và phân tách rõ ràng trách nhiệm giữa Frontend, Backend và Shared Packages.
- **Tính toàn vẹn dữ liệu**: Đặt tính bất biến (Immutability) và bảo mật quyền ghi làm ưu tiên cao nhất trong quá trình sao chép và xuất bản tài liệu văn phòng.
- **Zero-Configuration**: Triển khai thiết kế không phụ thuộc cơ sở dữ liệu bên ngoài, sẵn sàng khởi chạy và kiểm thử ngay lập tức trên mọi môi trường chuẩn.
- **Chiến lược Backend & Khả năng Bóc tách (Decoupling Ready)**: Giai đoạn hiện tại sử dụng Next.js Route Handlers (BFF) kết hợp Domain Services để toàn bộ Monorepo tự cấp tự túc, giúp việc chạy thử, kiểm thử tự động và review đạt tốc độ tối đa. Hệ thống tuân thủ chặt chẽ Data Access Layer, sẵn sàng bóc tách thành Dedicated Standalone Backend (NestJS / Go) và Cloud DB khi mở rộng quy mô mà không cần refactor giao diện.
