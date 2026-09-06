import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CircularProgress from "@mui/material/CircularProgress";

interface Expert {
    id: number;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    personal_id_serial_number: string;
    work_place?: string | null;
    duty?: string | null;
    scientific_degree?: string | null;
    phone_number?: string | null;
    email_verified: boolean;
}

/**
 * The register of experts.
 *
 * Verification is the column that matters: an unverified address cannot
 * receive the appointment e-mail that carries the expert's one-time password,
 * so those experts are not offered when assigning a project. This screen is
 * where an admin chases that up.
 */
export default function Experts() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = async () => {
        try {
            const response = await apiClient.get(`/api/experts`);
            setExperts(response.data.data ?? []);
        } catch (error) {
            console.error("Failed to fetch experts:", error);
            setExperts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleResend = async (expert: Expert) => {
        try {
            setBusyId(expert.id);
            await apiClient.post(`/api/experts/${expert.id}/resend-verification`);
            Swal.fire(
                "Göndərildi!",
                `Təsdiq linki ${expert.email} ünvanına yenidən göndərildi.`,
                "success"
            );
        } catch (error: any) {
            console.error("Failed to resend verification:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Təsdiq linki göndərilə bilmədi.",
                "error"
            );
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (expert: Expert) => {
        const confirmation = await Swal.fire({
            title: "Ekspert silinsin?",
            html: `<b>${expert.name} ${expert.surname}</b> (${expert.email}) siyahıdan silinəcək.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr",
            confirmButtonColor: "#d33",
        });
        if (!confirmation.isConfirmed) return;

        try {
            setBusyId(expert.id);
            await apiClient.delete(`/api/experts/${expert.id}`);
            setExperts((prev) => prev.filter((e) => e.id !== expert.id));
            Swal.fire("Silindi!", "Ekspert siyahıdan silindi.", "success");
        } catch (error: any) {
            console.error("Failed to delete expert:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Eksperti silmək mümkün olmadı.",
                "error"
            );
        } finally {
            setBusyId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    const unverified = experts.filter((e) => !e.email_verified).length;

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                {unverified > 0 ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-warning-200/70 bg-warning-50/70 px-4 py-2 text-sm text-warning-800 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
                        {unverified} ekspertin e-poçtu təsdiqlənməyib — onlar layihəyə təyin edilə bilməz.
                    </span>
                ) : <span />}
                <Link to="/new-expert">
                    <Button size="sm" startIcon={<PersonAddAlt1Icon style={{ width: 18, height: 18 }} />}>
                        Yeni ekspert
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {["Ad, Soyad", "E-poçt", "Təsdiq", "İş yeri / Vəzifə", "Elmi dərəcə", "Əməliyyat"].map((h) => (
                                    <TableCell
                                        key={h}
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {experts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Hələ ekspert əlavə edilməyib.
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {experts.map((expert) => (
                                <TableRow key={expert.id}>
                                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                                        {expert.name} {expert.surname} {expert.father_name}
                                        <span className="block text-xs text-gray-400">
                                            {expert.personal_id_serial_number}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {expert.email}
                                        {expert.phone_number ? (
                                            <span className="block text-xs text-gray-400">{expert.phone_number}</span>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        {expert.email_verified ? (
                                            <Badge color="success" size="sm">Təsdiqlənib</Badge>
                                        ) : (
                                            <Badge color="warning" size="sm">Gözləyir</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {[expert.work_place, expert.duty].filter(Boolean).join(" · ") || "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {expert.scientific_degree || "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        <div className="flex items-center gap-2">
                                            {!expert.email_verified ? (
                                                <button
                                                    type="button"
                                                    title="Təsdiq linkini yenidən göndər"
                                                    onClick={() => handleResend(expert)}
                                                    disabled={busyId === expert.id}
                                                    className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100 disabled:opacity-60 dark:bg-brand-900/40 dark:text-brand-300"
                                                >
                                                    {busyId === expert.id
                                                        ? <CircularProgress size={16} color="inherit" />
                                                        : <SendIcon style={{ width: 18, height: 18 }} />}
                                                </button>
                                            ) : null}
                                            <button
                                                type="button"
                                                title="Eksperti sil"
                                                onClick={() => handleDelete(expert)}
                                                disabled={busyId === expert.id}
                                                className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-error-50 text-error-600 transition-colors hover:bg-error-100 disabled:opacity-60 dark:bg-error-500/15 dark:text-error-400"
                                            >
                                                <DeleteIcon style={{ width: 18, height: 18 }} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
