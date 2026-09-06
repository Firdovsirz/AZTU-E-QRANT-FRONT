import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ExpertProjects from "../../components/expertProjects/ExpertProjects";

export default function ExpertProjectsPage() {
    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Ekspert layihələri" description="Sizə təyin olunmuş layihələr" />
            <PageBreadcrumb pageTitle="Qiymətləndirdiyim layihələr" />
            <ExpertProjects />
        </div>
    );
}
