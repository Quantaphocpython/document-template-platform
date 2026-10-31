import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Slide Presentation Template Library API',
      version: '1.0.0',
      description: 'API endpoints for Slide Presentation Template Library (Product 2) - Enterprise Office Platform',
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment Host',
      },
    ],
    paths: {
      '/api/templates': {
        get: {
          tags: ['Slide Templates'],
          summary: 'Get all slide presentation templates',
          description: 'Returns list of PowerPoint slide decks with optional category filtering and search query.',
          parameters: [
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['all', 'pitch-deck', 'quarterly-review', 'product-launch'] },
              description: 'Filter slide decks by category',
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search slide templates by keyword',
            },
          ],
          responses: {
            200: {
              description: 'Successful retrieval of presentation template decks',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/SlideTemplate' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/templates/{id}': {
        get: {
          tags: ['Slide Templates'],
          summary: 'Get slide template deck details by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Slide template unique ID (e.g. tpl-pitch-deck-investor)',
            },
          ],
          responses: {
            200: {
              description: 'Slide template detail with full slide deck',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/SlideTemplate' },
                    },
                  },
                },
              },
            },
            404: { description: 'Slide template not found' },
          },
        },
      },
      '/api/presentations': {
        post: {
          tags: ['Presentations'],
          summary: 'Create new user presentation from template (Physical File Clone)',
          description: 'Copies master PPTX file physically to user storage folder and creates instance metadata.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['templateId'],
                  properties: {
                    templateId: { type: 'string', example: 'tpl-pitch-deck-investor' },
                    customTitle: { type: 'string', example: 'Bài Thuyết Trình Gọi Vốn Series A - TechCorp' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Presentation cloned successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/UserPresentation' },
                    },
                  },
                },
              },
            },
            400: { description: 'Missing template ID' },
            404: { description: 'Template not found' },
          },
        },
      },
      '/api/presentations/{id}': {
        get: {
          tags: ['Presentations'],
          summary: 'Get user presentation metadata by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'User presentation details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/UserPresentation' },
                    },
                  },
                },
              },
            },
            404: { description: 'Presentation not found' },
          },
        },
      },
      '/api/presentations/{id}/download': {
        get: {
          tags: ['Download'],
          summary: 'Stream download PowerPoint (.pptx) binary file',
          description: 'Streams the physical PPTX file directly with proper RFC-6266 attachment headers.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Binary PowerPoint (.pptx) file download',
              headers: {
                'Content-Type': { schema: { type: 'string', example: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' } },
                'Content-Disposition': { schema: { type: 'string', example: 'attachment; filename="presentation.pptx"' } },
              },
              content: {
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            404: { description: 'Presentation or PPTX file not found' },
          },
        },
      },
    },
    components: {
      schemas: {
        SlideItem: {
          type: 'object',
          properties: {
            slideNumber: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Tiêu Đề Bìa Slide' },
            previewSvgUrl: { type: 'string', example: '/slides/pitch-deck/slide-1.svg' },
            layoutType: { type: 'string', example: 'cover' },
          },
        },
        SlideTemplate: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'tpl-pitch-deck-investor' },
            title: { type: 'string', example: 'Pitch Deck Gọi Vốn Đầu Tư' },
            category: { type: 'string', example: 'pitch-deck' },
            description: { type: 'string', example: 'Bộ mẫu slide 16:9 gọi vốn khởi nghiệp chuyên nghiệp' },
            aspectRatio: { type: 'string', example: '16:9' },
            totalSlides: { type: 'integer', example: 5 },
            pptxFileName: { type: 'string', example: 'Pitch_Deck_Investor_Series_A.pptx' },
            coverImageUrl: { type: 'string', example: '/slides/pitch-deck/slide-1.svg' },
            slides: {
              type: 'array',
              items: { $ref: '#/components/schemas/SlideItem' },
            },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserPresentation: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'pres-ca968a02...' },
            title: { type: 'string', example: 'Bài Thuyết Trình Gọi Vốn Series A' },
            clonedFromTemplateId: { type: 'string', example: 'tpl-pitch-deck-investor' },
            pptxFileName: { type: 'string', example: 'pres-ca968a02....pptx' },
            fileSizeBytes: { type: 'integer', example: 75319 },
            totalSlides: { type: 'integer', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}

