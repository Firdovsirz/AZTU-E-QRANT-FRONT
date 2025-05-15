import React, { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
} from "../ui/table";
import Input from "../form/input/InputField";
import DoneIcon from "@mui/icons-material/Done";
import Swal from "sweetalert2";
import apiClient from "../../util/apiClient";

interface RentItem {
    id?: number;
    project_code: number;
    rent_area: string;
    unit_of_measure: string;
    unit_price: number;
    quantity: number;
    duration: number;
    total_amount: number;
}

export default function SmetaExpenses() {
    const projectCode = 58744983;

    const [rents, setRents] = useState<RentItem[]>([]);

    const [rentArea, setRentArea] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [duration, setDuration] = useState(0);

    const totalAmount = unitPrice * quantity * duration;

    useEffect(() => {
        async function fetchRents() {
            try {
                const response = await apiClient.get(`/api/get-rent-all-tables/${projectCode}`);
                setRents(response.data);
            } catch (error) {
                console.error("Failed to fetch rents", error);
            }
        }
        fetchRents();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await apiClient.post("/api/rent", {
                project_code: projectCode,
                rent_area: rentArea,
                unit_of_measure: unitOfMeasure,
                unit_price: unitPrice,
                quantity,
                duration,
                total_amount: totalAmount,
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: response.data.message,
                });
                window.location.reload();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Xəta!",
                    text: response.data.error || "Xəta baş verdi",
                });
                window.location.reload();
            }
        } catch (error: any) {
            await Swal.fire({
                icon: "error",
                title: "Xəta!",
                text: error.response?.data?.error || "Sorğu alınmadı",
            });
            window.location.reload();
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                İcarəyə götürüləcək daşınar və daşınmaz əmlakın adı*
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
                                Vahidin qiyməti (manat)
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
                                Müddət (ay)
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Cəmi məbləğ (manat)
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
                        {rents.map((rent) => (
                            <TableRow key={rent.id}>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.rent_area}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.unit_of_measure}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.unit_price}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.quantity}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.duration}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {rent.total_amount}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <Input
                                    type="text"
                                    value={rentArea}
                                    onChange={(e) => setRentArea(e.target.value)}
                                    placeholder="Ərazi"
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
                                    placeholder="Qiymət"
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
                                {rents.reduce((sum, r) => sum + r.total_amount, 0)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}
