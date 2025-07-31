import { useState, useEffect } from 'react';
import StockCard from '../component/StockCard';
const StockManagementPage = () => {
    
    const token = localStorage.getItem('Token');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 30;
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [categories, setCategories] = useState([]);

    const fetchProducts = async (pageNum = 1, reset = true) => {
        try {
        const response = await fetch(
            `http://localhost:5000/api/product/get-product?page=${pageNum}&limit=${limit}&search=${search}&category=${selectedCategory}&sortBy=productName&order=asc`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        const data = await response.json();
        const newProducts = data.data.products;
        const pages = parseInt(data.data.paging.pages) || 1;

        if (reset) {
            setProducts(newProducts);
        } else {
            setProducts((prev) => [...prev, ...newProducts]);
        }

        setTotalPages(pages);
        } catch (err) {
        console.error(err);
        }
    };

    // Fetch products on page change
    useEffect(() => {
        fetchProducts(page, page === 1);
    }, [page]);

    // Reset page to 1 on filter change
    useEffect(() => {
        setPage(1);
    }, [search, selectedCategory]);

    // Triggers fetch only when page is reset to 1 (on filter/search change)
    useEffect(() => {
        if (page === 1) {
        fetchProducts(1, true);
        }
    }, [search, selectedCategory, page]);

    const getMore = () => {
        if (page < totalPages) {
        setPage((prev) => prev + 1);
        }
    };

    const fetchCategory = async () => {
        const response = await fetch('http://localhost:5000/api/product/get-category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();
        setCategories(['ALL', ...data.data.categories]);
    }
    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <div className=''>
        <div className='flex justify-center'>
            <h1 className='md:text-xl text-sm text-bold text-blue-700 font-bold my-2'>
            PRODUCTS
            </h1>
        </div>

        <div className="mx-5 flex md:flex-row items-center justify-between mb-6 gap-x-2 ">
            <div className="relative w-full md:w-1/3">
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover-shadow-md"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 "></i>
            </div>

            <div className="relative w-full md:w-1/4">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg shadow-sm hover:shadow-md"
            >
                {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <i className="fas fa-chevron-down" />
            </div>
            </div>
        </div>

        <div className=''>
            {products.map((product) => (
            <StockCard key={product._id} product={product} />
            ))}
        </div>

        {page < totalPages && (
            <div className='text-center mb-6'>
            <button
                onClick={getMore}
                className='bg-blue-600 hover:bg-blue-800 transition-all px-4 py-2 rounded-full text-white font-bold cursor-pointer'
            >
                Load more products
            </button>
            </div>
        )}
        </div>
    );
};

export default StockManagementPage;