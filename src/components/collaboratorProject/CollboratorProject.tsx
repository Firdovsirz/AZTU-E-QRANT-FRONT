import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import MainSmeta from "../mainSmeta/MainSmeta";
import SmetaOther from "../smetaOther/SmetaOther";
import SmetaTools from "../smetaTools/SmetaTools";
import { useEffect, useState, useRef } from "react";
import SmetaSalary from "../smetaSalary/SmetaSalary";
import NotFoundImage from "../../../public/not_found.png";
import SmetaExpenses from "../smetaExpenses/SmetaExpenses";
import SmetaServices from "../smetaServices/SmetaServices";
import Collaborators from "../collaborators/Collaborators";
import CircularProgress from "@mui/material/CircularProgress";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";

export default function CollboratorProject() {
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    // A person may be an executor on more than one project, so this page holds
    // all of them and shows one at a time.
    const [projectCodes, setProjectCodes] = useState<number[]>([]);
    const [projectCode, setProjectCode] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPdf = async () => {
        console.log("PDF download started");
        setIsExporting(true);
        console.log("Exporting flag set to true");
        await new Promise((resolve) => setTimeout(resolve, 100));

        const element = printRef.current;
        console.log("Checking printRef element:", element);
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        console.log("Canvas created with width:", canvas.width, "and height:", canvas.height);
        const imgData = canvas.toDataURL("image/png");
        console.log("Image data generated for PDF");

        const pdf = new jsPDF("p", "mm", "a4");
        console.log("jsPDF instance created");
        const imgWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("layihe-detallari.pdf");
        console.log("PDF saved as 'layihe-detallari.pdf'");
        console.log("Exporting flag set to false");
        setIsExporting(false);
    };

    useEffect(() => {
        const fetchProjectCodes = async () => {
            try {
                const response = await apiClient.get(`/api/col-project/${finKod}`);

                if (response.data.status === 200) {
                    // `project_codes` is the current shape; `project_code` is the
                    // single-team fallback for an older backend.
                    const codes: number[] = response.data.project_codes
                        ?? (response.data.project_code ? [response.data.project_code] : []);
                    setProjectCodes(codes);
                    setProjectCode(codes[0] ?? null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectCodes();
    }, [finKod]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    };

    return (
        <>
            <style>{`
        /* Safe colors for export only */
        .export-safe * {
          color: #333 !important;
          background-color: transparent !important;
          border-color: #333 !important;
        }
      `}</style>

            <Button
                onClick={handleDownloadPdf}
                className="mb-4 px-4 py-2 bg-blue text-white rounded"
            >
                {isExporting ? <CircularProgress size={20} color="inherit" /> : "PDF yüklə"}
            </Button>

            {/* Only worth a switcher once there really is a second project. */}
            {projectCodes.length > 1 ? (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-sm text-gray-500 dark:text-gray-400">
                        İcraçı olduğunuz layihələr:
                    </span>
                    {projectCodes.map((code, index) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => setProjectCode(code)}
                            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${code === projectCode
                                ? "bg-brand-600 text-white shadow-theme-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300 dark:hover:bg-white/[0.1]"
                                }`}
                        >
                            {index + 1}. layihə
                            <span className="ml-1.5 opacity-70">#{code}</span>
                        </button>
                    ))}
                </div>
            ) : null}

            <div
                ref={printRef}
                className={isExporting ? "export-safe" : ""}
            >
                {projectCode ? (
                    <>
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray">Layihə detalları</h1>
                        <ProjectDetailsView projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihənin komandası</h1>
                        <Collaborators projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə Smetası</h1>
                        <MainSmeta projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə rəhbərinin və icraçıların xidmət haqqı smetası</h1>
                        <SmetaSalary projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası</h1>
                        <SmetaTools projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">İşlərin və xidmətlərin satınalınması smetası</h1>
                        <SmetaServices projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə üzrə icarə xərclər smetası</h1>
                        <SmetaExpenses projectCode={+projectCode} />
                        <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Digər birbaşa xərclər smetası</h1>
                        <SmetaOther projectCode={+projectCode} />
                    </>
                ) : (
                    <div className="w-full flex flex-col justify-center items-center">
                        <img src={NotFoundImage} alt="not-found" className="w-[400px]" />
                        <p
                            className="mt-[10px] text-[30px]"
                            style={{ color: "rgb(18, 32, 87)", fontWeight: 500 }}
                        >
                            Layihə mövcud deyil.
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
