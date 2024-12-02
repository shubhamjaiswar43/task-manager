import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckLogin: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const hostname = import.meta.env.VITE_APP_SERVER_HOST;
        const authToken: (string | null) = localStorage.getItem('authToken');
        const method = "GET";
        const headers = {
            'Content-Type': 'application/json',
            ...(authToken ? { authToken } : {})
        }
        document.body.style.filter = 'blur(10px)';
        if (authToken) {
            fetch(`${hostname}/task`, {
                method,
                headers
            }).then((res) => res.json()).then((res) => {
                if (!res.success) {
                    if (window.location.pathname !== '/') {
                        navigate('/');
                    }
                } else {
                    if (window.location.pathname === '/') {
                        navigate('/dashboard');
                    }
                }
                document.body.style.filter = '';
            });
        } else {
            if (window.location.pathname !== '/') {
                navigate('/');
            }
            document.body.style.filter = '';
        }
    }, []);
    return <></>
}
export default CheckLogin;