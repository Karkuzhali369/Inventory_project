import { Link, useNavigate } from "react-router-dom";



const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <aside className='backdrop-blur-lg bg-blue-600/90 text-white h-full shadow-lg px-2'>
            <ul className='px-5 py-3 space-y-5 flex flex-col h-full'>
                <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Home</li>
                <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>View</li>
                <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Stocks</li>

                <Link to='/product-management' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Product Management</Link>
                <Link to='/admin-panel' className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Admin Panel</Link>
    
                <li onClick={() => handleLogout()} className='hover:bg-red-700 bg-red-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300 text-center'>Log Out</li>
            </ul>
        </aside>
    )
}

export default Sidebar
