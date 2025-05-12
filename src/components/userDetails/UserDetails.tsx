import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import Header from "../header/Header";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import PhoneInput from "../form/group-input/PhoneInput";
import DropzoneComponent from "../../components/form/form-elements/DropZone";

// Define interface for form data
interface UserDetailsFormData {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    personal_id_number: string;
    sex: string;
    born_place: string;
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
}

export default function UserDetails() {
    const navigate = useNavigate();
    const options = [
        { value: "0", label: "Kişi" },
        { value: "1", label: "Qadın" },
    ];
    
    
    const [formData, setFormData] = useState<UserDetailsFormData>({
        name: "",
        surname: "",
        father_name: "",
        fin_kod: "",
        personal_id_number: "",
        sex: "",
        born_place: "",
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
        work_email: ""
    });
    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            sex: value,
        });
    };
    const handleHomePhoneNumberChange = (phoneNumber: string) => {
        setFormData({
            ...formData,
            home_phone: phoneNumber,
        });
    };
    const handlePersonalPhoneNumberChange = (phoneNumber: string) => {
        setFormData({
            ...formData,
            personal_mobile_number: phoneNumber,
        });
    };
    const handleCorporativePhoneNumberChange = (phoneNumber: string) => {
        setFormData({
            ...formData,
            work_phone: phoneNumber,
        });
    };
    

    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const requiredFields: (keyof UserDetailsFormData)[] = [
            "name", "surname", "father_name", "fin_kod", "personal_id_number", "sex", "born_place",
            "living_location", "citizenship", "work_place", "department", "duty", "main_education",
            "additonal_education", "scientific_degree", "scientific_date", "scientific_name",
            "scientific_name_date", "work_location", "home_phone", "personal_mobile_number", "work_phone",
            "personal_email", "work_email"
        ];
    
        const emptyFields = requiredFields.filter(field => {
            const value = formData[field];
            return !value || value.toString().trim() === "";
        });
    
        if (emptyFields.length > 0 || !image) {
            const formattedFieldNames = emptyFields
                .map(field => `• ${field.replace(/_/g, " ")}`)
                .join("<br>");
    
            const imageWarning = !image ? "<br>• şəkil" : "";
    
            Swal.fire({
                icon: "warning",
                title: "Aşağıdakı sahələr doldurulmalıdır:",
                html: formattedFieldNames + imageWarning,
                confirmButtonText: "Bağla"
            });
    
            return;
        }
    
        // If all fields are filled, submit the form
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
    
            if (image) {
                data.append("image", image);
            }
    
            await apiClient.post("/api/approve/profile", data);
    
            Swal.fire({
                icon: "success",
                title: "Profil uğurla göndərildi!",
                confirmButtonText: "OK"
            });
    
            navigate("/");
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


    return (
        <>
            <Header />
            <div className="w-[100%] flex flex-col justify-center items-center p-[50px]">
                <h1 className="text-[20px] text-center text-gray-400 dark:text-white/60 mb-10 mt-10">
                    Digər səhifələrə giriş icazəsi üçün bütün məlumatları doldurun və təsdiq edin!
                </h1>
                <form action="" onSubmit={(e) => handleSubmit(e)}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                        <div className="col-span-2 lg:col-span-1">
                            <Label>Ad</Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Soyad</Label>
                            <Input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Ata adı</Label>
                            <Input
                                type="text"
                                name="father_name"
                                value={formData.father_name}
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Fin kod</Label>
                            <Input
                                type="text"
                                name="fin_kod"
                                value={formData.fin_kod}
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Şəxsiyyət vəsiqəsinin seriyası</Label>
                            <Input
                                type="text"
                                name="personal_id_number"
                                value={formData.personal_id_number}
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Cinsiyyət</Label>
                            <Select
                                options={options}
                                placeholder="Cinsiyyət seçin"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Doğum yeri</Label>
                            <Input
                                type="text"
                                name="born_place"
                                value={formData.born_place}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Yaşayış yeri</Label>
                            <Input
                                type="text"
                                name="living_location"
                                value={formData.living_location}
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Vətəndaşlıq</Label>
                            <Input
                                type="text"
                                name="citizenship"
                                value={formData.citizenship}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>İş yeri</Label>
                            <Input
                                type="text"
                                name="work_place"
                                value={formData.work_place}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Şöbə</Label>
                            <Input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Vəzifə</Label>
                            <Input
                                type="text"
                                name="duty"
                                value={formData.duty}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Ali təhsil</Label>
                            <Input
                                type="text"
                                name="main_education"
                                value={formData.main_education}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Əlavə ali təhsil</Label>
                            <Input
                                type="text"
                                name="additonal_education"
                                value={formData.additonal_education}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Elmi dərəcə</Label>
                            <Input
                                type="text"
                                name="scientific_degree"
                                value={formData.scientific_degree}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Elmi dərəcənin tarixi</Label>
                            <Input
                                type="text"
                                name="scientific_date"
                                value={formData.scientific_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Elmi ad</Label>
                            <Input
                                type="text"
                                name="scientific_name"
                                value={formData.scientific_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Elmi adın verilmə tarixi</Label>
                            <Input
                                type="text"
                                name="scientific_name_date"
                                value={formData.scientific_name_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Lahiyə rolu</Label>
                            <Input
                                type="text"
                                name="work_location"
                                value={formData.work_location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <Label>Ev telefonu</Label>
                            <PhoneInput
                                selectPosition="start"
                                placeholder="+1 (555) 000-0000"
                                onChange={handleHomePhoneNumberChange}
                            />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <Label>Əlaqə nömrəsi-şəxsi</Label>
                            <PhoneInput
                                selectPosition="start"
                                placeholder="+1 (555) 000-0000"
                                onChange={handlePersonalPhoneNumberChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Əlaqə nömrəsi-koperativ</Label>
                            <PhoneInput
                                selectPosition="start"
                                placeholder="+1 (555) 000-0000"
                                onChange={handleCorporativePhoneNumberChange}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Epoçt-adres</Label>
                            <Input
                                type="text"
                                name="personal_email"
                                value={formData.personal_email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Epoçt-adres-koperativ</Label>
                            <Input
                                type="text"
                                name="work_email"
                                value={formData.work_email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Şəkil yüklə</Label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            <DropzoneComponent />
                        </div>
                    </div>
                    <Button className="mt-10">
                        Təsdiq edin
                    </Button>
                </form>
            </div>
        </>
    );
}