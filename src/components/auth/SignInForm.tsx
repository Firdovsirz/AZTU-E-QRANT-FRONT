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
import { loginSuccess, setFinKod, setUserType } from "../../redux/slices/authSlice";

/** FIN codes are 7 characters; an expert signs in with their e-mail instead. */
const FIN_PATTERN = /^[A-Z0-9]{7}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const looksLikeEmail = (value: string) => value.includes("@");

/** null when the identifier is usable, otherwise why it is not. */
function identifierError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (looksLikeEmail(trimmed)) {
    return EMAIL_PATTERN.test(trimmed) ? null : "E-poçt ünvanı düzgün formatda deyil.";
  }
  return FIN_PATTERN.test(trimmed) ? null : "FIN kod 7 simvoldan ibarət olmalıdır.";
}

export default function SignInForm() {
  const [finKod, setFinKodInterally] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(finKod);


  const { userType } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      userType === null ||
      // academicType === null ||
      finKod.length === 0 ||
      password.length === 0
    ) {
      return Swal.fire("Xəta", "Bütün məlumatları doldurun", "error");
    }

    const identifierProblem = identifierError(finKod);
    if (identifierProblem) {
      return Swal.fire("Xəta", identifierProblem, "error");
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        "/auth/signin",
        {
          user_type: userType,
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
        const is_collaborator = response.data.data.is_collaborator;
        const token = response.data.token;
        const projectRole = response.data.data.auth.project_role;
        console.log("project role", projectRole);

        const mustChangePassword = !!response.data.data.must_change_password;

        dispatch(setFinKod(finKod));
        dispatch(loginSuccess({
          token, user: authData, is_collaborator, projectCode, profileCompleted,
          mustChangePassword,
        }));

        // An expert arrives with a one-time password from their appointment
        // e-mail and cannot go anywhere until they replace it.
        if (mustChangePassword) {
          navigate("/change-password");
        } else if (projectRole === 3) {
          navigate("/expert/projects");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      Swal.fire("Xəta baş verdi", "FIN kod / e-poçt və ya şifrə yanlışdır", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-[50px] text-gray-700 dark:text-gray-400 sm:text-start flex items-center">
          <div className="cursor-pointer" onClick={() => { dispatch(setUserType(null)) }}>
            <ArrowBackIosIcon /> Əvvəl
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                FIN kod və ya e-poçt <span className="text-error-500">*</span>
              </Label>
              <Input
                // Long enough for an address; a FIN is still capped by the
                // pattern check rather than by the field length.
                maxLength={254}
                value={finKod}
                placeholder="FIN kod və ya e-poçt ünvanı"
                error={!!identifierError(finKod)}
                onChange={(e) => {
                  const raw = e.target.value;
                  // An expert's identifier is an address — leave its case alone.
                  setFinKodInterally(looksLikeEmail(raw) ? raw.trim() : raw.toUpperCase());
                }} />
              {identifierError(finKod) ? (
                <p className="mt-1 text-xs font-medium text-error-500">{identifierError(finKod)}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Ekspertlər e-poçt ünvanı ilə daxil olurlar.
                </p>
              )}
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
            <div className="flex items-center justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Şifrəmi unutdum?
                  </Link>
                </div>
            <div>
              <Button
                className="w-full"
                size="sm"
                disabled={
                  loading ||
                  !finKod.trim() ||
                  !!identifierError(finKod) ||
                  !password.trim() ||
                  userType === null
                }
              >
                {loading ? "Giriş edilir..." : "Daxil Ol"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Hesabınız yoxdur? &nbsp;&nbsp;
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Qeydiyyat
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}