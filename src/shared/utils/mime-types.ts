/**
 * Map of Monaco language identifiers to their corresponding MIME types.
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml
 */
export const languageToMimeType = new Map<string, string>([
  ['css', 'text/css'],
  ['html', 'text/html'],
  ['javascript', 'text/javascript'],
  ['json', 'application/json'],
  ['markdown', 'text/markdown'],
  ['sql', 'application/sql'],
  ['xml', 'application/xml'],
  ['yaml', 'text/yaml']
])
