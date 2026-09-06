import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import { setMustChangePassword } from "../../redux/slices/authSlice";
import LockResetIcon from "@mui/icons-material/LockReset";

const MIN_LENGTH = 8;

/**
 * Replacing your own password.
 *
 * An expert lands here straight after signing in with the one-time password
 * from their appointment e-mail — `mustChangePassword` keeps them here until
 * they choose their own. Anyone else can reach it to change theirs voluntarily.
 */
export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const forced = useSelector((state: RootState) => state.auth.mustChangePassword);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [repeat, setRepeat] = useState("");
    const [loading, setLoading] = useState(false);

    const tooShort = next.length > 0 && next.length < MIN_LENGTH;
    const mismatch = repeat.length > 0 && next !== repeat;
    const sameAsCurrent = next.length > 0 && next === current;

    const blocked = !current || !next || !repeat || tooShort || mismatch || sameAsCurrent;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (blocked) return;

        try {
            setLoading(true);
            await apiClient.post("/auth/change-password", {
                current_password: current,
                new_password: next,
            });
            dispatch(setMustChangePassword(false));
            await Swal.fire({
                icon: "success",
                title: "Şifrə dəyişdirildi!",
                text: "Bundan sonra yeni şifrənizlə daxil olacaqsınız.",
                confirmButtonText: "Davam et",
            });
            navigate(projectRole === 3 ? "/expert/projects" : "/home");
        } catch (error: any) {
            console.error("Failed to change password:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Şifrəni dəyişmək mümkün olmadı.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMeta title="AzTU E-Qrant | Şifrənin dəyişdirilməsi" description="Şifrənizi yeniləyin" />
            <div className="mx-auto w-full max-w-lg px-4 py-10">
                <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white">
                            <LockResetIcon />
                        </span>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">
                                Şifrəni dəyişdirin
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {forced
                                    ? "Birdəfəlik şifrə ilə daxil oldunuz. Davam etmək üçün yeni şifrə təyin edin."
                                    : "Hesabınız üçün yeni şifrə təyin edin."}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <Label>
                                {forced ? "Birdəfəlik şifrə" : "Cari şifrə"}
                                <span className="ml-0.5 text-error-500">*</span>
                            </Label>
                            <Input
                                type="password"
                                value={current}
                                autoComplete="current-password"
                                placeholder={forced ? "E-poçtdakı şifrəni daxil edin" : "Cari şifrəniz"}
                                onChange={(e) => setCurrent(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Yeni şifrə<span className="ml-0.5 text-error-500">*</span></Label>
                            <Input
                                type="password"
                                value={next}
                                autoComplete="new-password"
                                placeholder={`Ən azı ${MIN_LENGTH} simvol`}
                                error={tooShort || sameAsCurrent}
                                onChange={(e) => setNext(e.target.value)}
                            />
                            {tooShort ? (
                                <p className="mt-1 text-xs font-medium text-error-500">
                                    Şifrə ən azı {MIN_LENGTH} simvol olmalıdır.
                                </p>
                            ) : sameAsCurrent ? (
                                <p className="mt-1 text-xs font-medium text-error-500">
                                    Yeni şifrə köhnəsindən fərqli olmalıdır.
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <Label>Yeni şifrənin təkrarı<span className="ml-0.5 text-error-500">*</span></Label>
                            <Input
                                type="password"
                                value={repeat}
                                autoComplete="new-password"
                                placeholder="Yeni şifrəni təkrar yazın"
                                error={mismatch}
                                onChange={(e) => setRepeat(e.target.value)}
                            />
                            {mismatch ? (
                                <p className="mt-1 text-xs font-medium text-error-500">
                                    Şifrələr uyğun gəlmir.
                                </p>
                            ) : null}
                        </div>

                        <Button className="w-full" disabled={blocked || loading}>
                            {loading ? "Yadda saxlanılır..." : "Şifrəni dəyişdir"}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
