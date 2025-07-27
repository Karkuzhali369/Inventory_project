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
        <div className='flex flex-col h-screen'>
            <Navbar toggleSideOpen={toggleSideOpen} />
            <div className='flex flex-1'>
                {/* Desktop Sidebar */}
                <div className='hidden lg:block'>
                    <Sidebar />
                </div>

                {/* Mobile Sidebar (Slide-in) */}
                <div className={`transform bg-blue-600 text-white shadow-lg
                    transition-transform duration-300
                    ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="min-h-[calc(100vh-64px)] w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Mainlayout;
