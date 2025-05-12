import { useState } from 'react';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';

export default function ProjectDetails() {
    const [message, setMessage] = useState("");
    return (
        <div>
            <div>
                <Label>LAYİHƏNİN  ADI</Label>
                <TextArea
                    value={"Burada layihənin adı qısa aydın və layihənin məzmununu dolğun şəklində əks etdirilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  MƏQSƏDİ</Label>
                <TextArea
                    value={"Burada: \n Layihənin məqsədi ifadə edilir. \n Layihədə həllinə çalışılan problem (məsələ) təsvir olunur. \n Problemin elmi-tədqiqatın inkişafı üçün aktual olduğu əsaslandırılır"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  ANNOTASIYASI</Label>
                <TextArea
                    value={"Burada layihənin qısa, dolğun təsviri verilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏ  ÜZRƏ  AÇAR  SÖZLƏR </Label>
                <TextArea
                    value={"Burada layihənin məzmununu tam əks etdirən açar sözlər verilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  ELMİ  İDEYASI </Label>
                <TextArea
                    value={"Burada layihənin əsas elmi konsepsiyası ( layihənin elmi əsaslarını, nəzəriyyə və metodologiyasını izah edən, onun hansı elmi problemə cavab verdiyini və bu problemin necə həll ediləcəyini əsaslandıran qısa və konkret təsvir hissəsi) qeyd olunur."}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏ  ÜZRƏ  TƏDQİQATIN  STRUKTURU </Label>
                <TextArea
                    value={"Burada layihənin iş planı, mərhələləri və tədqiqat üsulları göstərilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏ  ELMİ  KOLLEKTİVİN  XARAKTERİZƏ  EDİLMƏSİ </Label>
                <TextArea
                    value={"Burada layihə rəhbəri və icraçılarının ixtisasları və onların layihə mövzusuna uyğunluq dərəcəsi; əvvəllər həmin sahədə tədqiqat aparmaq təcrübəsi ölkədaxili, regional və beynəlxalq qrant müsabiqələri çərçivəsində; layihə mövzusu üzrə iştirakçıların əsas elmi əsərləri, 8-dan artıq olmamaq şərtilə) göstərilir"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  MONİTORİNQİ  VƏ  DAVAMLILIĞI </Label>
                <TextArea
                    value={"Burada layihənin icrası və nəticələri haqqında ictimaiyyətin məlumatlandırılması və informasiya əldə edilməsi yollarını göstərilr. Layihənin icrası başa çatdıqdan sonra onun davamlılığının təmin olunması istiqamətində görəcələcək işlər qeyd olunur."}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  QİYMƏTLƏNDİRİLMƏSİ  VƏ  HESABATLILIĞI </Label>
                <TextArea
                    value={"Burada layihənin qiymətləndirilməsi meyarlarını və hesabatlılıq formaları qeyd olunur. Nail olunmuş dəyişikliyin hansı meyarlar əsasında müəyyənləşdiriləcəyi izah olunur"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
            <div>
                <Label>LAYİHƏNİN  TƏLƏBLƏRİ </Label>
                <TextArea
                    value={"Burada layihə üzrə elmi-tədqiqat işinin yerinə yetirilməsi üçün lazım olan avadanlıq, cihaz və qurğulardan mövcud olanlar haqqında məlumat, əlavə lazım olanlar əsaslandırılır"}
                    onChange={(value) => setMessage(value)}
                    rows={6}
                />
            </div>
        </div>
    )
}
