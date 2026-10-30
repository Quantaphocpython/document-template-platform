# ĐỀ BÀI & YÊU CẦU CHI TIẾT - SẢN PHẨM 2
## THƯ VIỆN MẪU TRÌNH CHIẾU (PRESENTATION TEMPLATE LIBRARY)

Trích xuất từ email đề bài kiểm tra tuyển dụng vị trí **Fullstack Developer**.

---

## 1. MỤC TIÊU BÀI TOÁN

Phát triển thư viện mẫu trình chiếu, cho phép người dùng lựa chọn một bộ template PowerPoint và tạo bản trình chiếu mới.

---

## 2. CHI TIẾT CÁC YÊU CẦU KỸ THUẬT & CHỨC NĂNG

### A. Giao diện
1. Hiển thị các template PowerPoint với thumbnail.
2. Có chức năng tìm kiếm và phân loại mẫu.
3. Xem trước bộ slide của từng template (Slide Deck Preview).
4. Có chức năng chọn mẫu để tạo bản trình chiếu mới.

### B. Luồng sử dụng
1. Người dùng chọn một template.
2. Hệ thống tạo bản trình chiếu mới từ template đó.
3. **Bản trình chiếu mới phải độc lập với template gốc.** (Cơ chế Template Immutability).
4. Người dùng có thể mở và chỉnh sửa bản trình chiếu bằng trình soạn thảo được tích hợp hoặc bằng ứng dụng tương thích.
5. Có thể tải xuống PPTX nếu giải pháp lựa chọn hỗ trợ.

### C. Quản lý dữ liệu
1. Có tối thiểu 3 bộ template thử nghiệm.
2. Mỗi bộ có tên, mô tả, thumbnail và danh sách slide xem trước.
3. Có thể thêm hoặc cập nhật template mà không phải xây dựng lại toàn bộ tính năng.

### D. Tính tương thích
Nếu giải pháp chưa có trình chỉnh sửa slide tích hợp, bạn có thể xây dựng luồng chọn mẫu, tạo bản sao và tải xuống PPTX. Hãy nêu rõ giới hạn của giải pháp và hướng mở rộng để tích hợp trình soạn thảo sau này.

---

## 3. ĐỐI CHIẾU THỰC HIỆN TRONG DỰ ÁN

| Hạng mục đề bài | Thành phần mã nguồn thực hiện | Tài liệu kỹ thuật chi tiết |
| :--- | :--- | :--- |
| **Giao diện & Lưới thẻ 16:9** | `src/components/slides/PresentationGallery.tsx`<br>`src/components/slides/PresentationCard.tsx` | [SRS.md](SRS.md#fr-1) |
| **Tìm kiếm & Phân loại** | `src/components/slides/CategoryFilter.tsx`<br>Tích hợp `usehooks-ts` (`useDebounceValue`) | [SRS.md](SRS.md#fr-2) |
| **Xem trước Slide Deck Cinema 16:9** | `src/components/slides/SlideDeckModal.tsx` | [SRS.md](SRS.md#fr-3) |
| **Filmstrip Carousel nhiều slide** | `src/components/slides/SlideDeckModal.tsx` (Filmstrip bar) | [SRS.md](SRS.md#fr-4) |
| **Bảo vệ file gốc (Copy-on-Create)** | `src/server/services/presentation.service.ts`<br>`src/server/services/storage.service.ts` | [ARCHITECTURE.md](ARCHITECTURE.md#2) |
| **Tải xuống file PowerPoint (.pptx)** | `src/server/services/pptx-generator.service.ts`<br>`src/app/api/presentations/[id]/download/route.ts` | [API_SPEC.md](API_SPEC.md#download) |
| **3 bộ slide (15 slides 16:9)** | `src/data/templates.ts`<br>`public/slides/` | [PLAN.md](PLAN.md) |
| **Báo cáo mở rộng Slide Editor (Mục III.2.D)** | `src/components/slides/PresentationCreatedModal.tsx`<br>`docs/ROADMAP.md` | [ROADMAP.md](ROADMAP.md#giai-doan-2) |

