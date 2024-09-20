import axios from 'axios'
import {setUser} from "../reducers/userReducer";
import { API_URL } from '../config';

export const registration = async (email, password, confirmPassword) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/registration`, {
            email,
            password,
            confirmPassword
        });
        return response; 
    } catch (e) {
        if (e.response && e.response.data) {
            return e.response; 
        } else {
            return { status: 500, message: "Server error" }; 
        }
    }
};

export const verifyCode = async (email, verificationCode) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/verify`, {
            email,
            verificationCode
        });
        return response;
    } catch (e) {
        if (e.response && e.response.data) {
            return e.response;
        } else {
            return { status: 500, message: "Server error" };
        }
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/forgot-password`, {
            email
        });
        return response;
    } catch (e) {
        if (e.response && e.response.data) {
            return e.response;
        } else {
            return { status: 500, message: "Server error" };
        }
    }
};

export const resetPassword = async (email, resetCode, newPassword, confirmNewPassword) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/reset-password`, {
            email,
            resetCode,
            newPassword,
            confirmNewPassword
        });
        return response;
    } catch (e) {
        if (e.response && e.response.data) {
            return e.response;
        } else {
            return { status: 500, message: "Server error" };
        }
    }
};

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/auth/login`, {
                email,
                password
            });
            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (e) {
            alert(e.response?.data?.message || "Login error");
        }
    };
};

export const auth = () => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get(`${API_URL}api/auth/auth`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setUser(response.data.user));
                localStorage.setItem('token', response.data.token);
            } catch (e) {
                console.error(e.response?.data?.message || "Authorization error");
                if (e.response?.status === 401) {
                    localStorage.removeItem('token');
                }
            }
        }
    };
};

export const uploadAvatar =  (file) => {
    return async dispatch => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await axios.post(`${API_URL}api/files/avatar`, formData,
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

export const deleteAvatar =  () => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files/avatar`,
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}