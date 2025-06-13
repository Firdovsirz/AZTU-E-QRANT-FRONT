import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SmetaSalry from "../../components/smetaSalary/SmetaSalary";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function SmetaSalaryPage() {
  const projectCode = useSelector((state: RootState) => state.auth.projectCode);
  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Layihə rəhbərinin və icraçıların xidmət haqqı smetası" />
      <SmetaSalry projectCode={projectCode}/>
    </div>
  );
}