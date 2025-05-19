import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from "../ui/table";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';

export interface SubjectOfPurchase {
    id: number;
    project_code: number;
    equipment_name: string;
    unit_of_measure: string;
    price: number;
    quantity: number;
    total_amount: number;
}

export interface SubjectApiResponse {
    data: SubjectOfPurchase[];
}

export default function SmetaTools({ projectCode }: { projectCode: Number | null }) {

    const [equipmentName, setEquipmentName] = useState("");
    const [unit, setUnit] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [subjects, setSubjects] = useState<SubjectOfPurchase[]>([]);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await apiClient.get<SubjectApiResponse>(`/api/subject/smeta/${projectCode}`);
                setSubjects(response.data.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleSaveSubject = async () => {
        try {
            await apiClient.post('/api/add-subject', {
                project_code: projectCode,
                fin_code: "1CEB3D",
                equipment_name: equipmentName,
                unit_of_measure: unit,
                price: Number(price),
                quantity: Number(quantity)
            });

            await Swal.fire({
                icon: 'success',
                title: 'Əlavə edildi!',
                text: 'Məlumat uğurla yadda saxlanıldı',
                confirmButtonText: 'OK'
            });

            window.location.reload();
        } catch (error) {
            console.error("Error saving subject:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Məlumatı yadda saxlamaq mümkün olmadı',
                confirmButtonText: 'Bağla'
            });
        }
    };

    const handleDeleteSubject = async (id: number) => {
        try {
            await apiClient.delete(`/api/delete/smeta/subject/${id}`);
            await Swal.fire({
                icon: 'success',
                title: 'Silindi!',
                text: 'Məlumat uğurla silindi',
                confirmButtonText: 'OK',
            });
            // window.location.reload();

            setSubjects(subjects.filter(subject => subject.id !== id));
        } catch (error) {
            console.error("Error deleting subject:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Məlumatı silmək mümkün olmadı',
                confirmButtonText: 'Bağla',
            });
        }
    };

    const location = useLocation();

    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname])
    console.log(location.pathname);

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Avadanlıq, cihaz, qurğu və mal-materialların adları*
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ölçü vahidi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Vahidin qiyməti {'(manat)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Miqdarı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Cəmi məbləğ {'(manat)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Tesdiq et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {subjects.map((subject, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{subject.equipment_name}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{subject.unit_of_measure}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{subject.price}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{subject.quantity}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{subject.total_amount}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block">
                                            Təsdiq olunub
                                        </p>
                                    </TableCell>
                                    {projectRole === 0 && !viewOnly ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DeleteIcon className="text-white cursor-pointer" onClick={() => handleDeleteSubject(subject.id)} />
                                            </div>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                            {projectRole === 0 && !viewOnly ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input placeholder="Avadanlıq" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input placeholder="Ölçü vahidi" value={unit} onChange={(e) => setUnit(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input placeholder="Qiymət" value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input placeholder="Miqdar" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">-</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                            <DoneIcon className="text-white cursor-pointer" onClick={handleSaveSubject} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    colSpan={4}   // <-- this makes the cell span 4 columns
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {subjects.reduce((acc, item) => acc + item.total_amount, 0)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
