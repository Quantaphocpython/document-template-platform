import { INITIAL_SLIDE_TEMPLATES } from '@/data/templates';
import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import { storageService } from './storage.service';

class PptxGeneratorService {
  /**
   * Ensure standard master PPTX template files exist on disk with rich visual layouts.
   */
  public async ensureTemplateFilesExist(force = false): Promise<void> {
    const templatesDir = storageService.getTemplatesDir();

    for (const tpl of INITIAL_SLIDE_TEMPLATES) {
      const filePath = path.join(templatesDir, tpl.pptxFileName);
      if (!fs.existsSync(filePath) || force) {
        await this.generateTemplateFile(tpl.id, filePath);
      }
    }
  }

  public async generateTemplateFile(
    templateId: string,
    destPath: string,
  ): Promise<void> {
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    if (templateId === 'tpl-pitch-deck-investor') {
      this.buildPitchDeck(pres);
    } else if (
      templateId === 'tpl-quarterly-review-board' ||
      templateId === 'tpl-quarterly-review'
    ) {
      this.buildQuarterlyReview(pres);
    } else {
      this.buildProductLaunch(pres);
    }

    await pres.writeFile({ fileName: destPath });
  }

  // ==========================================
  // TEMPLATE 1: PITCH DECK (Indigo / Slate theme)
  // ==========================================
  private buildPitchDeck(pres: pptxgen) {
    const BG = '0F172A';
    const CARD_BG = '1E293B';
    const BORDER = '334155';
    const ACCENT = '818CF8';
    const PRIMARY = '6366F1';

    // Slide 1: Cover
    const s1 = pres.addSlide();
    s1.background = { color: BG };
    this.addPillBadge(
      pres,
      s1,
      0.8,
      0.8,
      2.2,
      0.38,
      'SERIES SEED • $1.5M',
      PRIMARY,
      'FFFFFF',
    );
    s1.addText('NEXUS AI CLOUD', {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 0.8,
      fontSize: 40,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });
    s1.addText('Nền Tảng Tự Động Hóa Quản Trị Văn Phòng Thông Minh', {
      x: 0.8,
      y: 2.3,
      w: 8.4,
      h: 0.5,
      fontSize: 16,
      color: '94A3B8',
      fontFace: 'Arial',
    });
    this.addCardBox(pres, s1, 0.8, 3.4, 8.4, 1.2, CARD_BG, BORDER, [
      {
        text: 'Trình bày trước: Các Quỹ Đầu Tư Mạo Hiểm (VCs) & Nhà Đầu Tư Thiên Thần',
        bold: true,
        color: 'FFFFFF',
        size: 12,
      },
      {
        text: 'Mục tiêu: Huy động $1,500,000 USD hoàn thiện nền tảng & mở rộng thị trường khu vực',
        color: ACCENT,
        size: 11,
      },
    ]);

    // Slide 2: Problem & Solution
    const s2 = pres.addSlide();
    s2.background = { color: BG };
    this.addHeader(
      s2,
      '01 / VẤN ĐỀ & GIẢI PHÁP',
      'Nỗi Đau Thị Trường & Giải Pháp Đột Phá',
      ACCENT,
    );
    this.addCardBox(pres, s2, 0.8, 1.8, 4.0, 3.0, CARD_BG, 'EF4444', [
      { text: 'VẤN ĐỀ THỰC TRẠNG', bold: true, color: 'F87171', size: 13 },
      {
        text: '• 35% thời gian nhân sự bị lãng phí do thiếu biểu mẫu tập trung.',
        color: 'CBD5E1',
        size: 12,
      },
      {
        text: '• Rủi ro sửa nhầm file gốc khi nhiều người cùng thao tác.',
        color: 'CBD5E1',
        size: 12,
      },
      {
        text: '• Định dạng không đồng bộ giữa các chi nhánh và phòng ban.',
        color: 'CBD5E1',
        size: 12,
      },
    ]);
    this.addCardBox(pres, s2, 5.2, 1.8, 4.0, 3.0, CARD_BG, PRIMARY, [
      { text: 'GIẢI PHÁP ĐỘT PHÁ', bold: true, color: 'A5B4FC', size: 13 },
      {
        text: '• Thư viện mẫu trực quan với phân loại chuyên sâu theo ngành nghề.',
        color: 'CBD5E1',
        size: 12,
      },
      {
        text: '• Cơ chế Copy-on-Create bảo vệ 100% file gốc bất biến.',
        color: 'CBD5E1',
        size: 12,
      },
      {
        text: '• Tích hợp xuất file chuẩn OpenXML Word DOCX và PowerPoint PPTX.',
        color: 'CBD5E1',
        size: 12,
      },
    ]);

    // Slide 3: Market Size (TAM - SAM - SOM)
    const s3 = pres.addSlide();
    s3.background = { color: BG };
    this.addHeader(
      s3,
      '02 / QUY MÔ THỊ TRƯỜNG',
      'Cơ Hội Thị Trường TAM - SAM - SOM',
      ACCENT,
    );
    this.addMetricCards(
      pres,
      s3,
      [
        {
          label: 'TAM (Total Addressable)',
          value: '$28B',
          desc: 'Thị trường phần mềm văn phòng toàn cầu',
        },
        {
          label: 'SAM (Serviceable Addressable)',
          value: '$4.2B',
          desc: 'Doanh nghiệp SME khu vực Đông Nam Á',
        },
        {
          label: 'SOM (Obtainable Market)',
          value: '$350M',
          desc: 'Mục tiêu 100.000 doanh nghiệp trả phí trong 3 năm',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: '818CF8',
        labelColor: '94A3B8',
      },
    );

    // Slide 4: Business Model
    const s4 = pres.addSlide();
    s4.background = { color: BG };
    this.addHeader(
      s4,
      '03 / MÔ HÌNH DOANH THU',
      'Gói Dịch Vụ SaaS B2B Bền Vững',
      ACCENT,
    );
    this.addMetricCards(
      pres,
      s4,
      [
        {
          label: 'STARTER',
          value: 'Miễn Phí',
          desc: '5 biểu mẫu cơ bản, xem trước trực quan khổ A4 & 16:9',
        },
        {
          label: 'PRO TEAM',
          value: '$15/tháng',
          desc: 'Không giới hạn tải DOCX/PPTX, lưu trữ đám mây riêng biệt',
        },
        {
          label: 'ENTERPRISE',
          value: 'Báo Giá',
          desc: 'Tùy chỉnh biểu mẫu theo thương hiệu, phân quyền RBAC & SSO',
        },
      ],
      {
        cardBg: CARD_BG,
        border: PRIMARY,
        valueColor: 'FFFFFF',
        labelColor: ACCENT,
      },
    );

    // Slide 5: The Ask
    const s5 = pres.addSlide();
    s5.background = { color: BG };
    this.addHeader(
      s5,
      '04 / KÊU GỌI ĐẦU TƯ',
      'Mục Tiêu Vòng Seed: $1,500,000 USD',
      ACCENT,
    );
    this.addCardRow(
      pres,
      s5,
      1.8,
      'R&D SẢN PHẨM',
      'Phát triển In-browser Editor & AI Template Assistant',
      '55% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: PRIMARY,
        badgeText: 'FFFFFF',
        statusColor: ACCENT,
      },
    );
    this.addCardRow(
      pres,
      s5,
      2.7,
      'GTM & MARKETING',
      'Tiếp thị số, hội thảo B2B & mạng lưới đối tác doanh nghiệp',
      '30% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: '475569',
        badgeText: 'FFFFFF',
        statusColor: ACCENT,
      },
    );
    this.addCardRow(
      pres,
      s5,
      3.6,
      'VẬN HÀNH & PHÁP LÝ',
      'Bảo mật chuẩn ISO 27001, dự phòng quỹ lương & bản quyền',
      '15% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: '334155',
        badgeText: 'CBD5E1',
        statusColor: '94A3B8',
      },
    );
  }

  // ==========================================
  // TEMPLATE 2: QUARTERLY REVIEW (Emerald theme)
  // ==========================================
  private buildQuarterlyReview(pres: pptxgen) {
    const BG = '022C22';
    const CARD_BG = '064E3B';
    const BORDER = '059669';
    const ACCENT = '34D399';
    const PRIMARY = '10B981';

    // Slide 1: Cover
    const s1 = pres.addSlide();
    s1.background = { color: BG };
    this.addPillBadge(
      pres,
      s1,
      0.8,
      0.8,
      2.0,
      0.38,
      'BÁO CÁO QUÝ',
      PRIMARY,
      '022C22',
    );
    s1.addText('QUARTERLY BUSINESS REVIEW', {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 0.8,
      fontSize: 38,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });
    s1.addText('Tổng Kết Kết Quả Hoạt Động & Định Hướng Q4/2026', {
      x: 0.8,
      y: 2.3,
      w: 8.4,
      h: 0.5,
      fontSize: 16,
      color: 'A7F3D0',
      fontFace: 'Arial',
    });
    this.addCardBox(pres, s1, 0.8, 3.4, 8.4, 1.2, CARD_BG, BORDER, [
      {
        text: 'Hội Đồng Quản Trị & Ban Điều Hành Doanh Nghiệp',
        bold: true,
        color: 'FFFFFF',
        size: 12,
      },
      {
        text: 'Tài liệu lưu hành nội bộ • Doanh nghiệp Công nghệ số • Ngày báo cáo: 30/10/2026',
        color: ACCENT,
        size: 11,
      },
    ]);

    // Slide 2: Financial Highlights
    const s2 = pres.addSlide();
    s2.background = { color: BG };
    this.addHeader(
      s2,
      '01 / TỔNG QUAN TÀI CHÍNH',
      'Chỉ Số Doanh Thu & Biên Lợi Nhuận Quý Q3/2026',
      ACCENT,
    );
    this.addMetricCards(
      pres,
      s2,
      [
        {
          label: 'DOANH THU THUẦN',
          value: '$2.4M',
          desc: '+108% so với kế hoạch quý ban hành',
        },
        {
          label: 'LỢI NHUẬN GỘP',
          value: '$1.68M',
          desc: 'Biên lợi nhuận gộp vững vàng đạt 70%',
        },
        {
          label: 'TỶ LỆ GIỮ CHÂN (NRR)',
          value: '124%',
          desc: 'Tăng trưởng doanh thu mở rộng từ khách hiện hữu',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: 'FFFFFF',
        labelColor: ACCENT,
      },
    );

    // Slide 3: OKRs Evaluation
    const s3 = pres.addSlide();
    s3.background = { color: BG };
    this.addHeader(
      s3,
      '02 / ĐÁNH GIÁ TIẾN ĐỘ OKRs',
      'Tiến Độ Mục Tiêu Trọng Điểm Toàn Công Ty',
      ACCENT,
    );
    this.addMetricCards(
      pres,
      s3,
      [
        {
          label: 'KHỐI CÔNG NGHỆ (R&D)',
          value: '92%',
          desc: 'Hoàn thành Monorepo & chuẩn hóa xuất DOCX/PPTX',
        },
        {
          label: 'KHỐI TĂNG TRƯỞNG (GROWTH)',
          value: '88%',
          desc: 'Đạt mốc 2.940 doanh nghiệp dùng thử sản phẩm',
        },
        {
          label: 'KHỐI VẬN HÀNH & PMO',
          value: '95%',
          desc: 'Quy trình kiểm thử tự động đạt độ tin cậy 100%',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: ACCENT,
        labelColor: 'A7F3D0',
      },
    );

    // Slide 4: Market Segmentation
    const s4 = pres.addSlide();
    s4.background = { color: BG };
    this.addHeader(
      s4,
      '03 / PHÂN TÍCH THỊ PHẦN',
      'Cơ Cấu Khách Hàng & Mức Độ Hài Lòng',
      ACCENT,
    );
    this.addMetricCards(
      pres,
      s4,
      [
        {
          label: 'DOANH NGHIỆP LỚN',
          value: '45%',
          desc: 'Đóng góp doanh thu chủ lực từ các tập đoàn',
        },
        {
          label: 'DOANH NGHIỆP VỪA (SME)',
          value: '35%',
          desc: 'Tốc độ ký mới hợp đồng tăng 40% theo quý',
        },
        {
          label: 'CHỈ SỐ NPS DỊCH VỤ',
          value: '72/100',
          desc: 'Khách hàng đánh giá rất cao trải nghiệm xem trước',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: 'FFFFFF',
        labelColor: ACCENT,
      },
    );

    // Slide 5: Next Quarter Goals
    const s5 = pres.addSlide();
    s5.background = { color: BG };
    this.addHeader(
      s5,
      '04 / KẾ HOẠCH & CHIẾN LƯỢC',
      'Mục Tiêu Trọng Điểm Quý Q4/2026 (OKRs)',
      ACCENT,
    );
    this.addCardRow(
      pres,
      s5,
      1.8,
      'MỤC TIÊU 1',
      'Đạt mốc 5.000 Khách Hàng Doanh Nghiệp (SMBs)',
      'Tiến độ: 68%',
      {
        cardBg: CARD_BG,
        border: PRIMARY,
        badgeBg: PRIMARY,
        badgeText: '022C22',
        statusColor: ACCENT,
      },
    );
    this.addCardRow(
      pres,
      s5,
      2.7,
      'MỤC TIÊU 2',
      'Nghiên cứu tích hợp Canvas Slide Editor trực tuyến (Fabric.js/WOPI)',
      'Đang thực hiện',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: '059669',
        badgeText: 'FFFFFF',
        statusColor: 'A7F3D0',
      },
    );
    this.addCardRow(
      pres,
      s5,
      3.6,
      'MỤC TIÊU 3',
      'Mở rộng thêm 200+ bộ mẫu trình chiếu chuẩn đa ngành nghề',
      'Kế hoạch Q4',
      {
        cardBg: CARD_BG,
        border: '047857',
        badgeBg: '047857',
        badgeText: 'FFFFFF',
        statusColor: 'A7F3D0',
      },
    );
  }

  // ==========================================
  // TEMPLATE 3: PRODUCT LAUNCH (Amber / Warm theme)
  // ==========================================
  private buildProductLaunch(pres: pptxgen) {
    const BG = '451A03';
    const CARD_BG = '78350F';
    const BORDER = 'B45309';
    const ACCENT = 'FDE68A';
    const PRIMARY = 'F59E0B';

    // Slide 1: Cover
    const s1 = pres.addSlide();
    s1.background = { color: BG };
    this.addPillBadge(
      pres,
      s1,
      0.8,
      0.8,
      2.2,
      0.38,
      'GTM STRATEGY',
      PRIMARY,
      '451A03',
    );
    s1.addText('PRODUCT LAUNCH 2026', {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 0.8,
      fontSize: 38,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });
    s1.addText('Chiến Lược Ra Mắt Sản Phẩm Mới & Chinh Phục Thị Trường', {
      x: 0.8,
      y: 2.3,
      w: 8.4,
      h: 0.5,
      fontSize: 16,
      color: ACCENT,
      fontFace: 'Arial',
    });
    this.addCardBox(pres, s1, 0.8, 3.4, 8.4, 1.2, CARD_BG, BORDER, [
      {
        text: 'Kế Hoạch Go-To-Market Toàn Diện Cho Bộ Ứng Dụng Văn Phòng',
        bold: true,
        color: 'FFFFFF',
        size: 12,
      },
      {
        text: 'Đồng bộ truyền thông, định giá sản phẩm và kích hoạt tăng trưởng 90 ngày',
        color: ACCENT,
        size: 11,
      },
    ]);

    // Slide 2: Target Audience
    const s2 = pres.addSlide();
    s2.background = { color: BG };
    this.addHeader(
      s2,
      '01 / CHÂN DUNG KHÁCH HÀNG',
      'Đối Tượng Mục Tiêu & Nhu Cầu Cốt Lõi',
      PRIMARY,
    );
    this.addCardBox(pres, s2, 0.8, 1.8, 4.0, 3.0, CARD_BG, BORDER, [
      {
        text: 'NHÓM KHỞI NGHIỆP (STARTUPS)',
        bold: true,
        color: PRIMARY,
        size: 13,
      },
      {
        text: '• Cần bộ Pitch Deck và hợp đồng lao động chuẩn quốc tế.',
        color: 'FFFFFF',
        size: 12,
      },
      {
        text: '• Ưu tiên giải pháp tinh gọn, dùng ngay, không cần cài đặt phần mềm.',
        color: ACCENT,
        size: 12,
      },
    ]);
    this.addCardBox(pres, s2, 5.2, 1.8, 4.0, 3.0, CARD_BG, BORDER, [
      {
        text: 'KHỐI VẬN HÀNH (PMO & HR)',
        bold: true,
        color: PRIMARY,
        size: 13,
      },
      {
        text: '• Cần chuẩn hóa thư viện mẫu biểu đơn từ, biên bản họp nội bộ.',
        color: 'FFFFFF',
        size: 12,
      },
      {
        text: '• Bảo toàn file gốc, ngăn chặn rủi ro ghi đè dữ liệu phòng ban.',
        color: ACCENT,
        size: 12,
      },
    ]);

    // Slide 3: GTM Pillars
    const s3 = pres.addSlide();
    s3.background = { color: BG };
    this.addHeader(
      s3,
      '02 / TRỤ CỘT CHIẾN LƯỢC',
      'Khung Kế Hoạch Ra Mắt Sản Phẩm',
      PRIMARY,
    );
    this.addMetricCards(
      pres,
      s3,
      [
        {
          label: 'TRUYỀN THÔNG (AWARENESS)',
          value: 'Hội Thảo Tech',
          desc: 'Ra mắt tại các sự kiện công nghệ lớn & tech demo trực tiếp',
        },
        {
          label: 'CHUYỂN ĐỔI (CONVERSION)',
          value: 'Trải Nghiệm 0đ',
          desc: 'Mở quyền dùng thử miễn phí 5 biểu mẫu văn phòng chuẩn',
        },
        {
          label: 'DUY TRÌ (RETENTION)',
          value: 'Hỗ Trợ 24/7',
          desc: 'Cập nhật mẫu mới hàng tuần theo các thông tư, quy định mới',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: 'FFFFFF',
        labelColor: ACCENT,
      },
    );

    // Slide 4: Marketing Channels
    const s4 = pres.addSlide();
    s4.background = { color: BG };
    this.addHeader(
      s4,
      '03 / PHÂN BỔ KÊNH TIẾP CẬN',
      'Tối Ưu Ngân Sách Tiếp Thị Đa Kênh',
      PRIMARY,
    );
    this.addCardRow(
      pres,
      s4,
      1.8,
      'CONTENT & SEO',
      'Tài liệu hướng dẫn nghiệp vụ, bài viết chuyên sâu & cẩm nang quản trị',
      '45% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: PRIMARY,
        badgeText: '451A03',
        statusColor: ACCENT,
      },
    );
    this.addCardRow(
      pres,
      s4,
      2.7,
      'PERFORMANCE ADS',
      'Quảng cáo nhắm mục tiêu LinkedIn B2B, Google Search & Meta',
      '35% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: '92400E',
        badgeText: 'FFFFFF',
        statusColor: ACCENT,
      },
    );
    this.addCardRow(
      pres,
      s4,
      3.6,
      'PARTNERSHIP',
      'Liên kết các vườn ươm khởi nghiệp, hiệp hội doanh nghiệp vừa & nhỏ',
      '20% Ngân sách',
      {
        cardBg: CARD_BG,
        border: BORDER,
        badgeBg: '78350F',
        badgeText: 'FFFFFF',
        statusColor: ACCENT,
      },
    );

    // Slide 5: Launch Timeline
    const s5 = pres.addSlide();
    s5.background = { color: BG };
    this.addHeader(
      s5,
      '04 / LỘ TRÌNH TRIỂN KHAI',
      'Kế Hoạch Hành Động 90 Ngày Đầu',
      PRIMARY,
    );
    this.addMetricCards(
      pres,
      s5,
      [
        {
          label: 'THÁNG 1: BETA LAUNCH',
          value: '1.000 User',
          desc: 'Kiểm thử khép kín với 50 doanh nghiệp đối tác chiến lược',
        },
        {
          label: 'THÁNG 2: OFFICIAL GO-LIVE',
          value: '10.000 User',
          desc: 'Công bố rộng rãi trên Product Hunt, báo chí & mạng xã hội',
        },
        {
          label: 'THÁNG 3: MONETIZATION',
          value: '500 Khách Trả Phí',
          desc: 'Kích hoạt cổng thanh toán các gói Pro Team & Enterprise',
        },
      ],
      {
        cardBg: CARD_BG,
        border: BORDER,
        valueColor: ACCENT,
        labelColor: 'FFFFFF',
      },
    );
  }

  // ==========================================
  // HELPER METHODS FOR DRAWING SHAPES & CARDS
  // ==========================================
  private addHeader(
    slide: pptxgen.Slide,
    category: string,
    title: string,
    accentColor: string,
  ) {
    slide.addText(category, {
      x: 0.8,
      y: 0.5,
      w: 8.4,
      h: 0.3,
      fontSize: 11,
      color: accentColor,
      bold: true,
      fontFace: 'Arial',
    });
    slide.addText(title, {
      x: 0.8,
      y: 0.85,
      w: 8.4,
      h: 0.6,
      fontSize: 24,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });
  }

  private addPillBadge(
    pres: pptxgen,
    slide: pptxgen.Slide,
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    bgColor: string,
    textColor: string,
  ) {
    slide.addShape(pres.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      fill: { color: bgColor },
      rectRadius: 0.15,
    });
    slide.addText(text, {
      x,
      y,
      w,
      h,
      fontSize: 11,
      bold: true,
      color: textColor,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial',
    });
  }

  private addCardBox(
    pres: pptxgen,
    slide: pptxgen.Slide,
    x: number,
    y: number,
    w: number,
    h: number,
    bgColor: string,
    borderColor: string,
    lines: { text: string; bold?: boolean; color: string; size: number }[],
  ) {
    slide.addShape(pres.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      fill: { color: bgColor },
      line: { color: borderColor, width: 1.5 },
      rectRadius: 0.1,
    });

    let textY = y + 0.2;
    for (const l of lines) {
      slide.addText(l.text, {
        x: x + 0.3,
        y: textY,
        w: w - 0.6,
        h: 0.4,
        fontSize: l.size,
        bold: l.bold,
        color: l.color,
        fontFace: 'Arial',
      });
      textY += 0.45;
    }
  }

  private addCardRow(
    pres: pptxgen,
    slide: pptxgen.Slide,
    y: number,
    badgeText: string,
    mainText: string,
    statusText: string,
    colors: {
      cardBg: string;
      border: string;
      badgeBg: string;
      badgeText: string;
      statusColor: string;
    },
  ) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: 8.4,
      h: 0.75,
      fill: { color: colors.cardBg },
      line: { color: colors.border, width: 1.5 },
      rectRadius: 0.08,
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: y + 0.18,
      w: 1.6,
      h: 0.38,
      fill: { color: colors.badgeBg },
      rectRadius: 0.05,
    });
    slide.addText(badgeText, {
      x: 1.0,
      y: y + 0.18,
      w: 1.6,
      h: 0.38,
      fontSize: 10,
      bold: true,
      color: colors.badgeText,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial',
    });

    slide.addText(mainText, {
      x: 2.8,
      y: y + 0.18,
      w: 4.3,
      h: 0.38,
      fontSize: 12,
      bold: true,
      color: 'FFFFFF',
      valign: 'middle',
      fontFace: 'Arial',
    });

    slide.addText(statusText, {
      x: 7.2,
      y: y + 0.18,
      w: 1.8,
      h: 0.38,
      fontSize: 12,
      bold: true,
      color: colors.statusColor,
      align: 'right',
      valign: 'middle',
      fontFace: 'Arial',
    });
  }

  private addMetricCards(
    pres: pptxgen,
    slide: pptxgen.Slide,
    cards: { label: string; value: string; desc: string }[],
    colors: {
      cardBg: string;
      border: string;
      valueColor: string;
      labelColor: string;
    },
  ) {
    const cardW = 2.6;
    const gap = 0.3;
    const startX = 0.8;
    const y = 1.8;
    const cardH = 2.4;

    cards.forEach((c, idx) => {
      const x = startX + idx * (cardW + gap);
      slide.addShape(pres.ShapeType.roundRect, {
        x,
        y,
        w: cardW,
        h: cardH,
        fill: { color: colors.cardBg },
        line: { color: colors.border, width: 1.5 },
        rectRadius: 0.1,
      });

      slide.addText(c.label, {
        x: x + 0.2,
        y: y + 0.25,
        w: cardW - 0.4,
        h: 0.4,
        fontSize: 10,
        bold: true,
        color: colors.labelColor,
        fontFace: 'Arial',
      });

      slide.addText(c.value, {
        x: x + 0.2,
        y: y + 0.65,
        w: cardW - 0.4,
        h: 0.8,
        fontSize: 26,
        bold: true,
        color: colors.valueColor,
        fontFace: 'Arial',
      });

      slide.addText(c.desc, {
        x: x + 0.2,
        y: y + 1.45,
        w: cardW - 0.4,
        h: 0.8,
        fontSize: 11,
        color: 'E2E8F0',
        fontFace: 'Arial',
      });
    });
  }
}

export const pptxGeneratorService = new PptxGeneratorService();
