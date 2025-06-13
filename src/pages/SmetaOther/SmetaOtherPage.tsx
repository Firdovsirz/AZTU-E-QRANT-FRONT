import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import SmetaOther from "../../components/smetaOther/SmetaOther";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function SmetaOtherPage() {

  const projectCode = useSelector((state: RootState) => state.auth.projectCode);

  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Digər birbaşa xərclər smetası" />
      <SmetaOther projectCode={projectCode} />
    </div>
  );
}