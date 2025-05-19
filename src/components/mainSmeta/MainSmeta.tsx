import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Button from "../ui/button/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from "../ui/table";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";

interface MainSmeta {
    total_other_smeta?: number,
    total_rent_smeta?: number,
    total_salary_smeta?: number,
    total_services_smeta?: number,
    total_tools_smeta?: number
}

export default function MainSmeta({ projectCode }: { projectCode: Number | null }) {
    console.log(projectCode);
  const [mainSmeta, setMainSmeta] = useState<MainSmeta>({
  total_other_smeta: 0,
  total_rent_smeta: 0,
  total_salary_smeta: 0,
  total_services_smeta: 0,
  total_tools_smeta: 0
});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get(`/api/main-smeta/${projectCode}`);
                console.log(response.data.data);
                setMainSmeta(response.data.data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };
        fetchProjects();
    }, []);
    // Calculate total smeta sum
    const totalSmetaSum =
      (mainSmeta.total_other_smeta || 0) +
      (mainSmeta.total_rent_smeta || 0) +
      (mainSmeta.total_salary_smeta || 0) +
      (mainSmeta.total_services_smeta || 0) +
      (mainSmeta.total_tools_smeta || 0);

    const exportToExcel = () => {
      // Define the headers
      const headers = ["Xərc maddələrinin adları", "Layihə üzrə cəmi", "birinci il üçün", "Ikinci il üçün"];
      // Define the rows dynamically based on backend data
      const rows = [
        [
          "1. Layihə rəhbərinin və icraçıların xidmət haqları",
          mainSmeta.total_salary_smeta ?? 0,
          ".",
          "."
        ],
        [
          "2. Layihə üzrə vergilər və digər məcburi  ödənişlər",
          ".",
          ".",
          "."
        ],
        [
          "3. Dövlət Sosial Müdafiə Fonduna ayırmalar",
          ".",
          ".",
          "."
        ],
        [
          "4. Avadanlıq, cihaz, qurğu və mal-materialların satınalınması*",
          ".",
          ".",
          "."
        ],
        [
          "5. İşlərin və xidmətlərin satınalınması",
          mainSmeta.total_services_smeta ?? 0,
          ".",
          "."
        ],
        [
          "İcarə",
          mainSmeta.total_rent_smeta ?? 0,
          ".",
          "."
        ],
        [
          "Digər birbaşa xərclər",
          mainSmeta.total_other_smeta ?? 0,
          ".",
          "."
        ],
        [
          "Cəm",
          totalSmetaSum,
          0,
          0
        ],
      ];
      const wsData = [headers, ...rows];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Main Smeta");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "main_smeta.xlsx");
    };
    return (
        <>
            <div className="p-4">
              <Button onClick={exportToExcel}>Excelə ixrac et</Button>
            </div>
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

                                    Xərc maddələrinin adları
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə üzrə cəmi

                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    birinci il üçün
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ikinci il üçün
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    1. Layihə rəhbərinin və icraçıların xidmət haqları
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_salary_smeta}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    2. Layihə üzrə vergilər və digər məcburi  ödənişlər
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    3.   Dövlət Sosial Müdafiə Fonduna ayırmalar
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    4. Avadanlıq, cihaz, qurğu və mal-materialların satınalınması* (vergilər və digər məcburi ödənişlər daxil olmaqla)*
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    5.   İşlərin və xidmətlərin satınalınması (çatdırılma, quraşdırılma, sazlanma, sınaqdan keçirilmə, treninqlər və s.)
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_services_smeta}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    İcarə
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_rent_smeta}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    Digər birbaşa xərclər
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_other_smeta}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    .
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {totalSmetaSum}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    0
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    0
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}
