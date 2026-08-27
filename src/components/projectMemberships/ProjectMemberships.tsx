import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import apiClient from "../../util/apiClient";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";

interface MembershipProject {
    project_code: number;
    project_name: string | null;
    role: "lead" | "member";
    /** For a joined project: whether the lead has approved the application yet. */
    approved: boolean | null;
    project_approved: number | null;
    submitted: boolean | null;
    winner: boolean | null;
    lead_fin_kod: string | null;
    lead_name: string | null;
}

interface Memberships {
    fin_kod: string;
    name: string | null;
    surname: string | null;
    project_role: number | null;
    competition_code: string | null;
    led_projects: MembershipProject[];
    joined_projects: MembershipProject[];
    used_slots: number;
    allowed_slots: number;
    remaining_slots: number;
}

function ProjectCard({ item }: { item: MembershipProject }) {
    const isLead = item.role === "lead";
    const pending = !isLead && item.approved === false;

    return (
        <div className="rounded-xl border border-gray-100 p-4 transition-all hover:border-brand-300 hover:shadow-theme-sm dark:border-white/[0.05]">
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge color={isLead ? "primary" : "info"} size="sm">
                    {isLead ? "Layihə rəhbəri" : "İcraçı"}
                </Badge>
                {pending && <Badge color="warning" size="sm">Təsdiq gözləyir</Badge>}
                {item.winner && (
                    <Badge color="warning" size="sm" startIcon={<EmojiEventsIcon style={{ width: 13, height: 13 }} />}>
                        Qalib
                    </Badge>
                )}
                {item.submitted && <Badge color="success" size="sm">Təqdim edilib</Badge>}
            </div>

            <ReadMore
                text={item.project_name || "Adsız layihə"}
                lines={2}
                className="text-sm font-medium text-gray-800 dark:text-gray-100"
            />

            <div className="mt-3 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-gray-400">
                    {isLead ? `Kod: ${item.project_code}` : item.lead_name ? `Rəhbər: ${item.lead_name}` : ""}
                </span>
                <Link
                    to={`/project-view/${item.project_code}`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
                >
                    <VisibilityIcon style={{ width: 14, height: 14 }} /> Bax
                </Link>
            </div>
        </div>
    );
}

/**
 * Everything one person takes part in during the RUNNING competition — the
 * project they lead plus every project they joined as an executor — together
 * with how many collaboration slots they have left.
 *
 * Without `finKod` it shows the signed-in user their own participation; with
 * one it shows an admin somebody else's. The backend enforces that difference.
 */
export default function ProjectMemberships({ finKod }: { finKod?: string } = {}) {
    const [data, setData] = useState<Memberships | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(
                    finKod ? `/api/memberships/${finKod}` : "/api/memberships"
                );
                setData(res.data?.data ?? null);
            } catch (error) {
                console.error("Failed to fetch memberships:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [finKod]);

    // Admins take part in nothing, so the panel has nothing to say about them.
    if (!loading && data && data.allowed_slots === 0 && data.led_projects.length === 0) {
        return null;
    }

    const projects = data ? [...data.led_projects, ...data.joined_projects] : [];

    return (
        <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                        <GroupsIcon className="size-5" />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">
                            {finKod ? "İştirak etdiyi layihələr" : "İştirak etdiyim layihələr"}
                        </h2>
                        {data?.competition_code && (
                            <p className="text-xs text-gray-400">{data.competition_code}</p>
                        )}
                    </div>
                </div>

                {data && data.allowed_slots > 0 && (
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${data.remaining_slots > 0
                            ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
                            : "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400"
                            }`}
                    >
                        <WorkIcon style={{ width: 14, height: 14 }} />
                        İcraçı yeri: {data.used_slots}/{data.allowed_slots}
                        {data.remaining_slots > 0 ? ` — ${data.remaining_slots} boş` : " — dolu"}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex h-[120px] items-center justify-center"><CircularProgress /></div>
            ) : projects.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                    {finKod
                        ? "Cari müsabiqədə heç bir layihədə iştirak etmir."
                        : "Cari müsabiqədə hələ heç bir layihədə iştirak etmirsiniz."}
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {projects.map((item) => (
                        <ProjectCard key={`${item.role}-${item.project_code}`} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
