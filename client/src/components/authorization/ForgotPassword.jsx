import React, { useState } from "react";
import "./authorization.css";
import { requestPasswordReset, resetPassword } from "../../actions/user";
import Input from "../../utils/input/Input";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleRequestReset = async () => {
        await requestPasswordReset(email);
        setIsCodeSent(true);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await resetPassword(email, resetCode, newPassword, confirmNewPassword);
        if (response.status === 200) {
            alert("Password reset successfully!");
        } else {
            alert(response.data.message);
        }
    };

    return (
        <div className="authorization">
            <div className="authorization__header">Forgot Password</div>
            {!isCodeSent ? (
                <div>
                    <Input value={email} setValue={setEmail} type="text" placeholder="Enter your email..." />
                    <button className="authorization__btn" onClick={handleRequestReset}>Send Reset Code</button>
                </div>
            ) : (
                <div>
                    <Input value={resetCode} setValue={setResetCode} type="text" placeholder="Enter reset code..." />
                    <Input value={newPassword} setValue={setNewPassword} type="password" placeholder="New password..." />
                    <Input value={confirmNewPassword} setValue={setConfirmNewPassword} type="password" placeholder="Confirm new password..." />
                    <button className="authorization__btn" onClick={handleResetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
