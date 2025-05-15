import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SmetaTools from "../../components/smetaTools/SmetaTools";
import SmetaServices from "../../components/smetaServices/SmetaServices";

export default function SmetaServicesPage() {
    return (
        <div>
            <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Layihə maaş" />
            <SmetaServices />
        </div>
    );
}