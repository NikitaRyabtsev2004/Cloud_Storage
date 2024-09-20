import React, { useState } from 'react';
import { login } from "../../actions/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import Input from "../../utils/input/Input";
import './authorization.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const handleLogin = async () => {
        try {
            await dispatch(login(email, password));
            setError(""); 
        } catch (e) {
            setError("Неверный пароль или email");
        }
    };

    return (
        <div className='authorization'>
            <div className='authorization__header'>Login</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Email..." />
            <Input value={password} setValue={setPassword} type="password" placeholder="Password..." />
            {error && <div className="error">{error}</div>}
            <button className="authorization__btn" onClick={handleLogin}>Login</button>
            <button className="authorization__btn" onClick={() => navigate('/forgot-password')}>Forgot password?</button> 
        </div>
    );
};

export default Login;
