import { useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import UserDetails from "../../components/userDetails/UserDetails";
import { RootState } from "../../redux/store";

export default function UserDetailsPage() {
  const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div>
        <UserDetails fin_kod={fin_kod} />
      </div>
    </>
  )
}
