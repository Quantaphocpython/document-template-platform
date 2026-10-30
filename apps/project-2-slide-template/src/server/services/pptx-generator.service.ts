import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import { storageService } from './storage.service';
import { INITIAL_SLIDE_TEMPLATES } from '@/data/templates';

class PptxGeneratorService {
  /**
   * Ensure standard master PPTX template files exist on disk.
   */
  public async ensureTemplateFilesExist(): Promise<void> {
    const templatesDir = storageService.getTemplatesDir();

    for (const tpl of INITIAL_SLIDE_TEMPLATES) {
      const filePath = path.join(templatesDir, tpl.pptxFileName);
      if (!fs.existsSync(filePath)) {
        await this.generateTemplateFile(tpl.id, filePath);
      }
    }
  }

  private async generateTemplateFile(templateId: string, destPath: string): Promise<void> {
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    if (templateId === 'tpl-pitch-deck-investor') {
      // Slide 1: Cover
      const s1 = pres.addSlide();
      s1.background = { color: '0F172A' };
      s1.addText('SERIES SEED • $1.5M', { x: 0.8, y: 0.8, fontSize: 11, color: '818CF8', bold: true });
      s1.addText('NEXUS AI CLOUD', { x: 0.8, y: 1.6, fontSize: 38, color: 'FFFFFF', bold: true });
      s1.addText('Nền Tảng Tự Động Hóa Quản Trị Văn Phòng Thông Minh', { x: 0.8, y: 2.3, fontSize: 16, color: '94A3B8' });
      s1.addText('Trần Hoàng Quân - Founder & CEO', { x: 0.8, y: 4.5, fontSize: 12, color: 'CBD5E1' });

      // Slide 2: Problem & Solution
      const s2 = pres.addSlide();
      s2.background = { color: '0F172A' };
      s2.addText('01 / VẤN ĐỀ & GIẢI PHÁP', { x: 0.8, y: 0.6, fontSize: 11, color: '818CF8', bold: true });
      s2.addText('Nỗi Đau Thị Trường & Giải Pháp Đột Phá', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s2.addText('Vấn Đề: 35% thời gian nhân sự bị lãng phí do thiếu biểu mẫu tập trung, rủi ro sửa nhầm file gốc.', { x: 0.8, y: 1.8, w: 5.5, fontSize: 13, color: 'F87171' });
      s2.addText('Giải Pháp: Hệ thống Thư viện biểu mẫu với cơ chế Copy-on-Create an toàn tuyệt đối, xuất DOCX/PPTX chuẩn.', { x: 0.8, y: 3.0, w: 5.5, fontSize: 13, color: 'A5B4FC' });

      // Slide 3: Market Size
      const s3 = pres.addSlide();
      s3.background = { color: '0F172A' };
      s3.addText('02 / QUY MÔ THỊ TRƯỜNG', { x: 0.8, y: 0.6, fontSize: 11, color: '818CF8', bold: true });
      s3.addText('Cơ Hội Thị Trường TAM - SAM - SOM', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s3.addText('TAM: $28B (Phần mềm văn phòng toàn cầu)\nSAM: $4.2B (Doanh nghiệp SME Đông Nam Á)\nSOM: $350M (Mục tiêu 100.000 doanh nghiệp trả phí)', { x: 0.8, y: 2.0, fontSize: 15, color: 'FFFFFF', lineSpacing: 26 });

      // Slide 4: Business Model
      const s4 = pres.addSlide();
      s4.background = { color: '0F172A' };
      s4.addText('03 / MÔ HÌNH DOANH THU', { x: 0.8, y: 0.6, fontSize: 11, color: '818CF8', bold: true });
      s4.addText('Gói Dịch Vụ SaaS B2B Bền Vững', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s4.addText('Starter: Miễn phí (5 mẫu cơ bản)\nPro Team: $15/tháng (500+ mẫu, export DOCX/PPTX)\nEnterprise: Báo giá theo quy mô (Private storage, SSO)', { x: 0.8, y: 2.0, fontSize: 14, color: 'CBD5E1', lineSpacing: 24 });

      // Slide 5: The Ask
      const s5 = pres.addSlide();
      s5.background = { color: '0F172A' };
      s5.addText('04 / KÊU GỌI ĐẦU TƯ', { x: 0.8, y: 0.6, fontSize: 11, color: '818CF8', bold: true });
      s5.addText('Mục Tiêu Vòng Seed: $1,500,000 USD', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s5.addText('Phân bổ nguồn vốn:\n• 55% Phát triển R&D sản phẩm\n• 30% Tiếp thị & Bán hàng (GTM)\n• 15% Dự phòng vận hành & Pháp lý', { x: 0.8, y: 2.0, fontSize: 14, color: 'A5B4FC', lineSpacing: 24 });

    } else if (templateId === 'tpl-quarterly-review') {
      // Slide 1: Cover
      const s1 = pres.addSlide();
      s1.background = { color: '022C22' };
      s1.addText('BÁO CÁO KINH DOANH ĐỊNH KỲ', { x: 0.8, y: 0.8, fontSize: 11, color: '34D399', bold: true });
      s1.addText('BUSINESS QUARTERLY REVIEW', { x: 0.8, y: 1.6, fontSize: 36, color: 'FFFFFF', bold: true });
      s1.addText('Tổng Kết Kết Quả Hoạt Động & Định Hướng Quý Q4/2026', { x: 0.8, y: 2.3, fontSize: 16, color: 'A7F3D0' });

      // Slide 2: Executive Summary
      const s2 = pres.addSlide();
      s2.background = { color: '022C22' };
      s2.addText('01 / TỔNG QUAN', { x: 0.8, y: 0.6, fontSize: 11, color: '34D399', bold: true });
      s2.addText('Tóm Tắt Điểm Sáng Trong Kỳ', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s2.addText('• Tăng trưởng khách hàng: +145% (Đạt 2.940 doanh nghiệp trả phí)\n• Doanh thu ARR: $2.4M (Đạt 108% kế hoạch quý)\n• Tỷ lệ giữ chân NRR: 124%', { x: 0.8, y: 2.0, fontSize: 14, color: 'FFFFFF', lineSpacing: 24 });

      // Slide 3: Financials
      const s3 = pres.addSlide();
      s3.background = { color: '022C22' };
      s3.addText('02 / TÀI CHÍNH', { x: 0.8, y: 0.6, fontSize: 11, color: '34D399', bold: true });
      s3.addText('Biên Lợi Nhuận Gộp & Dòng Tiền', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s3.addText('Biên lợi nhuận gộp đạt 82.4% nhờ tối ưu hóa chi phí đám mây và tự động hóa quy trình.', { x: 0.8, y: 2.0, fontSize: 14, color: 'A7F3D0' });

      // Slide 4: Ops
      const s4 = pres.addSlide();
      s4.background = { color: '022C22' };
      s4.addText('03 / VẬN HÀNH', { x: 0.8, y: 0.6, fontSize: 11, color: '34D399', bold: true });
      s4.addText('Độ Tin Cậy Hệ Thống Uptime 99.99%', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s4.addText('Hệ thống xử lý hơn 1.2 triệu lượt tải tài liệu và tạo mẫu mới mà không ghi nhận bất kỳ sự cố gián đoạn nào.', { x: 0.8, y: 2.0, fontSize: 14, color: 'FFFFFF' });

      // Slide 5: Next Steps
      const s5 = pres.addSlide();
      s5.background = { color: '022C22' };
      s5.addText('04 / KẾ HOẠCH', { x: 0.8, y: 0.6, fontSize: 11, color: '34D399', bold: true });
      s5.addText('Mục Tiêu Trọng Điểm Quý Tiếp Theo', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s5.addText('• Đạt mốc 5.000 khách hàng doanh nghiệp trả phí.\n• Thử nghiệm tích hợp trình biên tập slide Canvas trực tuyến.\n• Bổ sung 200+ bộ mẫu thuyết trình chuyên ngành.', { x: 0.8, y: 2.0, fontSize: 14, color: 'A7F3D0', lineSpacing: 24 });

    } else {
      // Product launch
      const s1 = pres.addSlide();
      s1.background = { color: '451A03' };
      s1.addText('GO-TO-MARKET STRATEGY', { x: 0.8, y: 0.8, fontSize: 11, color: 'F59E0B', bold: true });
      s1.addText('PRODUCT LAUNCH 2026', { x: 0.8, y: 1.6, fontSize: 36, color: 'FFFFFF', bold: true });
      s1.addText('Chiến Lược Ra Mắt Sản Phẩm Mới & Chinh Phục Thị Trường', { x: 0.8, y: 2.3, fontSize: 16, color: 'FDE68A' });

      const s2 = pres.addSlide();
      s2.background = { color: '451A03' };
      s2.addText('01 / CHÂN DUNG KHÁCH HÀNG', { x: 0.8, y: 0.6, fontSize: 11, color: 'F59E0B', bold: true });
      s2.addText('Đối Tượng Mục Tiêu Trọng Tâm', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s2.addText('• Nhóm 1: Founders khởi nghiệp cần biểu mẫu gọi vốn & pháp lý chuyên nghiệp.\n• Nhóm 2: Quản lý vận hành (PMO, HR) cần thư viện mẫu nội bộ chuẩn hóa.', { x: 0.8, y: 2.0, fontSize: 14, color: 'FFFFFF', lineSpacing: 24 });

      const s3 = pres.addSlide();
      s3.background = { color: '451A03' };
      s3.addText('02 / KÊNH TIẾP THỊ', { x: 0.8, y: 0.6, fontSize: 11, color: 'F59E0B', bold: true });
      s3.addText('Phân Bổ Kênh Tiếp Cận Đa Điểm Chạm', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s3.addText('• 45% Content Marketing & SEO\n• 35% Performance Ads (LinkedIn, Google)\n• 20% Partnership & Cộng đồng khởi nghiệp', { x: 0.8, y: 2.0, fontSize: 14, color: 'FDE68A', lineSpacing: 24 });

      const s4 = pres.addSlide();
      s4.background = { color: '451A03' };
      s4.addText('03 / LỘ TRÌNH', { x: 0.8, y: 0.6, fontSize: 11, color: 'F59E0B', bold: true });
      s4.addText('3 Giai Đoạn Triển Khai', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s4.addText('Giai đoạn 1 (Beta) -> Giai đoạn 2 (Launch chính thức) -> Giai đoạn 3 (Scale khu vực)', { x: 0.8, y: 2.0, fontSize: 14, color: 'FFFFFF' });

      const s5 = pres.addSlide();
      s5.background = { color: '451A03' };
      s5.addText('04 / CHỈ SỐ THÀNH CÔNG', { x: 0.8, y: 0.6, fontSize: 11, color: 'F59E0B', bold: true });
      s5.addText('Mục Tiêu 90 Ngày Đầu', { x: 0.8, y: 1.0, fontSize: 24, color: 'FFFFFF', bold: true });
      s5.addText('• 50.000+ người dùng đăng ký mới.\n• Tỷ lệ chuyển đổi trả phí 6.8%.\n• ROAS đạt 3.5x.', { x: 0.8, y: 2.0, fontSize: 14, color: 'FDE68A', lineSpacing: 24 });
    }

    await pres.writeFile({ fileName: destPath });
  }
}

export const pptxGeneratorService = new PptxGeneratorService();

