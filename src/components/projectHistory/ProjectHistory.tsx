import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import apiClient from "../../util/apiClient";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";

interface HistoryItem {
    project_code: number;
    project_name: string | null;
    role: "lead" | "member";
    approved: number | null;
    submitted: boolean | null;
    winner: boolean | null;
    competition_year: number | null;
    competition_code: string | null;
    archived: boolean | null;
    // true only for a lead whose archived project an admin unlocked
    editable: boolean | null;
}

export default function ProjectHistory() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiClient.get("/api/my-project-history");
                setItems(res.data?.data ?? []);
            } catch (error) {
                console.error("Failed to fetch project history:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
            <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white">
                    <WorkIcon className="size-5" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">Layihə tarixçəm</h2>
            </div>

            {loading ? (
                <div className="flex h-[120px] items-center justify-center"><CircularProgress /></div>
            ) : items.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">Hələ heç bir layihədə iştirak etməmisiniz.</p>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.project_code}-${item.role}-${idx}`}
                            className="rounded-xl border border-gray-100 p-4 transition-all hover:border-brand-300 hover:shadow-theme-sm dark:border-white/[0.05]"
                        >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                {item.competition_year && <Badge color="light" size="sm">{item.competition_year}</Badge>}
                                <Badge color={item.role === "lead" ? "primary" : "info"} size="sm">
                                    {item.role === "lead" ? "Layihə rəhbəri" : "İcraçı"}
                                </Badge>
                                {item.winner && (
                                    <Badge color="warning" size="sm" startIcon={<EmojiEventsIcon style={{ width: 13, height: 13 }} />}>
                                        Qalib
                                    </Badge>
                                )}
                                {item.approved ? (
                                    <Badge color="success" size="sm">Təsdiqlənib</Badge>
                                ) : (
                                    <Badge color="light" size="sm">Qaralama</Badge>
                                )}
                                {item.editable && (
                                    <Badge color="success" size="sm" startIcon={<LockOpenIcon style={{ width: 13, height: 13 }} />}>
                                        Redaktəyə açıqdır
                                    </Badge>
                                )}
                            </div>
                            <ReadMore text={item.project_name || "Adsız layihə"} lines={2} className="text-sm font-medium text-gray-800 dark:text-gray-100" />
                            <div className="mt-3 flex items-center justify-between gap-2">
                                {item.competition_code ? (
                                    <span className="text-xs text-gray-400">{item.competition_code}</span>
                                ) : <span />}
                                <span className="inline-flex items-center gap-3">
                                    {item.editable && (
                                        <Link
                                            to={`/archive/project/${item.project_code}/edit`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-success-600 hover:underline dark:text-success-400"
                                        >
                                            <EditIcon style={{ width: 14, height: 14 }} /> Redaktə et
                                        </Link>
                                    )}
                                    <Link
                                        to={`/project-view/${item.project_code}`}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
                                    >
                                        <VisibilityIcon style={{ width: 14, height: 14 }} /> Bax
                                    </Link>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
