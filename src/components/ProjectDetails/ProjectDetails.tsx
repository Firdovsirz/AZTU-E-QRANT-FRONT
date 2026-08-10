// import './ProjectDetails.css';
import Swal from 'sweetalert2';
import Label from '../form/Label';
import Select from '../form/Select';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Input from '../form/input/InputField';
import apiClient from '../../util/apiClient';
import TextArea from '../form/input/TextArea';
import ProjectFilesUpload from './ProjectFilesUpload';
import { RootState } from '../../redux/store';
import CircularProgress from '@mui/material/CircularProgress';
import { setGlobalProjectCode } from '../../redux/slices/authSlice';

/**
 * The project content form.
 *
 * By default it edits the signed-in lead's project in the ACTIVE competition.
 * Passing `archiveProjectCode` switches it to archive mode: it edits that one
 * archived project instead — only possible after an admin unlocked it, which
 * the backend re-checks on every read and write.
 */
export default function ProjectDetails({ archiveProjectCode }: { archiveProjectCode?: number } = {}) {
    const isArchiveEdit = archiveProjectCode != null;
    const [projectName, setProjectName] = useState("");
    const [projectGoal, setProjectGoal] = useState("");
    const [projectKeyWords, setProjectKeyWords] = useState("");
    const [projectStructure, setProjectStructure] = useState("");
    const [projectMonitoring, setProjectMonitoring] = useState("");
    const [projectAnnotation, setProjectAnnotation] = useState("");
    const [projectEvaluation, setProjectEvaluation] = useState("");
    const [projectCharacterize, setProjectCharacterize] = useState("");
    const [projectRequirements, setProjectRequirements] = useState("");
    const [projectScientificIdea, setProjectScientificIdea] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [prioritet, setPrioritet] = useState("");
    const [collaboratorLimit, setCollaboratorLimit] = useState<number | null>(7);
    const [maxSmetaExpense, setMaxSmetaExpense] = useState<number | null>(200000);
    const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const [loading, setLoading] = useState(false);
    const [projectApproved, setProjectApproved] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState<boolean | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const dispatch = useDispatch();

    // An archived project is only editable because an admin unlocked it, so
    // `submitted` (always true for a past season) must not freeze the form.
    const fieldsDisabled = !isArchiveEdit && !!submitted;

    useEffect(() => {
        if (!isArchiveEdit && !fin_kod) return;

        const loadProject = async () => {
            try {
                setLoading(true);
                setLoadError(null);
                const response = isArchiveEdit
                    ? await apiClient.get(`/api/archive/project/${archiveProjectCode}`)
                    : await apiClient.get(`/api/project/${fin_kod}`);
                setProjectName(response.data.data.project_name);
                setProjectGoal(response.data.data.project_purpose);
                setProjectAnnotation(response.data.data.project_annotation);
                setProjectKeyWords(response.data.data.project_key_words);
                setProjectScientificIdea(response.data.data.project_scientific_idea);
                setProjectStructure(response.data.data.project_structure);
                setProjectCharacterize(response.data.data.team_characterization);
                setProjectMonitoring(response.data.data.project_monitoring);
                setProjectEvaluation(response.data.data.project_assessment);
                setProjectRequirements(response.data.data.project_requirements);
                setProjectCode(response.data.data.project_code);
                setCollaboratorLimit(response.data.data.collaborator_limit);
                setMaxSmetaExpense(response.data.data.max_smeta_amount);
                setPrioritet(response.data.data.priotet || "");
                setProjectApproved(response.data.data.approved);
                setSubmitted(response.data.data.submitted);
            } catch (error: any) {
                console.error('Error fetching project:', error);
                if (isArchiveEdit) {
                    setLoadError(
                        error.response?.status === 403
                            ? 'Bu arxiv layihəsi redaktəyə bağlıdır. Administratora müraciət edin.'
                            : 'Arxiv layihəsi yüklənə bilmədi.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [fin_kod, archiveProjectCode, isArchiveEdit]);

    const handleApprove = async () => {
        if (
            !(projectName?.trim()) ||
            !(projectGoal?.trim()) ||
            !(projectAnnotation?.trim()) ||
            !(projectKeyWords?.trim()) ||
            !(projectScientificIdea?.trim()) ||
            !(projectStructure?.trim()) ||
            !(projectCharacterize?.trim()) ||
            !(projectMonitoring?.trim()) ||
            !(projectEvaluation?.trim()) ||
            !(projectRequirements?.trim()) ||
            !(prioritet?.trim())
        ) {
            await Swal.fire({
                icon: 'warning',
                title: 'Diqqət!',
                text: 'Layihəni təsdiqləmək üçün bütün xanalari doldurun.',
                confirmButtonText: 'Bağla'
            });
            return;
        }

        try {
            const response = await apiClient.post('/api/approve_project', {
                fin_kod,
                // Omit rather than send "" — the backend then resolves this
                // user's project in the active competition.
                ...(projectCode ? { project_code: projectCode } : {})
            });

            if (response.status === 200) {
                if (projectCode) dispatch(setGlobalProjectCode(+projectCode));
                Swal.fire('Uğur!', 'Layihə uğurla təsdiqləndi.', 'success');
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                Swal.fire({
                    title: 'Xəta!',
                    text: 'Layihəni təsdiq etmək üçün ilk növbədə şəxsi məlumatlarınızı təmin etməlisiniz!',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Şəxsi məlumatlara keç',
                    cancelButtonText: 'Bağla'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/user-details/:fin_kod';
                    }
                });
            } else {
                Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
            }
        }
    };

    const handleSubmitProject = async () => {
        Swal.fire({
            title: 'Əminsiniz?',
            text: 'Layihəni təqdim etmək istədiyinizdən əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Bəli, təqdim et',
            cancelButtonText: 'Xeyr'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiClient.post('/api/submit-project', { project_code: projectCode });
                    if (response.status === 200) {
                        Swal.fire('Uğur!', 'Layihə uğurla təqdim olundu.', 'success');
                    }
                } catch (error) {
                    console.error('Error submitting project:', error);
                    Swal.fire('Xəta!', 'Layihəni təqdim edərkən xəta baş verdi.', 'error');
                }
            }
        });
    };

    async function postProjectField(fieldName: string, fieldValue: string) {
        const payload = {
            fin_kod,
            // In archive mode the project is addressed explicitly — without it
            // the backend would target the ACTIVE competition's project.
            ...(isArchiveEdit ? { project_code: archiveProjectCode } : {}),
            [fieldName]: fieldValue
        };

        try {
            const response = await apiClient.post('/api/save/project', payload);

            if (response.status !== 200) {
                console.error('Error:', response.data?.error || response.data?.message);
            } else {
                // The first save of a brand-new proposal is what creates the
                // row, so this is where the form learns its project_code —
                // without it "Təsdiq et" would submit an empty code.
                const savedCode = response.data?.project_code;
                if (savedCode && !projectCode) {
                    setProjectCode(savedCode);
                    if (!isArchiveEdit) dispatch(setGlobalProjectCode(+savedCode));
                }
            }
        } catch (error: any) {
            console.error('Network error:', error);
            if (error.response?.status === 403) {
                Swal.fire('Xəta!', 'Bu layihə redaktəyə bağlıdır. Administratora müraciət edin.', 'error');
            }
        }
    };

    const [prioritetOptions, setPrioritetOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchPrioritets = async () => {
            try {
                const response = await apiClient.get("/api/priotets");
                const data = response.data?.data || [];
                setPrioritetOptions(
                    data.map((p: any) => ({
                        value: p.prioritet_code,
                        label: p.prioritet_name
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch prioritet options:", err);
            }
        };
        fetchPrioritets();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[300px] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    };

    if (loadError) {
        return (
            <div className="rounded-2xl border border-error-200 bg-error-50 p-8 text-center text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                {loadError}
            </div>
        );
    }

    return (
        <div>
            <div className='mt-[20px] flex justify-between items-center mb-[20px]'>
                <div style={{
                    width: "calc((100% / 2) - 10px)"
                }}>
                    <Label className='mb-[10px]'>Layihənin icraçı sayı (maksimum 7)</Label>
                    <Input
                        type='number'
                        value={collaboratorLimit ? collaboratorLimit : 0}
                        max={7}
                        placeholder='Burada: Layihənin məqsədi ifadə edilir. \n Layihədə həllinə çalışılan problem (məsələ) təsvir olunur. \n Problemin elmi-tədqiqatın inkişafı üçün aktual olduğu əsaslandırılır'
                        onChange={(e) => {
                            const value = Math.min(+e.target.value, 7);
                            setCollaboratorLimit(value);
                            postProjectField('collaborator_limit', String(value));
                        }}
                        disabled={fieldsDisabled}
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 10px)"
                }}>
                    <Label className='mb-[10px]'>Layihənin maksimum smeta xərci (maksimum 200000 AZN)</Label>
                    <Input
                        type='number'
                        value={maxSmetaExpense ? maxSmetaExpense : 0}
                        max={200000}
                        placeholder='Burada: Layihənin məqsədi ifadə edilir. \n Layihədə həllinə çalışılan problem (məsələ) təsvir olunur. \n Problemin elmi-tədqiqatın inkişafı üçün aktual olduğu əsaslandırılır'
                        onChange={(e) => {
                            const value = Math.min(+e.target.value, 200000);
                            setMaxSmetaExpense(value);
                            postProjectField('max_smeta_amount', String(value));
                        }}
                        disabled={fieldsDisabled}
                    />
                </div>
            </div>
            <div className='flex justify-between items-start mb-[20px]'>
                <div className='w-[100%]'>
                    <Label className='mb-[10px]'>Layihə prioriteti</Label>
                    <div className='w-[100%]'>
                        <Select
                            options={prioritetOptions}
                            defaultValue={prioritet || undefined}
                            placeholder='Layihə prioriteti'
                            onChange={(option: any) => {
                                const value = typeof option === 'string' ? option : option?.value;
                                setPrioritet(value || "");
                                postProjectField('priotet', value || "");
                            }}
                            className='w-[100%]'
                            disabled={fieldsDisabled}
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-start'>
                <div className='w-[100%]'>
                    <Label className='mb-[10px]'>Layihənin adı</Label>
                    <div className='w-[100%]'>
                        <TextArea
                            value={projectName}
                            placeholder='Layihənin adı qısa aydın və layihənin məzmununu dolğun şəklində əks etdirməlidir'
                            onChange={(value) => {
                                setProjectName(value)
                                postProjectField('project_name', value)
                            }}
                            rows={6}
                            className='w-[100%]'
                            disabled={fieldsDisabled}
                        />
                    </div>
                </div>
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin məqsədi, qarşıya qoyulan məsələlərin, aktuallığının əsaslandırılması (2-5 səhifə)</Label>
                <TextArea
                    value={projectGoal}
                    placeholder='Layihənin məqsədini ifadə edin. Layihədə həllinə çalışmaq istədiyiniz problemi (məsələni) təsvir edin. Problemin elmi-tədqiqatın inkişafı üçün aktual olduğunu əsaslandırın.'
                    onChange={(value) => {
                        setProjectGoal(value)
                        postProjectField('project_purpose', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin annotasiyası (0,5-1 səhifə)</Label>
                <TextArea
                    value={projectAnnotation}
                    placeholder='Layihənin annotasiyası'
                    onChange={(value) => {
                        setProjectAnnotation(value)
                        postProjectField('project_annotation', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin məzmununu tam əks etdirən açar sözlər</Label>
                <TextArea
                    value={projectKeyWords}
                    placeholder='Layihədə əsas açar sözləri qeyd edin.'
                    onChange={(value) => {
                        setProjectKeyWords(value)
                        postProjectField('project_key_words', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin elmi ideyası. (1-2 səhifə)</Label>
                <TextArea
                    value={projectScientificIdea}
                    placeholder='Burada layihənin əsas elmi konsepsiyası ( layihənin elmi əsaslarını, nəzəriyyə və metodologiyasını izah edən, onun hansı elmi problemə cavab verdiyini və bu problemin necə həll ediləcəyini əsaslandıran qısa və konkret təsvir hissəsi) qeyd olunur.'
                    onChange={(value) => {
                        setProjectScientificIdea(value)
                        postProjectField('project_scientific_idea', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}

                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihə üzrə tədqiqatın strukturu (1-2 səhifə)</Label>
                <TextArea
                    value={projectStructure}
                    placeholder='Burada layihənin iş planı, mərhələləri və tədqiqat üsulları göstərilməlidir'
                    onChange={(value) => {
                        setProjectStructure(value)
                        postProjectField('project_structure', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}

                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Elmi kollektivin xarakterizə edilməsi</Label>
                <TextArea
                    value={projectCharacterize}
                    placeholder='Layihə rəhbəri və icraçılarının ixtisasları və onların layihə mövzusuna uyğunluq dərəcəsi; əvvəllər həmin sahədə tədqiqat aparmaq təcrübəsi ölkədaxili, regional və beynəlxalq qrant müsabiqələri çərçivəsində; layihə mövzusu üzrə iştirakçıların əsas elmi əsərləri, 8-dan artıq olmamaq şərtilə'
                    onChange={(value) => {
                        setProjectCharacterize(value)
                        postProjectField('team_characterization', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}

                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin monitorinqi və davamlılığı (1-2 səhifə)</Label>
                <TextArea
                    value={projectMonitoring}
                    placeholder='Layihənin icrası və nəticələri haqqında ictimaiyyətin məlumatlandırılması və informasiya əldə edilməsi yollarını göstərin. Layihənin icrası başa çatdıqdan sonra onun davamlılığının təmin olunması istiqamətində görəcəyiniz işləri qeyd edin.'
                    onChange={(value) => {
                        setProjectMonitoring(value)
                        postProjectField('project_monitoring', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}

                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin qiymətləndirilməsi və hesabatlılığı (1-2 səhifə)</Label>
                <TextArea
                    value={projectEvaluation}
                    placeholder='Layihənin qiymətləndirilməsi meyarlarını və hesabatlılıq formalarını qeyd edin. Nail olunmuş dəyişikliyin hansı meyarlar əsasında müəyyənləşdiriləcəyini izah edin.'
                    onChange={(value) => {
                        setProjectEvaluation(value)
                        postProjectField('project_assessment', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}

                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin tələbləri</Label>
                <TextArea
                    value={projectRequirements}
                    placeholder='Layihə üzrə elmi-tədqiqat işinin yerinə yetirilməsi üçün lazım olan avadanlıq, cihaz və qurğulardan mövcud olanlar haqqında məlumat, əlavə lazım olanların əsaslandırılması'
                    onChange={(value) => {
                        setProjectRequirements(value)
                        postProjectField('project_requirements', value)
                    }}
                    rows={6}
                    disabled={fieldsDisabled}
                />
            </div>
            <ProjectFilesUpload projectCode={projectCode} disabled={fieldsDisabled} />
            {projectRole === 0 ? (
                <div className='mt-[20px] flex justify-end items-end'>
                    <Button onClick={handleApprove}>
                        Təsdiq et
                    </Button>
                </div>
            ) : null}
            {/* Re-submitting would rewrite `submitted_at` of a closed season,
                so the archive form leaves the submission record untouched. */}
            {!isArchiveEdit && (projectRole === 0 || projectRole === 2) ? (
                <div className='mt-[20px] flex justify-end items-end'>
                    <Button onClick={handleSubmitProject} disabled={!projectApproved}>
                        Layihəni təqdim et
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
