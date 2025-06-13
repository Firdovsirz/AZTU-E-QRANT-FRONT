import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import MainSmeta from "../../components/mainSmeta/MainSmeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MainSmetaPage() {

  const projectCode = useSelector((state: RootState) => state.auth.projectCode);

  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Projects" />
      <MainSmeta projectCode={projectCode} />
    </div>
  );
}