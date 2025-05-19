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

interface ServiceItem {
    project_code: number;
    fin_code?: string;
    services_name: string;
    unit_of_measure: string;
    price: number;
    quantity: number;
    total_amount: number;
}

export default function SmetaServices({ projectCode }: { projectCode: Number | null }) {
    const [servicesName, setServicesName] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const totalAmount = services.reduce((sum, item) => sum + item.total_amount, 0);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get(`/api/get-services/${projectCode}`);
                setServices(response.data);
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await apiClient.post('/api/add-services', {
                project_code: projectCode,
                services_name: servicesName,
                unit_of_measure: unitOfMeasure,
                price,
                quantity,
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Uğurlu!',
                    text: response.data.message,
                });
                window.location.reload();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta!',
                    text: response.data.error || 'Xəta baş verdi',
                });
                window.location.reload();
            }
        } catch (err: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: err.response?.data?.error || 'Sorğu alınmadı',
            });
            window.location.reload();
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
                                    İş və xidmətlərin adları*
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ölcü vahidi
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
                            {services.map((service, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.services_name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.unit_of_measure}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.price}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.total_amount}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block">
                                            Təsdiq olunub
                                        </p>
                                    </TableCell>
                                    {projectRole === 0 && !viewOnly ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DeleteIcon className="text-white cursor-pointer" />
                                            </div>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}

                            {projectRole === 0 && !viewOnly ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={servicesName}
                                            onChange={(e) => setServicesName(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={unitOfMeasure}
                                            onChange={(e) => setUnitOfMeasure(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {price * quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div
                                            onClick={handleSubmit}
                                            className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                        >
                                            <DoneIcon className="text-white cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    colSpan={4}
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {totalAmount}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
