'use client';

import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, ButtonSize, ButtonVariant } from 'ui';

export default function ApiDocsPage() {
  useEffect(() => {
    // Inject Swagger UI CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css';
    document.head.appendChild(link);

    // Initialize Swagger UI
    const initSwagger = () => {
      // @ts-expect-error SwaggerUIBundle loaded from CDN
      if (typeof window !== 'undefined' && window.SwaggerUIBundle) {
        // @ts-expect-error SwaggerUIBundle constructor
        window.SwaggerUIBundle({
          url: '/api/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          // @ts-expect-error SwaggerUI presets
          presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
          layout: 'BaseLayout',
          persistAuthorization: true,
          displayRequestDuration: true,
        });
      }
    };

    // Load bundle and standalone preset scripts
    const scriptBundle = document.createElement('script');
    scriptBundle.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.min.js';
    scriptBundle.async = true;

    scriptBundle.onload = () => {
      const scriptPreset = document.createElement('script');
      scriptPreset.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.min.js';
      scriptPreset.async = true;
      scriptPreset.onload = initSwagger;
      document.body.appendChild(scriptPreset);
    };

    document.body.appendChild(scriptBundle);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
      if (scriptBundle.parentNode) scriptBundle.parentNode.removeChild(scriptBundle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.ICON}
              title="Quay lại Thư viện"
              aria-label="Quay lại Thư viện"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Interactive OpenAPI 3.0 Documentation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground font-mono inline-flex items-center gap-1 transition-colors"
          >
            <span>/api/openapi.json</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Swagger UI Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div id="swagger-ui" className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden" />
      </main>
    </div>
  );
}

