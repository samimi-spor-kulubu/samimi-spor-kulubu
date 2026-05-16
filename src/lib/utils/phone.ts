/**
 * Turkish phone number formatters.
 *
 * Single source of truth for how we render the salon's number across
 * the site. The admin types one raw value (anything reasonable —
 * "05335594797", "+90 533 559 47 97", "(533) 559-47-97" — and these
 * helpers derive every format we need:
 *   - display:  "0533 559 47 97"   (what users read)
 *   - tel:      "+905335594797"    (anchor href for "Ara")
 *   - whatsapp: "905335594797"     (path segment for wa.me/…)
 *
 * Unrecognised input is returned as-is so a partially-typed value
 * still shows something on screen instead of disappearing.
 */

/** Strip everything but digits and re-shape into the canonical
 *  12-digit form `90XXXXXXXXXX`. Returns '' if the input can't be
 *  coerced into a Turkish phone of the expected length. */
function normalise(raw: string | null | undefined): string {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';

  // 12 digits starting with 90 → already canonical (e.g. 905335594797)
  if (digits.length === 12 && digits.startsWith('90')) {
    return digits;
  }
  // 11 digits starting with 0 → drop the leading 0, prefix 90
  if (digits.length === 11 && digits.startsWith('0')) {
    return '90' + digits.slice(1);
  }
  // 10 digits → assume local mobile, prefix 90
  if (digits.length === 10) {
    return '90' + digits;
  }
  // 13+ digits with leading 0090 → strip the leading 0
  if (digits.length === 13 && digits.startsWith('090')) {
    return digits.slice(1);
  }
  return '';
}

/** "0533 559 47 97" — what users see in the UI. */
export function formatPhoneDisplay(raw: string | null | undefined): string {
  const norm = normalise(raw);
  if (!norm) return raw ?? '';
  const local = norm.slice(2); // 10 digits without country code
  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
}

/** "+905335594797" — for `<a href="tel:…">`. */
export function formatPhoneTel(raw: string | null | undefined): string {
  const norm = normalise(raw);
  if (!norm) return raw ?? '';
  return `+${norm}`;
}

/** "905335594797" — path segment for wa.me / wa.link URLs. */
export function formatPhoneWhatsApp(raw: string | null | undefined): string {
  const norm = normalise(raw);
  if (!norm) return raw ?? '';
  return norm;
}

/** True when the input parses to a valid 12-digit TR number. */
export function isValidPhone(raw: string | null | undefined): boolean {
  return normalise(raw).length === 12;
}
