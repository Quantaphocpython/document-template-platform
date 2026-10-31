# YÊU CẦU NGHIỆP VỤ & ĐẶC TẢ TÍNH NĂNG - SẢN PHẨM 2
## THƯ VIỆN MẪU TRÌNH CHIẾU (PRESENTATION TEMPLATE LIBRARY)

Tài liệu này tổng hợp các yêu cầu nghiệp vụ và tiêu chuẩn kỹ thuật áp dụng cho phân hệ **Thư viện Mẫu Trình chiếu PowerPoint**.

---

## 1. MỤC TIÊU SẢN PHẨM

Phát triển phân hệ thư viện mẫu trình chiếu PowerPoint độc lập, cho phép người dùng lựa chọn một bộ template chuẩn 16:9, xem trước toàn bộ slide deck với trải nghiệm Cinema Preview, và nhân bản độc lập file `.pptx` để chỉnh sửa hoặc tải về.

---

## 2. CHI TIẾT CÁC YÊU CẦU KỸ THUẬT & CHỨC NĂNG

### A. Giao diện người dùng (Presentation Gallery)
1. Hiển thị danh mục các template PowerPoint với tỷ lệ khung hình 16:9 chuẩn.
2. Bộ lọc danh mục tức thì kết hợp tìm kiếm thời gian thực.
3. Xem trước chi tiết từng trang slide trong bộ (Slide Deck Cinema Preview).
4. Khởi tạo bản trình chiếu mới từ bộ mẫu được chọn.

### B. Luồng khởi tạo bản sao (Copy-on-Create Workflow)
1. Người dùng chọn một bộ template PowerPoint phù hợp.
2. Hệ thống thực hiện nhân bản tệp tin vật lý độc lập sang thư mục người dùng.
3. **Bản trình chiếu mới hoàn toàn tách biệt với template gốc** (Cơ chế Template Immutability).
4. Cung cấp chức năng tải xuống trực tiếp tệp tin PPTX nhị phân hợp lệ.

### C. Quản lý dữ liệu mẫu (Slide Catalog)
1. Cung cấp bộ sưu tập slide mẫu khởi tạo (Pitch Deck, Báo cáo định kỳ, Ra mắt sản phẩm).
2. Mỗi bộ slide bao gồm tiêu đề, mô tả, thumbnail cover và danh sách vector slide xem trước.
3. Kiến trúc module hóa cho phép bổ sung thêm các bộ slide mới linh hoạt.

### D. Kiến trúc mở rộng trình biên tập trực tuyến (In-browser Editor Roadmap)
Xây dựng luồng tạo bản sao độc lập và tải xuống file PPTX nguyên bản, đồng thời thiết kế sẵn tài liệu kiến trúc kỹ thuật và lộ trình tích hợp trình biên tập slide trực tiếp trên trình duyệt (Canvas Engine & WOPI Protocol).

---

## 3. ĐỐI CHIẾU TRIỂN KHAI MÃ NGUỒN

| Yêu cầu nghiệp vụ cốt lõi | Thành phần mã nguồn thực hiện | Tài liệu kỹ thuật chi tiết |
| :--- | :--- | :--- |
| **Giao diện & Lưới thẻ 16:9** | `src/features/presentations/screens/presentation-gallery-screen.tsx`<br>`src/features/presentations/components/presentation-card.tsx` | [SRS.md](SRS.md#fr-1) |
| **Tìm kiếm & Phân loại** | `src/features/presentations/components/category-filter.tsx`<br>Tích hợp `usehooks-ts` (`useDebounceValue`) | [SRS.md](SRS.md#fr-2) |
| **Xem trước Slide Deck Cinema 16:9** | `src/features/presentations/components/slide-deck-modal.tsx` | [SRS.md](SRS.md#fr-3) |
| **Filmstrip Carousel nhiều slide** | `src/features/presentations/components/slide-deck-modal.tsx` (Filmstrip bar) | [SRS.md](SRS.md#fr-4) |
| **Bảo vệ file gốc (Copy-on-Create)** | `src/server/services/presentation.service.ts`<br>`src/server/services/storage.service.ts` | [ARCHITECTURE.md](ARCHITECTURE.md#2) |
| **Tải xuống file PowerPoint (.pptx)** | `src/server/services/pptx-generator.service.ts`<br>`src/app/api/presentations/[id]/download/route.ts` | [API_SPEC.md](API_SPEC.md#download) |
| **Bộ slide tiêu chuẩn (15 slides 16:9)** | `src/data/templates.ts`<br>`public/slides/` | [PLAN.md](PLAN.md) |
| **Kiến trúc mở rộng In-browser Editor** | `src/features/presentations/components/presentation-created-modal.tsx`<br>`docs/ROADMAP.md` | [ROADMAP.md](ROADMAP.md#giai-doan-2) |
