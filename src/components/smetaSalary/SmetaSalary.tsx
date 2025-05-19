import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from "../ui/table";
import Swal from 'sweetalert2';
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';

interface SalaryData {
    id: number;
    project_code: number;
    fin_kod: string;
    salary_per_month: number;
    months: number;
    total_salary: number;
}

interface Owner {
    name?: string;
    surname?: string;
    father_name?: string;
    fin_kod?: string;
    salary?: SalaryData | null;
}

interface Collaborator {
    name?: string;
    surname?: string;
    father_name?: string;
    fin_kod?: string;
    salary?: SalaryData | null;
}

export default function SmetaSalary({ projectCode }: { projectCode: Number | null }) {
    const [owner, setOwner] = useState<Owner>();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [ownerInputs, setOwnerInputs] = useState({ salary: "", months: "" });
    const [collabInputs, setCollabInputs] = useState<{ [finKod: string]: { salary: string, months: string } }>({});

    const handleSaveSalary = async (fin_kod: string, salary: string, months: string) => {
        try {
            await apiClient.post('/api/create-salary-table', {
                project_code: projectCode,
                fin_kod,
                salary_per_month: Number(salary),
                months: Number(months)
            });

            await Swal.fire({
                icon: 'success',
                title: 'Əlavə edildi!',
                text: 'Məlumat uğurla yadda saxlanıldı',
                confirmButtonText: 'OK'
            });

            window.location.reload();
        } catch (error) {
            console.error("Error saving salary:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Məlumatı yadda saxlamaq mümkün olmadı',
                confirmButtonText: 'Bağla'
            });
        }
    };


    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await apiClient.get(`/api/salary/smeta/${projectCode}`);
                setOwner(response.data.project_owner);
                setCollaborators(response.data.collaborators);
            } catch (error) {
                console.error("Failed to fetch salary data:", error);
            }
        };
        fetchSalaries();
    }, []);

    const totalAllSalaries = (owner?.salary?.total_salary || 0) + collaborators.reduce((sum, collaborator) => {
        return sum + (collaborator.salary?.total_salary || 0);
    }, 0);

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
                                    Ad, Soyad, Ata adı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihədə funksiyası
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Aylıq xidmət haqqı {'(manat)'}
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
                                    Layihə üzrə ümumi xidmət haqqı
                                </TableCell>
                                {owner?.salary && !viewOnly ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Təsdiq et
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.name} {owner?.surname} {owner?.father_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    Layihə rəhbəri
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.salary
                                        ? owner.salary.salary_per_month
                                        : (
                                            <Input
                                                placeholder="Xidmət haqqı"
                                                value={ownerInputs.salary}
                                                onChange={(e) => setOwnerInputs({ ...ownerInputs, salary: e.target.value })}
                                            />
                                        )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.salary
                                        ? owner.salary.months
                                        : (
                                            <Input
                                                placeholder="Müddət"
                                                value={ownerInputs.months}
                                                onChange={(e) => setOwnerInputs({ ...ownerInputs, months: e.target.value })}
                                            />
                                        )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.salary?.total_salary}
                                </TableCell>
                                {!viewOnly ? (
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                            <DoneIcon
                                                className="text-white cursor-pointer"
                                                onClick={() => handleSaveSalary(owner?.fin_kod || "", ownerInputs.salary, ownerInputs.months)}
                                            />
                                        </div>
                                    </TableCell>
                                ) : null}
                            </TableRow>
                            {collaborators.map((collaborator, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator?.name} {collaborator?.surname} {collaborator?.father_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Layihə iştirakçısı
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator?.salary
                                                ? collaborator.salary.salary_per_month
                                                : (
                                                    <Input
                                                        placeholder="Xidmət haqqı"
                                                        value={collabInputs[collaborator.fin_kod || ""]?.salary || ""}
                                                        onChange={(e) =>
                                                            setCollabInputs({
                                                                ...collabInputs,
                                                                [collaborator.fin_kod || ""]: {
                                                                    ...collabInputs[collaborator.fin_kod || ""],
                                                                    salary: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator?.salary
                                                ? collaborator.salary.months
                                                : (
                                                    <Input
                                                        placeholder="Müddət"
                                                        value={collabInputs[collaborator.fin_kod || ""]?.months || ""}
                                                        onChange={(e) =>
                                                            setCollabInputs({
                                                                ...collabInputs,
                                                                [collaborator.fin_kod || ""]: {
                                                                    ...collabInputs[collaborator.fin_kod || ""],
                                                                    months: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.salary?.total_salary}
                                        </TableCell>
                                        {!viewOnly ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                    <DoneIcon
                                                        className="text-white cursor-pointer"
                                                        onClick={() =>
                                                            handleSaveSalary(
                                                                collaborator.fin_kod || "",
                                                                collabInputs[collaborator.fin_kod || ""]?.salary || "",
                                                                collabInputs[collaborator.fin_kod || ""]?.months || ""
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                )
                            })}
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
                                    {totalAllSalaries}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
