import Swal from "sweetalert2";
import Label from "../form/Label";
import { Link } from "react-router";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../services/otp/otp";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [finKod, setFinKod] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await sendOtp(finKod);
      if (res === "SUCCESS") {
        await Swal.fire({
          icon: "success",
          title: "OTP uğurla göndərildi",
          text: "Zəhmət olmasa e-poçt adresinizi yoxlayın",
          showConfirmButton: true
        });
        navigate(`/otp-verification/${finKod}`);
      } else if (res === "NOT FOUND") {
        Swal.fire({
          icon: "error",
          title: "Yanlış fin kod",
          text: "Zəhmət olmasa fin kodun doğruluğundan əmin olun."
        });
      } else if (res === "NO EMAIL") {
        Swal.fire({
          icon: "error",
          title: "E-poçt ünvanı tapılmadı",
          text: "Hesabınıza e-poçt ünvanı bağlanmayıb. Administratora müraciət edin."
        });
      } else if (res === "MAIL FAILED") {
        Swal.fire({
          icon: "error",
          title: "OTP göndərilə bilmədi",
          text: "E-poçt xidmətində problem var. Zəhmət olmasa bir az sonra yenidən cəhd edin və ya administratora müraciət edin."
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Xəta baş verdi",
          text: "Zəhmət olmasa bir az sonra yenidən cəhd edin.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: "Zəhmət olmasa bir az sonra yenidən cəhd edin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-5">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daxil Ol
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sistemə daxil olmaq üçün fin kod və şifrənizi daxil edin!
            </p>
          </div>
          <div>
            <form onSubmit={handleSendOtp}>
              <div className="space-y-5">
                <div>
                  <Label>
                    Fin Kod <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input maxLength={7} placeholder="A1A2A3A" value={finKod} onChange={(e) => { setFinKod(e.target.value.toUpperCase()) }} />
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading || !finKod}>
                    {loading ? "Doğrulanır..." : "Təsdiqlə"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Artıq hesabınız var? {""}
                <Link
                  to="/"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Daxil Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}