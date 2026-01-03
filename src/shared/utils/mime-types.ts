/**
 * Map of Monaco language identifiers to their corresponding MIME types.
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml
 */
export const languageToMimeType = new Map<string, string>([
  ['json', 'application/json'],
  ['sql', 'application/sql'],
  ['yaml', 'text/yaml']
])
