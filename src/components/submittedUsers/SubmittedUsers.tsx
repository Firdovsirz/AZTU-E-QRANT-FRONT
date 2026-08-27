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
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import useCollaborationStatus from "../../hooks/useCollaborationStatus";

export default function SubmittedUsers() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [winnerLoading, setWinnerLoading] = useState<number | null>(null);
    const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    // Leads may take part in a project besides the one they run, so both
    // participant roles get the "join" column.
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
                const response = await apiClient.get('/api/projects/submitted');
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

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    };

    const emptyColSpan = projectRole === 2 ? 7 : canJoinProjects ? 6 : 5;

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
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
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
                                            <Badge color="warning" size="sm">Təsdiq gözləyir</Badge>
                                        ) : (
                                            <Badge color="success" size="sm">Təsdiq olunub</Badge>
                                        )}
                                    </TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}