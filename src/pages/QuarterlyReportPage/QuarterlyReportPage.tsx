import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import QuarterlyReportPanel from "../../components/QuarterlyReport/QuarterlyReportPanel";

export default function QuarterlyReportPage() {
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);

    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="Rüblük Elmi-Texniki Hesabat"
            />
            <PageBreadcrumb pageTitle="Rüblük Elmi-Texniki Hesabat" />

            <QuarterlyReportPanel projectCode={projectCode} />
        </div>
    );
}
