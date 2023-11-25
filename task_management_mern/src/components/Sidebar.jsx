import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

function Sidebar({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/",
            name: "Admins",
            icon: <svg
                className="shrink-0 group-hover:!text-primary"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
            </svg>
        },
        {
            path: "/reports",
            name: "Reports",
            icon: <svg
                class="shrink-0 group-hover:!text-primary"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
            </svg>
        }
    ]

    const titleStyle = {
        fontSize: "20px"
    }

    return (
        <div className="main-container min-h-screen text-black dark:text-white-dark">
            <div style={{ width: isOpen ? "260px" : "0px" }} className="sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
                <div className="h-full bg-white dark:bg-[#0e1726] ">
                    <div className="flex items-center justify-between px-4 py-3 top_section">
                        <a href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-8 flex-none" src="./assets/images/favicon.png" alt="logo" />
                            <span
                                className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline "
                                style={{ display: isOpen ? "block" : "none" }}>TechSpire</span>
                        </a>
                        <div className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={toggle}
                            style={{ marginLeft: isOpen ? "50px" : "0px" }}>
                            <svg className="m-auto h-5 w-5" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path
                                    opacity="0.5"
                                    d="M16.9998 19L10.9998 12L16.9998 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <ul
                        className="perfect-scrollbar relative h-[calc(100vh-80px)] space-y-0.5 overflow-y-auto overflow-x-hidden p-4 py-0 font-semibold"
                        x-data="{ activeDropdown: 'users' }"
                    >
                        {
                            menuItem.map((item, index) => {
                                console.log("page: ", item.name);
                                return (
                                    <li class="nav-item">
                                        <NavLink to={item.path} key={index} className="group" activeclassName="active">
                                            <div className="flex items-center">
                                                <div>{item.icon}</div>
                                                <span style={{ display: isOpen ? "block" : "none" }} className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{item.name}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                )
                            })
                        }
                    </ul>

                </div>
            </div>
            <main>{children}</main>
        </div>
    )
}

export default Sidebar;