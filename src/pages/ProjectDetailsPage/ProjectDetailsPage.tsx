import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";

export default function ProjectDetailsPage() {
  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Layihə Detalları" />
      <ProjectDetails />
    </div>
  );
}