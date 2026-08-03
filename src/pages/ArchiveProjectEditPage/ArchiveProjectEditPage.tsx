import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import apiClient from "../../util/apiClient";
import Badge from "../../components/ui/badge/Badge";
import Collaborators from "../../components/collaborators/Collaborators";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";
import ProjectActivitiesTable from "../../components/ProjectActivities/ProjectActivities";
import QuarterlyReportPanel from "../../components/QuarterlyReport/QuarterlyReportPanel";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CircularProgress from "@mui/material/CircularProgress";

interface ArchiveProject {
    project_code: number;
    project_name: string | null;
    competition_year: number | null;
    competition_code: string | null;
    winner: boolean | null;
}

/**
 * Editing surface for a single ARCHIVED project that an admin unlocked.
 *
 * Deliberately excludes the smeta: the budget of a closed competition stays
 * frozen, everything else on the application is editable by its owner.
 */
export default function ArchiveProjectEditPage() {
    const { projectCode } = useParams<{ projectCode: string }>();
    const code = Number(projectCode);

    const [project, setProject] = useState<ArchiveProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setError("Layihə kodu düzgün deyil.");
            setLoading(false);
            return;
        }
        const load = async () => {
            try {
                const res = await apiClient.get(`/api/archive/project/${code}`);
                setProject(res.data?.data ?? null);
            } catch (err: any) {
                console.error("Failed to fetch archived project:", err);
                setError(
                    err.response?.status === 403
                        ? "Bu arxiv layihəsi redaktəyə bağlıdır. Administratora müraciət edin."
                        : "Arxiv layihəsi tapılmadı."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [code]);

    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Arxiv layihəsinin redaktəsi" description="Arxivdəki layihənin redaktəsi" />
            <PageBreadcrumb pageTitle="Arxiv layihəsinin redaktəsi" />

            {loading ? (
                <div className="flex h-[300px] items-center justify-center">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-error-200 bg-error-50 p-8 text-center text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                    {error}
                </div>
            ) : (
                <>
                    <div className="mb-6 rounded-2xl border border-success-200 bg-success-50 p-5 dark:border-success-500/30 dark:bg-success-500/10">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-700 dark:text-success-400">
                                <LockOpenIcon style={{ width: 17, height: 17 }} />
                                Redaktə üçün açıqdır
                            </span>
                            {project?.competition_code && <Badge color="light" size="sm">{project.competition_code}</Badge>}
                            {project?.competition_year && <Badge color="light" size="sm">{project.competition_year}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {project?.project_name || "Adsız layihə"}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Administrator bu arxiv layihəsini redaktəyə açıb. Smeta istisna olmaqla bütün
                            dəyişiklikləri edə bilərsiniz. İcazə istənilən vaxt geri alına bilər.
                        </p>
                    </div>

                    <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihə məzmunu
                    </h1>
                    <ProjectDetails archiveProjectCode={code} />

                    <h1 className="mb-2 mt-[30px] font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihə üzrə görüləcək işlər (ay üzrə)
                    </h1>
                    <ProjectActivitiesTable projectCode={code} />

                    <h1 className="mb-2 mt-[30px] font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihənin komandası
                    </h1>
                    <Collaborators projectCode={code} />

                    <h1 className="mb-2 mt-[30px] font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Rüblük Elmi-Texniki Hesabat
                    </h1>
                    <QuarterlyReportPanel projectCode={code} defaultYear={project?.competition_year} />
                </>
            )}
        </div>
    );
}
