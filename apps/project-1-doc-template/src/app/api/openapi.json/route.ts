import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Document Template Library API',
      version: '1.0.0',
      description: 'API endpoints for Document Template Library (Product 1) - Enterprise Office Platform',
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
          tags: ['Templates'],
          summary: 'Get all document templates',
          description: 'Returns list of standard document templates with optional category filtering and search query.',
          parameters: [
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['all', 'contract', 'form', 'minutes', 'report', 'proposal'] },
              description: 'Filter templates by business category',
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search templates by title, description, or tags',
            },
          ],
          responses: {
            200: {
              description: 'Successful retrieval of template items',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/DocumentTemplate' },
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
          tags: ['Templates'],
          summary: 'Get template details by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Template unique ID (e.g. tpl-employment-contract)',
            },
          ],
          responses: {
            200: {
              description: 'Template detail found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/DocumentTemplateDetail' },
                    },
                  },
                },
              },
            },
            404: { description: 'Template not found' },
          },
        },
      },
      '/api/documents': {
        get: {
          tags: ['Documents'],
          summary: 'List user created documents',
          responses: {
            200: {
              description: 'List of user documents',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UserDocument' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Documents'],
          summary: 'Create new document from template (Copy-on-Create)',
          description: 'Clones content from master template into an independent user document entity without altering the master template.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['templateId'],
                  properties: {
                    templateId: { type: 'string', example: 'tpl-employment-contract' },
                    customTitle: { type: 'string', example: 'Hợp Đồng Lao Động - Nhân Viên Mới' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Document created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/UserDocument' },
                    },
                  },
                },
              },
            },
            400: { description: 'Missing template ID or invalid payload' },
            404: { description: 'Target template not found' },
          },
        },
      },
      '/api/documents/{id}': {
        get: {
          tags: ['Documents'],
          summary: 'Get user document by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'User document details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/UserDocument' },
                    },
                  },
                },
              },
            },
            404: { description: 'Document not found' },
          },
        },
        put: {
          tags: ['Documents'],
          summary: 'Update user document content or status',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Hợp Đồng Lao Động - Đã Hoàn Thiện' },
                    contentHtml: { type: 'string', example: '<p>Nội dung hợp đồng hoàn chỉnh...</p>' },
                    status: { type: 'string', enum: ['draft', 'saved', 'exported'], example: 'saved' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Document updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/UserDocument' },
                    },
                  },
                },
              },
            },
            404: { description: 'Document not found' },
          },
        },
      },
      '/api/documents/{id}/export': {
        get: {
          tags: ['Export'],
          summary: 'Export and download document as Microsoft Word (.docx)',
          description: 'Generates valid OpenXML DOCX binary buffer directly from user document content.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Binary Microsoft Word file download',
              headers: {
                'Content-Type': { schema: { type: 'string', example: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' } },
                'Content-Disposition': { schema: { type: 'string', example: 'attachment; filename="document.docx"' } },
              },
              content: {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            404: { description: 'Document not found' },
          },
        },
      },
    },
    components: {
      schemas: {
        DocumentTemplate: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'tpl-employment-contract' },
            title: { type: 'string', example: 'Hợp Đồng Lao Động Chuẩn' },
            category: { type: 'string', example: 'contract' },
            description: { type: 'string', example: 'Mẫu hợp đồng lao động chuẩn hóa theo Bộ luật Lao động' },
            thumbnailUrl: { type: 'string', example: '/thumbnails/employment-contract.svg' },
            tags: { type: 'array', items: { type: 'string' }, example: ['hợp đồng', 'nhân sự', 'lao động'] },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DocumentTemplateDetail: {
          allOf: [
            { $ref: '#/components/schemas/DocumentTemplate' },
            {
              type: 'object',
              properties: {
                contentHtml: { type: 'string', example: '<h2>HỢP ĐỒNG LAO ĐỘNG</h2><p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM...</p>' },
              },
            },
          ],
        },
        UserDocument: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'doc-8e12fa...' },
            title: { type: 'string', example: 'Hợp Đồng Lao Động - Nhân Viên Mới' },
            clonedFromTemplateId: { type: 'string', example: 'tpl-employment-contract' },
            contentHtml: { type: 'string', example: '<p>Nội dung tài liệu...</p>' },
            status: { type: 'string', enum: ['draft', 'saved', 'exported'], example: 'saved' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}

