import { Link } from "react-router-dom";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { RootState } from "../../redux/store";
import PersonIcon from '@mui/icons-material/Person';
import { setUserType } from "../../redux/slices/authSlice";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export default function SignInUserTypeChoice() {
    const dispatch = useDispatch();
    const location = useLocation();
    console.log(location.pathname);
    
    const userType = useSelector((state: RootState) => state.auth.userType);
    console.log(userType);
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <h1 className="text-center mb-[20px] text-gray-700 dark:text-gray-400">
                    «DAXİLİ QRANT MÜSABİQƏSİ»
                    ELEKTRON İNFORMASİYA SİSTEMİ
                </h1>
                <div className="flex flex-col justify-center">
                    <Button className="mb-[40px]" onClick={() => { dispatch(setUserType(0)) }}>
                        <PersonIcon />
                        İddiaçı
                    </Button>
                    <Button onClick={() => { dispatch(setUserType(1)) }}>
                        <SupervisorAccountIcon />
                        Ekspertlər
                    </Button>
                </div>
                <div className="mt-10 flex justify-center items-center">
                    {location.pathname === '/signin' ? (
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Hesabınız yoxdur? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link
                            to="/signup"
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            Qeydiyyat
                        </Link>
                    </p>
                    ) : (
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Artıq hesabınız mövcuddur? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link
                            to="/signin"
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            Daxil Ol
                        </Link>
                    </p>
                    )}
                </div>
            </div>
        </div>
    );
}