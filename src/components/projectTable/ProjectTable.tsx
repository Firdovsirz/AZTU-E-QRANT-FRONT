import {
    Table,
    TableCell,
    TableHeader,
    TableBody,
    TableRow
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import ReadMore from "../ui/ReadMore";
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CircularProgress from '@mui/material/CircularProgress';
import useCollaborationStatus from "../../hooks/useCollaborationStatus";

/** `submitted_at` arrives as an RFC-1123 string; show just the day. */
function formatSubmittedAt(value: string | null | undefined) {
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" });
}

export default function ProjectTable() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [winnerLoading, setWinnerLoading] = useState<number | null>(null);
    const [deletingCode, setDeletingCode] = useState<number | null>(null);
    const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    // Leads take part in projects too, so both roles get the "join" column.
    const canJoinProjects = projectRole === 0 || projectRole === 1;
    const {
        projectCodes: joinedCodes,
        allowedSlots,
        remainingSlots,
        canJoinMore,
        refresh: refreshCollaboration,
    } = useCollaborationStatus();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get('/api/projects');
                setProjects(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);


    const handleBeCollaborator = async (fin_kod: string, project_code: string) => {
    const slotsAfter = remainingSlots - 1;
    const result = await Swal.fire({
        title: 'Əminsiniz?',
        text: `Layihəyə iştirakçı olaraq qoşulmaq istədiyinizə əminsiniz? Qoşulduqdan sonra `
            + (slotsAfter > 0
                ? `daha ${slotsAfter} layihədə icraçı ola bilərsiniz.`
                : 'bu müsabiqədə başqa layihəyə qoşula bilməyəcəksiniz.'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Bəli, əminəm',
        cancelButtonText: 'Xeyr, imtina et'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await apiClient.post('/api/be-collaborator', {
            fin_kod,
            project_code
        });

        if (response.data.status === 201) {
            // Re-read the slots rather than guessing: the answer decides which
            // of the remaining projects still offer a "join" button.
            await refreshCollaboration();
            Swal.fire({
                icon: 'success',
                title: 'İştirakçı olaraq əlavə olundunuz!',
                text: "Təsdiq edildikdən sonra aktiv icraçı statusu əldə edəcəksiniz!",
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
        }

    } catch (error: any) {
        if (error.response?.status === 403) {
            Swal.fire({
                title: 'Xəta!',
                text: 'Layihəni təsdiq etmək üçün ilk növbədə şəxsi məlumatlarınızı təmin etməlisiniz!',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Şəxsi məlumatlara keç',
                cancelButtonText: 'Bağla'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/user-details/${fin_kod}`;
                }
            });
        } else if (error.response?.status === 409) {
            // 409 covers both a full project and a used-up personal limit; the
            // backend says which, so show its message rather than guessing.
            Swal.fire({
                title: 'Xəta!',
                text: error.response?.data?.message
                    ?? error.response?.data?.error
                    ?? 'Layihə üçün bütün yerlər doludur!',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            refreshCollaboration();
        } else {
            Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
        }
    }
};

    const handleToggleWinner = async (project_code: number, currentWinner: boolean) => {
        const makingWinner = !currentWinner;
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: makingWinner
                ? 'Bu layihəni qalib layihə olaraq qeyd etmək istəyirsiniz?'
                : 'Bu layihəni qalib siyahısından çıxarmaq istəyirsiniz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Bəli',
            cancelButtonText: 'Xeyr'
        });

        if (!result.isConfirmed) return;

        try {
            setWinnerLoading(project_code);
            const response = await apiClient.post('/api/project/winner', {
                project_code,
                winner: makingWinner
            });

            if (response.data.status === 200 || response.data.success_code === "SUCCESS") {
                setProjects(prev =>
                    prev.map(p =>
                        p.project_code === project_code ? { ...p, winner: makingWinner } : p
                    )
                );
                Swal.fire({
                    icon: 'success',
                    title: makingWinner ? 'Layihə qalib olaraq qeyd edildi!' : 'Layihə qalib siyahısından çıxarıldı!',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
            }
        } catch (error) {
            console.error("Failed to update winner status:", error);
            Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
        } finally {
            setWinnerLoading(null);
        }
    };

    const handleDeleteProject = async (project: any) => {
        const confirmation = await Swal.fire({
            title: 'Layihə silinsin?',
            html:
                `<b>${project.project_name || 'Adsız layihə'}</b> layihəsi tamamilə silinəcək.<br/><br/>` +
                'Layihənin bütün icraçıları komandadan çıxarılacaq və onlar başqa ' +
                'layihələrə müraciət edə biləcəklər. Bu əməliyyat geri qaytarıla bilməz.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Bəli, sil',
            cancelButtonText: 'Xeyr',
            confirmButtonColor: '#d33'
        });
        if (!confirmation.isConfirmed) return;

        try {
            setDeletingCode(project.project_code);
            await apiClient.delete('/api/delete/project', {
                // The owner's FIN identifies whose project this is; the backend
                // authorises the delete from the TOKEN, not from this field.
                data: { fin_kod: project.fin_kod, project_code: project.project_code }
            });
            setProjects(prev => prev.filter(p => p.project_code !== project.project_code));
            Swal.fire('Silindi!', 'Layihə uğurla silindi.', 'success');
        } catch (error: any) {
            console.error("Failed to delete project:", error);
            Swal.fire('Xəta!', error.response?.data?.error ?? 'Layihəni silmək mümkün olmadı.', 'error');
        } finally {
            setDeletingCode(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    };

    const emptyColSpan = projectRole === 2 ? 10 : canJoinProjects ? 5 : 4;

    /** Why this project's "join" button is unavailable, or null when it is. */
    const joinBlockedReason = (project: any): string | null => {
        if (project.fin_kod === fin_kod) return "Bu, sizin öz layihənizdir";
        if (joinedCodes.includes(project.project_code)) return "Artıq bu layihənin icraçısısınız";
        if (!project.approved) return "Layihə hələ təsdiqlənməyib";
        if (!canJoinMore) return `İcraçı ola biləcəyiniz layihə sayı doludur (maksimum ${allowedSlots})`;
        return null;
    };

    return (
        <>
            {/* State the rule where the decision is made, so a disabled
                "İştirakçı Ol" never looks like a bug. */}
            {canJoinProjects && allowedSlots > 0 ? (
                <div
                    className={`mb-4 flex flex-wrap items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${canJoinMore
                        ? "border-brand-200/70 bg-brand-50/60 text-brand-800 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200"
                        : "border-gray-200/70 bg-gray-50 text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-gray-300"
                        }`}
                >
                    <GroupsIcon style={{ width: 18, height: 18 }} />
                    <span>
                        Bu müsabiqədə <b>{allowedSlots}</b> layihədə icraçı ola bilərsiniz
                        {projectRole === 0 ? " (öz layihənizdən əlavə)" : ""}.
                        {" "}
                        {canJoinMore
                            ? `Hazırda ${joinedCodes.length} layihədə iştirak edirsiniz, ${remainingSlots} yeriniz boşdur.`
                            : "Bütün yerlərinizdən istifadə etmisiniz."}
                    </span>
                </div>
            ) : null}
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə adı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə rəhbəri
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İştirakçı sayı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə statusu
                                </TableCell>
                                {/* Whether the lead has actually handed the proposal in.
                                    Distinct from "təsdiq olunub", which only means the
                                    form is fully filled. Admins only. */}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Təqdim edilib
                                    </TableCell>
                                ) : null}
                                {/* The admin body row renders a "view" link here, so the
                                    header has to exist too or every later column is
                                    labelled by its neighbour. */}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Baxış
                                    </TableCell>
                                ) : null}
                                {canJoinProjects ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İştirakçı Ol
                                    </TableCell>
                                ) : null}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Ekspert təyin et
                                    </TableCell>
                                ) : null}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Qalib
                                    </TableCell>
                                ) : null}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Redaktə
                                    </TableCell>
                                ) : null}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Sil
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={emptyColSpan} className="text-center py-8 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {projects.map((project, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300 min-w-[200px] max-w-[340px]">
                                        <ReadMore text={project.project_name} lines={2} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.user.name && project.user.surname ? `${project.user.name} ${project.user.surname}` : "Mövcud deyil"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.members?.length || 0}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.approved === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200/60 dark:bg-warning-500/15 dark:text-warning-400 dark:ring-warning-400/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse" />
                                                Təsdiq gözləyir
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-success-50 text-success-700 ring-1 ring-inset ring-success-200/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-400/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                                                Təsdiq olunub
                                            </span>
                                        )}
                                    </TableCell>
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {project.submitted ? (
                                                <span className="inline-flex flex-col gap-0.5">
                                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 ring-1 ring-inset ring-success-200/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-400/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                                                        Təqdim edilib
                                                    </span>
                                                    {project.submitted_at ? (
                                                        <span className="text-[11px] text-gray-400">
                                                            {formatSubmittedAt(project.submitted_at)}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 ring-1 ring-inset ring-gray-200/60 dark:bg-white/[0.06] dark:text-gray-400 dark:ring-white/10">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                                    Təqdim edilməyib
                                                </span>
                                            )}
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/project-view/${project.project_code}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                    ) : null}
                                    {canJoinProjects ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {fin_kod && (
                                                joinedCodes.includes(project.project_code) ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 ring-1 ring-inset ring-success-200/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-400/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                                                        İcraçısınız
                                                    </span>
                                                ) : (
                                                    <span title={joinBlockedReason(project) ?? undefined}>
                                                        <Button
                                                            onClick={() => handleBeCollaborator(fin_kod, project.project_code)}
                                                            disabled={!!joinBlockedReason(project)}
                                                        >
                                                            İştirakçı Ol
                                                        </Button>
                                                    </span>
                                                )
                                            )}
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {
                                                <Link to={"/set-expert"} state={{project}}>
                                                    <Button>
                                                        Ekspert təyin et
                                                    </Button>
                                                </Link>
                                            }
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <button
                                                onClick={() => handleToggleWinner(project.project_code, !!project.winner)}
                                                disabled={winnerLoading === project.project_code}
                                                title={project.winner ? "Qalib siyahısından çıxar" : "Qalib olaraq qeyd et"}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${project.winner
                                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300"
                                                    }`}
                                            >
                                                {winnerLoading === project.project_code ? (
                                                    <CircularProgress size={16} />
                                                ) : (
                                                    <>
                                                        <EmojiEventsIcon style={{ width: 16, height: 16 }} />
                                                        {project.winner ? "Qalib" : "Qalib et"}
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/admin/project/${project.project_code}/edit`} title="Layihəni redaktə et">
                                                <EditIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <button
                                                type="button"
                                                title="Layihəni sil"
                                                onClick={() => handleDeleteProject(project)}
                                                disabled={deletingCode === project.project_code}
                                                className="inline-flex h-[35px] w-[35px] items-center justify-center rounded bg-error-50 text-error-600 transition-colors hover:bg-error-100 disabled:opacity-60 dark:bg-error-500/15 dark:text-error-400 dark:hover:bg-error-500/25"
                                            >
                                                {deletingCode === project.project_code ? (
                                                    <CircularProgress size={16} color="inherit" />
                                                ) : (
                                                    <DeleteIcon style={{ width: 22, height: 22 }} />
                                                )}
                                            </button>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}