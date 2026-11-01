# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS - SOFTWARE REQUIREMENTS SPECIFICATION)
## SẢN PHẨM 2: THƯ VIỆN MẪU TRÌNH CHIẾU (PRESENTATION TEMPLATE LIBRARY)

* **Phiên bản tài liệu**: 1.0.0  
* **Trạng thái**: Approved & Implemented  
* **Tác giả**: Engineering Team  
* **Hệ thống mục tiêu**: Bộ ứng dụng văn phòng tích hợp (Integrated Office Suite)  

---

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích tài liệu
Tài liệu SRS này xác định chi tiết các yêu cầu kỹ thuật và nghiệp vụ cho **Hệ thống Thư viện Mẫu Trình chiếu PowerPoint (Presentation Template Library)**. Tài liệu đóng vai trò làm chuẩn mực đối soát tính năng và làm cơ sở đánh giá chất lượng triển khai của Sản phẩm 2.

### 1.2. Phạm vi sản phẩm
Sản phẩm là phân hệ trình chiếu cho phép người dùng trong tổ chức:
- Khám phá các bộ mẫu slide thuyết trình PowerPoint chuẩn 16:9 được thiết kế bài bản theo từng mục đích kinh doanh (Pitch Deck gọi vốn, Báo cáo quý, Kế hoạch ra mắt sản phẩm).
- Trải nghiệm xem trước bộ slide (Slide Deck Preview) với màn hình Cinema lớn và thanh cuộn Filmstrip nhiều slide.
- Lựa chọn bộ mẫu và tạo bản trình chiếu mới theo nguyên tắc **Copy-on-Create**, đảm bảo file mẫu gốc tuyệt đối bất biến.
- Tải file bài thuyết trình độc lập định dạng `.pptx` chuẩn để mở và thuyết trình trên Microsoft PowerPoint, Google Slides hoặc Apple Keynote.
- Đưa ra báo cáo giải trình giới hạn kỹ thuật và phương án kiến trúc để tích hợp trình soạn thảo slide trực tuyến (In-browser Slide Editor) trong tương lai.

### 1.3. Định nghĩa & Thuật ngữ (Definitions & Acronyms)
| Thuật ngữ | Diễn giải |
| :--- | :--- |
| **Slide Template (Bộ mẫu)** | Tập hợp các slide thuyết trình có chung ngôn ngữ thiết kế, màu sắc chủ đạo, font chữ và tỷ lệ màn hình 16:9. |
| **Slide Deck Preview** | Trình phát trực quan cho phép người dùng xem lướt qua từng trang slide bên trong một bộ mẫu mà không cần tải file về máy. |
| **Filmstrip Carousel** | Dải thumbnail các slide con nằm dưới màn hình xem chính, cho phép nhấp chọn chuyển đổi nhanh giữa các trang slide. |
| **OpenXML (PPTX)** | Định dạng tài liệu trình chiếu chuẩn quốc tế của Microsoft PowerPoint (`.pptx`). |
| **WOPI (Web Application Open Platform Interface)** | Giao thức chuẩn doanh nghiệp của Microsoft cho phép tích hợp trực tiếp Office Online vào ứng dụng web của bên thứ ba. |

---

## 2. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)

### 2.1. Phối cảnh hệ thống
```
┌────────────────────────────────────────────────────────┐
│                   GIAO DIỆN NGƯỜI DÙNG                 │
│  - Presentation Gallery (Lưới thẻ 16:9, Lọc, Tìm kiếm)│
│  - Slide Deck Cinema Viewer (Màn chiếu 16:9 + Filmstrip)│
│  - Presentation Created Modal (Thông số file & Tải PPTX)│
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / RESTful API
┌──────────────────────────▼─────────────────────────────┐
│                 BACKEND API & DOMAIN LAYER             │
│  - Template Controller (/api/templates)                │
│  - Presentation Controller (/api/presentations)        │
│  - SlideTemplateService & PresentationService          │
│  - PptxGeneratorService (Khởi tạo & bảo vệ file PPTX) │
└──────────────────────────┬─────────────────────────────┘
                           │ Physical I/O
┌──────────────────────────▼─────────────────────────────┐
│                  STORAGE REPOSITORY                    │
│  - storage/templates/ (Read-only master *.pptx)        │
│  - storage/presentations/ (User *.pptx & *.json)       │
└────────────────────────────────────────────────────────┘
```

