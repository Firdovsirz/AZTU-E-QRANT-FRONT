import PageMeta from "../../components/common/PageMeta";
import UserView from "../../components/userView/UserView";

export default function UserViewPage() {
    return (
        <>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div>
                <UserView />
            </div>
        </>
    )
}
