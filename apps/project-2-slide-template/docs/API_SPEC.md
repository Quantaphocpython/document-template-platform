# ĐẶC TẢ API - SẢN PHẨM 2: THƯ VIỆN MẪU TRÌNH CHIẾU

## 1. Templates API

### `GET /api/templates`
Lấy danh sách các bộ mẫu trình chiếu PowerPoint.
* **Query Parameters**:
  * `category` (optional, string): Mã danh mục (`all`, `pitch-deck`, `business-report`, `marketing-sales`).
  * `search` (optional, string): Từ khóa tìm kiếm theo tên bộ slide hoặc mô tả.
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "tpl-pitch-deck-investor",
      "title": "Bộ Mẫu Pitch Deck Gọi Vốn Đầu Tư",
      "description": "Cấu trúc slide chuẩn dành cho Startup trình bày trước các quỹ đầu tư mạo hiểm (VCs).",
      "category": "pitch-deck",
      "categoryName": "Gọi Vốn & Khởi Nghiệp",
      "totalSlides": 5,
      "thumbnailUrl": "/thumbnails/slides/pitch-deck-thumb.svg",
      "aspectRatio": "16:9",
      "createdAt": "2026-10-01T08:00:00Z"
    }
  ],
  "total": 3
}
```

---

### `GET /api/templates/:id`
Lấy thông tin chi tiết một bộ mẫu bao gồm toàn bộ danh sách các slide bên trong để xem trước (Slide Deck Preview).
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "tpl-pitch-deck-investor",
    "title": "Bộ Mẫu Pitch Deck Gọi Vốn Đầu Tư",
    "description": "...",
    "category": "pitch-deck",
    "categoryName": "Gọi Vốn & Khởi Nghiệp",
    "totalSlides": 5,
    "slides": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Trang Bìa & Khẩu Hiệu",
        "previewImageUrl": "/slides/pitch-deck/slide-1.svg",
        "layoutType": "cover"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Vấn Đề & Giải Pháp Đột Phá",
        "previewImageUrl": "/slides/pitch-deck/slide-2.svg",
        "layoutType": "content"
      }
    ]
  }
}
```

---

## 2. Presentations API (Bản trình chiếu người dùng tạo)

### `POST /api/presentations`
Tạo một bản trình chiếu mới độc lập dựa trên bộ mẫu (sao chép độc lập file PPTX).
* **Request Body**:
```json
{
  "templateId": "tpl-pitch-deck-investor",
  "customTitle": "Bài Thuyết Trình Gọi Vốn - Công Ty TechCorp" // optional
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "pres-4e78a1bc-299a-4c91-a887-872f10b892a1",
    "title": "Bài Thuyết Trình Gọi Vốn - Công Ty TechCorp",
    "clonedFromTemplateId": "tpl-pitch-deck-investor",
    "downloadUrl": "/api/presentations/pres-4e78a1bc-299a-4c91-a887-872f10b892a1/download",
    "createdAt": "2026-10-30T14:20:00Z"
  }
}
```

---

### `GET /api/presentations/:id/download`
Tải file `.pptx` của bản trình chiếu về máy tính.
* **Response**: Stream file binary `application/vnd.openxmlformats-officedocument.presentationml.presentation` kèm Header `Content-Disposition: attachment; filename="TechCorp-PitchDeck.pptx"`.

