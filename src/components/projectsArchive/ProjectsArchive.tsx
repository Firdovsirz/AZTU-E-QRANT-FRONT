import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import { useEffect, useMemo, useState } from "react";
import apiClient from "../../util/apiClient";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CircularProgress from "@mui/material/CircularProgress";

interface ArchivedProject {
    project_code: number;
    project_name: string | null;
    approved: number | null;
    winner: boolean | null;
    competition_year: number | null;
    competition_code: string | null;
    edit_unlocked: boolean | null;
    user: { name: string | null; surname: string | null } | null;
}

export default function ProjectsArchive() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<ArchivedProject[]>([]);
    // project_code currently being toggled — keeps the row's button busy
    const [savingCode, setSavingCode] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiClient.get("/api/projects/archive");
                setProjects(res.data?.data ?? []);
            } catch (error) {
                console.error("Failed to fetch archive:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // group by competition year (desc)
    const groups = useMemo(() => {
        const map = new Map<string, ArchivedProject[]>();
        for (const p of projects) {
            const key = p.competition_code || (p.competition_year ? String(p.competition_year) : "Digər");
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(p);
        }
        return Array.from(map.entries()).sort((a, b) => {
            const ya = a[1][0]?.competition_year || 0;
            const yb = b[1][0]?.competition_year || 0;
            return yb - ya;
        });
    }, [projects]);

    // Hand an archived project back to its owner (or take it back again).
    const toggleEditAccess = async (project: ArchivedProject) => {
        const willUnlock = !project.edit_unlocked;

        const confirmation = await Swal.fire({
            title: willUnlock ? "Redaktəyə icazə verilsin?" : "Redaktə bağlansın?",
            text: willUnlock
                ? "Layihə rəhbəri arxivdəki bu layihədə smeta xaricində bütün dəyişiklikləri edə biləcək."
                : "Layihə rəhbəri bu layihəni artıq redaktə edə bilməyəcək.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: willUnlock ? "Bəli, icazə ver" : "Bəli, bağla",
            cancelButtonText: "Xeyr",
        });
        if (!confirmation.isConfirmed) return;

        setSavingCode(project.project_code);
        try {
            await apiClient.post("/api/project/archive/edit-access", {
                project_code: project.project_code,
                unlocked: willUnlock,
            });
            setProjects((prev) =>
                prev.map((p) =>
                    p.project_code === project.project_code ? { ...p, edit_unlocked: willUnlock } : p
                )
            );
            Swal.fire(
                "Uğur!",
                willUnlock ? "Layihə redaktə üçün açıldı." : "Layihə redaktəyə bağlandı.",
                "success"
            );
        } catch (error) {
            console.error("Failed to change archive edit access:", error);
            Swal.fire("Xəta!", "Redaktə icazəsi dəyişdirilə bilmədi.", "error");
        } finally {
            setSavingCode(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-10 text-center text-gray-500 dark:border-white/[0.06] dark:bg-gray-900/40">
                Arxivdə layihə yoxdur.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {groups.map(([label, items]) => (
                <div key={label}>
                    <div className="mb-3 flex items-center gap-3">
                        <h2 className="text-lg font-bold text-brand-600 dark:text-brand-300">{label}</h2>
                        <span className="text-sm text-gray-400">{items.length} layihə</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 text-start">Layihə adı</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-start">Rəhbər</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-start">Status</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-start">Redaktə icazəsi</TableCell>
                                        <TableCell isHeader className="px-5 py-3 text-start">Baxış</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {items.map((p) => (
                                        <TableRow key={p.project_code}>
                                            <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 min-w-[200px] max-w-[340px]">
                                                <ReadMore text={p.project_name} lines={2} />
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {p.user?.name || p.user?.surname ? `${p.user?.name ?? ""} ${p.user?.surname ?? ""}`.trim() : "Mövcud deyil"}
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <span className="inline-flex flex-wrap items-center gap-1.5">
                                                    {p.approved ? <Badge color="success" size="sm">Təsdiqlənib</Badge> : <Badge color="light" size="sm">Qaralama</Badge>}
                                                    {p.winner && (
                                                        <Badge color="warning" size="sm" startIcon={<EmojiEventsIcon style={{ width: 13, height: 13 }} />}>Qalib</Badge>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleEditAccess(p)}
                                                    disabled={savingCode === p.project_code}
                                                    title={p.edit_unlocked
                                                        ? "Rəhbərin redaktə icazəsini bağla"
                                                        : "Rəhbərə redaktə icazəsi ver"}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${p.edit_unlocked
                                                        ? "bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-500/15 dark:text-success-400"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.1]"
                                                        }`}
                                                >
                                                    {savingCode === p.project_code ? (
                                                        <CircularProgress size={14} color="inherit" />
                                                    ) : p.edit_unlocked ? (
                                                        <LockOpenIcon style={{ width: 15, height: 15 }} />
                                                    ) : (
                                                        <LockIcon style={{ width: 15, height: 15 }} />
                                                    )}
                                                    {p.edit_unlocked ? "Açıqdır" : "Bağlıdır"}
                                                </button>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <Link to={`/project-view/${p.project_code}`}>
                                                    <VisibilityIcon
                                                        style={{ width: 34, height: 34 }}
                                                        className="cursor-pointer rounded bg-brand-50 p-1 text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300"
                                                    />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
