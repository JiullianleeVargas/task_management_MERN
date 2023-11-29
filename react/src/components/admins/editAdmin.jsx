import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import axios from "axios";
import { Route, Link, useParams } from 'react-router-dom';


export default function EditAdmin(props) {

    const baseUrl = 'http://localhost:3500/admin/';
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [lname, setLName] = useState('');
    const [fname, setFName] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [admin, setAdmin] = useState([]);
    const toast = useRef(null);

    const queryParameters = new URLSearchParams(window.location.search)
    const admin_ID = queryParameters.get("id")
    console.log("ID: ", admin_ID);

    useEffect(() => {
        if (admin_ID) {
            const fetchData = () => {
                axios.get(baseUrl + `/getAdmin/${admin_ID}`)
                    .then(async (res) => {
                        await console.log(res.data)
                        await setAdmin(res.data[0])

                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            fetchData();
        }
        console.log("admin: ", admin.email);
    }, [admin_ID]);

    const status_ = [
        { name: 'active' },
        { name: 'inactive' }
    ];

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email already exists', life: 3000 });
    };
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'New admin Edited!', life: 3000 });
    };

    const handleEditAdmin = (admin_id) => {
        setVisible(false);
        axios.post(baseUrl + `editadmin/${admin_id}`, {
            email: email,
            password: password,
            lname: lname,
            fname: fname,
            status: status
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



    return (
        <div className="card pt-5 pb-2 mx-5">
            <Toast ref={toast} />
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
            <div className="p-inputgroup flex-1 mb-5">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                </span>
                <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={1} placeholder="Password" required />
            </div>
            <div className="p-inputgroup flex-1 mb-5">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                <MultiSelect showSelectAll={false} value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} options={status_} optionLabel="name"
                    placeholder="Select Status" maxSelectedLabels={1} className="w-full md:w-20rem" />
            </div>
            <Button label="Save" icon="pi pi-check" onClick={() => handleEditAdmin()} autoFocus severity="info" />

        </div>
    )
}
