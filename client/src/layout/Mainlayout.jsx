import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation } from "react-router-dom";

const Mainlayout = () => {
    const [sideOpen, setSideOpen] = useState(false);

    const toggleSideOpen = () => {
        setSideOpen(!sideOpen);
    };
    const location = useLocation();

    useEffect(() => {
        setSideOpen(false);
    }, [location.pathname]);


    return (
        <div className='h-[100dvh] grid grid-cols-1 md:grid-cols-[20%_80%] grid-rows-[auto_1fr] max-md:relative'>
            <div className="col-span-1 md:col-span-3">
                <Navbar toggleSideOpen={toggleSideOpen} />
            </div>


            <div className={`max-md:z-20 md:block overflow-y-hidden bg-white ${sideOpen ? 'max-md:fixed' : 'max-md:hidden'} max-md:h-[calc(100dvh-4.5rem)] max-md:bottom-0 max-md:top-[4.5rem]`}>

                <Sidebar />
            </div>

            <div className="overflow-y-scroll">
                <Outlet />
            </div>
        </div>
    );
};

export default Mainlayout;
