import { useParams } from "react-router-dom";
import MainSmeta from "../mainSmeta/MainSmeta";
import SmetaOther from "../smetaOther/SmetaOther";
import SmetaTools from "../smetaTools/SmetaTools";
import SmetaSalary from "../smetaSalary/SmetaSalary";
import Collaborators from "../collaborators/Collaborators";
import SmetaServices from "../smetaServices/SmetaServices";
import SmetaExpenses from "../smetaExpenses/SmetaExpenses";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";

export default function ProjectView() {
    const { projectCode } = useParams<{ projectCode: string }>();

    if (!projectCode) {
        return <div>Project code is missing.</div>;
    }

    return (
        <>
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400">Laayihə detalları</h1>
            <ProjectDetailsView projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Laayihənin komandası</h1>
            <Collaborators projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Layihə Smetası</h1>
            <MainSmeta projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Layihə rəhbərinin və icraçıların xidmət haqqı smetası</h1>
            <SmetaSalary projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası</h1>
            <SmetaTools projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">İşlərin və xidmətlərin satınalınması smetası</h1>
            <SmetaServices projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Layihə üzrə icarə xərclər smetası</h1>
            <SmetaExpenses projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400 mt-[20px]">Digər birbaşa xərclər smetası</h1>
            <SmetaOther projectCode={+projectCode} />
        </>
    );
}