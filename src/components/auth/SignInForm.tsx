import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import apiClient from "../../util/apiClient";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { loginSuccess, setAcademicType, setFinKod } from "../../redux/slices/authSlice";

export default function SignInForm() {
  const [finKod, setFinKodInterally] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(finKod);


  const { userType, academicType } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(userType, academicType, finKod, password);

    if (
      userType === null ||
      academicType === null ||
      finKod.length === 0 ||
      password.length === 0
    ) {
      return Swal.fire("Xəta", "Bütün məlumatları doldurun", "error");
    }

    try {
      const response = await apiClient.post(
        "/auth/signin",
        {
          user_type: userType,
          academic_type: academicType,
          fin_kod: finKod,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const authData = response.data.data.auth;
        const projectCode = response.data.data.project_code;
        const profileCompleted = response.data.data.profile_completed;
        const token = response.data.token;
        const projectRole = response.data.data.auth.project_role;
        console.log("project role", projectRole);

        dispatch(setFinKod(finKod));
        dispatch(loginSuccess({ token, user: authData, projectCode, profileCompleted }));
        {projectRole === 0 ? navigate("/project-offer") : navigate("/")}
        // navigate("/");
      }
    } catch (error) {
      Swal.fire("Xəta baş verdi", "Fin kod və ya şifrə yanlışdır", "error");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-[50px] text-gray-700 dark:text-gray-400 sm:text-start flex items-center" onClick={() => { dispatch(setAcademicType(null)) }}>
          <ArrowBackIosIcon /> Əvvəl
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                Fin kod <span className="text-error-500">*</span>
              </Label>
              <Input
                value={finKod}
                placeholder="Fin Kod"
                onChange={(e) => setFinKodInterally(e.target.value)} />
              {/* If editable is required, you can update it from another step */}
            </div>
            <div>
              <Label>
                Şifrə <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrənizi daxil edin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>
            <div>
              <Button className="w-full" size="sm">
                Daxil Ol
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}