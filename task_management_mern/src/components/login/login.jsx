import React, { useState } from 'react';
import axios, { AxiosError } from "axios";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";


const Login = (props) => {
    const baseUrl = 'http://localhost:3500/admin/login';
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form submission

        fetch(baseUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then(response => response.json())
            .then(value => {
                if (value.auth === true) {
                    window.location.href = "/sidebar/tasks";
                } else if (value.auth === false) {
                    window.location.href = "login";
                }
            })
    };


    return (

        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <div className='flex align-items-center justify-content-left h-50'>
                        <img src="/images/favicon.png" alt="logo" height={50} className="mb-3" />
                        <span style={{ fontSize: '20px' }} className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">TechSpire</span>
                    </div>
                    <div className="text-900 text-3xl font-medium mb-3">Login</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email" type="text" placeholder="Email address" className="w-full mb-3"
                        name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required />


                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password" type="password" placeholder="Password" className="w-full mb-5"
                        name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required />

                    <Button label="Login" icon="pi pi-user" className="w-full" type="submit" />
                </form>
            </div>
        </div>

    );
};

export default Login;