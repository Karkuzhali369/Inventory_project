import { Link, useNavigate } from "react-router-dom";



const Sidebar = () => {
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('Role') === 'ADMIN';

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <aside className='backdrop-blur-lg bg-blue-600/90 text-white h-full shadow-lg px-2'>
            <ul className='px-5 py-3 space-y-5 flex flex-col h-full'>
                <Link to='/home' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Home</Link>
                <Link to='/view' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>View</Link>
                <Link to='stock-management' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Stocks</Link>
                <Link to='/product-management' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Product Management</Link>
                <Link to='/statistics' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Statistics</Link>
                <Link to='/stock-entry' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Stock Entry Details</Link>
                <Link to='/stock-added' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Stock Added Details</Link>


                {
                    isAdmin && <Link to='/admin-panel' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Admin Panel</Link>
                }
    
                <li onClick={() => handleLogout()} className='hover:bg-red-700 bg-red-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300 text-center'>Log Out</li>
            </ul>
        </aside>
    )
}

export default Sidebar