### 2.2. Đối tượng người dùng (User Personas)
1. **Lãnh đạo Khởi nghiệp (Startup Founders)**: Cần bộ slide Pitch Deck chuẩn mực để gặp gỡ các quỹ đầu tư mạo hiểm (VCs).
2. **Khối Kế hoạch & Tài chính (FP&A / PMO)**: Sử dụng các slide báo cáo hoạt động định kỳ để tổng kết số liệu kinh doanh trước Hội đồng Quản trị.
3. **Giám đốc Tiếp thị & Sản phẩm (CMO / PM)**: Chuẩn bị slide chiến lược Go-To-Market cho chiến dịch ra mắt sản phẩm mới.

### 2.3. Ràng buộc kỹ thuật & Giải pháp Kiến trúc
- **Ràng buộc định dạng PPTX trên Web**: Định dạng `.pptx` là tập hợp hàng trăm thành phần XML phức tạp (vector shapes, animations, master layouts, gradient fills, embedded fonts). Việc phát triển một trình biên tập slide hai chiều (round-trip visual editor) đầy đủ trên web đòi hỏi giải pháp engine chuyên biệt để tránh lỗi suy hao dữ liệu.
- **Giải pháp kiến trúc chuẩn**: Xây dựng hoàn chỉnh luồng: **Chọn mẫu $\rightarrow$ Nhân bản bản sao độc lập $\rightarrow$ Tải file PPTX chuẩn**, kèm theo lộ trình tích hợp trình biên tập trực tuyến chi tiết trong tài liệu hệ thống.

---

## 3. CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### FR-1: Duyệt & Phân loại Danh mục Bộ Slide (Presentation Catalog)
- **FR-1.1**: Hệ thống phải hiển thị danh mục các nhóm bộ slide: Gọi vốn & Khởi nghiệp (`pitch-deck`), Báo cáo & Đánh giá định kỳ (`quarterly-review`), Chiến lược & Ra mắt sản phẩm (`product-launch`).
- **FR-1.2**: Mỗi bộ mẫu hiển thị thẻ card dạng 16:9 gồm: Ảnh bìa đại diện, tên bộ slide, mô tả định hướng sử dụng, badge danh mục, tổng số trang slide, định dạng file (`.pptx`) và tags.
- **FR-1.3**: Có badge hiển thị tổng số lượng bộ slide đang sẵn sàng trên hệ thống.

### FR-2: Tìm kiếm & Lọc Thời gian Thực (Real-time Search & Filter)
- **FR-2.1**: Cho phép tìm kiếm bộ slide theo từ khóa xuất hiện trong: Tên bài thuyết trình, Mô tả, Tags phân loại.
- **FR-2.2**: Lọc tức thời theo từng danh mục chuyên ngành.
- **FR-2.3**: Có Empty State thông báo khi không có kết quả tìm kiếm kèm nút "Xóa bộ lọc tìm kiếm".

