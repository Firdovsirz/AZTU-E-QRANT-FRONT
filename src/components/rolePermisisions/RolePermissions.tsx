import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";
import { getLockStatus, lockVariable, unlockVariable } from "../../services/lock/lockService";
import Select from "../form/Select";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../ui/button/Button";

interface UserInterface {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    personal_id_number: string;
    sex: string;
    born_place: string;
    born_date: string;
    living_location: string;
    project_role: number;
    citizenship: string;
    work_place: string;
    department: string;
    duty: string;
    main_education: string;
    additonal_education: string;
    scientific_degree: string;
    scientific_date: string;
    scientific_name: string;
    scientific_name_date: string;
    work_location: string;
    home_phone: string;
    personal_mobile_number: string;
    work_phone: string;
    personal_email: string;
    work_email: string;
    image?: string;
    institution_code?: string;
};

type AllUsersFilterProps = {
    filters: {
        name?: string;
        surname?: string;
        finKod?: string;
    };
};

export default function RolePermissions({ filters }: AllUsersFilterProps) {
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("");
    const [loadingRows, setLoadingRows] = useState<{ [finKod: string]: boolean }>({});
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [lockStatus, setLockStatus] = useState<boolean>(false);
    const [deletingFinKod, setDeletingFinKod] = useState<string | null>(null);

    const roleOptions = [
        {
            value: "0",
            label: "Layihə rəhbəri"
        }, {
            value: "1",
            label: "Layihə icraçısı"
        }, {
            value: "2",
            label: "Admin"
        }
    ];

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        params.append(key, String(value));
                    }
                });
                const response = await apiClient.get(`api/users/all?${params.toString()}`);
                setUsers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        // Fetch lock status on mount
        const fetchLockStatus = async () => {
            try {
                const response = await getLockStatus();
                setLockStatus(response.locked);
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchLockStatus();
    }, [filters, lockStatus]);

    const handleLockToggle = async () => {
        try {
            if (lockStatus) {
                await unlockVariable();
                Swal.fire("Sistem açıldı!", "", "success");
                setLockStatus(false);
            } else {
                await lockVariable();
                Swal.fire("Sistem kilidləndi!", "", "success");
                setLockStatus(true);
            }
        } catch (err) {
            Swal.fire("Server xətası!", "", "error");
        }
    };

    /**
     * Erase a person and everything of theirs.
     *
     * This removes far more than the row on screen — the login, the profile,
     * any project they lead with its team, plan, budget and files — so the
     * confirmation spells that out and asks for the FIN to be typed back.
     */
    const handleDeleteUser = async (user: UserInterface) => {
        const fullName = `${user.name ?? ""} ${user.surname ?? ""}`.trim() || user.fin_kod;

        // The FIN has to be typed back before this goes through — deleting a
        // person is irreversible.
        //
        // The input is hand-rolled in `html` rather than using SweetAlert2's
        // own `input`/`inputValidator`: those two options key a very large
        // conditional type, and letting the checker see them here took the
        // whole project's `tsc` run from ~40 seconds to over ten minutes.
        const confirmOptions: SweetAlertOptions = {
            title: "İstifadəçi tamamilə silinsin?",
            html:
                `<b>${fullName}</b> (${user.fin_kod}) və ona aid bütün məlumatlar silinəcək:<br/><br/>` +
                "<div style='text-align:left;display:inline-block'>" +
                "• hesab və şəxsi məlumatlar<br/>" +
                "• rəhbəri olduğu layihə (komanda, smeta, fayllar, hesabatlar)<br/>" +
                "• başqa layihələrdə icraçı statusu<br/>" +
                "• bildirişlər və mesajlar" +
                "</div><br/><br/>" +
                "<b>Bu əməliyyat geri qaytarıla bilməz.</b><br/>" +
                "Təsdiq üçün FIN kodu yazın:" +
                `<input id="delete-user-fin" class="swal2-input" placeholder="${user.fin_kod}" autocomplete="off" />`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr",
            confirmButtonColor: "#d33",
            preConfirm: () => {
                const field = document.getElementById("delete-user-fin") as HTMLInputElement | null;
                const typed = field?.value.trim().toUpperCase() ?? "";
                if (typed !== (user.fin_kod ?? "").toUpperCase()) {
                    Swal.showValidationMessage("FIN kod düzgün deyil.");
                    return false;
                }
                return true;
            },
        };

        const confirmation = await Swal.fire(confirmOptions);
        if (!confirmation.isConfirmed) return;

        try {
            setDeletingFinKod(user.fin_kod);
            await apiClient.delete(`/api/user/${user.fin_kod}`);
            setUsers(prev => prev.filter(u => u.fin_kod !== user.fin_kod));
            Swal.fire("Silindi!", `${fullName} sistemdən tamamilə silindi.`, "success");
        } catch (error: any) {
            console.error("Failed to delete user:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "İstifadəçini silmək mümkün olmadı.",
                "error"
            );
        } finally {
            setDeletingFinKod(null);
        }
    };

    const handleRoleUpdate = async (finKod: string, projectRole: number) => {
        setLoadingRows(prev => ({ ...prev, [finKod]: true }));
        try {
            const response = await apiClient.post(`/auth/${finKod}/update/role/${+projectRole}`);
            if (response.status === 200) {
                Swal.fire("Yeni rol uğurla təyin edildi!", "", "success").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            } else if (response.status === 404) {
                Swal.fire("İstifadəçi mövcud deyil!", "", "error").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            } else {
                Swal.fire("Server xətası!", "", "error").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            }
        } catch (err) {
            Swal.fire("Server xətası!", "", "error").then(() => {
                setLoadingRows(prev => ({ ...prev, [finKod]: false }));
            });
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
                <Button onClick={handleLockToggle} className={lockStatus ? "bg-red-500" : "bg-green-500"}>
                    {lockStatus ? "Unlock" : "Lock"}
                </Button>
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40 mt-[30px]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ad, Soyad, Ata adı (Fin Kod)
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
                                    Təsdiq et
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Sil
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {users.map((user, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {user.name} {user.surname} {user.father_name} {user.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {/* {user.project_role === 0 ? "Layihə rəhbəri" : user.project_role === 2 ? "Admin" : "Layihə icraçısı"} */}
                                            <Select
                                                options={roleOptions}
                                                placeholder={user.project_role === 0 ? "Layihə rəhbəri" : user.project_role === 2 ? "Admin" : "Layihə icraçısı"}
                                                onChange={handleRoleChange}
                                                className="dark:bg-dark-900 w-[100px]"
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${user.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]" onClick={() => handleRoleUpdate(user.fin_kod, +selectedRole)}>
                                                {loadingRows[user.fin_kod] ? (
                                                    <CircularProgress style={{ width: 24, height: 24, color: 'white' }} />
                                                ) : (
                                                    <DoneIcon
                                                        className="text-white cursor-pointer"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <button
                                                type="button"
                                                title="İstifadəçini bütün məlumatları ilə sil"
                                                onClick={() => handleDeleteUser(user)}
                                                disabled={deletingFinKod === user.fin_kod}
                                                className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-error-500 text-white transition-colors hover:bg-error-600 disabled:opacity-60"
                                            >
                                                {deletingFinKod === user.fin_kod ? (
                                                    <CircularProgress size={18} color="inherit" />
                                                ) : (
                                                    <PersonRemoveIcon style={{ width: 20, height: 20 }} />
                                                )}
                                            </button>
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
