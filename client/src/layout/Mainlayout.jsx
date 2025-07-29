import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from "react-router-dom";

const Mainlayout = () => {
    const [sideOpen, setSideOpen] = useState(false);

    const toggleSideOpen = () => {
        setSideOpen(!sideOpen);
    };

    return (
        <div className='h-[100dvh] grid grid-cols-1 md:grid-cols-[20%_80%] grid-rows-[auto_1fr] dark:bg-slate-950 max-md:relative'>
            <div className="col-span-1 md:col-span-3">
                <Navbar toggleSideOpen={toggleSideOpen} />
            </div>

            <div className={`max-md:z-20 md:block overflow-y-hidden bg-white dark:bg-slate-950 ${sideOpen ? 'max-md:fixed' : 'max-md:hidden'} max-md:h-[calc(100dvh-4.5rem)] max-md:bottom-0`}>
                <Sidebar />
            </div>

            <div className="overflow-y-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default Mainlayout;