### FR-3: Trình Duyệt Slide Deck Cinema 16:9 (Cinema Player & Floating Controls)
- **FR-3.1**: Cho phép người dùng nhấp vào ảnh hoặc nút "Xem slide" để mở Modal trình chiếu kích thước lớn (MaxWidth 5xl).
- **FR-3.2**: Khung màn chiếu chính giữ đúng tỷ lệ chuẩn điện ảnh 16:9 Cinema HD với hiệu ứng chuyển đổi mượt mà (smooth crossfade).
- **FR-3.3**: Cung cấp **2 hệ thống điều hướng chuyển slide trực quan & nổi bật**:
  - **Nút mũi tên nổi (Floating Arrow Buttons)** trực tiếp hai bên mép màn chiếu: Nút mũi tên trái (`ChevronLeft`) và nút mũi tên phải (`ChevronRight`) kích thước lớn, hiệu ứng hover phóng to và nền mờ bán trong suốt.
  - **Thanh điều hướng bên dưới (Bottom Navigation Bar)**: Cung cấp 2 nút bấm chuẩn Design System `< Slide trước` và `Slide tiếp theo >` kèm huy hiệu đếm trang hiện tại (`Slide X / 5`).
- **FR-3.4**: Chế độ **Xem tổng quan lưới slide (Overview Grid Mode)**: Nhấp nút "Tổng quan" hoặc bấm phím `ESC` để mở lưới toàn bộ 5 slide 16:9, cho phép xem toàn cảnh và nhấp chuyển trang tức thì.
- **FR-3.5**: Chế độ **Toàn màn hình (Fullscreen)**: Nhấp nút "Toàn màn hình" hoặc bấm phím `F`.
- **FR-3.6**: Hỗ trợ đầy đủ phím tắt bàn phím: Phím mũi tên trái/phải (`←` / `→`), Phím cách (Space).

### FR-4: Thanh Cuộn Filmstrip Carousel (Multi-slide Thumbnail Bar)
- **FR-4.1**: Nằm ngay bên dưới khung chiếu chính, hiển thị toàn bộ các slide con trong bộ mẫu dưới dạng dải thumbnail cuộn ngang.
- **FR-4.2**: Đồng bộ hai chiều: khi chuyển slide bằng nút nổi, nút thanh công cụ hoặc bàn phím, Filmstrip tự động làm nổi bật thumbnail tương ứng với viền tím `border-primary` và hiệu ứng phóng to.
- **FR-4.3**: Người dùng có thể nhấp vào bất kỳ thumbnail nào để lập tức chuyển tới trang slide đó.

### FR-5: Cơ chế Nhân bản Độc lập File PPTX (Copy-on-Create & Immutability)
- **FR-5.1**: Khi người dùng nhấn "Tạo bài trình chiếu" hoặc "Tạo bản trình chiếu mới", hệ thống gửi request `POST /api/presentations`.
- **FR-5.2**: Hệ thống thực hiện sao chép tệp vật lý độc lập (Physical File Copy) từ file mẫu gốc trong `storage/templates/` sang tệp mới mang tên `{presentationId}.pptx` trong `storage/presentations/`.
- **FR-5.3**: File mẫu gốc phải được bảo vệ nguyên vẹn 100%, không bị sửa đổi, không thay đổi kích thước và thời gian sửa đổi (mtime).
- **FR-5.4**: Lưu trữ bản ghi metadata độc lập trong file `{presentationId}.json`.

### FR-6: Tải Xuống File Bản Trình Chiếu Chuẩn (Download PPTX)
- **FR-6.1**: Sau khi nhân bản thành công, mở Modal thông báo khởi tạo thành công, hiển thị đầy đủ thông số: Tên bài thuyết trình, Mã định danh, Số trang, Dung lượng file và Mẫu ban đầu.
- **FR-6.2**: Nút "Tải file PPTX về máy" gọi endpoint `GET /api/presentations/:id/download`.
- **FR-6.3**: Trả về dữ liệu nhị phân với Header chuẩn MIME type: `application/vnd.openxmlformats-officedocument.presentationml.presentation` và `Content-Disposition: attachment`.
- **FR-6.4**: File PPTX tải về phải là tệp OpenXML hợp lệ (có magic bytes `PK\x03\x04`), mở thành công trên Microsoft PowerPoint, Google Slides, Keynote với đầy đủ các slide, text box và định dạng màu sắc.

