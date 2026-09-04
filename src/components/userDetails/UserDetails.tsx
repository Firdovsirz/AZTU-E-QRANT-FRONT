import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import DatePicker from "../form/date-picker";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import FileInput from "../form/input/FileInput";
import Profile from "../../../public/profile.webp";
import PhoneInput from "../form/group-input/PhoneInput";
import IdSeriesInput from "../form/IdSeriesInput";
import { isCompleteIdNumber } from "../../util/idNumber";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CircularProgress from "@mui/material/CircularProgress";
import { setGlobalProfilCompleted } from "../../redux/slices/authSlice";

/**
 * Field order and wording for the profile form.
 *
 * `REQUIRED_FIELDS` mirrors what `POST /api/approve/profile` insists on, so a
 * form that passes here is not bounced by the server with an unhelpful
 * "Missing field". The fields the server wants that the user never types —
 * work_location (from their role), work_email and the work/home phones (copies
 * of the personal ones) — are filled in automatically and left out.
 */
const REQUIRED_FIELDS = [
    "born_date", "personal_id_number", "sex", "born_place", "living_location",
    "citizenship", "work_place", "department", "duty", "main_education",
    "additonal_education", "scientific_degree", "scientific_date",
    "scientific_name", "scientific_name_date",
    "personal_mobile_number", "personal_email",
] as const;

const FIELD_LABELS: Record<string, string> = {
    name: "Ad",
    surname: "Soyad",
    father_name: "Ata adı",
    born_date: "Doğum tarixi",
    born_place: "Doğum yeri",
    personal_id_number: "Şəxsiyyət vəsiqəsinin seriyası",
    sex: "Cinsiyyət",
    living_location: "Yaşayış yeri",
    citizenship: "Vətəndaşlıq",
    work_place: "İş yeri",
    department: "Şöbə",
    duty: "Vəzifə",
    main_education: "Ali təhsil",
    additonal_education: "Əlavə ali təhsil",
    scientific_degree: "Elmi dərəcə",
    scientific_date: "Elmi dərəcənin tarixi",
    scientific_name: "Elmi ad",
    scientific_name_date: "Elmi adın verilmə tarixi",
    personal_mobile_number: "Əlaqə nömrəsi",
    personal_email: "Epoçt ünvanı",
    image: "Profil şəkli",
};

/** One titled block of related fields, laid out on a shared grid. */
function FormSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
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

/** A labelled slot on the section grid, able to show why it was rejected. */
function Field({
    name, label, required = false, error = false, errorText, wide = false, children,
}: {
    name: string;
    label: string;
    required?: boolean;
    error?: boolean;
    errorText?: string;
    wide?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div id={`field-${name}`} className={wide ? "sm:col-span-2" : undefined}>
            <Label>
                {label}
                {required ? <span className="ml-0.5 text-error-500">*</span> : null}
            </Label>
            {children}
            {error ? (
                <p className="mt-1 text-xs font-medium text-error-500">
                    {errorText ?? "Bu sahə doldurulmalıdır"}
                </p>
            ) : null}
        </div>
    );
}

interface UserDetailsFormData {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    personal_id_number: string;
    sex: string;
    born_place: string;
    born_date: string;
    living_location: string;
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
}

