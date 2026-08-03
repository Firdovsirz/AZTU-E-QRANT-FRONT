import apiClient from "../../util/apiClient";

export type SendOtpResult = "SUCCESS" | "NOT FOUND" | "NO EMAIL" | "MAIL FAILED" | "ERROR";

export const sendOtp = async (fin_kod: string): Promise<SendOtpResult> => {
    // axios rejects on every non-2xx, so the failure cases must be read from
    // the thrown error — testing `response.data.status` alone never sees them.
    try {
        const response = await apiClient.post(`/auth/send-otp/${fin_kod}`);
        return response.data?.status === 200 ? "SUCCESS" : "ERROR";
    } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) return "NOT FOUND";
        if (status === 422) return "NO EMAIL";
        // 502: the OTP was generated but the mail could not be delivered.
        if (status === 502) return "MAIL FAILED";
        console.error("Send OTP error:", err);
        return "ERROR";
    }
}


export const validateOtp = async (fin_kod: string, otp: number) => {
    try {
        const response = await apiClient.post(`/auth/validate-otp/${fin_kod}/${otp}`);
        if (response.data.status === 200 && response.data.data) {
            return response.data.data;
        } else if (response.data.status === 400 || response.data.status === 404) {
            return "UNAUTHORIZED";
        } else {
            return "ERROR";
        }
    } catch (err) {
        console.error("Validate OTP error:", err);
        return "ERROR";
    }
};