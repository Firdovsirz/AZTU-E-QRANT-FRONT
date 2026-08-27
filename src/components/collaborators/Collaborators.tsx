import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import Profile from "../../../public/profile.webp";
import Button from "../ui/button/Button";
import AddCollaboratorModal from "./AddCollaboratorModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CircularProgress from "@mui/material/CircularProgress";

interface Collaborator {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    projectRole: number;
    image?: {
        image: string | null;
    } | null;
}

interface Owner {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    projectRole: number;
    image?: {
        image: string | null;
    } | null;
}

/**
 * The project's team table.
 *
 * Read-only for everyone by default. Whoever may take somebody OFF the team —
 * an admin on any project, the lead on their own — gets a remove action per
 * row. Putting somebody on directly is an administrative override, so the
 * "add" button is admins only; a lead still composes their team through
 * apply-and-approve. The backend re-checks both, so this is only about not
 * showing controls that would be refused.
 */
export default function Collaborators({ projectCode }: { projectCode: Number | null }) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [owner, setOwner] = useState<Owner | null>(null);
    const [loading, setLoading] = useState(true);
    const [removingFinKod, setRemovingFinKod] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const pathname = useLocation().pathname;
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);

    // An admin manages every team; a lead only the team of the project they own.
    const canManage =
        projectCode != null &&
        (projectRole === 2 || (projectRole === 0 && !!owner && owner.fin_kod === finKod));
    const canAdd = canManage && projectRole === 2;

    const fetchCollaborators = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/collaborators/${projectCode}`);
            setCollaborators(response.data.data ?? []);
        } catch (error: any) {
            // 404 simply means the team is still empty.
            if (error.response?.status !== 404) {
                console.error("Failed to fetch collaborators:", error);
            }
            setCollaborators([]);
        }
    }, [projectCode]);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const response = await apiClient.get(`/api/project-owner/${projectCode}`);
                setOwner(response.data.owner_data);
            } catch (error) {
                console.error("Failed to fetch project owner:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOwnerData();
        fetchCollaborators();
    }, [projectCode, fetchCollaborators]);

    const handleRemove = async (collaborator: Collaborator) => {
        const fullName = `${collaborator.name ?? ""} ${collaborator.surname ?? ""}`.trim() || collaborator.fin_kod;

        const confirmation = await Swal.fire({
            title: "İcraçı layihədən çıxarılsın?",
            html:
                `<b>${fullName}</b> layihənin icraçıları siyahısından çıxarılacaq.<br/><br/>` +
                "Onun bu layihə üzrə xidmət haqqı smetası da silinəcək və " +
                "istifadəçi başqa bir layihəyə müraciət edə biləcək.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, çıxar",
            cancelButtonText: "Xeyr",
            confirmButtonColor: "#d33",
        });
        if (!confirmation.isConfirmed) return;

        try {
            setRemovingFinKod(collaborator.fin_kod);
            await apiClient.delete(`/api/project/${projectCode}/collaborator/${collaborator.fin_kod}`);
            setCollaborators((prev) => prev.filter((c) => c.fin_kod !== collaborator.fin_kod));
            Swal.fire("Uğurla çıxarıldı!", `${fullName} artıq layihənin icraçısı deyil.`, "success");
        } catch (error: any) {
            console.error("Failed to remove collaborator:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "İcraçını çıxarmaq mümkün olmadı.",
                "error"
            );
        } finally {
            setRemovingFinKod(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    };

    // Whoever manages the team also needs to reach a member's profile — that is
    // where their other projects are listed.
    const showViewColumn = pathname === "/collaborators" || canManage;
    const columnCount = 3 + (showViewColumn ? 1 : 0) + (canManage ? 1 : 0);

    return (
        <>
            {canAdd ? (
                <div className="mb-3 flex justify-end">
                    <Button
                        size="sm"
                        startIcon={<PersonAddAlt1Icon style={{ width: 18, height: 18 }} />}
                        onClick={() => setIsAddOpen(true)}
                    >
                        İcraçı əlavə et
                    </Button>
                </div>
            ) : null}
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ad, Soyad
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fin Kod
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə Rolu
                                </TableCell>
                                {showViewColumn ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Baxış
                                    </TableCell>
                                ) : null}
                                {canManage ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Çıxar
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {collaborators.length === 0 && !owner ? (
                                <TableRow>
                                    <TableCell colSpan={columnCount} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {owner ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-3">
                                            {owner.image?.image ? (

                                                <img
                                                    src={`data:image/jpeg;base64,${owner.image?.image}`}
                                                    alt={`${owner.name} ${owner.surname}`}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={Profile}
                                                    alt="User"
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                                />
                                            )}
                                            <span>{owner.name} {owner.surname} {owner.father_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {owner.fin_kod}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə rəhbəri
                                    </TableCell>
                                    {showViewColumn ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${owner.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                    ) : null}
                                    {canManage ? (
                                        // The lead is the project's owner, not a team member —
                                        // removing them would leave the project without an author.
                                        <TableCell className="px-4 py-3 text-gray-400 text-start text-theme-sm dark:text-gray-500">
                                            —
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ) : null}
                            {collaborators.map((collaborator, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                {collaborator?.image?.image ? (

                                                    <img
                                                        src={`data:image/jpeg;base64,${collaborator?.image?.image}`}
                                                        alt={`${collaborator.name} ${collaborator.surname}`}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={Profile}
                                                        alt="User"
                                                        className="w-[fit-content] h-[fit-content] rounded-full object-cover border border-gray-300"
                                                    />
                                                )}
                                                <span>{collaborator.name} {collaborator.surname} {collaborator.father_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Layihə İştirakçısı
                                        </TableCell>
                                        {showViewColumn ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Link to={`/user-view/${collaborator.fin_kod}`}>
                                                    <VisibilityIcon
                                                        style={{ width: 35, height: 35 }}
                                                        className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                    />
                                                </Link>
                                            </TableCell>
                                        ) : null}
                                        {canManage ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <button
                                                    type="button"
                                                    title="İcraçını layihədən çıxar"
                                                    onClick={() => handleRemove(collaborator)}
                                                    disabled={removingFinKod === collaborator.fin_kod}
                                                    className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-error-500 text-white transition-colors hover:bg-error-600 disabled:opacity-60"
                                                >
                                                    {removingFinKod === collaborator.fin_kod ? (
                                                        <CircularProgress size={16} color="inherit" />
                                                    ) : (
                                                        <PersonRemoveIcon style={{ width: 20, height: 20 }} />
                                                    )}
                                                </button>
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {canAdd && projectCode != null ? (
                <AddCollaboratorModal
                    isOpen={isAddOpen}
                    projectCode={Number(projectCode)}
                    onClose={() => setIsAddOpen(false)}
                    onAdded={fetchCollaborators}
                />
            ) : null}
        </>
    )
}
