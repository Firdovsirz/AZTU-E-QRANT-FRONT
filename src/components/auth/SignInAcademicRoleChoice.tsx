import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { setAcademicType, setUserType } from "../../redux/slices/authSlice";

export default function SignInAcademicRoleChoice() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-[50px] text-gray-700 dark:text-gray-400 sm:text-start flex items-center" onClick={() => {dispatch(setUserType(null))}}>
                    <ArrowBackIosIcon /> Əvvəl
                </div>
                <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400">Akademik Rol</h1>
                <div className="flex flex-col justify-center">
                    <Button className="mb-[40px]" onClick={() => { dispatch(setAcademicType("0")) }}>
                        Müəllim
                    </Button>
                    <Button className="mb-[40px]" onClick={() => { dispatch(setAcademicType("1")) }}>
                        Doktorant
                    </Button>
                    <Button className="mb-[40px]" onClick={() => { dispatch(setAcademicType("2")) }}>
                        Magistr
                    </Button>
                </div>
            </div>
        </div>
    );
}