import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../util/apiClient";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * Where the "confirm your e-mail" link from an expert invitation lands.
 *
 * Public on purpose: clicking it IS the proof that the address works, so it
 * cannot require a login the expert does not have yet.
 */
export default function ExpertVerifyPage() {
    const { token } = useParams<{ token: string }>();
    const [state, setState] = useState<"loading" | "ok" | "failed">("loading");
    const [name, setName] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setState("failed");
            setMessage("Təsdiq linki tapılmadı.");
            return;
        }
        const verify = async () => {
            try {
                const res = await apiClient.post(`/api/expert/verify/${token}`);
                setName(res.data?.data?.name ?? null);
                setState("ok");
            } catch (error: any) {
                setMessage(
                    error.response?.data?.error ??
                    "Təsdiq linki etibarsızdır və ya artıq istifadə olunub."
                );
                setState("failed");
            }
        };
        verify();
    }, [token]);

    return (
        <>
            <PageMeta title="AzTU E-Qrant | E-poçt təsdiqi" description="Ekspert e-poçt təsdiqi" />
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200/70 bg-white/80 p-8 text-center shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                    {state === "loading" ? (
                        <>
                            <CircularProgress />
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                E-poçt ünvanı təsdiqlənir...
                            </p>
                        </>
                    ) : state === "ok" ? (
                        <>
                            <CheckCircleIcon className="text-success-500" style={{ width: 56, height: 56 }} />
                            <h1 className="mt-3 text-lg font-bold text-gray-800 dark:text-white/90">
                                E-poçt ünvanınız təsdiqləndi
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {name ? `Təşəkkür edirik, ${name}. ` : ""}
                                Layihəyə ekspert təyin olunduqda sistemə giriş məlumatlarınız
                                bu ünvana göndəriləcək.
                            </p>
                        </>
                    ) : (
                        <>
                            <ErrorOutlineIcon className="text-error-500" style={{ width: 56, height: 56 }} />
                            <h1 className="mt-3 text-lg font-bold text-gray-800 dark:text-white/90">
                                Təsdiq alınmadı
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
                            <p className="mt-2 text-xs text-gray-400">
                                Administratordan təsdiq linkini yenidən göndərməsini xahiş edin.
                            </p>
                        </>
                    )}

                    <Link
                        to="/signin"
                        className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
                    >
                        Giriş səhifəsinə keç
                    </Link>
                </div>
            </div>
        </>
    );
}
