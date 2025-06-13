import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SmetaServices from "../../components/smetaServices/SmetaServices";

export default function SmetaServicesPage() {
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="İşlərin və xidmətlərin satınalınması smetası" />
            <SmetaServices projectCode={projectCode} />
        </div>
    );
}