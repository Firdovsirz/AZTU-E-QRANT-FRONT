import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectTable from "../../components/projectTable/ProjectTable";

export default function ProjectTablePage() {
  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Projects" />
      <ProjectTable />
    </div>
  );
}