import { ID_SERIES_OPTIONS, MAX_ID_DIGITS, parseIdNumber } from "../../util/idNumber";

interface Props {
    value: string;
    /** Receives the combined value, e.g. "AZE12345678". */
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
}

/**
 * The "Şəxsiyyət vəsiqəsinin seriyası" field: the prefix is picked from a
 * fixed list, the rest is typed as digits only, and the parent still stores
 * one combined string — so nothing downstream has to know about the split.
 */
export default function IdSeriesInput({ value, onChange, disabled = false, required = false }: Props) {
    const { series, digits } = parseIdNumber(value);

    const selectClasses =
        "h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2 pr-9 text-sm shadow-theme-xs backdrop-blur transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90 dark:hover:border-white/20 dark:focus:border-brand-500";

    const inputClasses =
        "h-10 w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2 text-sm text-gray-800 shadow-theme-xs backdrop-blur transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90 dark:placeholder:text-white/30 dark:hover:border-white/20 dark:focus:border-brand-500";

    return (
        <div className="flex gap-2">
            <select
                aria-label="Seriya"
                value={series}
                disabled={disabled}
                required={required}
                onChange={(event) => onChange(event.target.value + digits)}
                className={`w-[6.5rem] shrink-0 ${selectClasses} ${series ? "text-gray-800 dark:text-white/90" : "text-gray-400"}`}
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2398A2B3' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                }}
            >
                <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    Seriya
                </option>
                {ID_SERIES_OPTIONS.map((option) => (
                    <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {option}
                    </option>
                ))}
            </select>

            <input
                aria-label="Nömrə"
                // `type="number"` would bring a spinner, accept "e"/"+"/"-" and
                // drop leading zeros, so the digits are filtered by hand instead.
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="12345678"
                maxLength={MAX_ID_DIGITS}
                value={digits}
                disabled={disabled}
                required={required}
                onChange={(event) =>
                    onChange(series + event.target.value.replace(/\D/g, "").slice(0, MAX_ID_DIGITS))
                }
                className={inputClasses}
            />
        </div>
    );
}
