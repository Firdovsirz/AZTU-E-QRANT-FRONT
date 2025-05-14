import {
    Table,
    TableCell,
    TableHeader,
    TableBody,
    TableRow
} from "../ui/table";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ProjectTable() {
    return (
        <>
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            User
                        </TableCell>
                    </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    <TableRow>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            Ad, Soyad, Ata adi
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}