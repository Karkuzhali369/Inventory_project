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
  const [changes, setChanges] = useState(() => {
  const saved = localStorage.getItem('stock_changes');
  return saved ? JSON.parse(saved) : {};
   });

  const [popupType, setPopupType] = useState(null);

  const fetchProducts = async (pageNum = 1, reset = true) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/get-product?page=${pageNum}&limit=${limit}&search=${search}&category=${selectedCategory}&sortBy=productName&order=asc`,
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
  }, [search, selectedCategory]);

  useEffect(() => {
    if (page === 1) {
      fetchProducts(1, true);
    }
  }, [search, selectedCategory, page]);

  const fetchCategory = async () => {
    const response = await fetch('http://localhost:5000/api/product/get-category', {
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

  const handleQuantityChange = (productId, amount, type) => {
    setChanges((prev) => {
      const existing = prev[productId] || { add: 0, entry: 0 };
      return {
        ...prev,
        [productId]: {
          ...existing,
          [type]: (existing[type] || 0) + amount,
        },
      };
    });
  };

  const cancelChange = (productId) => {
    const updated = { ...changes };
    delete updated[productId];
    setChanges(updated);
  };

  useEffect(() => {
  localStorage.setItem('stock_changes', JSON.stringify(changes));
  }, [changes]);

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (Object.keys(changes).length > 0) {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome to trigger the alert
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [changes]);



  const getChangedProducts = (type) => {
    return products.filter((product) => {
      const change = changes[product._id];
      return change && change[type];
    });
  };

  const saveChanges = async () => {
  const addedStocks = [];
  const enteredStocks = [];

  for (const [productId, change] of Object.entries(changes)) {
    if (change.add && change.add !== 0) {
      addedStocks.push({ productId, value: change.add });
    }
    if (change.entry && change.entry !== 0) {
      enteredStocks.push({ productId, value: change.entry });
    }
  }

  try {
    // Send to stock-addition endpoint
    if (addedStocks.length > 0) {
      const resAdd = await fetch('http://localhost:5000/api/product/stock-addition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stocks: addedStocks }),
      });

      if (!resAdd.ok) {
        throw new Error('Failed to save stock additions');
      }
    }

    // Send to stock-entry endpoint
    if (enteredStocks.length > 0) {
      const resEntry = await fetch('http://localhost:5000/api/product/stock-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stocks: enteredStocks }),
      });

      if (!resEntry.ok) {
        throw new Error('Failed to save stock entries');
      }
    }

    alert('Stock changes saved successfully');
    setChanges({});
    localStorage.removeItem('stock_changes');
    fetchProducts(1, true);
  } catch (err) {
    console.error(err);
    alert('Error saving changes');
  }
};

  return (
    <div className=''>
      <div className='flex justify-center'>
        <h1 className='md:text-xl text-sm text-bold text-blue-700 font-bold my-2'>PRODUCTS</h1>
      </div>

      <div className='flex justify-between mx-5 my-4'>
        <div>
        <button onClick={() => setPopupType('add')} className='bg-green-500 text-white px-4 py-2 rounded'>Show Added</button>
        <button onClick={() => setPopupType('entry')} className='bg-blue-500 text-white px-4 py-2 rounded'>Show Entered</button>
        
        </div>
        <button onClick={saveChanges} className='bg-purple-600 text-white px-4 py-2 rounded'>Save</button>
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
        </div>

        <div className="relative w-full md:w-1/4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg shadow-sm hover:shadow-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className=''>
        {products.map((product) => (
          <StockCard
            key={product._id}
            product={product}
            onQuantityChange={handleQuantityChange}
            modified={!!changes[product._id]}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className='text-center mb-6'>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className='bg-blue-600 hover:bg-blue-800 transition-all px-4 py-2 rounded-full text-white font-bold cursor-pointer'
          >
            Load more products
          </button>
        </div>
      )}

      {/* Popup */}
      {popupType && (
        
        <div className='fixed top-0 left-0 w-full h-full bg-black/30 bg-opacity-40 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl'>
            <h2 className='text-lg font-bold mb-4'>Modified Products ({popupType.toUpperCase()})</h2>
            <ul className='space-y-2 max-h-[300px] overflow-y-auto'>
              {getChangedProducts(popupType).map((product) => (
                <li key={product._id} className='flex justify-between items-center border-b pb-2'>
                  <div>
                    <p><strong>{product.productName}</strong> (Code: {product.code})</p>
                    <p className='text-sm text-gray-600'>Change: {changes[product._id][popupType]}</p>
                  </div>
                  <button
                    onClick={() => cancelChange(product._id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >Cancel</button>
                </li>
              ))}
              {getChangedProducts(popupType).length === 0 && (
                <p className='text-gray-500'>No changes yet.</p>
              )}
            </ul>
            <div className='text-right mt-4'>
              <button onClick={() => setPopupType(null)} className='bg-gray-400 text-white px-4 py-2 rounded'>Close</button>
            </div>
          </div>
        </div>
      )
      
      }
    </div>
  );
};

export default StockManagementPage;
