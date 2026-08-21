import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import apiClient from "../../util/apiClient";
import Profile from "../../../public/profile.webp";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

interface Candidate {
    fin_kod: string;
    name: string | null;
    surname: string | null;
    father_name: string | null;
    work_place: string | null;
    duty: string | null;
    image?: { image: string | null } | null;
}

interface Props {
    isOpen: boolean;
    projectCode: number;
    onClose: () => void;
    onAdded: () => void;
}

/**
 * Picks someone to put on a project's team.
 *
 * The list comes from the backend already filtered to people who may actually
 * join: approved executor accounts with a completed profile who are not on
 * another team this competition.
 */
export default function AddCollaboratorModal({ isOpen, projectCode, onClose, onAdded }: Props) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [addingFinKod, setAddingFinKod] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const load = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(
                    `/api/project/${projectCode}/collaborator-candidates`
                );
                setCandidates(response.data?.data ?? []);
            } catch (error) {
                console.error("Failed to fetch collaborator candidates:", error);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isOpen, projectCode]);

    const term = search.trim().toLowerCase();
    const visible = term
        ? candidates.filter((candidate) =>
            [candidate.name, candidate.surname, candidate.father_name, candidate.fin_kod]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term)
        )
        : candidates;

    const handleAdd = async (candidate: Candidate) => {
        const fullName = `${candidate.name ?? ""} ${candidate.surname ?? ""}`.trim() || candidate.fin_kod;

        const confirmation = await Swal.fire({
            title: "İcraçı əlavə edilsin?",
            html: `<b>${fullName}</b> layihənin icraçısı olaraq təyin ediləcək.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Bəli, əlavə et",
            cancelButtonText: "Xeyr",
        });
        if (!confirmation.isConfirmed) return;

        try {
            setAddingFinKod(candidate.fin_kod);
            await apiClient.post(`/api/project/${projectCode}/collaborator`, {
                fin_kod: candidate.fin_kod,
            });
            setCandidates((prev) => prev.filter((c) => c.fin_kod !== candidate.fin_kod));
            onAdded();
            Swal.fire("Əlavə olundu!", `${fullName} layihənin icraçısıdır.`, "success");
        } catch (error: any) {
            console.error("Failed to add collaborator:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "İcraçı əlavə edilə bilmədi.",
                "error"
            );
        } finally {
            setAddingFinKod(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[640px] m-4 p-6 lg:p-8">
            <h4 className="mb-1 text-title-sm font-semibold text-gray-800 dark:text-white/90">
                İcraçı əlavə et
            </h4>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                Siyahıda yalnız profili tamamlanmış və bu müsabiqədə hələ heç bir
                layihəyə qoşulmamış icraçılar görünür.
            </p>

            <div className="relative mb-4">
                <SearchIcon
                    style={{ width: 18, height: 18 }}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Ad, soyad və ya FIN kod üzrə axtarış"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white/90"
                />
            </div>

            <div className="max-h-[380px] overflow-y-auto rounded-xl border border-gray-100 dark:border-white/[0.06]">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <CircularProgress />
                    </div>
                ) : visible.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Əlavə edilə biləcək icraçı tapılmadı.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                        {visible.map((candidate) => (
                            <li
                                key={candidate.fin_kod}
                                className="flex items-center justify-between gap-3 px-4 py-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        src={
                                            candidate.image?.image
                                                ? `data:image/jpeg;base64,${candidate.image.image}`
                                                : Profile
                                        }
                                        alt={`${candidate.name ?? ""} ${candidate.surname ?? ""}`}
                                        className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover dark:border-white/10"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                                            {candidate.name} {candidate.surname} {candidate.father_name}
                                        </p>
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                            {candidate.fin_kod}
                                            {candidate.duty ? ` · ${candidate.duty}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={addingFinKod === candidate.fin_kod}
                                    onClick={() => handleAdd(candidate)}
                                >
                                    {addingFinKod === candidate.fin_kod ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        "Əlavə et"
                                    )}
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={onClose}>
                    Bağla
                </Button>
            </div>
        </Modal>
    );
}
