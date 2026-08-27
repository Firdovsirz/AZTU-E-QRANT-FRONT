/** The series prefixes an Azerbaijani identity document can carry. */
export const ID_SERIES_OPTIONS = ["AA", "AB", "AZE"] as const;

/** Digits after the prefix — 7 on an AA/AB ID card, 8 in an AZE passport. */
export const MAX_ID_DIGITS = 8;

export interface ParsedIdNumber {
    series: string;
    digits: string;
}

/**
 * Split a stored value such as "AZE12345678" into its prefix and its number.
 *
 * Anything that is not one of the known prefixes leaves `series` empty rather
 * than guessing, so a legacy value shows up as "needs choosing" instead of
 * being silently reinterpreted. Prefixes are tested longest-first: no prefix
 * here is a prefix of another, but that ordering keeps this correct if one
 * ever is.
 */
export function parseIdNumber(value: string | null | undefined): ParsedIdNumber {
    const raw = (value ?? "").replace(/\s+/g, "").toUpperCase();

    const byLength = [...ID_SERIES_OPTIONS].sort((a, b) => b.length - a.length);
    for (const series of byLength) {
        if (raw.startsWith(series)) {
            return { series, digits: raw.slice(series.length).replace(/\D/g, "") };
        }
    }

    return { series: "", digits: raw.replace(/\D/g, "") };
}

/** True once the value is a known prefix followed by at least one digit. */
export function isCompleteIdNumber(value: string | null | undefined): boolean {
    const { series, digits } = parseIdNumber(value);
    return !!series && digits.length > 0;
}
