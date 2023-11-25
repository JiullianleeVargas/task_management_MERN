import React from 'react';

function Admins() {
    return (
        <div x-data="contacts">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Administrator Accounts</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                >
                                    <circle cx="10" cy="6" r="4" stroke="currentColor" stroke-width="1.5" />
                                    <path
                                        opacity="0.5"
                                        d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    />
                                    <path
                                        d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                Create Admin Account
                            </button>
                            <div className="fixed inset-0 z-[999] hidden overflow-y-auto bg-[black]/60">
                                <div className="flex min-h-screen items-center justify-center px-4">
                                    <div
                                        x-show="addContactModal"
                                        x-transition
                                        className="panel my-8 w-[90%] max-w-lg overflow-hidden rounded-lg border-0 p-0 md:w-full"
                                    >
                                        <button
                                            type="button"
                                            className="absolute top-4 text-white-dark hover:text-dark ltr:right-4 rtl:left-4"

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24px"
                                                height="24px"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="h-6 w-6"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                        <h3
                                            className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]"
                                            x-text="params.id ? 'Editar estudiante' : 'Create admin'"
                                        ></h3>
                                        <div className="p-5">
                                            <form>
                                                <div className="mb-5">
                                                    <label for="email">Email</label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        placeholder="yeyo.soto2@upr.edu"
                                                        className="form-input"
                                                        x-model="params.email"
                                                    />
                                                </div>
                                                <div className="mb-5">
                                                    <label for="password">password</label>
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        placeholder="*********"
                                                        className="form-input"
                                                        x-model="params.password"
                                                    />
                                                </div>

                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                        x-text="params.id ? 'Update' : 'Add'"
                                                    ></button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by email"
                            className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                            x-model="searchadmin"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" stroke-width="1.5" opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <template x-if="displayType === 'list'">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="contact in filterdContactsList">
                                    <tr>
                                        <td>
                                            <div className="flex w-max items-center">
                                                <div x-show="contact.path" className="w-max">
                                                    <img
                                                        src="`/assets/images/profile-3.png`"
                                                        className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <div
                                                    x-show="!contact.path && contact.email"
                                                    className="grid h-8 w-8 place-content-center rounded-full bg-primary text-sm font-semibold text-white ltr:mr-2 rtl:ml-2"
                                                    x-text="contact.email.charAt(0) + '' + contact.email.charAt(contact.email.indexOf(' ') + 1)"
                                                ></div>
                                                <div
                                                    x-show="!contact.path && !contact.email"
                                                    className="rounded-full border border-gray-300 p-2 ltr:mr-2 rtl:ml-2 dark:border-gray-800"
                                                >
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4.5 w-4.5"
                                                    >
                                                        <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"></circle>
                                                        <ellipse
                                                            opacity="0.5"
                                                            cx="12"
                                                            cy="17"
                                                            rx="7"
                                                            ry="4"
                                                            stroke="currentColor"
                                                            stroke-width="1.5"
                                                        ></ellipse>
                                                    </svg>
                                                </div>
                                                <div className='email_tab' x-text="contact.email"></div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap">
                                            <template x-if="contact.status">
                                                <div x-data="dropdown" className="dropdown">
                                                    <button
                                                        type="button"
                                                        className="badge rounded-full capitalize hover:top-0 hover:text-white"
                                                        x-text="contact.status"

                                                    ></button>
                                                    <ul
                                                        x-cloak
                                                        x-show="open"
                                                        x-transition
                                                        className="text-medium text-sm ltr:right-0 rtl:left-0"
                                                    >

                                                        <li>
                                                            <button
                                                                className="w-full text-primary ltr:text-left rtl:text-right"
                                                            >
                                                                Active
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="w-full text-warning ltr:text-left rtl:text-right"
                                                            >
                                                                Inactive
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </template>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
        </div>
    )
}

export default Admins;