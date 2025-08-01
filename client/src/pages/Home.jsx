import { useEffect, useState } from 'react';
import bgImage from '../assets/logo1.png'; // Adjust this path as needed
import { Link } from 'react-router-dom';

const Home = () => {
  const [lowStockCount, setLowStockCount] = useState(null);
  const name = localStorage.getItem("UserName");

  useEffect(() => {
    const token = localStorage.getItem("Token");

    fetch("http://localhost:5000/api/product/get-lowstock-count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const count = data?.data?.lowStockCount || 0;
        setLowStockCount(count);
      })
      .catch(err => {
        console.error("Failed to fetch low stock count", err);
        setLowStockCount(0);
      });
  }, []);

  return (
    <div
      className="text-left p-10 min-h-screen   bg-center bg-no-repeat sm:bg-contain md:bg-cover"
      style={{ backgroundImage: `url(${bgImage})`,backgroundSize:'300px',backgroundRepeat:'no-repeat',backgroundPosition:'center', }}
    >
      <h1 className="text-2xl font-bold text-blue-700 mb-6 ">
        Welcome {name}🙏
      </h1>

      <Link to='/view'
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                   text-3xl sm:text-4xl md:text-5xl
                   bg-red-600 text-white font-bold
                   rounded-full flex items-center justify-center
                   animate-bounce fixed bottom-4 right-4 sm:bottom-6 sm:right-6
                   cursor-pointer z-50"
        title="Show low stock"
      >
        {!lowStockCount || lowStockCount === 0 ? '!' : lowStockCount}
        <h1>!</h1>
      </Link>
    </div>
  );
};

export default Home;