### FR-7: Thuyết Minh Kiến Trúc Mở Rộng Slide Editor (In-browser Editor Roadmap)
- **FR-7.1**: Modal thông báo và tài liệu kiến trúc phải nêu rõ giải pháp mở rộng trong tương lai để tích hợp trình chỉnh sửa slide trực tuyến (HTML5 Canvas & WOPI Protocol).

### FR-8: Chế Độ Biên Tập & Vẽ Vector HTML5 Canvas (Fabric.js Engine)
- **FR-8.1**: Cung cấp nút chuyển đổi "Canvas Mode" ngay trên màn chiếu slide.
- **FR-8.2**: Sử dụng thư viện tiêu chuẩn Fabric.js (`fabric` v7) để dựng slide lên thẻ HTML5 `<canvas>` với độ phân giải chuẩn 16:9 Cinema (1280x720).
- **FR-8.3**: Hỗ trợ thêm Textbox vector với tính năng tự động ngắt dòng và co giãn chữ.
- **FR-8.4**: Hỗ trợ thêm Shape/Card vector bo góc, chọn và di chuyển đối tượng bằng chuột (bounding box), xóa đối tượng đã chọn.
- **FR-8.5**: Hỗ trợ xuất ảnh PNG độ nét cao (2x DPI) trực tiếp từ Canvas (`canvas.toDataURL`).

---

## 4. CÁC YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

### NFR-1: Hiệu năng & Tốc độ Chuyển Slide (Performance)
- Tốc độ chuyển đổi giữa các slide trong Modal phải đạt độ trễ dưới 50ms, không có hiện tượng chớp nháy màn hình.
- File PPTX mẫu được nén tối ưu (dung lượng ~75KB), tải xuống tức thì ngay khi người dùng nhấn nút.

### NFR-2: Tính Bất biến Tuyệt đối của Mẫu Gốc (Data Immutability)
- File master template tại `storage/templates/` được phân vùng Read-only. Mọi thao tác tải về hay sửa đổi của người dùng chỉ tác động trên file bản sao tại `storage/presentations/`.
- Được kiểm chứng tự động qua bộ test suite `pnpm test`.

### NFR-3: Độ Sắc Nét & Tương Thích Màn Hình (Visual Fidelity)
- Toàn bộ 15 trang slide preview được thiết kế bằng đồ họa vector SVG tỉ lệ chuẩn 16:9, đảm bảo hiển thị sắc nét trên cả màn hình Retina/4K mà không bị vỡ hạt.

---

## 5. MA TRẬN KIỂM CHỨNG & TIÊU CHÍ NGHIỆM THU (VERIFICATION MATRIX)

| Mã yêu cầu | Hạng mục kiểm chứng | Phương pháp kiểm tra | Kết quả đạt được |
| :--- | :--- | :--- | :---: |
| **FR-1** | 3 bộ template PowerPoint (15 slides) | Automated Test (`tests/verify-all.ts`) | **PASSED** (3 bộ, 15 slides 16:9) |
| **FR-2** | Lọc danh mục, tìm kiếm từ khóa | Automated Test (`tests/verify-all.ts`) | **PASSED** (Filter & Search OK) |
| **FR-3** | Màn chiếu Cinema 16:9, Previous/Next | Component Build & Typecheck | **PASSED** (Cinema Player OK) |
| **FR-4** | Thanh Filmstrip Carousel cuộn chọn slide | Component Build & DOM Interaction | **PASSED** (Filmstrip OK) |
| **FR-5** | Copy-on-Create, Immutability file gốc | Automated Test (`tests/verify-all.ts`) | **PASSED** (File gốc nguyên vẹn) |
| **FR-6** | Tải xuống file PPTX nhị phân hợp lệ | Automated Test (`tests/verify-all.ts`) | **PASSED** (PK zip magic bytes OK) |
| **FR-7** | Báo cáo kỹ thuật & Hướng mở rộng Editor | Modal & Architecture Documentation | **PASSED** (Mục III.2.D OK) |

