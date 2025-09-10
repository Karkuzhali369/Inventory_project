import React, { useState, useEffect } from 'react'

const Navbar = ({ toggleSideOpen }) => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format: 26 July 2025
    const formattedDate = dateTime.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const formattedTime = dateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).toLowerCase();


    return (
            <header className='bg-blue-600 text-white shadow-md h-[4.5rem] flex justify-between items-center max-md:pl-1 px-0 md:px-4'>
                <div className='flex items-center space-x-4'>
                    <button onClick={toggleSideOpen} className='mx-2 lg:hidden text-white text-2xl cursor-pointer' >☰</button>
                    <h1 className='text-2xl max-md:text-[14px] font-bold'>Balaram Electricals and Hardwares</h1>
                </div>
                <div className='text-xs md:text-sm font-medium bg-blue-400 px-3 py-1 rounded-md shadow-sm flex flex-col items-center'>
                    <p>
                        {formattedDate} 
                    </p>
                    
                    <p>
                        {formattedTime}

                    </p>
                </div>
            </header>
    )
}

export default Navbar
