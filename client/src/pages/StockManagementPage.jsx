import { useState, useEffect } from 'react';
import StockCard from '../component/StockCard';
import StockEntryList from '../component/stockPageComponent/StockEntryList';
import StockAddedList from '../component/stockPageComponent/StockAddedList';

import arrowIcon from '../assets/icons/right-arrow.png';

const StockManagementPage = () => {
    const token = localStorage.getItem('Token');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 30;
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState("productName");
    const [sortOrder, setSortOrder] = useState('asc');
    const handleOrder = () => {
        if(sortOrder === 'asc') setSortOrder('desc');
        else setSortOrder('asc');
    }

    const [entryListPopup, setEntryListPopup] = useState(false);
    const [additionListPopup, setAdditionListPopup] = useState(false);

    const fetchProducts = async (pageNum = 1, reset = true) => {
        try {
        const response = await fetch(
            `https://inventory-project-d3mr.onrender.com/api/product/get-product?page=${pageNum}&limit=${limit}&search=${search.trim()}&category=${selectedCategory}&sortBy=${sortBy}&order=${sortOrder}`,
            {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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

    useEffect(() => {
        fetchProducts(page, page === 1);
    }, [page]);

    useEffect(() => {
        setPage(1);
    }, [search, selectedCategory, sortBy, sortOrder]);

    useEffect(() => {
        if (page === 1) {
        fetchProducts(1, true);
        }
    }, [search, selectedCategory, page, sortBy, sortOrder]);

    const getMore = () => {
        if (page < totalPages) {
        setPage((prev) => prev + 1);
        }
    };

    const fetchCategory = async () => {
        const response = await fetch('https://inventory-project-d3mr.onrender.com/api/product/get-category', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
        const data = await response.json();
        setCategories(['ALL', ...data.data.categories]);
    };

    useEffect(() => {
        fetchCategory();
    }, []);


    return (
        <div className=''>
            <div className='flex justify-center'>
                <h1 className='md:text-xl text-sm text-bold text-blue-700 font-bold my-2'>PRODUCTS</h1>
            </div>

            <div className='flex justify-between mx-5 my-4'>
                <div>
                    <button onClick={() => setAdditionListPopup(true)} className='bg-green-500 text-white px-4 py-2 ml-1 rounded'>Show Added</button>
                    <button onClick={() => setEntryListPopup(true)} className='bg-blue-500 text-white px-4 py-2 ml-2 rounded'>Show Entered</button>
                </div>
            </div>

            <div className="mx-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                {/* Search */}
                <div className="relative w-full md:w-1/3">
                    <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Sort */}
                <div className="relative w-full md:w-1/3 flex items-center gap-2">
                    <label htmlFor="sortBy" className="whitespace-nowrap font-medium text-sm w-20">
                    Sort by:
                    </label>
                    <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer appearance-none border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
                    >
                    <option value="productName">Product Name</option>
                    <option value="currentQuantity">Quantity</option>
                    </select>
                    <button
                    onClick={handleOrder}
                    className="bg-blue-600 p-2 cursor-pointer rounded-md hover:bg-blue-800 transition-all shrink-0"
                    >
                    <img
                        src={arrowIcon}
                        alt="Sort Order"
                        className={`w-4 invert transition-transform duration-200 ${
                        sortOrder === 'asc' ? '-rotate-90' : 'rotate-90'
                        }`}
                    />
                    </button>
                </div>

                {/* Category */}
                <div className="relative w-full md:w-1/3 flex items-center gap-2">
                    <label htmlFor="category" className="whitespace-nowrap font-medium text-sm w-20">
                    Category:
                    </label>
                    <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none cursor-pointer border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
                    >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                        {cat}
                        </option>
                    ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fas fa-chevron-down" />
                    </div>
                </div>
            </div>

            <div className=''>
                {
                    products.map((product) => (
                        <StockCard key={product._id} product={product} />
                    ))
                }
            </div>

            {page < totalPages && (
                <div className='text-center mb-6'>
                    <button
                        onClick={() => getMore()}
                        className='bg-blue-600 hover:bg-blue-800 transition-all px-4 py-2 rounded-full text-white font-bold cursor-pointer'
                    >
                        Load more products
                    </button>
                </div>
            )}

            {
                entryListPopup && <StockEntryList setEntryListPopup={setEntryListPopup} />
            }
            {
                additionListPopup && <StockAddedList setAdditionListPopup={setAdditionListPopup} />
            }
        </div>
    );
};

export default StockManagementPage;
