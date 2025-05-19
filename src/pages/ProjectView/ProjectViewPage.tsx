import PageMeta from "../../components/common/PageMeta";
import ProjectView from "../../components/projectView/ProjectView";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ProjectViewPage() {
    return (
        <div>
            <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Layihə Detalları" />
            <ProjectView />
        </div>
    );
}