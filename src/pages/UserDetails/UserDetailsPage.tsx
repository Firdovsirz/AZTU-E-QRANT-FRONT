import PageMeta from "../../components/common/PageMeta";
import UserDetails from "../../components/userDetails/UserDetails";

export default function UserDetailsPage() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div>
        <UserDetails />
      </div>
    </>
  )
}
