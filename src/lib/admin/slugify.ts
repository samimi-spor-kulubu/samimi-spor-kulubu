/**
 * TR-aware slug generator.
 *
 * Used across admin forms to derive `slug` / `key` / storage filenames
 * from human-typed Turkish text. Lowercases, strips diacritics, maps
 * Turkish-specific letters to ASCII, replaces non-alphanumerics with
 * hyphens, trims leading/trailing hyphens, and caps length at 64.
 */
export function slugify(input: string, maxLen = 64): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen);
}

/** Split a textarea value into a clean string[] (trim + drop empties). */
export function splitLines(input: string): string[] {
  return input
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Split a string by either newlines or commas. Used for specialty /
 * certification lists where admins may use either separator.
 */
export function splitLinesOrCommas(input: string): string[] {
  return input
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
