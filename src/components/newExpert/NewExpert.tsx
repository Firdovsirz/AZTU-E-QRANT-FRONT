import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
    name: "", surname: "", father_name: "", email: "",
    personal_id_serial_number: "", work_place: "", duty: "",
    scientific_degree: "", phone_number: "",
};

type Field = keyof typeof EMPTY;

const REQUIRED: Field[] = ["name", "surname", "father_name", "email", "personal_id_serial_number"];

const LABELS: Record<Field, string> = {
    name: "Ad",
    surname: "Soyad",
    father_name: "Ata adı",
    email: "E-poçt ünvanı",
    personal_id_serial_number: "Şəxsiyyət vəsiqəsinin seriya nömrəsi",
    work_place: "İş yeri",
    duty: "Vəzifə",
    scientific_degree: "Elmi dərəcə",
    phone_number: "Telefon nömrəsi",
};

/** One titled block of related fields, on a shared responsive grid. */
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 sm:p-6">
            <div className="mb-5 border-b border-gray-100 pb-3 dark:border-white/[0.06]">
                <h3 className="text-base font-bold tracking-tight text-gray-800 dark:text-white/90">{title}</h3>
                {hint ? <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
        </section>
    );
}

/**
 * Registering an expert.
 *
 * The address matters more than anything else on this form: appointments and
 * the expert's one-time password are delivered there and nowhere else, so it
 * is validated here, checked again on the server, and finally confirmed by a
 * link the expert has to click before they can be assigned.
 */
export default function NewExpert() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...EMPTY });
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

    const set = (field: Field, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const emailInvalid = form.email.trim().length > 0 && !EMAIL_PATTERN.test(form.email.trim());
    const missing = REQUIRED.filter((f) => !form[f].trim());
    const blocked = loading || missing.length > 0 || emailInvalid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (blocked) return;

        try {
            setLoading(true);
            const res = await apiClient.post("/api/create-expert", {
                ...form,
                work_place: form.work_place || null,
                duty: form.duty || null,
                scientific_degree: form.scientific_degree || null,
                phone_number: form.phone_number || null,
            });

            const sent = res.data?.data?.verification_email_sent !== false;
            await Swal.fire({
                icon: sent ? "success" : "warning",
                title: sent ? "Ekspert əlavə edildi!" : "Ekspert əlavə edildi, lakin məktub göndərilmədi",
                html: sent
                    ? `<b>${form.email}</b> ünvanına təsdiq linki göndərildi.<br/><br/>` +
                      "Ekspert linki təsdiqlədikdən sonra layihələrə təyin edilə biləcək."
                    : "E-poçt göndərilə bilmədi. Ekspertlər siyahısından təkrar göndərə bilərsiniz.",
                confirmButtonText: "OK",
            });
            setForm({ ...EMPTY });
            setTouched({});
            navigate("/experts");
        } catch (error: any) {
            console.error("Failed to create expert:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Ekspert əlavə edilə bilmədi.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const field = (name: Field, extra?: { type?: string; placeholder?: string }) => (
        <div>
            <Label>
                {LABELS[name]}
                {REQUIRED.includes(name) ? <span className="ml-0.5 text-error-500">*</span> : null}
            </Label>
            <Input
                type={extra?.type ?? "text"}
                value={form[name]}
                placeholder={extra?.placeholder ?? LABELS[name]}
                error={name === "email" ? emailInvalid : touched[name] && REQUIRED.includes(name) && !form[name].trim()}
                onChange={(e) => set(name, e.target.value)}
            />
            {name === "email" && emailInvalid ? (
                <p className="mt-1 text-xs font-medium text-error-500">
                    E-poçt ünvanı düzgün formatda deyil.
                </p>
            ) : null}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div className="rounded-2xl border border-brand-200/70 bg-brand-50/60 p-5 dark:border-brand-500/20 dark:bg-brand-500/10">
                <h1 className="flex items-center gap-2 text-base font-bold tracking-tight text-brand-900 dark:text-brand-100 sm:text-lg">
                    <PersonAddAlt1Icon /> Yeni ekspert
                </h1>
                <p className="mt-1 text-sm text-brand-800/80 dark:text-brand-200/80">
                    <span className="font-semibold">*</span> ilə işarələnmiş sahələr mütləqdir.
                    Ekspert yaradıldıqdan sonra e-poçt ünvanına təsdiq linki göndəriləcək.
                </p>
            </div>

            <Section
                title="Şəxsi məlumatlar"
                hint="Ad, soyad və şəxsiyyət vəsiqəsi məlumatları rəsmi sənədlərdəki kimi olmalıdır."
            >
                {field("name")}
                {field("surname")}
                {field("father_name")}
                {field("personal_id_serial_number", { placeholder: "AZE12345678" })}
                {field("phone_number", { placeholder: "+994 50 000 00 00" })}
            </Section>

            <Section
                title="E-poçt ünvanı"
                hint="Təyinat məktubları və sistemə giriş üçün birdəfəlik şifrə yalnız bu ünvana göndəriləcək."
            >
                {field("email", { type: "email", placeholder: "ekspert@aztu.edu.az" })}
                <div className="sm:col-span-2 xl:col-span-2">
                    <div className="flex h-full items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-xs text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-gray-300">
                        <MarkEmailReadIcon className="mt-0.5 shrink-0 text-brand-500" style={{ width: 18, height: 18 }} />
                        <span>
                            Ünvanın işlək olduğu iki mərhələdə yoxlanılır: yaradılarkən domenin
                            e-poçt qəbul etdiyi, sonra isə ekspertin göndərilən linki
                            təsdiqləməsi ilə. Yalnız təsdiqlənmiş ekspertlər layihəyə təyin edilə bilər.
                        </span>
                    </div>
                </div>
            </Section>

            <Section title="Vəzifə və elmi fəaliyyət" hint="Bu sahələr məcburi deyil.">
                {field("work_place")}
                {field("duty")}
                {field("scientific_degree", { placeholder: "Məsələn: t.ü.f.d." })}
            </Section>

            <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white/90 px-5 py-4 shadow-theme-lg backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/80">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {missing.length === 0 && !emailInvalid
                        ? "Bütün məcburi sahələr doldurulub."
                        : `${missing.length} məcburi sahə qalıb.`}
                </span>
                <Button className="min-w-[12rem]" disabled={blocked}>
                    {loading ? "Göndərilir..." : "Eksperti əlavə et"}
                </Button>
            </div>
        </form>
    );
}
