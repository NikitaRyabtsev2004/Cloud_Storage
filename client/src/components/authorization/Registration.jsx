import React, { useState } from 'react';
import './authorization.css';
import Input from "../../utils/input/Input";
import { registration, verifyCode } from "../../actions/user"; 

const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false); 
    const [verificationCode, setVerificationCode] = useState(""); 

    const handleRegistration = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
    
        const response = await registration(email, password, confirmPassword);
        if (response.status === 200) {
            setIsRegistered(true);
        } else {
            alert(response.message || "An error occurred during registration");
        }
    };

    const handleVerifyCode = async () => {
        const response = await verifyCode(email, verificationCode);
        if (response.status === 200) {
            alert("Account activated successfully!");
        } else {
            alert(response.message || "Invalid verification code.");
        }
    };

    return (
        <div className="authorization">
            <div className="authorization__header">Registration</div>
            {!isRegistered ? (
                <div>
                    <Input value={email} setValue={setEmail} type="text" placeholder="Enter email..." />
                    <Input value={password} setValue={setPassword} type="password" placeholder="Enter password..." />
                    <Input value={confirmPassword} setValue={setConfirmPassword} type="password" placeholder="Confirm password..." />
                    <button className="authorization__btn" onClick={handleRegistration}>Register</button>
                </div>
            ) : (
                <div>
                    <Input value={verificationCode} setValue={setVerificationCode} type="text" placeholder="Enter verification code..." />
                    <button className="authorization__btn" onClick={handleVerifyCode}>Verify Code</button>
                </div>
            )}
        </div>
    );
};

export default Registration;
