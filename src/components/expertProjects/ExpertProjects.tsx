import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GradingIcon from "@mui/icons-material/Grading";
import CircularProgress from "@mui/material/CircularProgress";

interface AssignedProject {
    project_code: number;
    project_name: string | null;
    project_annotation: string | null;
    submitted: boolean;
    lead_name: string | null;
    max_score: number;
    assessment: { assessment: number | null; note: string | null; updated_at: string | null } | null;
}

/** 0..10, rendered as buttons so the range is obvious without a legend. */
function ScorePicker({
    value, max, disabled, onChange,
}: { value: number | null; max: number; disabled?: boolean; onChange: (n: number) => void }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: max + 1 }, (_, n) => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(n)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${value === n
                        ? "bg-brand-600 text-white shadow-theme-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300 dark:hover:bg-white/[0.12]"
                        }`}
                >
                    {n}
                </button>
            ))}
        </div>
    );
}

function ProjectCard({ project, onSaved }: { project: AssignedProject; onSaved: () => void }) {
    const [score, setScore] = useState<number | null>(project.assessment?.assessment ?? null);
    const [note, setNote] = useState(project.assessment?.note ?? "");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (score === null) {
            Swal.fire("Diqqət!", "Qiymət seçilməlidir.", "warning");
            return;
        }
        try {
            setSaving(true);
            await apiClient.post("/api/expert/assessment", {
                project_code: project.project_code,
                assessment: score,
                note,
            });
            Swal.fire("Yadda saxlanıldı!", "Qiymətləndirməniz qeydə alındı.", "success");
            onSaved();
        } catch (error: any) {
            console.error("Failed to save assessment:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Qiymətləndirməni yadda saxlamaq mümkün olmadı.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge color="light" size="sm">Kod: {project.project_code}</Badge>
                {project.assessment?.assessment != null ? (
                    <Badge color="success" size="sm">
                        Qiymətləndirilib — {project.assessment.assessment}/{project.max_score}
                    </Badge>
                ) : (
                    <Badge color="warning" size="sm">Qiymətləndirilməyib</Badge>
                )}
            </div>

            <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                {project.project_name || "Adsız layihə"}
            </h3>
            {project.lead_name ? (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Layihə rəhbəri: {project.lead_name}
                </p>
            ) : null}

            {project.project_annotation ? (
                <ReadMore
                    text={project.project_annotation}
                    lines={3}
                    className="mt-3 text-sm text-gray-600 dark:text-gray-300"
                />
            ) : null}

            <Link
                to={`/project-view/${project.project_code}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
                <VisibilityIcon style={{ width: 16, height: 16 }} />
                Layihənin tam məzmunu
            </Link>

            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/[0.06]">
                <Label>Qiymət ({project.max_score} ballıq sistem)</Label>
                <ScorePicker
                    value={score}
                    max={project.max_score}
                    disabled={saving}
                    onChange={setScore}
                />

                <div className="mt-4">
                    <Label>Rəy / qeyd</Label>
                    <TextArea
                        value={note}
                        rows={4}
                        placeholder="Layihə haqqında rəyinizi yazın"
                        onChange={(value) => setNote(value)}
                        disabled={saving}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                        {project.assessment?.updated_at
                            ? `Son yenilənmə: ${new Date(project.assessment.updated_at).toLocaleDateString("az-AZ")}`
                            : ""}
                    </span>
                    <Button size="sm" onClick={handleSave} disabled={saving || score === null}>
                        {saving ? "Yadda saxlanılır..." : "Qiymətləndirməni yadda saxla"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/** Everything this expert has been appointed to, each with its scoring form. */
export default function ExpertProjects() {
    const [projects, setProjects] = useState<AssignedProject[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await apiClient.get("/api/expert/my-projects");
            setProjects(res.data?.data?.projects ?? []);
        } catch (error) {
            console.error("Failed to fetch assigned projects:", error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) {
        return (
            <div className="flex h-[300px] items-center justify-center"><CircularProgress /></div>
        );
    }

    if (!projects.length) {
        return (
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-10 text-center dark:border-white/[0.06] dark:bg-gray-900/40">
                <GradingIcon className="text-gray-300" style={{ width: 48, height: 48 }} />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hazırda sizə təyin olunmuş layihə yoxdur.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {projects.map((project) => (
                <ProjectCard key={project.project_code} project={project} onSaved={load} />
            ))}
        </div>
    );
}
