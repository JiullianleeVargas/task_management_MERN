import React, { useState, useEffect } from 'react';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import CreateAdmin from './createAdmin';
import { Outlet, Link } from "react-router-dom";


const Admins = () => {
    const baseUrl = 'http://localhost:3500/admin/';
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        axios.get(baseUrl + '/getAdmins')
            .then(response => {
                console.log(response.data.admins);
                setAdmins(response.data.admins);
            });
    }, []);

    const emailBodyTemplate = (admin) => {
        return <div>
            <img src={`/images/avatar.png`} alt={admin.image}
                style={{ width: "24px", height: "24px" }} />
            <label style={{ marginLeft: "10px" }}><Link to={`/main/editAdmin/${admin._id}`} style={{ textDecoration: 'none' }}>{admin.email}</Link></label>
        </div>;
    };

    const statusBodyTemplate = (admin) => {
        return <Tag value={admin.status} severity={getSeverity(admin)}></Tag>;
    };

    const getSeverity = (admin) => {
        switch (admin.status) {
            case 'inactive':
                return 'warning';

            case 'active':
                return 'success';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Administrators</span>
            <CreateAdmin />
        </div>
    );
    const footer = `In total there are ${admins ? admins.length : 0} Administrators.`;
    console.log("admin length: ", admins);
    return (
        <div className="card">
            <div className="flex flex-wrap align-items-center justify-content-between gap-2 px-3">
                <span className="text-xl text-900 font-bold">Administrators</span>
                <CreateAdmin />
            </div>
            <DataTable value={admins} footer={footer}
                stripedRows tableStyle={{ minWidth: '60rem' }} scrollable scrollHeight="390px" >
                <Column header="Email" body={emailBodyTemplate}></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default Admins;