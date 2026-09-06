import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import apiClient from "../../util/apiClient";
import CircularProgress from "@mui/material/CircularProgress";

interface ExpertOption {
    id: number;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    work_place: string | null;
    duty: string | null;
    scientific_degree: string | null;
    email_verified: boolean;
}

interface Props {
    isOpen: boolean;
    project: any;
    onClose: () => void;
    onAssigned: (email: string) => void;
}

/**
 * Picks the expert for one project.
 *
 * Only verified addresses are offered: the appointment e-mail carries the
 * expert's one-time password, so assigning an address that cannot receive mail
 * would leave them unable to sign in.
 */
export default function AssignExpertModal({ isOpen, project, onClose, onAssigned }: Props) {
    const [experts, setExperts] = useState<ExpertOption[]>([]);
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setSelected(project?.expert ?? "");

        const load = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get("/api/experts?verified_only=true");
                setExperts(res.data?.data ?? []);
            } catch (error) {
                console.error("Failed to fetch experts:", error);
                setExperts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isOpen, project?.expert]);

    const handleAssign = async () => {
        if (!selected) return;
        const expert = experts.find((e) => e.email === selected);
        const fullName = expert ? `${expert.name} ${expert.surname}` : selected;

        const confirmation = await Swal.fire({
            title: "Ekspert təyin edilsin?",
            html:
                `<b>${fullName}</b> bu layihəyə ekspert təyin ediləcək.<br/><br/>` +
                "Ona layihə məlumatları və sistemə giriş üçün birdəfəlik şifrə " +
                "e-poçt ilə göndəriləcək.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Bəli, təyin et",
            cancelButtonText: "Xeyr",
        });
        if (!confirmation.isConfirmed) return;

        try {
            setSaving(true);
            await apiClient.post("/api/set-expert", {
                email: selected,
                project_code: project?.project_code,
            });
            onAssigned(selected);
            onClose();
            Swal.fire(
                "Təyin edildi!",
                `${fullName} ekspert təyin edildi və giriş məlumatları e-poçtuna göndərildi.`,
                "success"
            );
        } catch (error: any) {
            console.error("Failed to assign expert:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Ekspert təyin edilə bilmədi.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[560px] m-4 p-6 lg:p-8">
            <h4 className="mb-1 text-title-sm font-semibold text-gray-800 dark:text-white/90">
                Ekspert təyin et
            </h4>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                {project?.project_name || "Adsız layihə"}
            </p>

            {loading ? (
                <div className="flex h-[140px] items-center justify-center"><CircularProgress /></div>
            ) : experts.length === 0 ? (
                <div className="rounded-xl border border-warning-200 bg-warning-50 p-5 text-sm text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
                    Təsdiqlənmiş e-poçtu olan ekspert yoxdur. Əvvəlcə ekspert əlavə edin
                    və e-poçtunun təsdiqlənməsini gözləyin.
                </div>
            ) : (
                <>
                    <Label>Ekspert</Label>
                    <select
                        value={selected}
                        disabled={saving}
                        onChange={(e) => setSelected(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2 pr-10 text-sm text-gray-800 shadow-theme-xs backdrop-blur transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2398A2B3' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                        }}
                    >
                        <option value="">Ekspert seçin</option>
                        {experts.map((expert) => (
                            <option key={expert.id} value={expert.email}>
                                {expert.name} {expert.surname} — {expert.email}
                                {expert.scientific_degree ? ` (${expert.scientific_degree})` : ""}
                            </option>
                        ))}
                    </select>

                    {selected ? (
                        <div className="mt-4 rounded-xl border border-gray-100 p-4 text-sm dark:border-white/[0.06]">
                            {(() => {
                                const expert = experts.find((e) => e.email === selected);
                                if (!expert) return null;
                                return (
                                    <>
                                        <p className="font-medium text-gray-800 dark:text-white/90">
                                            {expert.name} {expert.surname} {expert.father_name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            {[expert.work_place, expert.duty, expert.scientific_degree]
                                                .filter(Boolean).join(" · ") || "—"}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">{expert.email}</p>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                </>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={saving}>Bağla</Button>
                <Button onClick={handleAssign} disabled={!selected || saving || loading}>
                    {saving ? "Göndərilir..." : "Təyin et və məktub göndər"}
                </Button>
            </div>
        </Modal>
    );
}
