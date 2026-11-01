# KẾ HOẠCH TRIỂN KHAI - SẢN PHẨM 2: THƯ VIỆN MẪU TRÌNH CHIẾU (PRESENTATION TEMPLATE LIBRARY)

## 1. Mục tiêu sản phẩm
Xây dựng module thư viện mẫu trình chiếu (PowerPoint Presentation Template Library), cho phép người dùng:
1. Duyệt, tìm kiếm và phân loại các bộ mẫu trình chiếu PowerPoint (Pitch Deck, Báo cáo kinh doanh, Chiến lược Marketing, Kế hoạch công nghệ...).
2. Xem trước bộ slide (Slide Deck Preview) bên trong từng template (từng slide kèm tiêu đề và hình ảnh trực quan).
3. Lựa chọn mẫu và tạo bản trình chiếu mới độc lập (nguyên tắc: **Template Immutability** - không làm biến đổi bộ mẫu gốc).
4. Tải xuống bản trình chiếu dạng file `.pptx` chuẩn để mở trong Microsoft PowerPoint, Google Slides hoặc Keynote.
5. Cung cấp báo cáo phân tích giới hạn kỹ thuật và hướng mở rộng tích hợp trình soạn thảo slide trực tuyến (In-browser Slide Editor).

---

## 2. Các yêu cầu kỹ thuật & Kiến trúc cần đạt
- **Framework**: Next.js 15+ (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS (giao diện tối ưu theo tỉ lệ màn hình 16:9 của slide).
- **Xem trước Slide Deck**: Trình duyệt slide mượt mà (Carousel / Filmstrip view) cho phép lướt qua từng trang slide trong bộ mẫu trước khi quyết định sử dụng.
- **Quản lý dữ liệu & Immutability**:
  - Dữ liệu Template: Read-only, gồm tối thiểu 3 bộ template hoàn chỉnh kèm danh sách slide preview.
  - Sao chép bản trình chiếu mới: Tạo file/bản ghi mới độc lập (`presentationId`), người dùng có thể tải về file PPTX hoàn chỉnh.
- **Xử lý trạng thái UX**:
  - Loading skeleton khi tải danh sách và slide deck.
  - Empty state khi không tìm thấy bộ template phù hợp.
  - Error state và Toast thông báo khi tạo/tải slide.

---

## 3. Lộ trình triển khai (Implementation Phases)

### Giai đoạn 1: Chuẩn bị Cấu trúc & Dữ liệu Mẫu (Seed Data)
- [x] Thiết kế TypeScript Interfaces cho `SlideTemplate`, `SlideItem`, `Presentation`, `SlideCategory`.
- [x] Xây dựng tối thiểu 3 bộ template slide chuyên nghiệp:
  1. **Pitch Deck Gọi Vốn Đầu Tư (Investor Pitch Deck)** - 5 slide mẫu (Cover, Problem & Solution, Market Size, Traction, Team).
  2. **Báo Cáo Hoạt Động & Đánh Giá Định Kỳ (Business Quarterly Review)** - 5 slide mẫu (Cover, KPI Highlights, Financials, Challenges, Next Steps).
  3. **Chiến Lược Ra Mắt Sản Phẩm Mới (Product Launch & Marketing Strategy)** - 5 slide mẫu (Cover, Target Audience, Go-To-Market Plan, Channels, Roadmap).
- [x] Thiết kế ảnh thumbnail vector SVG tỉ lệ 16:9 sắc nét cho từng slide.

### Giai đoạn 2: Xây dựng Backend API Service
- [x] `GET /api/templates`: Lấy danh sách các bộ template (hỗ trợ search, filter danh mục).
- [x] `GET /api/templates/:id`: Lấy chi tiết bộ slide bao gồm toàn bộ danh sách slide preview.
- [x] `POST /api/presentations`: Tạo bản trình chiếu mới từ template (sao chép vật lý độc lập).
- [x] `GET /api/presentations/:id`: Lấy thông tin bản trình chiếu đã tạo.
- [x] `GET /api/presentations/:id/download`: Tải file PPTX của bản trình chiếu với headers chuẩn MIME type.

### Giai đoạn 3: Xây dựng Giao diện Người dùng (UI/UX)
- [x] Layout thư viện template trình chiếu: Thiết kế hiện đại, chuyên nghiệp.
- [x] Bộ lọc danh mục & Ô tìm kiếm từ khóa thời gian thực.
- [x] Template Card: Hiển thị thumbnail slide đầu tiên, số lượng slide trong bộ, tag danh mục, nút xem chi tiết.
- [x] Slide Deck Preview Modal:
  - Slide chính hiển thị to ở giữa theo tỉ lệ chuẩn 16:9 Cinema HD.
  - Filmstrip thumbnail danh sách các slide bên dưới để nhấp chuyển qua lại.
  - Hệ thống điều hướng chuyển slide kép: Nút mũi tên nổi 2 bên + Bộ nút thanh công cụ + Phím mũi tên/Phím cách.
  - Chế độ lưới tổng quan (Overview Grid) và Toàn màn hình (Fullscreen).
  - Tích hợp chế độ **Fabric.js HTML5 Canvas Engine**: Render slide trực tiếp lên canvas, tương tác vector, thêm chữ, thêm khối, xuất PNG.
  - Nút "Tạo bản trình chiếu mới từ mẫu này".
- [x] Presentation Detail & Download View:
  - Modal xác nhận bản trình chiếu đã được tạo thành công với thông số kỹ thuật chi tiết.
  - Tải xuống file PPTX nhị phân chuẩn OpenXML.
  - Phần giải thích hướng mở rộng chỉnh sửa slide.

### Giai đoạn 4: Phân tích Kỹ thuật & Hoàn thiện Tài liệu
- [x] Phân tích so sánh các giải pháp In-browser Slide Editor (Fabric.js, Reveal.js, Microsoft WOPI, PPTXgenJS).
- [x] Tích hợp trực tiếp Fabric.js HTML5 Canvas Engine vào trình xem slide.
- [x] Hoàn thiện README, Architecture, SRS và API documentation.

