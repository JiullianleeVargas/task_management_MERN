
import React, { useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import axios from "axios";

export default function CreateAdmin() {

    const baseUrl = 'http://localhost:3500/admin/';
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [lname, setLName] = useState('');
    const [fname, setFName] = useState('');
    const toast = useRef(null);

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email already exists', life: 3000 });
    };
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'New admin created!', life: 3000 });
    };

    const handleCreateAdmin = () => {
        setVisible(false);
        axios.post(baseUrl + 'createAdmin', {
            email: email,
            password: password,
            lname: lname,
            fname: fname
        })
            .then((response) => {
                console.log(response.data);
                let data = response.data;
                if (data.isInserted === true) {
                    showSuccess();
                } else if (data.isInserted === false) {
                    showError();
                }
            });
    }





    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" severity="danger" />
            <Button label="Create" icon="pi pi-check" onClick={() => handleCreateAdmin()} autoFocus severity="info" />
        </div>
    );

    return (
        <div className="card flex justify-content-center pt-5 pb-2">
            <Toast ref={toast} />
            <Button label="Create Admin Account" icon="pi pi-plus" onClick={() => setVisible(true)} severity="info" />
            <Dialog header="Create Admin" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="card flex flex-column md:flex-row gap-3 py-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText value={fname} onChange={(e) => setFName(e.target.value)} placeholder="First Name" required />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText value={lname} onChange={(e) => setLName(e.target.value)} placeholder="Last Name" required />
                    </div>
                </div>
                <div className="p-inputgroup flex-1 mb-5">
                    <span className="p-inputgroup-addon">
                        @
                    </span>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-lock"></i>
                    </span>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={1} placeholder="Password" required />
                </div>
            </Dialog>
        </div>
    )
}
