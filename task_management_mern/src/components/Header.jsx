import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

function Header() {
    const menuItem = [
        {
            path: "/",
            name: "Admins",
            icon: <svg
                classNameName="shrink-0 group-hover:!text-primary"
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
        }
    ]

    const titleStyle = {
        fontSize: "20px"
    }

    return (
        <div className="main-content flex flex-col min-h-screen">
            <header className="z-40">
                <div className="shadow-sm">
                    <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-[#0e1726]">
                        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                            <a href="index.html" className="main-logo flex shrink-0 items-center">
                                <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/favicon.png" alt="image" />
                                <span
                                    className="hidden align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline"
                                >TechSpire</span
                                >
                            </a>

                            <a
                                href=""
                                className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"

                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </a>
                        </div>
                        <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                            <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">

                            </ul>
                        </div>
                        <div
                            x-data="header"
                            className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2"
                        >
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto" x-data="{ search: false }">
                            </div>


                            <div className="dropdown" x-data="dropdown" >
                                <a
                                    href=""
                                    className="relative block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"

                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <template x-if="messages.length">
                                        <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                            <span
                                                className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"
                                            ></span>
                                            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                        </span>
                                    </template>
                                </a>
                                <ul
                                    x-cloak
                                    x-show="open"
                                    x-transition
                                    className="top-11 w-[300px] divide-y !py-0 text-dark ltr:-right-2 rtl:-left-2 dark:divide-white/10 dark:text-white-dark sm:w-[350px]"
                                >
                                    {/* <li>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold hover:!bg-transparent">
                                            <h4 className="text-lg">Notifications</h4>
                                            <template x-if="messages.length">
                                                <span className="badge bg-primary/80" x-text="messages.length + ''"></span>
                                            </template>
                                        </div>
                                    </li> */}
                                    <template x-for="notification in messages">
                                        <li className="dark:text-white-light/90">
                                            <div className="group flex items-center px-4 py-2">

                                                <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                    <div className="ltr:pr-3 rtl:pl-3">
                                                        <h6 x-html="notification.message"></h6>
                                                        <span className="block text-xs font-normal dark:text-gray-500" x-text="notification.time"></span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"

                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                            <path
                                                                d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                    <template x-if="!messages.length">
                                        <li>
                                            <div className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full text-primary ring-4 ring-primary/30">
                                                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            opacity="0.5"
                                                            d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V11C10.75 11.4142 10.4142 11.75 10 11.75C9.58579 11.75 9.25 11.4142 9.25 11V5C9.25 4.58579 9.58579 4.25 10 4.25Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </div>
                                                No data available.
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>

                            <div className="dropdown flex-shrink-0" x-data="dropdown">
                                <a href=""
                                    className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                >
                                    <span> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                        <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    </span>
                                </a>
                                <ul

                                    x-cloak
                                    x-show="open"
                                    x-transition
                                    className="top-11 w-[230px] !py-0 font-semibold text-dark ltr:right-0 rtl:left-0 dark:text-white-dark dark:text-white-light/90"
                                >
                                    {/* <li className="border-t border-white-light dark:border-white-light/10">
                                        <a href="login.html" className="!py-3 text-danger">
                                            <svg
                                                className="h-4.5 w-4.5 rotate-90 ltr:mr-2 rtl:ml-2"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    opacity="0.5"
                                                    d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Sign Out
                                        </a>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;