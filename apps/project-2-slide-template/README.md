# SẢN PHẨM 2: THƯ VIỆN MẪU TRÌNH CHIẾU (PRESENTATION TEMPLATE LIBRARY)

Module thư viện mẫu trình chiếu PowerPoint (PPTX) hiện đại, tích hợp trong bộ ứng dụng văn phòng, phát triển bằng Next.js 15, TypeScript và Tailwind CSS.

* **Live Production URL**: [https://slide-template-platform.vercel.app](https://slide-template-platform.vercel.app)
* **Swagger API Docs**: [https://slide-template-platform.vercel.app/api-docs](https://slide-template-platform.vercel.app/api-docs)

---

## Tính Năng Chính

1. **Thư viện mẫu trình chiếu PowerPoint**:
   - Hiển thị danh sách các bộ mẫu bài thuyết trình chuẩn 16:9 dưới dạng lưới (Grid).
   - Mỗi bộ mẫu có tên, ảnh bìa đại diện, mô tả định hướng sử dụng, danh mục và tổng số lượng slide.
   - Có sẵn tối thiểu **3 bộ template mẫu chuyên nghiệp**:
     1. **Bộ Mẫu Pitch Deck Gọi Vốn Đầu Tư (Investor Pitch Deck)** - 5 slide chuẩn (Cover, Problem & Solution, Market Size, Traction, Team).
     2. **Báo Cáo Hoạt Động & Đánh Giá Định Kỳ (Business Quarterly Review)** - 5 slide chuẩn (Cover, KPI Highlights, Financials, Challenges, Roadmap).
     3. **Chiến Lược Ra Mắt Sản Phẩm Mới (Product Launch & Marketing Strategy)** - 5 slide chuẩn (Cover, Target Audience, Go-To-Market Plan, Channels, Timeline).

2. **Tìm kiếm & Phân loại bộ slide**:
   - Tìm kiếm nhanh theo từ khóa tên hoặc mô tả bài thuyết trình.
   - Bộ lọc danh mục (Gọi vốn & Khởi nghiệp, Báo cáo doanh nghiệp, Chiến lược Marketing).
   - Xử lý trạng thái Loading Shimmer và Empty state khi không có kết quả.

3. **Trình duyệt xem trước Slide Deck Cinema 16:9**:
   - Trải nghiệm xem trước trực quan với khung chiếu slide chuẩn 16:9 Cinema HD.
   - Hệ thống điều hướng chuyển slide kép: Nút mũi tên nổi 2 bên mép màn chiếu (`ChevronLeft` / `ChevronRight`) + Bộ nút điều hướng thanh công cụ + Phím tắt mũi tên/phím cách.
   - Chế độ lưới tổng quan (Overview Grid) và chế độ toàn màn hình (Fullscreen).
   - Thanh trượt Filmstrip bên dưới cho phép nhấp chọn và xem qua từng slide trong bộ mẫu với hiệu ứng đồng bộ hai chiều.

4. **Tích hợp HTML5 Canvas 2D Engine (Fabric.js v7)**:
   - Nút chuyển đổi **"Canvas Mode"** trên thanh điều khiển cho phép tương tác trực tiếp trên Canvas.
   - Các phần tử slide được render dưới dạng đối tượng vector tương tác (Selectable Bounding Box, Rotate, Scale).
   - Tự động ngắt dòng chữ thông qua `Fabric.Textbox`, loại bỏ triệt để lỗi tràn dòng của DOM.
   - Thêm Text Box mới, thêm Card/Shape vector bo góc, xóa phần tử và tải ảnh PNG 2x DPI trực tiếp từ Canvas (`canvas.toDataURL`).

5. **Tạo bản trình chiếu mới & Tải file PPTX (Copy-on-Create)**:
   - Khi người dùng nhấn "Tạo bản trình chiếu mới", hệ thống tự động nhân bản file PPTX độc lập từ template gốc.
   - Đảm bảo **bộ mẫu gốc hoàn toàn không bị thay đổi hoặc ghi đè (Template Immutability)**.
   - Sinh file Microsoft PowerPoint (`.pptx`) nhị phân chuẩn OpenXML chất lượng cao bằng thư viện `pptxgenjs`.
   - Hỗ trợ tải file `.pptx` trực tiếp về máy tính để mở trên Microsoft PowerPoint, Google Slides hoặc Apple Keynote.

---

## Công Nghệ Sử Dụng (Tech Stack)

- **Frontend & Backend**: Next.js 15 (App Router), React 19, TypeScript
- **Canvas 2D Engine**: Fabric.js (`fabric` v7)
- **PowerPoint Generation**: PptxGenJS (`pptxgenjs`)
- **Presentation Display**: Reveal.js (`reveal.js`)
- **Styling**: Tailwind CSS (tối ưu hóa layout cinema 16:9)
- **Iconography**: Lucide React
- **File & Stream Handling**: Node.js File Stream & MIME types chuẩn OpenXML (`application/vnd.openxmlformats-officedocument.presentationml.presentation`)

---

## Hướng Dẫn Cài Đặt & Chạy Thử

### Yêu cầu môi trường:
- Node.js version 18+ (khuyên dùng Node 20+)
- Trình quản lý gói `pnpm`

### Các bước khởi chạy:
```bash
# 1. Di chuyển vào thư mục dự án
cd project-2-slide-template

# 2. Cài đặt các gói phụ thuộc bằng pnpm
pnpm install

# 3. Chạy môi trường phát triển (Development mode)
pnpm dev

# 4. Chạy kiểm thử tự động
pnpm test
```

Mở trình duyệt và truy cập: `http://localhost:3001` (hoặc cổng do Next.js tự gán)

---

## Danh Mục Tài Liệu Kỹ Thuật

Toàn bộ tài liệu kỹ thuật chi tiết đã được chuẩn bị sẵn sàng trong thư mục `docs/`:
- **[SRS.md](docs/SRS.md)**: Đặc tả yêu cầu phần mềm chi tiết cho phân hệ slide thuyết trình.
- **[STRUCTURE.md](docs/STRUCTURE.md)**: Cấu trúc mã nguồn, Slide Deck data model và luồng stream download.
- **[ROADMAP.md](docs/ROADMAP.md)**: Lộ trình phát triển sản phẩm & kế hoạch tích hợp In-browser Slide Editor (Canvas Fabric.js & Microsoft WOPI Enterprise).
- **[REQUIREMENTS.md](docs/REQUIREMENTS.md)**: Tổng hợp yêu cầu nghiệp vụ và tiêu chuẩn kỹ thuật phân hệ trình chiếu.
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Kiến trúc Slide Deck Cinema 16:9, Filmstrip Carousel và giải pháp nhân bản tệp vật lý.
- **[API_SPEC.md](docs/API_SPEC.md)**: Đặc tả toàn bộ API Routes & Contracts.
- **[PLAN.md](docs/PLAN.md)**: Kế hoạch triển khai & Checklist tính năng.
