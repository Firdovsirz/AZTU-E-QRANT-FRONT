import { useMemo, useState } from "react";
import QuarterlyReportForm from "./QuarterlyReportForm";

const QUARTERS = [1, 2, 3, 4];

interface Props {
    projectCode: string | number | null;
    /**
     * Year the picker opens on. Archived projects report against their own
     * competition year, which may be older than the 5 years listed by default —
     * it is added to the list when missing.
     */
    defaultYear?: number | null;
}

/**
 * Rüb + il picker wrapped around the report form. Shared by the standalone
 * report page and the archive edit page so a lead files reports the same way
 * for a current and for a past project.
 */
export default function QuarterlyReportPanel({ projectCode, defaultYear }: Props) {
    const currentYear = new Date().getFullYear();
    const initialYear = defaultYear || currentYear;

    const [quarter, setQuarter] = useState<number>(
        Math.ceil((new Date().getMonth() + 1) / 3)
    );
    const [year, setYear] = useState<number>(initialYear);

    const years = useMemo(() => {
        const recent = Array.from({ length: 5 }, (_, i) => currentYear - i);
        const all = recent.includes(initialYear) ? recent : [...recent, initialYear];
        return all.sort((a, b) => b - a);
    }, [currentYear, initialYear]);

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        Rüb:
                    </label>
                    <select
                        value={quarter}
                        onChange={(e) => setQuarter(Number(e.target.value))}
                        className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
                    >
                        {QUARTERS.map((q) => (
                            <option key={q} value={q}>
                                {q}-ci rüb
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        İl:
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {projectCode ? (
                <QuarterlyReportForm
                    projectCode={projectCode}
                    quarter={quarter}
                    year={year}
                />
            ) : (
                <div className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                    Layihə kodu tapılmadı. Zəhmət olmasa əvvəlcə layihənizi seçin.
                </div>
            )}
        </div>
    );
}
