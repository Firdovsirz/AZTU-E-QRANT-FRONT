import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import Profile from "../../../public/profile.webp";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

export default function ApproveWaitingUsers() {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/api/app-wait-collaborators/${projectCode}`);
                setCollaborators(response.data.data ?? []);
            } catch (error: any) {
                // 404 just means nobody is waiting.
                if (error.response?.status !== 404) {
                    console.error("Failed to fetch collaborators:", error);
                }
                setCollaborators([]);
            }
        };
        fetchCollaborators();
    }, [projectCode]);

    // The applicant is identified by FIN alone, so the project has to travel
    // with the call — otherwise the backend has to guess which of the person's
    // applications is meant.
    const scoped = (path: string) =>
        projectCode ? `${path}?project_code=${projectCode}` : path;

    const handleApprove = async (finKod: string) => {
        try {
            await apiClient.post(scoped(`/api/app-collaborator/${finKod}`));
            setCollaborators((prev) => prev.filter((c) => c.fin_kod !== finKod));
            Swal.fire("Uğurla təsdiqləndi!", "", "success");
        } catch (error: any) {
            console.error("Error during approval:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Təsdiqləmə mümkün olmadı",
                "error"
            );
        }
    };

    const handleReject = async (finKod: string) => {
        const confirmation = await Swal.fire({
            title: "Müraciət ləğv edilsin?",
            text: "İstifadəçi bu layihəyə qəbul edilməyəcək və başqa layihəyə müraciət edə biləcək.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, ləğv et",
            cancelButtonText: "Xeyr",
            confirmButtonColor: "#d33",
        });
        if (!confirmation.isConfirmed) return;

        try {
            await apiClient.delete(scoped(`/api/reject-collaborator/${finKod}`));
            setCollaborators((prev) => prev.filter((c) => c.fin_kod !== finKod));
            Swal.fire("Uğurla ləğv edildi!", "", "success");
        } catch (error: any) {
            console.error("Error during rejection:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Ləğv etmək mümkün olmadı",
                "error"
            );
        };
    };

    return (
        <>
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
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Təsdiqlə
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ləğv et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {collaborators.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
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
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${collaborator.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DoneIcon
                                                    className="text-white cursor-pointer"
                                                    onClick={() => handleApprove(collaborator.fin_kod)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DeleteIcon
                                                    className="text-white cursor-pointer"
                                                    onClick={() => handleReject(collaborator.fin_kod)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
