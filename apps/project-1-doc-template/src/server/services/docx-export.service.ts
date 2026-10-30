import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { UserDocument } from '@/types';

class DocxExportService {
  /**
   * Generate a valid DOCX buffer from a UserDocument.
   */
  public async generateDocxBuffer(document: UserDocument): Promise<Buffer> {
    const paragraphs: (Paragraph | Table)[] = [];

    // Document Main Title Header
    paragraphs.push(
      new Paragraph({
        text: document.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
      })
    );

    // Metadata line
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `Tài liệu tạo từ mẫu: ${document.clonedFromTemplateTitle} | Ngày: ${new Date(document.updatedAt).toLocaleDateString('vi-VN')}`,
            italics: true,
            size: 18, // 9pt
            color: '64748B',
          }),
        ],
      })
    );

    // Parse HTML content into Paragraphs
    const parsedElements = this.parseHtmlToDocxElements(document.contentHtml);
    paragraphs.push(...parsedElements);

    // Build Word Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  /**
   * Helper to parse simplified HTML structure into docx Paragraphs and Tables
   */
  private parseHtmlToDocxElements(html: string): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];
    if (!html) return elements;

    // Clean up html and extract blocks
    const cleanedHtml = html.replace(/\r?\n/g, ' ');

    // Extract table blocks or standard paragraphs
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const segments: { type: 'table' | 'html'; content: string }[] = [];

    let tableMatch;
    let currentIdx = 0;
    while ((tableMatch = tableRegex.exec(cleanedHtml)) !== null) {
      if (tableMatch.index > currentIdx) {
        segments.push({
          type: 'html',
          content: cleanedHtml.substring(currentIdx, tableMatch.index),
        });
      }
      segments.push({
        type: 'table',
        content: tableMatch[1],
      });
      currentIdx = tableMatch.index + tableMatch[0].length;
    }
    if (currentIdx < cleanedHtml.length) {
      segments.push({
        type: 'html',
        content: cleanedHtml.substring(currentIdx),
      });
    }

    for (const seg of segments) {
      if (seg.type === 'table') {
        const table = this.parseHtmlTable(seg.content);
        if (table) elements.push(table);
      } else {
        const blockMatches = seg.content.matchAll(/<(h[1-3]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi);
        let foundAny = false;
        for (const m of blockMatches) {
          foundAny = true;
          const tagName = m[1].toLowerCase();
          const innerContent = m[2];
          const textRuns = this.extractTextRuns(innerContent);

          if (tagName === 'h1') {
            elements.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 300, after: 120 },
                children: textRuns,
              })
            );
          } else if (tagName === 'h2') {
            elements.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 240, after: 100 },
                children: textRuns,
              })
            );
          } else if (tagName === 'h3') {
            elements.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 180, after: 80 },
                children: textRuns,
              })
            );
          } else if (tagName === 'li') {
            elements.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 60, after: 60 },
                children: textRuns,
              })
            );
          } else {
            elements.push(
              new Paragraph({
                spacing: { before: 100, after: 100 },
                children: textRuns,
              })
            );
          }
        }

        // If no HTML block tags found, fallback to plaintext paragraphs
        if (!foundAny) {
          const plainText = seg.content.replace(/<[^>]*>/g, '').trim();
          if (plainText) {
            elements.push(
              new Paragraph({
                children: [new TextRun(plainText)],
                spacing: { before: 100, after: 100 },
              })
            );
          }
        }
      }
    }

    return elements;
  }

  /**
   * Convert table HTML rows and cells into docx Table
   */
  private parseHtmlTable(tableInnerHtml: string): Table | null {
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const tableRows: TableRow[] = [];

    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableInnerHtml)) !== null) {
      const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
      const cells: TableCell[] = [];
      let cellMatch;

      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        const isHeader = cellMatch[1].toLowerCase() === 'th';
        const rawCellContent = cellMatch[2].replace(/<[^>]*>/g, '').trim();

        cells.push(
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: rawCellContent,
                    bold: isHeader,
                    size: 20, // 10pt
                  }),
                ],
              }),
            ],
            shading: isHeader ? { fill: 'F1F5F9' } : undefined,
          })
        );
      }

      if (cells.length > 0) {
        tableRows.push(new TableRow({ children: cells }));
      }
    }

    if (tableRows.length === 0) return null;

    return new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    });
  }

  /**
   * Parse inline tags: strong/b, em/i, u
   */
  private extractTextRuns(htmlContent: string): TextRun[] {
    const runs: TextRun[] = [];
    const plain = htmlContent.replace(/&nbsp;/g, ' ');

    // Simple parser for <strong> and <em>
    const regex = /(<strong>|<b>|<em>|<i>|<u>)([\s\S]*?)<\/\1>|([^<]+)/gi;
    let match;

    while ((match = regex.exec(plain)) !== null) {
      if (match[1]) {
        const tag = match[1].toLowerCase();
        const text = match[2].replace(/<[^>]*>/g, '');
        runs.push(
          new TextRun({
            text,
            bold: tag.includes('strong') || tag.includes('b'),
            italics: tag.includes('em') || tag.includes('i'),
            underline: tag.includes('u') ? {} : undefined,
          })
        );
      } else if (match[3]) {
        runs.push(new TextRun(match[3]));
      }
    }

    if (runs.length === 0) {
      const fallbackText = plain.replace(/<[^>]*>/g, '').trim();
      if (fallbackText) {
        runs.push(new TextRun(fallbackText));
      }
    }

    return runs;
  }
}

export const docxExportService = new DocxExportService();
