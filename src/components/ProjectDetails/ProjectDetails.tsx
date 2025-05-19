import Swal from 'sweetalert2';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import apiClient from '../../util/apiClient';
import TextArea from '../form/input/TextArea';
import { RootState } from '../../redux/store';
// import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
// import ProjectInfoDetail from '../projectInfoDetail/ProjectInfoDetail';

export default function ProjectDetails() {

    // const [infoIsVisible, setInfoIsVisible] = useState(false);

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
    const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) =>  state.auth.projectRole);


    useEffect(() => {
        if (fin_kod) {
            const getProjectByFinKod = async (finKod: string) => {
                try {
                    const response = await apiClient.get(`/api/project/${finKod}`);
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
                    return response.data;
                } catch (error: any) {
                    console.error('Error fetching project by fin_kod:', error);
                    throw error.response?.data || { message: 'An unexpected error occurred' };
                }
            };
            getProjectByFinKod(fin_kod);
        }
    }, [fin_kod]);

    const handleApprove = async () => {
        try {
            const response = await apiClient.post('/api/approve_project', {
                fin_kod,
                project_code: projectCode
            });

            if (response.status === 200) {
                console.log(response.data.message);
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
                        window.location.href = '/user-details'; // adjust the route if needed
                    }
                });
            } else {
                Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
            }
        }
    };

    async function postProjectField(fieldName: string, fieldValue: string) {
        const payload = {
            fin_kod,
            [fieldName]: fieldValue
        };

        try {
            const response = await apiClient.post('/api/save/project', payload);

            if (response.status !== 200) {
                console.error('Error:', response.data?.error || response.data?.message);
            } else {
                console.log('Success:', response.data?.message);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    return (
        <div>
            <div className='flex justify-between items-start'>
                <div className='w-[100%]'>
                    <Label className='mb-[10px]'>Layihınin adı</Label>
                    <div className='w-[100%]'>
                        <TextArea
                            value={projectName}
                            placeholder='Burada layihənin adı qısa aydın və layihənin məzmununu dolğun şəklində əks etdirilir'
                            onChange={(value) => {
                                setProjectName(value)
                                postProjectField('project_name', projectName)
                            }}
                            rows={6}
                            className='w-[100%]'
                        />
                        {/* <div style={{ position: "relative" }} >
                            <ProjectInfoDetail
                                info={'Burada layihənin adı qısa aydın və layihənin məzmununu dolğun şəklində əks etdirilir'}
                                isVisible={infoIsVisible} />
                            <div onClick={handleVisibility} className='' style={{ border: '1px solid black', borderRadius: 5, padding: 10 }}>
                                <InfoOutlineIcon />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin məqsədi</Label>
                <TextArea
                    value={projectGoal}
                    placeholder='Burada: Layihənin məqsədi ifadə edilir. \n Layihədə həllinə çalışılan problem (məsələ) təsvir olunur. \n Problemin elmi-tədqiqatın inkişafı üçün aktual olduğu əsaslandırılır'
                    onChange={(value) => {
                        setProjectGoal(value)
                        postProjectField('project_purpose', projectGoal)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin annotasiyası</Label>
                <TextArea
                    value={projectAnnotation}
                    placeholder='Burada layihənin qısa, dolğun təsviri verilir.'
                    onChange={(value) => {
                        setProjectAnnotation(value)
                        postProjectField('project_annotation', projectAnnotation)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihə üzrə açar sözlər</Label>
                <TextArea
                    value={projectKeyWords}
                    placeholder='Burada layihənin məzmununu tam əks etdirən açar sözlər verilir'
                    onChange={(value) => {
                        setProjectKeyWords(value)
                        postProjectField('project_key_words', projectKeyWords)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin elmi ideyası</Label>
                <TextArea
                    value={projectScientificIdea}
                    placeholder='Burada layihənin əsas elmi konsepsiyası ( layihənin elmi əsaslarını, nəzəriyyə və metodologiyasını izah edən, onun hansı elmi problemə cavab verdiyini və bu problemin necə həll ediləcəyini əsaslandıran qısa və konkret təsvir hissəsi) qeyd olunur.'
                    onChange={(value) => {
                        setProjectScientificIdea(value)
                        postProjectField('project_scientific_idea', projectScientificIdea)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihə üzrə tədqiqatın strukturu</Label>
                <TextArea
                    value={projectStructure}
                    placeholder='Burada layihənin iş planı, mərhələləri və tədqiqat üsulları göstərilir'
                    onChange={(value) => {
                        setProjectStructure(value)
                        postProjectField('project_structure', projectStructure)
                    }}
                    rows={6}
                />
            </div>
            <div>
                <Label className='mb-[10px]'>Layihə elmi kollektivinin xarakterizə edilməsi</Label>
                <TextArea
                    value={projectCharacterize}
                    placeholder='Burada layihə rəhbəri və icraçılarının ixtisasları və onların layihə mövzusuna uyğunluq dərəcəsi; əvvəllər həmin sahədə tədqiqat aparmaq təcrübəsi ölkədaxili, regional və beynəlxalq qrant müsabiqələri çərçivəsində; layihə mövzusu üzrə iştirakçıların əsas elmi əsərləri, 8-dan artıq olmamaq şərtilə) göstərilir.'
                    onChange={(value) => {
                        setProjectCharacterize(value)
                        postProjectField('team_characterization', projectCharacterize)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin monitorinqi və davamlığı</Label>
                <TextArea
                    value={projectMonitoring}
                    placeholder='Burada layihənin icrası və nəticələri haqqında ictimaiyyətin məlumatlandırılması və informasiya əldə edilməsi yollarını göstərilr. Layihənin icrası başa çatdıqdan sonra onun davamlılığının təmin olunması istiqamətində görəcələcək işlər qeyd olunur.'
                    onChange={(value) => {
                        setProjectMonitoring(value)
                        postProjectField('project_monitoring', projectMonitoring)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin qiymətləndirilməsi və hesabatlılığı </Label>
                <TextArea
                    value={projectEvaluation}
                    placeholder='Burada layihənin qiymətləndirilməsi meyarlarını və hesabatlılıq formaları qeyd olunur. Nail olunmuş dəyişikliyin hansı meyarlar əsasında müəyyənləşdiriləcəyi izah olunur'
                    onChange={(value) => {
                        setProjectEvaluation(value)
                        postProjectField('project_assessment', projectEvaluation)
                    }}
                    rows={6}
                />
            </div>
            <div className='mt-[20px]'>
                <Label className='mb-[10px]'>Layihənin tələbləri</Label>
                <TextArea
                    value={projectRequirements}
                    placeholder='Burada layihə üzrə elmi-tədqiqat işinin yerinə yetirilməsi üçün lazım olan avadanlıq, cihaz və qurğulardan mövcud olanlar haqqında məlumat, əlavə lazım olanlar əsaslandırılır.'
                    onChange={(value) => {
                        setProjectRequirements(value)
                        postProjectField('project_requirements', projectRequirements)
                    }}
                    rows={6}
                />
            </div>
            {projectRole === 0 ? (
                <div className='mt-[20px] flex justify-end items-end'>
                <Button onClick={handleApprove}>
                    Təsdiq et
                </Button>
            </div>
            ) : null}
        </div>
    )
}
