import { useState } from 'react';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ProjectInfoDetail from '../projectInfoDetail/ProjectInfoDetail';

export default function ProjectDetails() {
    const [message, setMessage] = useState("");
    console.log(message);
    const [infoIsVisible, setInfoIsVisible] = useState(false);
    const handleVisibility = () => {
        setInfoIsVisible(!infoIsVisible);
    }

    return (
        <div>
            <div className='flex justify-between items-start'>
                <div className='w-[100%]'>
                    <Label>Layihınin adı</Label>
                    <div className='flex w-[100%]'>
                        <TextArea
                            value={"Burada layihənin adı qısa aydın və layihənin məzmununu dolğun şəklində əks etdirilir"}
                            onChange={(value) => setMessage(value)}
                            rows={6}
                            className='w-[100%]'
                        />
                        <div style={{ position: "relative" }} >
                            <ProjectInfoDetail info={'Test'} isVisible={infoIsVisible} />
                            <div onClick={handleVisibility} className='' style={{ border: '1px solid black', borderRadius: 5, padding: 10 }}>
                                <InfoOutlineIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Label>Layihənin məqsədi</Label>
                <TextArea
                    value={"Burada: \n Layihənin məqsədi ifadə edilir. \n Layihədə həllinə çalışılan problem (məsələ) təsvir olunur. \n Problemin elmi-tədqiqatın inkişafı üçün aktual olduğu əsaslandırılır"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihənin annotasiyası</Label>
                <TextArea
                    value={"Burada layihənin qısa, dolğun təsviri verilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihə üzrə açar sözlər</Label>
                <TextArea
                    value={"Burada layihənin məzmununu tam əks etdirən açar sözlər verilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihənin elmi ideyası</Label>
                <TextArea
                    value={"Burada layihənin əsas elmi konsepsiyası ( layihənin elmi əsaslarını, nəzəriyyə və metodologiyasını izah edən, onun hansı elmi problemə cavab verdiyini və bu problemin necə həll ediləcəyini əsaslandıran qısa və konkret təsvir hissəsi) qeyd olunur."}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihə üzrə tədqiqatın strukturu</Label>
                <TextArea
                    value={"Burada layihənin iş planı, mərhələləri və tədqiqat üsulları göstərilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihə elmi kollektivinin xarakterizə edilməsi</Label>
                <TextArea
                    value={"Burada layihə rəhbəri və icraçılarının ixtisasları və onların layihə mövzusuna uyğunluq dərəcəsi; əvvəllər həmin sahədə tədqiqat aparmaq təcrübəsi ölkədaxili, regional və beynəlxalq qrant müsabiqələri çərçivəsində; layihə mövzusu üzrə iştirakçıların əsas elmi əsərləri, 8-dan artıq olmamaq şərtilə) göstərilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihənin monitorinqi və davamlığı</Label>
                <TextArea
                    value={"Burada layihənin icrası və nəticələri haqqında ictimaiyyətin məlumatlandırılması və informasiya əldə edilməsi yollarını göstərilr. Layihənin icrası başa çatdıqdan sonra onun davamlılığının təmin olunması istiqamətində görəcələcək işlər qeyd olunur."}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihənin qiymətləndirilməsi və hesabatlılığı </Label>
                <TextArea
                    value={"Burada layihənin qiymətləndirilməsi meyarlarını və hesabatlılıq formaları qeyd olunur. Nail olunmuş dəyişikliyin hansı meyarlar əsasında müəyyənləşdiriləcəyi izah olunur"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>Layihənin tələbləri</Label>
                <TextArea
                    value={"Burada layihə üzrə elmi-tədqiqat işinin yerinə yetirilməsi üçün lazım olan avadanlıq, cihaz və qurğulardan mövcud olanlar haqqında məlumat, əlavə lazım olanlar əsaslandırılır"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
        </div>
    )
}
