import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectTable from "../../components/projectTable/ProjectTable";
import MainSmeta from "../../components/mainSmeta/MainSmeta";
import Collaborators from "../../components/collaborators/Collaborators";

export default function CollaboratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Projects" />
      <Collaborators />
    </div>
  );
}