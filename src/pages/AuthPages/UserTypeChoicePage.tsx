import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import SignInUserTypeChoice from "../../components/auth/SignInUserTypeChoice";

export default function UserTypeChoicePage() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInUserTypeChoice />
      </AuthLayout>
    </>
  );
}
