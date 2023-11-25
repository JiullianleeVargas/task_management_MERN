import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { AdminService } from '../../service/AdminService';

const Admins = () => {

    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        AdminService.getAdminsMini().then((data) => setAdmins(data));
    }, []);

    const emailBodyTemplate = (admin) => {
        return <img src={`/images/favicon.png`} alt={admin.image}
            style={{ width: 24, height: 24 }}
            className="w-6rem shadow-2 border-round" />;
    };

    const statusBodyTemplate = (admin) => {
        return <Tag value={admin.status} severity={getSeverity(admin)}></Tag>;
    };

    const getSeverity = (admin) => {
        switch (admin.status) {
            case 'Inactive':
                return 'warning';

            case 'Active':
                return 'success';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Administrators</span>
        </div>
    );
    const footer = `In total there are ${Admins ? Admins.length : 0} Administrators.`;

    return (
        <div className="card">
            <DataTable value={admins} header={header} footer={footer}
                stripedRows tableStyle={{ minWidth: '60rem' }} scrollable scrollHeight="390px" >
                <Column header="Email" body={emailBodyTemplate}></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default Admins;