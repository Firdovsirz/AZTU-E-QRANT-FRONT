import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import apiClient from "../../util/apiClient";
import Badge from "../../components/ui/badge/Badge";
import Collaborators from "../../components/collaborators/Collaborators";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";
import ProjectActivitiesTable from "../../components/ProjectActivities/ProjectActivities";
import CircularProgress from "@mui/material/CircularProgress";

interface AdminProject {
    project_code: number;
    project_name: string | null;
    fin_kod: string | null;
    approved: number | null;
    submitted: boolean | null;
    winner: boolean | null;
}

interface Owner {
    name: string | null;
    surname: string | null;
    father_name: string | null;
}

/**
 * An admin's editing surface for ONE project of the running competition.
 *
 * Same form the lead uses, addressed at their project instead of the admin's
 * own — including the team, so an admin can compose or correct the executors
 * without asking the lead to do it.
 */
export default function AdminProjectEditPage() {
    const { projectCode } = useParams<{ projectCode: string }>();
    const code = Number(projectCode);

    const [project, setProject] = useState<AdminProject | null>(null);
    const [owner, setOwner] = useState<Owner | null>(null);
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
                const res = await apiClient.get(`/api/project/${code}`);
                setProject(res.data?.data ?? null);
            } catch (err: any) {
                console.error("Failed to fetch project:", err);
                setError("Layihə tapılmadı.");
            } finally {
                setLoading(false);
            }
        };

        const loadOwner = async () => {
            try {
                const res = await apiClient.get(`/api/project-owner/${code}`);
                setOwner(res.data?.owner_data ?? null);
            } catch (err) {
                console.error("Failed to fetch project owner:", err);
            }
        };

        load();
        loadOwner();
    }, [code]);

    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Layihənin redaktəsi" description="Layihənin administrator tərəfindən redaktəsi" />
            <PageBreadcrumb pageTitle="Layihənin redaktəsi" />

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
                    <div className="mb-6 rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-warning-700 dark:text-warning-400">
                                Administrator redaktəsi
                            </span>
                            <Badge color="light" size="sm">{project?.project_code}</Badge>
                            {project?.submitted ? <Badge color="success" size="sm">Təqdim edilib</Badge> : null}
                            {project?.winner ? <Badge color="warning" size="sm">Qalib</Badge> : null}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {project?.project_name || "Adsız layihə"}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Layihə rəhbəri:{" "}
                            {owner ? `${owner.name ?? ""} ${owner.surname ?? ""} ${owner.father_name ?? ""}`.trim() : project?.fin_kod}
                            . Etdiyiniz dəyişikliklər dərhal yadda saxlanılır.
                        </p>
                    </div>

                    <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihə məzmunu
                    </h1>
                    <ProjectDetails adminProjectCode={code} />

                    <h1 className="mb-2 mt-[30px] font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihə üzrə görüləcək işlər (ay üzrə)
                    </h1>
                    <ProjectActivitiesTable projectCode={code} />

                    <h1 className="mb-2 mt-[30px] font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">
                        Layihənin komandası
                    </h1>
                    <Collaborators projectCode={code} />
                </>
            )}
        </div>
    );
}
