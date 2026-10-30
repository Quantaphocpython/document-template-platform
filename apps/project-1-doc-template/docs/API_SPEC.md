# ĐẶC TẢ API - SẢN PHẨM 1: THƯ VIỆN MẪU VĂN BẢN

## 1. Templates API

### `GET /api/templates`
Lấy danh sách các mẫu tài liệu có sẵn trong hệ thống.
* **Query Parameters**:
  * `category` (optional, string): Lọc theo mã danh mục (ví dụ: `all`, `contract`, `hr`, `report`, `proposal`, `administrative`).
  * `search` (optional, string): Từ khóa tìm kiếm theo tiêu đề, mô tả hoặc tags.
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "tpl-employment-contract",
      "title": "Hợp Đồng Lao Động Chuẩn",
      "description": "Mẫu hợp đồng lao động xác định thời hạn theo Bộ luật Lao động Việt Nam hiện hành.",
      "category": "contract",
      "categoryName": "Hợp đồng & Pháp lý",
      "thumbnailUrl": "/thumbnails/templates/employment-contract.svg",
      "version": "1.0.0",
      "tags": ["hợp đồng", "lao động", "nhân sự", "pháp lý"],
      "createdAt": "2026-10-01T08:00:00Z",
      "updatedAt": "2026-10-15T09:30:00Z"
    }
  ],
  "total": 5
}
```

---

### `GET /api/templates/:id`
Lấy thông tin chi tiết và toàn bộ nội dung mẫu để xem trước (Preview).
* **Path Parameters**:
  * `id`: ID của mẫu template.
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "tpl-employment-contract",
    "title": "Hợp Đồng Lao Động Chuẩn",
    "description": "...",
    "category": "contract",
    "contentHtml": "<h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>...",
    "createdAt": "2026-10-01T08:00:00Z"
  }
}
```
* **Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Template không tồn tại trên hệ thống"
}
```

---

## 2. Documents API (Tài liệu người dùng tạo)

### `POST /api/documents`
Tạo một tài liệu mới độc lập dựa trên một mẫu có sẵn (Copy-on-Create).
* **Request Body**:
```json
{
  "templateId": "tpl-employment-contract",
  "customTitle": "Hợp đồng lao động - Nguyễn Văn A" // optional
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "doc-8f3e2b10-6c9a-4e2b-b991-321a4f0b78c9",
    "title": "Hợp đồng lao động - Nguyễn Văn A",
    "clonedFromTemplateId": "tpl-employment-contract",
    "category": "contract",
    "contentHtml": "<h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>...",
    "status": "draft",
    "createdAt": "2026-10-30T14:15:00Z",
    "updatedAt": "2026-10-30T14:15:00Z"
  }
}
```

---

### `GET /api/documents/:id`
Lấy thông tin và nội dung tài liệu để mở trong trình soạn thảo.
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "doc-8f3e2b10-6c9a-4e2b-b991-321a4f0b78c9",
    "title": "Hợp đồng lao động - Nguyễn Văn A",
    "contentHtml": "<p>Nội dung đang chỉnh sửa...</p>",
    "updatedAt": "2026-10-30T14:15:00Z"
  }
}
```

---

### `PUT /api/documents/:id`
Lưu nội dung và tiêu đề sau khi người dùng chỉnh sửa trong editor.
* **Request Body**:
```json
{
  "title": "Hợp đồng lao động - Nguyễn Văn A (Đã duyệt)",
  "contentHtml": "<p>Nội dung mới sau khi sửa...</p>"
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "doc-8f3e2b10-6c9a-4e2b-b991-321a4f0b78c9",
    "updatedAt": "2026-10-30T14:20:00Z",
    "status": "saved"
  }
}
```

---

### `POST /api/documents/:id/export`
Tải xuống tài liệu định dạng DOCX hoặc file HTML.
* **Query Parameters**:
  * `format`: `docx` | `html` (mặc định là `docx`).
* **Response**: Stream file binary `application/vnd.openxmlformats-officedocument.wordprocessingml.document` kèm Header `Content-Disposition: attachment; filename="document.docx"`.

