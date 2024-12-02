import React, { useState } from "react";
import CheckLogin from "../components/CheckLogin";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const getToken = async (url: string, options: Object) => {
        const res1 = await fetch(url, options);
        const res = await res1.json();
        console.log(res);
        if (res.success) return res.authToken;
        for (const e of res.err) {
            if (e.msg)
                toast(e.msg);
            else
                toast(e);
        }
        return "";
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        };
        let url: string = "";
        if (isLogin) {
            url = import.meta.env.VITE_APP_SERVER_HOST + '/login';
        } else {
            url = import.meta.env.VITE_APP_SERVER_HOST + '/signup';
        }
        const authToken = await getToken(url, options);
        if (authToken) {
            setFormData({ username: "", password: "" });
            localStorage.setItem('authToken', authToken);
            navigate('/dashboard');
        }
    };

    return (
        <>
            <CheckLogin />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                    <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">
                        {isLogin ? "Login" : "Signup"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            {isLogin ? "Login" : "Signup"}
                        </button>
                    </form>
                    <div className="mt-4 text-sm text-center text-gray-600">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Signup
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
