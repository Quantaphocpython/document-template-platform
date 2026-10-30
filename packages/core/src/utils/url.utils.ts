/**
 * Builds a query string URL safely ignoring undefined or empty values.
 */
export function buildUrlWithParams(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, String(value).trim());
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Generates HTTP response headers for file downloads with RFC 5987 UTF-8 encoded filenames.
 */
export function createAttachmentHeaders(
  filename: string,
  mimeType: string,
  contentLength?: number
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': mimeType,
    'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  };

  if (contentLength !== undefined) {
    headers['Content-Length'] = contentLength.toString();
  }

  return headers;
}

