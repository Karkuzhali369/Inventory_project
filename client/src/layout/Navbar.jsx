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
            <header className='bg-blue-600 text-white p-4 shadow-md'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-4'>
                        <button onClick={toggleSideOpen} className='mx-2 lg:hidden text-white text-2xl cursor-pointer' >☰</button>
                        <h1 className='text-2xl sm:text-2xl font-bold'>Balaram Electricals and Hardwares</h1>
                    </div>
                    <div className='text-sm md:text-base font-medium bg-blue-400 p-2 rounded-md drop-shadow-lg'>
                        {formattedDate} {formattedTime}
                    </div>
                </div>

            </header>
    )
}

export default Navbar
