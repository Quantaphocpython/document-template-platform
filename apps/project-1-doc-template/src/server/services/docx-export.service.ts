import {
  AlignmentType,
  BorderStyle,
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
import { decode } from 'html-entities';
import { UserDocument } from '@/types';

const DOCUMENT_FONT = 'Times New Roman';
const PRINTABLE_WIDTH_DXA = 8500; // Standard printable width on A4 page with 2.5cm/2cm margins

export class DocxExportService {
  /**
   * Generate a valid DOCX buffer from a UserDocument.
   * Complies with Vietnamese standard administrative typography (Nghị định 30/2020/NĐ-CP).
   * Decodes all HTML entities and prevents tag leakages.
   */
  public async generateDocxBuffer(document: UserDocument): Promise<Buffer> {
    const paragraphs: (Paragraph | Table)[] = [];

    // Parse HTML content into Paragraphs and Tables (WYSIWYG matching editor exactly)
    const parsedElements = this.parseHtmlToDocxElements(document.contentHtml);
    paragraphs.push(...parsedElements);

    // Build Word Document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: DOCUMENT_FONT,
              size: 26, // 13pt
              color: '171717',
            },
            paragraph: {
              spacing: { line: 360, before: 60, after: 60 },
            },
          },
          heading1: {
            run: {
              font: DOCUMENT_FONT,
              size: 34,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          heading2: {
            run: {
              font: DOCUMENT_FONT,
              size: 28,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 200, after: 100 },
            },
          },
          heading3: {
            run: {
              font: DOCUMENT_FONT,
              size: 26,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 160, after: 80 },
            },
          },
        },
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: DOCUMENT_FONT,
              size: 34,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: DOCUMENT_FONT,
              size: 28,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 200, after: 100 },
            },
          },
          {
            id: 'Heading3',
            name: 'Heading 3',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: DOCUMENT_FONT,
              size: 26,
              bold: true,
              color: '171717',
            },
            paragraph: {
              spacing: { before: 160, after: 80 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 2.54 cm
                bottom: 1440,
                left: 1700, // ~3 cm
                right: 1134, // ~2 cm
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Clean and decode HTML entities, normalize to Unicode NFC
   */
  private decodeHtml(text: string): string {
    if (!text) return '';
    return decode(text)
      .replace(/&nbsp;/g, ' ')
      .normalize('NFC');
  }

  /**
   * Parse inline color from CSS style string
   */
  private extractInlineColor(styleStr?: string): string | undefined {
    if (!styleStr) return undefined;
    const match = styleStr.match(/color:\s*#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/i);
    return match ? match[1].toUpperCase() : undefined;
  }

  /**
   * Parse text-align from CSS style string
   */
  private parseAlignment(styleStr?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
    if (!styleStr) return AlignmentType.LEFT;
    const lower = styleStr.toLowerCase();
    if (lower.includes('text-align: center') || lower.includes('text-align:center')) {
      return AlignmentType.CENTER;
    }
    if (lower.includes('text-align: right') || lower.includes('text-align:right')) {
      return AlignmentType.RIGHT;
    }
    if (lower.includes('text-align: justify') || lower.includes('text-align:justify')) {
      return AlignmentType.JUSTIFIED;
    }
    return AlignmentType.LEFT;
  }

  /**
   * Split HTML into top-level blocks: tables, headings, paragraphs, lists
   */
  private parseHtmlToDocxElements(html: string): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];
    if (!html) return elements;

    const normalizedHtml = html.normalize('NFC').replace(/\r?\n/g, ' ');

    // Match top-level blocks: <table>, <h1-h6>, <p>, <li>, <blockquote>
    const blockRegex = /<table[^>]*>[\s\S]*?<\/table>|<(h[1-6]|p|li|blockquote)([^>]*)>([\s\S]*?)<\/\1>/gi;
    let match;

    while ((match = blockRegex.exec(normalizedHtml)) !== null) {
      const fullMatch = match[0];

      if (fullMatch.toLowerCase().startsWith('<table')) {
        const table = this.parseHtmlTable(fullMatch);
        if (table) elements.push(table);
      } else {
        const tagName = (match[1] || '').toLowerCase();
        const tagAttributes = match[2] || '';
        const innerHtml = match[3] || '';

        const alignment = this.parseAlignment(tagAttributes);
        const explicitColor = this.extractInlineColor(tagAttributes);
        const defaultTextColor = explicitColor || '171717';

        if (tagName === 'h1') {
          elements.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment,
              spacing: { before: 240, after: 120 },
              children: this.extractTextRuns(innerHtml, {
                bold: true,
                size: 34, // 17pt
                color: defaultTextColor,
              }),
            })
          );
        } else if (tagName === 'h2') {
          elements.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              alignment,
              spacing: { before: 200, after: 100 },
              children: this.extractTextRuns(innerHtml, {
                bold: true,
                size: 28, // 14pt
                color: defaultTextColor,
              }),
            })
          );
        } else if (tagName === 'h3') {
          elements.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_3,
              alignment,
              spacing: { before: 160, after: 80 },
              children: this.extractTextRuns(innerHtml, {
                bold: true,
                size: 26, // 13pt
                color: defaultTextColor,
              }),
            })
          );
        } else if (tagName === 'li') {
          elements.push(
            new Paragraph({
              bullet: { level: 0 },
              alignment,
              spacing: { before: 40, after: 40 },
              children: this.extractTextRuns(innerHtml, {
                color: defaultTextColor,
              }),
            })
          );
        } else if (tagName === 'blockquote') {
          elements.push(
            new Paragraph({
              indent: { left: 720 },
              alignment,
              spacing: { before: 100, after: 100 },
              children: this.extractTextRuns(innerHtml, {
                italics: true,
                color: defaultTextColor,
              }),
            })
          );
        } else {
          // Standard Paragraph <p>
          elements.push(
            new Paragraph({
              alignment,
              spacing: { before: 60, after: 60 },
              children: this.extractTextRuns(innerHtml, {
                color: defaultTextColor,
              }),
            })
          );
        }
      }
    }

    // Fallback if no block tags matched
    if (elements.length === 0 && normalizedHtml.trim()) {
      const plainText = this.decodeHtml(normalizedHtml.replace(/<[^>]*>/g, '').trim());
      if (plainText) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: plainText,
                font: DOCUMENT_FONT,
                size: 26,
              }),
            ],
          })
        );
      }
    }

    return elements;
  }

  /**
   * Convert table HTML rows and cells into docx Table with accurate column widths
   */
  private parseHtmlTable(tableHtml: string): Table | null {
    const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    if (rowMatches.length === 0) return null;

    // Detect column widths from the first row
    const firstRowCells = [...rowMatches[0][1].matchAll(/<(td|th)([^>]*)>([\s\S]*?)<\/\1>/gi)];
    const colCount = firstRowCells.length;
    if (colCount === 0) return null;

    const colWidths: number[] = [];
    const colPercentages: (number | null)[] = [];
    let specifiedPercentageSum = 0;

    for (const cell of firstRowCells) {
      const attr = cell[2];
      const widthMatch = attr.match(/width:\s*(\d+)%/i) || attr.match(/width="(\d+)%"/i);
      if (widthMatch) {
        const pct = parseInt(widthMatch[1], 10);
        colPercentages.push(pct);
        specifiedPercentageSum += pct;
      } else {
        colPercentages.push(null);
      }
    }

    for (let i = 0; i < colCount; i++) {
      const pct = colPercentages[i];
      if (pct && specifiedPercentageSum > 0) {
        const ratio = pct / (specifiedPercentageSum >= 90 ? specifiedPercentageSum : 100);
        colWidths.push(Math.round(PRINTABLE_WIDTH_DXA * ratio));
      } else {
        colWidths.push(Math.round(PRINTABLE_WIDTH_DXA / colCount));
      }
    }

    const tableRows: TableRow[] = [];

    for (let rIdx = 0; rIdx < rowMatches.length; rIdx++) {
      const rowHtml = rowMatches[rIdx][1];
      const cellMatches = [...rowHtml.matchAll(/<(td|th)([^>]*)>([\s\S]*?)<\/\1>/gi)];
      const cells: TableCell[] = [];

      for (let cIdx = 0; cIdx < cellMatches.length; cIdx++) {
        const cell = cellMatches[cIdx];
        const isHeader = cell[1].toLowerCase() === 'th';
        const cellAttr = cell[2];
        const cellContent = cell[3];
        const cellAlign = this.parseAlignment(cellAttr);
        const cellTextColor = this.extractInlineColor(cellAttr) || '171717';
        const colWidth = colWidths[cIdx] || Math.round(PRINTABLE_WIDTH_DXA / colCount);

        const runs = this.extractTextRuns(cellContent, {
          bold: isHeader,
          size: isHeader ? 22 : 20, // 11pt header, 10pt cell
          color: cellTextColor,
        });

        cells.push(
          new TableCell({
            width: { size: colWidth, type: WidthType.DXA },
            shading: isHeader ? { fill: 'F1F5F9' } : undefined,
            margins: {
              top: 100, // ~5pt
              bottom: 100,
              left: 140, // ~7pt
              right: 140,
            },
            children: [
              new Paragraph({
                alignment: cellAlign,
                spacing: { before: 30, after: 30 },
                children: runs,
              }),
            ],
          })
        );
      }

      if (cells.length > 0) {
        tableRows.push(
          new TableRow({
            tableHeader: rIdx === 0,
            children: cells,
          })
        );
      }
    }

    if (tableRows.length === 0) return null;

    return new Table({
      width: { size: PRINTABLE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: colWidths,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      },
      rows: tableRows,
    });
  }

  /**
   * Tokenize HTML inline elements (strong/b, em/i, u, s, span color) and output TextRuns
   */
  private extractTextRuns(
    htmlContent: string,
    baseOptions: {
      bold?: boolean;
      italics?: boolean;
      underline?: boolean;
      strike?: boolean;
      size?: number;
      color?: string;
    } = {}
  ): TextRun[] {
    const runs: TextRun[] = [];
    const tokens = htmlContent.split(/(<[^>]+>)/g);

    let isBold = Boolean(baseOptions.bold);
    let isItalic = Boolean(baseOptions.italics);
    let isUnderline = Boolean(baseOptions.underline);
    let isStrike = Boolean(baseOptions.strike);
    let currentColor = baseOptions.color || '171717';

    for (const token of tokens) {
      if (!token) continue;

      if (token.startsWith('<')) {
        const lower = token.toLowerCase();

        // Bold tags
        if (lower.startsWith('<strong') || lower.startsWith('<b ') || lower === '<b>') {
          isBold = true;
        } else if (lower.startsWith('</strong') || lower.startsWith('</b')) {
          isBold = false;
        }
        // Italic tags
        else if (lower.startsWith('<em') || lower.startsWith('<i ') || lower === '<i>') {
          isItalic = true;
        } else if (lower.startsWith('</em') || lower.startsWith('</i')) {
          isItalic = false;
        }
        // Underline tags
        else if (lower.startsWith('<u ') || lower === '<u>') {
          isUnderline = true;
        } else if (lower.startsWith('</u')) {
          isUnderline = false;
        }
        // Strike tags
        else if (
          lower.startsWith('<s ') ||
          lower === '<s>' ||
          lower.startsWith('<del') ||
          lower.startsWith('<strike')
        ) {
          isStrike = true;
        } else if (
          lower.startsWith('</s') ||
          lower.startsWith('</del') ||
          lower.startsWith('</strike')
        ) {
          isStrike = false;
        }
        // Span with inline styles
        else if (lower.startsWith('<span')) {
          const colorMatch = token.match(/color:\s*#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/i);
          if (colorMatch) {
            currentColor = colorMatch[1].toUpperCase();
          }
          if (
            token.includes('font-weight: bold') ||
            token.includes('font-weight:bold') ||
            token.includes('font-weight: 700')
          ) {
            isBold = true;
          }
          if (token.includes('font-style: italic') || token.includes('font-style:italic')) {
            isItalic = true;
          }
          if (token.includes('text-decoration: underline')) {
            isUnderline = true;
          }
        } else if (lower.startsWith('</span')) {
          currentColor = baseOptions.color || '171717';
          isBold = Boolean(baseOptions.bold);
          isItalic = Boolean(baseOptions.italics);
          isUnderline = Boolean(baseOptions.underline);
        }
      } else {
        // Plain text token: decode entities
        const cleanText = this.decodeHtml(token);
        if (cleanText) {
          runs.push(
            new TextRun({
              text: cleanText,
              font: DOCUMENT_FONT,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
              strike: isStrike,
              color: currentColor,
              size: baseOptions.size,
            })
          );
        }
      }
    }

    if (runs.length === 0) {
      const fallback = this.decodeHtml(htmlContent.replace(/<[^>]*>/g, '').trim());
      if (fallback) {
        runs.push(
          new TextRun({
            text: fallback,
            font: DOCUMENT_FONT,
            size: baseOptions.size,
            color: baseOptions.color || '171717',
          })
        );
      }
    }

    return runs;
  }
}

export const docxExportService = new DocxExportService();
