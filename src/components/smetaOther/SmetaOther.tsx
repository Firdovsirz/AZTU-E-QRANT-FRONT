import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell, TableFooter
} from "../ui/table";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from '@mui/icons-material/Delete';


interface OtherExpItem {
    id: number;
    project_code: number;
    expenses_name: string;
    unit_of_measure: string;
    unit_price: number;
    quantity: number;
    duration: number;
    total_amount: number;
}

export default function SmetaOther({ projectCode }: { projectCode: Number | null }) {
    const [otherExps, setOtherExps] = useState<OtherExpItem[]>([]);
    const [expensesName, setExpensesName] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [duration, setDuration] = useState(0);
    const totalAmount = unitPrice * quantity * duration;
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const location = useLocation();

    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname])
    console.log(location.pathname);


    useEffect(() => {
        async function fetchOtherExps() {
            try {
                const response = await apiClient.get(`/api/get-other_exp-all-tables/${projectCode}`);
                setOtherExps(response.data);
            } catch (error) {
                console.error("Failed to fetch other expenses", error);
            }
        }
        fetchOtherExps();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await apiClient.post('/api/other_exp', {
                project_code: projectCode,
                expenses_name: expensesName,
                unit_of_measure: unitOfMeasure,
                unit_price: unitPrice,
                quantity,
                duration,
                total_amount: totalAmount,
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
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: error.response?.data?.error || 'Sorğu alınmadı',
            });
            window.location.reload();
        }
    };

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
                                    Xərc maddələrinin adı*
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
                                    Müddət {'(ay)'}
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
                                    Təsdiq et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {otherExps.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.expenses_name}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.unit_of_measure}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.unit_price}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.quantity}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.duration}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.total_amount}</TableCell>
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
                                            value={expensesName}
                                            onChange={(e) => setExpensesName(e.target.value)}
                                            placeholder="Xərc maddəsinin adı"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={unitOfMeasure}
                                            onChange={(e) => setUnitOfMeasure(e.target.value)}
                                            placeholder="Ölçü vahidi"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="number"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                                            placeholder="Vahid qiyməti"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            placeholder="Miqdar"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            placeholder="Müddət"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {totalAmount}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div
                                            onClick={handleSubmit}
                                            className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                            title="Təsdiq et"
                                        >
                                            <DoneIcon className="text-white" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    colSpan={5}
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {otherExps.reduce((sum, item) => sum + item.total_amount, 0)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
