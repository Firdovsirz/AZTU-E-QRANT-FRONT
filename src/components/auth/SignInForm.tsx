import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import apiClient from "../../util/apiClient";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [finKod, setFinKod] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await apiClient.post("/auth/signin", {
                  fin_kod: finKod,
                  password: password,
                }, {
                  withCredentials: true
                });
                
                if (response.status === 200) {
                  const { token, data: fin_kod } = response.data;
                  dispatch(login({ fin_kod, token }));
                  navigate("/");
                }
              } catch (error) {
                Swal.fire("Xəta baş verdi", "Fin kod və ya şifrə yanlışdır", "error");
              }
            }}
          >
            <div className="space-y-6">
              <div>
                <Label>
                  Fin kod <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  placeholder="Fin kod"
                  value={finKod}
                  onChange={(e) => setFinKod(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Şifrə <span className="text-error-500">*</span>{" "}
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
              Don&apos;t have an account? {""}
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
    </div>
  );
}
