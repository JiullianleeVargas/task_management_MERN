export const AdminService = {
    getAdminssData() {
        return [
            {
                email: 'juandel@mail.com',
                status: 'Active'
            },
            {
                email: 'juandel34567@mail.com',
                status: 'Active'
            },
            {
                email: 'juandel456345@mail.com',
                status: 'Inactive'
            },
            {
                email: 'juandel3452@mail.com',
                status: 'Active'
            },
            {
                email: 'juassgergndel321@mail.com',
                status: 'Active'
            },
            {
                email: 'segrregserg@mail.com',
                status: 'Inactive'
            },
            {
                email: 'juansegrdel@mail.com',
                status: 'Active'
            },
            {
                email: 'juarsgerghndel@mail.com',
                status: 'Active'
            },
            {
                email: 'juansergerdel@mail.com',
                status: 'Active'
            },
            {
                email: 'juandelserg@mail.com',
                status: 'Active'
            },
            {
                email: 'juandelsergserg@mail.com',
                status: 'Active'
            },
            {
                email: 'juandelgrtshrth@mail.com',
                status: 'Active'
            },
            {
                email: 'juandelgrtsdhrt@mail.com',
                status: 'Active'
            },
            {
                email: 'juandelgserg@mail.com',
                status: 'Active'
            },
        ];
    },
            
        

        getAdminsMini() {
            return Promise.resolve(this.getAdminssData().slice(0, 20));
        },
    };