import { CategoryInfo, Template, TemplateCategory } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: TemplateCategory.ALL,
    name: 'Tất cả mẫu',
    description: 'Toàn bộ thư viện biểu mẫu văn phòng',
  },
  {
    id: TemplateCategory.CONTRACT,
    name: 'Hợp đồng & Pháp lý',
    description: 'Hợp đồng lao động, thỏa thuận dịch vụ và văn bản pháp lý',
  },
  {
    id: TemplateCategory.HR,
    name: 'Nhân sự & Hành chính',
    description: 'Đơn từ, biểu mẫu hành chính, đề xuất nghỉ phép',
  },
  {
    id: TemplateCategory.MEETING,
    name: 'Biên bản & Hội họp',
    description: 'Biên bản cuộc họp, ghi nhận ý kiến và phân công nhiệm vụ',
  },
  {
    id: TemplateCategory.REPORT,
    name: 'Báo cáo & Đánh giá',
    description: 'Báo cáo định kỳ tuần/tháng, chỉ số hiệu suất KPI',
  },
  {
    id: TemplateCategory.PROPOSAL,
    name: 'Đề xuất & Kế hoạch',
    description: 'Bản đề xuất sáng kiến dự án, kế hoạch kinh doanh',
  },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl-employment-contract',
    title: 'Hợp Đồng Lao Động Xác Định Thời Hạn',
    description: 'Biểu mẫu hợp đồng lao động chuẩn theo Bộ luật Lao động hiện hành, bao gồm đầy đủ điều khoản tiền lương, bảo hiểm và nghĩa vụ đôi bên.',
    category: TemplateCategory.CONTRACT,
    categoryName: 'Hợp đồng & Pháp lý',
    thumbnailUrl: '/thumbnails/employment-contract.svg',
    version: '1.2.0',
    tags: ['hợp đồng', 'lao động', 'nhân sự', 'tiền lương', 'pháp lý'],
    author: 'Phòng Pháp Chế & HR',
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-10-20T10:30:00Z',
    contentHtml: `
<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-weight: bold; margin: 0; font-size: 14pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
  <p style="font-weight: bold; text-decoration: underline; margin: 0; font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</p>
  <p style="margin-top: 16px; font-style: italic;">Hà Nội, ngày ..... tháng ..... năm 2026</p>
  <h1 style="font-size: 18pt; font-weight: bold; margin-top: 24px; text-transform: uppercase;">HỢP ĐỒNG LAO ĐỘNG</h1>
  <p style="font-style: italic;">(Số: ....../2026/HĐLĐ-CTY)</p>
</div>

<p>Hôm nay, ngày ..... tháng ..... năm 2026, tại Trụ sở Công ty Cổ phần Công Nghệ Mới, chúng tôi gồm có:</p>

<p style="font-weight: bold;">BÊN SỬ DỤNG LAO ĐỘNG (BÊN A):</p>
<ul>
  <li><strong>Tên doanh nghiệp:</strong> CÔNG TY CỔ PHẦN CÔNG NGHỆ VĂN PHÒNG SỐ</li>
  <li><strong>Đại diện bởi Ông/Bà:</strong> Nguyễn Văn An &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức vụ:</strong> Giám đốc điều hành</li>
  <li><strong>Địa chỉ:</strong> Tầng 12, Tòa nhà Innovation, Quận Cầu Giấy, TP. Hà Nội</li>
  <li><strong>Mã số thuế:</strong> 0109988776</li>
</ul>

<p style="font-weight: bold;">BÊN LAO ĐỘNG (BÊN B):</p>
<ul>
  <li><strong>Ông/Bà:</strong> Trần Hoàng Quân</li>
  <li><strong>Sinh ngày:</strong> ...../...../199x &nbsp;&nbsp;&nbsp;&nbsp; <strong>Quốc tịch:</strong> Việt Nam</li>
  <li><strong>Số CCCD:</strong> 00109xxxxxxxx &nbsp;&nbsp;&nbsp;&nbsp; <strong>Cấp ngày:</strong> ...../...../202x tại Cục CS QLHC về TTXH</li>
  <li><strong>Địa chỉ thường trú:</strong> ............................................................................................</li>
</ul>

<p>Hai bên cùng thỏa thuận ký kết Hợp đồng lao động với các điều khoản sau:</p>

<h3>ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</h3>
<p>1.1. Loại hợp đồng: Hợp đồng lao động xác định thời hạn <strong>12 tháng</strong> kể từ ngày 01/11/2026 đến ngày 31/10/2027.</p>
<p>1.2. Vị trí chuyên môn: <strong>Kỹ sư Lập trình Fullstack (Fullstack Developer)</strong>.</p>
<p>1.3. Địa điểm làm việc: Trụ sở công ty hoặc làm việc linh hoạt theo quy chế nội bộ.</p>

<h3>ĐIỀU 2: CHẾ ĐỘ LÀM VIỆC VÀ NGHỈ NGƠI</h3>
<p>2.1. Thời gian làm việc: Từ thứ Hai đến thứ Sáu, 08 giờ/ngày (08:30 - 17:30).</p>
<p>2.2. Chế độ nghỉ ngơi: Nghỉ thứ Bảy, Chủ nhật và các ngày Lễ, Tết theo quy định của pháp luật Việt Nam. Hưởng 12 ngày phép năm nguyên lương.</p>

<h3>ĐIỀU 3: NGHĨA VỤ VÀ QUYỀN LỢI TIỀN LƯƠNG</h3>
<p>3.1. Mức lương cơ bản: <strong>25.000.000 VNĐ / tháng</strong> (Hai mươi lăm triệu đồng chẵn).</p>
<p>3.2. Hình thức trả lương: Chuyển khoản ngân hàng vào ngày 05 hàng tháng.</p>
<p>3.3. Bảo hiểm: Đóng BHXH, BHYT, BHTN theo đúng quy định pháp luật và gói bảo hiểm sức khỏe cao cấp của Công ty.</p>

<table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <p style="font-weight: bold; margin: 0;">ĐẠI DIỆN BÊN LAO ĐỘNG</p>
      <p style="font-style: italic; margin-top: 4px;">(Ký và ghi rõ họ tên)</p>
      <br/><br/><br/><br/>
      <p style="font-weight: bold;">Trần Hoàng Quân</p>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <p style="font-weight: bold; margin: 0;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="font-style: italic; margin-top: 4px;">(Ký tên và đóng dấu)</p>
      <br/><br/><br/><br/>
      <p style="font-weight: bold;">Nguyễn Văn An</p>
    </td>
  </tr>
</table>
`,
  },
  {
    id: 'tpl-leave-request',
    title: 'Đơn Xin Nghỉ Phép Thường Niên',
    description: 'Biểu mẫu tiêu chuẩn cho nhân viên đăng ký nghỉ phép năm, nghỉ việc riêng hoặc nghỉ ốm, có phân mục bàn giao công việc chi tiết.',
    category: TemplateCategory.HR,
    categoryName: 'Nhân sự & Hành chính',
    thumbnailUrl: '/thumbnails/leave-request.svg',
    version: '1.0.0',
    tags: ['đơn từ', 'nghỉ phép', 'nhân sự', 'hành chính', 'leave'],
    author: 'Bộ phận HR & Admin',
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-10-18T14:20:00Z',
    contentHtml: `
<div style="text-align: center; margin-bottom: 20px;">
  <p style="font-weight: bold; margin: 0; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
  <p style="font-weight: bold; text-decoration: underline; margin: 0; font-size: 11pt;">Độc lập - Tự do - Hạnh phúc</p>
  <h1 style="font-size: 16pt; font-weight: bold; margin-top: 24px; text-transform: uppercase;">ĐƠN XIN NGHỈ PHÉP</h1>
</div>

<p style="font-style: italic; text-align: center;"><strong>Kính gửi:</strong> - Ban Giám Đốc Công ty<br/>- Trưởng Bộ phận Kỹ thuật & Công nghệ (Tech Lead)<br/>- Phòng Nhân sự & Hành chính</p>

<p>Tôi tên là: <strong>Trần Hoàng Quân</strong> &nbsp;&nbsp;&nbsp;&nbsp; Mã nhân viên: <strong>EMP-2026-088</strong></p>
<p>Chức danh hiện tại: <strong>Fullstack Developer</strong> &nbsp;&nbsp;&nbsp;&nbsp; Bộ phận: <strong>Phát triển Sản phẩm (Product Engineering)</strong></p>
<p>Số điện thoại liên hệ khẩn cấp: <strong>0772713206</strong></p>

<p>Nay tôi làm đơn này kính xin phép được nghỉ phép trong khoảng thời gian:</p>
<ul>
  <li><strong>Số ngày xin nghỉ:</strong> 02 ngày làm việc.</li>
  <li><strong>Thời gian:</strong> Từ ngày ...../...../2026 đến hết ngày ...../...../2026.</li>
  <li><strong>Loại nghỉ phép:</strong> Nghỉ phép năm (Annual Leave) [X] &nbsp;&nbsp; Nghỉ việc riêng [ ] &nbsp;&nbsp; Nghỉ không hưởng lương [ ]</li>
  <li><strong>Lý do xin nghỉ:</strong> Giải quyết công việc gia đình đột xuất và tái tạo năng lượng làm việc.</li>
</ul>

<h3>KẾ HOẠCH BÀN GIAO CÔNG VIỆC</h3>
<p>Trong thời gian nghỉ phép, tôi đã sắp xếp hoàn thành các task cấp bách và bàn giao công việc như sau:</p>
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Hạng mục công việc</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Người tiếp nhận bàn giao</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Trạng thái / Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Review Pull Request module Templates</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Lê Văn Bình (Senior Dev)</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Đã merge code nhánh dev</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Theo dõi cảnh báo Server staging</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Phạm Tuấn Anh (DevOps)</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Hệ thống ổn định</td>
    </tr>
  </tbody>
</table>

<p style="margin-top: 20px;">Kính mong Ban Giám Đốc và Trưởng bộ phận xem xét phê duyệt.</p>

<table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; vertical-align: top;">
      <p style="font-weight: bold; margin: 0;">NGƯỜI LÀM ĐƠN</p>
      <p style="font-style: italic; margin-top: 4px;">(Ký và ghi rõ họ tên)</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Trần Hoàng Quân</p>
    </td>
    <td style="width: 33%; text-align: center; vertical-align: top;">
      <p style="font-weight: bold; margin: 0;">TRƯỞNG BỘ PHẬN</p>
      <p style="font-style: italic; margin-top: 4px;">(Ý kiến và ký tên)</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Đã phê duyệt</p>
    </td>
    <td style="width: 34%; text-align: center; vertical-align: top;">
      <p style="font-weight: bold; margin: 0;">PHÒNG NHÂN SỰ</p>
      <p style="font-style: italic; margin-top: 4px;">(Xác nhận ngày phép)</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Còn 10 ngày phép</p>
    </td>
  </tr>
</table>
`,
  },
  {
    id: 'tpl-meeting-minutes',
    title: 'Biên Bản Cuộc Họp Nội Bộ & Giao Việc',
    description: 'Mẫu ghi chép diễn biến cuộc họp chuẩn hóa, theo dõi các quyết định quan trọng và bảng phân công hành động (Action Items) có thời hạn cụ thể.',
    category: TemplateCategory.MEETING,
    categoryName: 'Biên bản & Hội họp',
    thumbnailUrl: '/thumbnails/meeting-minutes.svg',
    version: '1.1.0',
    tags: ['biên bản', 'cuộc họp', 'nhiệm vụ', 'quản lý', 'action-items'],
    author: 'Văn Phòng Dự Án (PMO)',
    createdAt: '2026-10-01T08:30:00Z',
    updatedAt: '2026-10-25T11:00:00Z',
    contentHtml: `
<div style="text-align: center; margin-bottom: 20px;">
  <h1 style="font-size: 18pt; font-weight: bold; margin: 0; text-transform: uppercase;">BIÊN BẢN CUỘC HỌP NỘI BỘ</h1>
  <p style="font-style: italic; margin-top: 6px;">V/v: Rà soát tiến độ phát sinh và thống nhất kiến trúc Sprint Q4/2026</p>
</div>

<h3>I. THÔNG TIN CHUNG</h3>
<ul>
  <li><strong>Thời gian:</strong> 09:00 - 11:30, Ngày 30 tháng 10 năm 2026</li>
  <li><strong>Địa điểm:</strong> Phòng họp A2 & Trực tuyến qua Google Meet</li>
  <li><strong>Chủ trì cuộc họp:</strong> Ông Nguyễn Văn An (Product Owner)</li>
  <li><strong>Thư ký cuộc họp:</strong> Bà Phạm Mai Chi (Project Coordinator)</li>
  <li><strong>Thành phần tham dự:</strong> Nhóm Phát triển (Fullstack, FE, BE, QA), Đại diện Vận hành. (Tổng cộng: 08 người).</li>
</ul>

<h3>II. NỘI DUNG CUỘC HỌP</h3>
<p><strong>1. Đánh giá tính năng Thư viện mẫu tài liệu:</strong></p>
<p>- Nhóm kỹ thuật báo cáo đã hoàn thành việc chuẩn hóa cấu trúc dữ liệu cho template văn bản và slide trình chiếu.</p>
<p>- Đảm bảo nguyên tắc bảo toàn file gốc (Template Immutability): File gốc nằm trong vùng Read-Only, khi người dùng click "Sử dụng mẫu", hệ thống tự động sinh bản sao độc lập.</p>
<p><strong>2. Thảo luận về trải nghiệm người dùng (UX):</strong></p>
<p>- Cần bổ sung trạng thái Loading Skeleton mượt mà và Empty state khi người dùng tìm kiếm không ra kết quả.</p>
<p>- Tối ưu hóa phím tắt và thanh công cụ soạn thảo trực quan.</p>

<h3>III. KẾT LUẬN & PHÂN CÔNG HÀNH ĐỘNG (ACTION ITEMS)</h3>
<table style="width: 100%; border-collapse: collapse; margin-top: 12px; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="border: 1px solid #cbd5e1; padding: 8px; width: 5%;">STT</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; width: 45%;">Hạng mục công việc cụ thể</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; width: 25%;">Người chịu trách nhiệm</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; width: 25%;">Hạn hoàn thành (Deadline)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">1</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Xây dựng API clone và export DOCX không đè file gốc</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Trần Hoàng Quân (Fullstack)</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">31/10/2026</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Thiết kế bộ Slide Deck Preview chuẩn 16:9 cho Sản phẩm 2</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Nguyễn Thùy Linh (UI/UX)</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">31/10/2026</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Viết tài liệu kiến trúc hệ thống và quay video demo</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Trần Hoàng Quân & PMO</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">01/11/2026</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; margin-top: 35px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center;">
      <p style="font-weight: bold; margin: 0;">CHỦ TRÌ CUỘC HỌP</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Nguyễn Văn An</p>
    </td>
    <td style="width: 50%; text-align: center;">
      <p style="font-weight: bold; margin: 0;">THƯ KÝ LẬP BIÊN BẢN</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Phạm Mai Chi</p>
    </td>
  </tr>
</table>
`,
  },
  {
    id: 'tpl-project-report',
    title: 'Báo Cáo Tiến Độ Dự Án Định Kỳ',
    description: 'Bản báo cáo tuần/tháng dành cho quản lý dự án và kỹ sư trưởng, trình bày tiến độ giải ngân, hoàn thành đầu việc, chỉ số rủi ro và kế hoạch tiếp theo.',
    category: TemplateCategory.REPORT,
    categoryName: 'Báo cáo & Đánh giá',
    thumbnailUrl: '/thumbnails/project-report.svg',
    version: '2.0.1',
    tags: ['báo cáo', 'tiến độ', 'dự án', 'kpi', 'quản lý'],
    author: 'Đội Ngũ Kỹ Thuật',
    createdAt: '2026-10-10T07:45:00Z',
    updatedAt: '2026-10-28T16:15:00Z',
    contentHtml: `
<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-weight: bold; color: #2563eb; font-size: 11pt; letter-spacing: 1px; text-transform: uppercase;">BỘ PHẬN PHÁT TRIỂN CÔNG NGHỆ VÀ SẢN PHẨM</p>
  <h1 style="font-size: 18pt; font-weight: bold; margin: 6px 0; text-transform: uppercase;">BÁO CÁO TIẾN ĐỘ DỰ ÁN</h1>
  <p style="font-style: italic;">(Kỳ báo cáo: Tháng 10/2026 - Dự án: Thư Viện Mẫu Văn Phòng Trực Tuyến)</p>
</div>

<h3>1. TỔNG QUAN TÌNH TRẠNG DỰ ÁN (PROJECT HEALTH)</h3>
<ul>
  <li><strong>Tên dự án:</strong> Office Template Library Suite (NextGen Office)</li>
  <li><strong>Giám đốc dự án:</strong> Trần Hoàng Quân</li>
  <li><strong>Trạng thái chung:</strong> <span style="background-color: #dcfce7; color: #166534; font-weight: bold; padding: 2px 8px; border-radius: 4px;">ĐÚNG TIẾN ĐỘ (ON-TRACK)</span></li>
  <li><strong>Mức độ hoàn thành tổng thể:</strong> 92% kế hoạch đề ra.</li>
</ul>

<h3>2. KẾT QUẢ ĐẠT ĐƯỢC TRONG KỲ</h3>
<p>Trong giai đoạn vừa qua, đội ngũ kỹ thuật đã hoàn thành các mục tiêu cốt lõi:</p>
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="border: 1px solid #cbd5e1; padding: 8px;">Module chức năng</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Mục tiêu cam kết</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Thực tế đạt được</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Đánh giá</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Thư viện mẫu văn bản</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">>= 5 mẫu chuẩn</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">5 mẫu hoàn chỉnh</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #16a34a; font-weight: bold;">Đạt 100%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Cơ chế bảo vệ mẫu gốc</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Deep copy & Clone</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Bảo mật & Immutability</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #16a34a; font-weight: bold;">Đạt 100%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Thư viện trình chiếu PPTX</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">>= 3 bộ template</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">3 bộ slide 16:9 cinema</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #16a34a; font-weight: bold;">Đạt 100%</td>
    </tr>
  </tbody>
</table>

<h3>3. PHÂN TÍCH RỦI RO & PHƯƠNG ÁN XỬ LÝ (RISK MANAGEMENT)</h3>
<p>- <strong>Rủi ro về định dạng DOCX:</strong> Việc xuất các bảng biểu phức tạp có thể bị lệch style nếu không dùng chuẩn OpenXML chuẩn. <br/>
<em>$\rightarrow$ Giải pháp đã thực hiện:</em> Áp dụng thư viện <code>docx</code> chuyên dụng trên Node.js backend để kiểm soát tuyệt đối từng bảng, đoạn văn và tiêu đề.</p>

<h3>4. KẾ HOẠCH CHO GIAI ĐOẠN TIẾP THEO</h3>
<ul>
  <li>Mở rộng API hỗ trợ upload template tùy biến từ phía người dùng quản trị.</li>
  <li>Nâng cấp cơ chế auto-save với debounce để tối ưu trải nghiệm khi gõ văn bản dài.</li>
</ul>

<div style="margin-top: 40px; text-align: right;">
  <p style="font-weight: bold; margin: 0;">NGƯỜI LẬP BÁO CÁO</p>
  <p style="font-style: italic; margin-top: 4px;">(Ký và ghi rõ họ tên)</p>
  <br/><br/><br/>
  <p style="font-weight: bold;">Trần Hoàng Quân</p>
</div>
`,
  },
  {
    id: 'tpl-project-proposal',
    title: 'Bản Đề Xuất Dự Án & Kế Hoạch Triển Khai',
    description: 'Mẫu thuyết minh đề xuất dự án kinh doanh hoặc chuyển đổi số, làm rõ giá trị mang lại, phân bổ nguồn lực, ngân sách dự kiến và chỉ số ROI.',
    category: TemplateCategory.PROPOSAL,
    categoryName: 'Đề xuất & Kế hoạch',
    thumbnailUrl: '/thumbnails/project-proposal.svg',
    version: '1.0.0',
    tags: ['đề xuất', 'kế hoạch', 'dự án', 'ngân sách', 'proposal'],
    author: 'Khối Phát Triển Chiến Lược',
    createdAt: '2026-10-15T09:15:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    contentHtml: `
<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-weight: bold; font-size: 11pt; color: #475569; text-transform: uppercase;">CÔNG TY CỔ PHẦN CÔNG NGHỆ VĂN PHÒNG SỐ</p>
  <h1 style="font-size: 20pt; font-weight: bold; margin: 10px 0; text-transform: uppercase; color: #1e3a8a;">BẢN ĐỀ XUẤT DỰ ÁN</h1>
  <p style="font-size: 13pt; font-weight: 600;">(Project Proposal & Business Case)</p>
  <p style="font-style: italic;">Dự án: Xây dựng Hệ sinh thái Thư viện Mẫu Tài liệu Đa nền tảng</p>
</div>

<h3>I. BỐI CẢNH VÀ SỰ CẦN THIẾT CỦA DỰ ÁN</h3>
<p>Hiện nay, nhân sự tại các doanh nghiệp tiêu tốn từ 20% đến 35% thời gian làm việc để định dạng, tìm kiếm các mẫu văn bản và bài thuyết trình. Việc thiếu hụt một hệ thống quản lý mẫu tài liệu tập trung dẫn đến tình trạng:</p>
<ul>
  <li>Sai sót về thể thức văn bản hành chính và pháp lý.</li>
  <li>Không đồng bộ bộ nhận diện thương hiệu công ty trên các slide thuyết trình.</li>
  <li>Nguy cơ sửa nhầm vào file mẫu gốc của tổ chức do thiếu cơ chế phân quyền và nhân bản độc lập.</li>
</ul>

<h3>II. MỤC TIÊU DỰ ÁN (PROJECT OBJECTIVES)</h3>
<p>1. Cung cấp một thư viện hơn 100+ mẫu văn bản và bộ slide chuẩn hóa, phân loại theo từng phòng ban chức năng.</p>
<p>2. Cho phép nhân viên tạo tài liệu mới chỉ với 01 cú click chuột (cơ chế Copy-on-Create an toàn tuyệt đối).</p>
<p>3. Tích hợp công cụ chỉnh sửa trực quan ngay trên nền web, hỗ trợ xuất khẩu file định dạng DOCX và PPTX nguyên bản.</p>

<h3>III. DỰ TOÁN NGÂN SÁCH ĐẦU TƯ (BUDGET ESTIMATE)</h3>
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="border: 1px solid #cbd5e1; padding: 8px;">Hạng mục chi phí</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Thời lượng</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Đơn giá dự kiến (VNĐ)</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Thành tiền (VNĐ)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Nghiên cứu & Thiết kế UX/UI</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">2 tuần</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">25.000.000</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">50.000.000</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Phát triển Core Engine (Fullstack Next.js)</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">4 tuần</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">40.000.000</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">160.000.000</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Kiểm thử bảo mật & Chuẩn hóa định dạng file</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">2 tuần</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">20.000.000</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">40.000.000</td>
    </tr>
    <tr style="font-weight: bold; background-color: #f8fafc;">
      <td colspan="3" style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">TỔNG NGÂN SÁCH ĐỀ XUẤT:</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; color: #1d4ed8;">250.000.000 VNĐ</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center;">
      <p style="font-weight: bold; margin: 0;">NGƯỜI ĐỀ XUẤT DỰ ÁN</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Trần Hoàng Quân</p>
    </td>
    <td style="width: 50%; text-align: center;">
      <p style="font-weight: bold; margin: 0;">PHÊ DUYỆT CỦA BAN GIÁM ĐỐC</p>
      <br/><br/><br/>
      <p style="font-weight: bold;">Nguyễn Văn An</p>
    </td>
  </tr>
</table>
`,
  },
];

