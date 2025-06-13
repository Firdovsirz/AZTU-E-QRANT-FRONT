import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import SignInAcademicRoleChoice from "../../components/auth/SignInAcademicRoleChoice";

export default function AcademicTypeChoicePage() {
    return (
        <>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <SignInAcademicRoleChoice />
            </AuthLayout>
        </>
    );
}
