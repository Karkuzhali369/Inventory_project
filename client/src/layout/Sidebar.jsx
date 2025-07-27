import { useNavigate } from "react-router-dom";



const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div>
            <aside className='backdrop-blur-lg bg-blue-600/90 text-white w-64 h-screen shadow-lg'>
                <ul className='px-5 py-3 space-y-5'>
                    <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Home</li>
                    <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>View</li>
                    <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Stocks</li>
                    <li className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Admin Panel</li>
                    <li onClick={() => handleLogout()} className='hover:bg-blue-500 cursor-pointer rounded-xl px-4 py-2 transition duration-300'>Log Out</li>
                </ul>
            </aside>
        </div>
    )
}

export default Sidebar
