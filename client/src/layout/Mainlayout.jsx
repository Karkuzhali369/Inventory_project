import React, { useState } from 'react'
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Mainlayout = () => {
    const [sideOpen, setSideOpen] = useState(false);
    const toggleSideOpen = () => {
        setSideOpen(!sideOpen);
    };
    return (
        <div className='flex flex-col h-screen'>
            <Navbar toggleSideOpen={toggleSideOpen} />
            <div className='flex felx-1'>
                <div className='hidden lg:block'>
                    <Sidebar />
                </div>
                <div className={`transform bg-blue-600 text-white shadow-lg
                    tarnsition-transform duration-300
                    ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
                    <Sidebar />
                </div>
                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl text-center w-full max-w-md">
                        <h2 className="text-2xl font-bold text-blue-700 mb-2">Welcome!</h2>
                        <p className="text-gray-600">You're on the Dashboard.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Mainlayout