export default function UserDetails({ fin_kod }: { fin_kod: string | undefined | null }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const options = [
        { value: "0", label: "Kişi" },
        { value: "1", label: "Qadın" },
    ];

    const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);

    const [instituteName, setInstituteName] = useState("");

    const [formData, setFormData] = useState<UserDetailsFormData>({
        name: "",
        surname: "",
        father_name: "",
        fin_kod: "",
        personal_id_number: "",
        sex: "",
        born_place: "",
        born_date: "",
        living_location: "",
        citizenship: "",
        work_place: "",
        department: "",
        duty: "",
        main_education: "",
        additonal_education: "",
        scientific_degree: "",
        scientific_date: "",
        scientific_name: "",
        scientific_name_date: "",
        work_location: "",
        home_phone: "",
        personal_mobile_number: "",
        work_phone: "",
        personal_email: "",
        work_email: "",
    });
    // Replacing the photo on an already-completed profile.
    const [photoUploading, setPhotoUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Clear the input straight away, otherwise picking the same file twice
        // in a row fires no change event.
        e.target.value = "";
        if (!file || !fin_kod) return;

        const payload = new FormData();
        payload.append("image", file);

        try {
            setPhotoUploading(true);
            const res = await apiClient.post(`/api/profile/${fin_kod}/image`, payload);
            const image = res.data?.data?.image;
            if (image) setUser(prev => (prev ? { ...prev, image } : prev));
            Swal.fire({ icon: "success", title: "Profil şəkli yeniləndi!", confirmButtonText: "OK" });
        } catch (error: any) {
            console.error("Failed to update the profile image:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Şəkli yeniləmək mümkün olmadı.",
                "error"
            );
        } finally {
            setPhotoUploading(false);
        }
    };

    // Which fields the last submit attempt rejected, so the form can point at
    // them instead of only listing names in a dialog.
    const [invalidFields, setInvalidFields] = useState<string[]>([]);
    const isInvalid = (field: string) => invalidFields.includes(field);
    const clearInvalid = (field: string) =>
        setInvalidFields(prev => prev.filter(f => f !== field));

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            sex: value,
        });
        clearInvalid("sex");
    };
    const handlePersonalPhoneNumberChange = (phoneNumber: string) => {
        // The profile carries three numbers but only asks for one; the work and
        // home fields are copies so the server's required-field check passes.
        setFormData({
            ...formData,
            personal_mobile_number: phoneNumber,
            home_phone: phoneNumber,
            work_phone: phoneNumber
        });
        clearInvalid("personal_mobile_number");
    };


    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        clearInvalid(e.target.name);
    };

    /** Set a field the plain input handler cannot reach (pickers, composites). */
    const setField = (field: keyof UserDetailsFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearInvalid(field);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            clearInvalid("image");
        }
    };

    /** Required fields still empty, in form order, plus the missing picture. */
    const missingFields = () => {
        const missing: string[] = REQUIRED_FIELDS.filter(field => {
            const value = formData[field];
            return !value || value.toString().trim() === "";
        });

        // A series with no number ("AZE") is not empty but is not usable either.
        if (!missing.includes("personal_id_number")
            && !isCompleteIdNumber(formData.personal_id_number)) {
            missing.push("personal_id_number");
        }

        if (!image) missing.push("image");
        return missing;
    };

    const filledCount = REQUIRED_FIELDS.length + 1 - missingFields().length;
    const totalCount = REQUIRED_FIELDS.length + 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const missing = missingFields();
        setInvalidFields(missing);

        if (missing.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Aşağıdakı sahələr doldurulmalıdır:",
                html: missing.map(field => `• ${FIELD_LABELS[field] ?? field}`).join("<br>"),
                confirmButtonText: "Bağla"
            }).then(() => {
                // Land the user on the first thing to fix rather than making
                // them hunt for it in a form this long.
                document
                    .getElementById(`field-${missing[0]}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });

            return;
        }

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            if (image) {
                data.append("image", image);
            }

            console.log(data);


            await apiClient.post("/api/approve/profile", data);

            Swal.fire({
                icon: "success",
                title: "Profil uğurla göndərildi!",
                confirmButtonText: "OK"
            });
            dispatch(setGlobalProfilCompleted(1));

            navigate("/home");
        } catch (error: unknown) {
            let errorMessage = "Bilinməyən xəta";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: errorMessage
            });
        }
    };
    const [user, setUser] = useState<UserDetailsFormData | null>(null)
    const [loading, setLoading] = useState(true);
    console.log(user);

    // State for edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<UserDetailsFormData>>({});

    // Open edit modal and prefill data (all editable fields)
    const handleOpenEditModal = () => {
        if (user) {
            setEditFormData({
                name: user.name || "",
                surname: user.surname || "",
                father_name: user.father_name || "",
                personal_id_number: user.personal_id_number || "",
                sex: user.sex || "",
                born_date: user.born_date || "",
                born_place: user.born_place || "",
                living_location: user.living_location || "",
                citizenship: user.citizenship || "",
                work_place: user.work_place || "",
                department: user.department || "",
                duty: user.duty || "",
                main_education: user.main_education || "",
                additonal_education: user.additonal_education || "",
                scientific_degree: user.scientific_degree || "",
                scientific_name: user.scientific_name || "",
                scientific_date: user.scientific_date || "",
                scientific_name_date: user.scientific_name_date || "",
                work_location: user.work_location || "",
                work_phone: user.work_phone || "",
                work_email: user.work_email || ""
            });
            setIsEditModalOpen(true);
        }
    };

    // Edit input change handler
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    // Edit modal submit handler
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fin_kod) return;

        // A value saved before the series became a fixed list may have no
        // recognised prefix, so this also catches an old record on its way past.
        if (!isCompleteIdNumber(editFormData.personal_id_number)) {
            Swal.fire({
                icon: "warning",
                title: "Şəxsiyyət vəsiqəsinin seriyası tam deyil",
                text: "Seriyanı seçin və nömrəni tam daxil edin.",
                confirmButtonText: "Bağla"
            });
            return;
        }

        try {
            const res = await apiClient.put(`/api/profile/${fin_kod}/edit`, editFormData);

            if (res.status === 200) {
                setUser((prev) => ({ ...prev!, ...editFormData }));
                Swal.fire({
                    icon: "success",
                    title: "İstifadəçi məlumatları yeniləndi!",
                    confirmButtonText: "OK"
                });
                setIsEditModalOpen(false);
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: "Məlumatları yeniləmək alınmadı!"
            });
        }
    };

    useEffect(() => {
        apiClient.get(`/api/profile/${fin_kod}`)
            .then((res) => {
                setUser(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const userFinKod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            fin_kod: userFinKod ?? "Not given"
        }));
    }, [userFinKod]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            home_phone: "Not given"
        }));
    }, []);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            work_location:
                projectRole !== null
                    ? projectRole === 0
                        ? "Layihə rəhbəri"
                        : projectRole === 1
                            ? "Lahiyə icraçısı"
                            : "Not Given"
                    : "Not Given"
        }));
    }, [projectRole]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            work_email: prev.personal_email
        }));
    }, [formData.personal_email]);
    useEffect(() => {
        if (!user?.institution_code) return;

        const getInstitution = async () => {
            try {
                const response = await apiClient.get(`/api/institution/${user.institution_code}`);
                console.log(response);
                if (response.data.status === 200) {
                    setInstituteName(response.data.data);
                } else if (response.data.status === 404) {
                    setInstituteName("NOT FOUND");
                }
            } catch (error) {
                console.error("Failed to fetch institution:", error);
                setInstituteName("NOT FOUND");
            }
        };

        getInstitution();
    }, [user?.institution_code]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };


    return (
        <>
            {profileCompleted === 1 ? (
                <>
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-4 mb-[50px]">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col items-center w-full gap-4 xl:flex-row">
                                {/* The photo used to be fixed once the profile was
                                    completed; the overlay button replaces it. */}
                                <div className="group relative h-20 w-20 shrink-0">
                                    <img
                                        src={user?.image ? `data:image/jpeg;base64,${user.image}` : Profile}
                                        alt="User"
                                        className="h-full w-full rounded-full border border-gray-200 object-cover dark:border-gray-800"
                                    />

                                    <button
                                        type="button"
                                        title="Profil şəklini dəyiş"
                                        onClick={() => photoInputRef.current?.click()}
                                        disabled={photoUploading}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-900/55 text-white opacity-0 transition-opacity duration-200 focus:opacity-100 focus:outline-none group-hover:opacity-100 disabled:opacity-100"
                                    >
                                        {photoUploading
                                            ? <CircularProgress size={22} color="inherit" />
                                            : <PhotoCameraIcon style={{ width: 22, height: 22 }} />}
                                    </button>

                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={handlePhotoReplace}
                                    />
                                </div>
                                <div className="order-3 xl:order-2">
                                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                        {user?.name} {user?.surname}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
                                    Şəxsi məlumatlar
                                </h4>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-x-10">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Soyad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.surname || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ata adı
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.father_name || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Fin kod
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.fin_kod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Şəxsiyyet vəsiqəsinin seriyası
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_id_number || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Cinsiyyət
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.sex !== undefined && user?.sex !== null
                                                ? user.sex === "0"
                                                    ? "Kişi"
                                                    : "Qadın"
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Doğum tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.born_date
                                                ? new Date(user.born_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Doğum yeri
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.born_place || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Vətandaşlıq
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.citizenship || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            İş yeri
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_place || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Şöbə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.department || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Vəzifə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.duty || ""}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ali təhsil
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.main_education || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlavə Ali təhsil
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.additonal_education || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi dərəcə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_degree || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi dərəcənin tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_date
                                                ? new Date(user.scientific_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi ad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_name || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi adın verilmə tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_name_date
                                                ? new Date(user.scientific_name_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Lahiyə rolu
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {/* {projectRole === 0 ? "Layihə rəhbəri" : "Layihə icraçısı"} */}
                                            {user?.work_location}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlaqə nömrəsi - şəxsi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_mobile_number || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlaqə nömrəsi - koperativ
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_phone || ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Epoçt-Adres
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Epoçt- Adres - koperativ
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Müəssisə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {instituteName ? instituteName : "Mövcud deyil"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Edit Button */}
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleOpenEditModal} className="bg-brand-600 hover:bg-brand-700 text-white">
                            Redaktə et
                        </Button>
                    </div>
                    {/* Edit Modal */}
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        className="max-w-3xl mx-auto max-h-[90vh] overflow-y-auto p-5 sm:p-8 lg:p-10"
                    >
                        <div className="mx-auto w-full max-w-3xl">
                            <form onSubmit={handleEditSubmit}>
                              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                                <div>
                                  <Label>Ad</Label>
                                  <Input type="text" name="name" value={editFormData.name ?? user?.name ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Soyad</Label>
                                  <Input type="text" name="surname" value={editFormData.surname ?? user?.surname ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Ata adı</Label>
                                  <Input type="text" name="father_name" value={editFormData.father_name ?? user?.father_name ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Şəxsiyyet vəsiqəsinin seriyası</Label>
                                  <IdSeriesInput
                                    value={editFormData.personal_id_number ?? user?.personal_id_number ?? ""}
                                    onChange={(value) =>
                                      setEditFormData(prev => ({ ...prev, personal_id_number: value }))
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Cinsiyyət</Label>
                                  <Input type="text" name="sex" value={editFormData.sex ?? user?.sex ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Doğum tarixi</Label>
                                  <Input type="date" name="born_date" value={editFormData.born_date ?? user?.born_date ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Doğum yeri</Label>
                                  <Input type="text" name="born_place" value={editFormData.born_place ?? user?.born_place ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Yaşayış yeri</Label>
                                  <Input type="text" name="living_location" value={editFormData.living_location ?? user?.living_location ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Vətəndaşlıq</Label>
                                  <Input type="text" name="citizenship" value={editFormData.citizenship ?? user?.citizenship ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>İş yeri</Label>
                                  <Input type="text" name="work_place" value={editFormData.work_place ?? user?.work_place ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Şöbə</Label>
                                  <Input type="text" name="department" value={editFormData.department ?? user?.department ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Vəzifə</Label>
                                  <Input type="text" name="duty" value={editFormData.duty ?? user?.duty ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Ali təhsil</Label>
                                  <Input type="text" name="main_education" value={editFormData.main_education ?? user?.main_education ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Əlavə ali təhsil</Label>
                                  <Input type="text" name="additonal_education" value={editFormData.additonal_education ?? user?.additonal_education ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Elmi dərəcə</Label>
                                  <Input type="text" name="scientific_degree" value={editFormData.scientific_degree ?? user?.scientific_degree ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Elmi ad</Label>
                                  <Input type="text" name="scientific_name" value={editFormData.scientific_name ?? user?.scientific_name ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Elmi dərəcənin tarixi</Label>
                                  <Input type="date" name="scientific_date" value={editFormData.scientific_date ?? user?.scientific_date ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Elmi adın verilmə tarixi</Label>
                                  <Input type="date" name="scientific_name_date" value={editFormData.scientific_name_date ?? user?.scientific_name_date ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Lahiyə rolu</Label>
                                  <Input type="text" name="work_location" value={editFormData.work_location ?? user?.work_location ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Əlaqə nömrəsi - koperativ</Label>
                                  <Input type="text" name="work_phone" value={editFormData.work_phone ?? user?.work_phone ?? ""} onChange={handleEditInputChange} />
                                </div>
                                <div>
                                  <Label>Epoçt- Adres - koperativ</Label>
                                  <Input type="text" name="work_email" value={editFormData.work_email ?? user?.work_email ?? ""} onChange={handleEditInputChange} />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setIsEditModalOpen(false)}>
                                  Ləğv et
                                </Button>
                                <Button className="hover:bg-green-700 text-white">Yadda saxla</Button>
                              </div>
                            </form>
                        </div>
                    </Modal>
                </>
            ) : (
                <>
                    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
                        <div className="mb-6 rounded-2xl border border-brand-200/70 bg-brand-50/60 p-5 dark:border-brand-500/20 dark:bg-brand-500/10">
                            <h1 className="text-base font-bold tracking-tight text-brand-900 dark:text-brand-100 sm:text-lg">
                                Şəxsi məlumatlarınızı tamamlayın
                            </h1>
                            <p className="mt-1 text-sm text-brand-800/80 dark:text-brand-200/80">
                                Digər səhifələrə giriş üçün <span className="font-semibold">*</span> ilə işarələnmiş
                                bütün sahələri doldurun və təsdiq edin.
                            </p>

                            {/* A long form is easier to face when you can see how much is left. */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/70 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${Math.round((filledCount / totalCount) * 100)}%` }}
                                    />
                                </div>
                                <span className="shrink-0 text-xs font-semibold text-brand-800 dark:text-brand-200">
                                    {filledCount}/{totalCount}
                                </span>
                            </div>
                        </div>

                        <form action="" onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6">
                            <FormSection
                                title="Şəxsi məlumatlar"
                                hint="Ad, soyad və FIN kod hesabınızdan gəlir və dəyişdirilə bilməz."
                            >
                                <Field name="name" label="Ad" required>
                                    {user?.name ? (
                                        <Input type="text" name="name" value={user.name} readOnly disabled />
                                    ) : (
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}
                                </Field>

                                <Field name="surname" label="Soyad" required>
                                    {user?.surname ? (
                                        <Input type="text" name="surname" value={user.surname} readOnly disabled />
                                    ) : (
                                        <Input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}
                                </Field>

                                <Field name="father_name" label="Ata adı" required>
                                    {user?.father_name ? (
                                        <Input type="text" name="father_name" value={user.father_name} readOnly disabled />
                                    ) : (
                                        <Input
                                            type="text"
                                            name="father_name"
                                            value={formData.father_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}
                                </Field>

                                <Field name="fin_kod" label="FIN kod">
                                    <Input type="text" name="fin_kod" value={formData.fin_kod} readOnly disabled />
                                </Field>

                                <Field name="born_date" label="Doğum tarixi" required error={isInvalid("born_date")}>
                                    <DatePicker
                                        id="birth-date-picker"
                                        value={formData.born_date}
                                        placeholder="Tarix seçin"
                                        onChange={(_dates, currentDateString) => setField("born_date", currentDateString)}
                                    />
                                </Field>

                                <Field name="born_place" label="Doğum yeri" required error={isInvalid("born_place")}>
                                    <Input
                                        type="text"
                                        name="born_place"
                                        placeholder="Bakı, Azərbaycan"
                                        value={formData.born_place}
                                        onChange={handleChange}
                                        error={isInvalid("born_place")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="personal_id_number"
                                    label="Şəxsiyyət vəsiqəsinin seriyası"
                                    required
                                    error={isInvalid("personal_id_number")}
                                    errorText="Seriyanı seçin və nömrəni tam daxil edin"
                                >
                                    <IdSeriesInput
                                        required
                                        error={isInvalid("personal_id_number")}
                                        value={formData.personal_id_number}
                                        onChange={(value) => setField("personal_id_number", value)}
                                    />
                                </Field>

                                <Field name="sex" label="Cinsiyyət" required error={isInvalid("sex")}>
                                    <Select
                                        options={options}
                                        placeholder="Cinsiyyət seçin"
                                        defaultValue={formData.sex}
                                        onChange={handleSelectChange}
                                        className={`dark:bg-dark-900 ${isInvalid("sex") ? "border-error-400" : ""}`}
                                    />
                                </Field>

                                <Field name="citizenship" label="Vətəndaşlıq" required error={isInvalid("citizenship")}>
                                    <Input
                                        type="text"
                                        name="citizenship"
                                        placeholder="Azərbaycan"
                                        value={formData.citizenship}
                                        onChange={handleChange}
                                        error={isInvalid("citizenship")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="living_location"
                                    label="Yaşayış yeri"
                                    required
                                    wide
                                    error={isInvalid("living_location")}
                                >
                                    <Input
                                        type="text"
                                        name="living_location"
                                        placeholder="Şəhər, rayon, küçə, ev"
                                        value={formData.living_location}
                                        onChange={handleChange}
                                        error={isInvalid("living_location")}
                                        required
                                    />
                                </Field>
                            </FormSection>

                            <FormSection title="İş yeri və vəzifə">
                                <Field name="work_place" label="İş yeri" required error={isInvalid("work_place")}>
                                    <Input
                                        type="text"
                                        name="work_place"
                                        value={formData.work_place}
                                        onChange={handleChange}
                                        error={isInvalid("work_place")}
                                        required
                                    />
                                </Field>

                                <Field name="department" label="Şöbə" required error={isInvalid("department")}>
                                    <Input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        error={isInvalid("department")}
                                        required
                                    />
                                </Field>

                                <Field name="duty" label="Vəzifə" required error={isInvalid("duty")}>
                                    <Input
                                        type="text"
                                        name="duty"
                                        value={formData.duty}
                                        onChange={handleChange}
                                        error={isInvalid("duty")}
                                        required
                                    />
                                </Field>

                                <Field name="work_location" label="Layihə rolu">
                                    <Input type="text" name="work_location" value={formData.work_location} readOnly disabled />
                                </Field>
                            </FormSection>

                            <FormSection title="Təhsil və elmi fəaliyyət">
                                <Field name="main_education" label="Ali təhsil" required error={isInvalid("main_education")}>
                                    <Input
                                        type="text"
                                        name="main_education"
                                        value={formData.main_education}
                                        onChange={handleChange}
                                        error={isInvalid("main_education")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="additonal_education"
                                    label="Əlavə ali təhsil"
                                    required
                                    error={isInvalid("additonal_education")}
                                >
                                    <Input
                                        type="text"
                                        name="additonal_education"
                                        value={formData.additonal_education}
                                        onChange={handleChange}
                                        error={isInvalid("additonal_education")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="scientific_degree"
                                    label="Elmi dərəcə"
                                    required
                                    error={isInvalid("scientific_degree")}
                                >
                                    <Input
                                        type="text"
                                        name="scientific_degree"
                                        value={formData.scientific_degree}
                                        onChange={handleChange}
                                        error={isInvalid("scientific_degree")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="scientific_date"
                                    label="Elmi dərəcənin tarixi"
                                    required
                                    error={isInvalid("scientific_date")}
                                >
                                    <DatePicker
                                        id="scientific-date-picker"
                                        value={formData.scientific_date}
                                        placeholder="Tarix seçin"
                                        onChange={(_dates, currentDateString) => setField("scientific_date", currentDateString)}
                                    />
                                </Field>

                                <Field name="scientific_name" label="Elmi ad" required error={isInvalid("scientific_name")}>
                                    <Input
                                        type="text"
                                        name="scientific_name"
                                        value={formData.scientific_name}
                                        onChange={handleChange}
                                        error={isInvalid("scientific_name")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="scientific_name_date"
                                    label="Elmi adın verilmə tarixi"
                                    required
                                    error={isInvalid("scientific_name_date")}
                                >
                                    <DatePicker
                                        id="scientific-name-date-picker"
                                        value={formData.scientific_name_date}
                                        placeholder="Tarix seçin"
                                        onChange={(_dates, currentDateString) => setField("scientific_name_date", currentDateString)}
                                    />
                                </Field>
                            </FormSection>

                            <FormSection
                                title="Əlaqə və profil şəkli"
                                hint="Əlaqə nömrəsi və epoçt ünvanı həm şəxsi, həm də işlə bağlı yazışmalar üçün istifadə olunur."
                            >
                                <Field
                                    name="personal_mobile_number"
                                    label="Əlaqə nömrəsi"
                                    required
                                    error={isInvalid("personal_mobile_number")}
                                >
                                    <PhoneInput
                                        selectPosition="start"
                                        placeholder="+994 50 000 00 00"
                                        onChange={handlePersonalPhoneNumberChange}
                                    />
                                </Field>

                                <Field name="personal_email" label="Epoçt ünvanı" required error={isInvalid("personal_email")}>
                                    <Input
                                        type="email"
                                        name="personal_email"
                                        placeholder="ad.soyad@aztu.edu.az"
                                        value={formData.personal_email}
                                        onChange={handleChange}
                                        error={isInvalid("personal_email")}
                                        required
                                    />
                                </Field>

                                <Field
                                    name="image"
                                    label="Profil şəkli"
                                    required
                                    error={isInvalid("image")}
                                    errorText="Profil şəkli yükləyin"
                                >
                                    <FileInput className="custom-class" onChange={handleImageChange} />
                                    {image ? (
                                        <p className="mt-1 truncate text-xs text-success-600 dark:text-success-400">
                                            Seçildi: {image.name}
                                        </p>
                                    ) : null}
                                </Field>
                            </FormSection>

                            {/* Stays in reach at the bottom of a long form. */}
                            <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white/90 px-5 py-4 shadow-theme-lg backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/80">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {filledCount === totalCount
                                        ? "Bütün məcburi sahələr doldurulub."
                                        : `${totalCount - filledCount} məcburi sahə qalıb.`}
                                </span>
                                <Button className="min-w-[10rem]">
                                    Təsdiq edin
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}