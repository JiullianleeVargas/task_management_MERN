
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

export default function CreateAdmin() {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [lname, setLName] = useState('');
    const [fname, setFName] = useState('');
    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" severity="danger" />
            <Button label="Create" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus severity="info" />
        </div>
    );

    return (
        <div className="card flex justify-content-center py-5">
            <Button label="Create Admin Account" icon="pi pi-plus" onClick={() => setVisible(true)} severity="info" />
            <Dialog header="Create Admin" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="card flex flex-column md:flex-row gap-3 py-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText value={fname} onChange={(e) => setFName(e.target.value)} placeholder="First Name" />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText value={lname} onChange={(e) => setLName(e.target.value)} placeholder="Last Name" />
                    </div>
                </div>
                <div className="p-inputgroup flex-1 mb-5">
                    <span className="p-inputgroup-addon">
                        @
                    </span>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-lock"></i>
                    </span>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={1} placeholder="Password" />
                </div>
            </Dialog>
        </div>
    )
}
