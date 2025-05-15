import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SmetaSalry from "../../components/smetaSalary/SmetaSalary";
import SmetaExpenses from "../../components/smetaExpenses/SmetaExpenses";

export default function SmetaExpensesPage() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Layihə maaş" />
      <SmetaExpenses />
    </div>
  );
}