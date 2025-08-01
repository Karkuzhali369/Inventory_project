import { useState, useEffect } from "react";

const StockEntryList = ({ setEntryListPopup }) => {
    const [productsInLs, setProductsInLs] = useState([]);

    // On mount, get items from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("StockEntry")) || [];
        setProductsInLs(stored);
    }, []);

    const cancelChange = (productId) => {
        const newArray = productsInLs.filter((item) => item.productId !== productId);
        setProductsInLs(newArray);
        localStorage.setItem("StockEntry", JSON.stringify(newArray));
    };

    const addEntryList = async () => {
        const stored = JSON.parse(localStorage.getItem("StockEntry")) || [];
        if(stored.length === 0) return;
        const inp = {
            stocks: []
        };
        stored.map(product => {
            inp.stocks.push({
                productId: product.productId,
                value: Number(product.value)
            })
        });
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch('https://inventory-project-d3mr.onrender.com/api/product/stock-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(inp)
            });

            const data = await response.json();

            const stored = JSON.parse(localStorage.getItem('StockEntry')) || [];

            if (data.data.warning.length !== 0) {
                const warnedIds = new Set(data.data.warning.map(w => w.productId));
                
                // ✅ Keep only warned products
                const warnedOnly = stored.filter(item => warnedIds.has(item.productId));

                localStorage.setItem('StockEntry', JSON.stringify(warnedOnly));
            }
            else if (response.ok) {
                localStorage.setItem('StockEntry', JSON.stringify([]));
            }

            window.location.reload();
        }
        catch (error) {
            console.error("Error submitting stock entry:", error);
        }

    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl">
            <h2 className="text-lg font-bold mb-4">Modified Products (Entry)</h2>

            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {productsInLs.length === 0 ? (
                <p className="text-gray-500">No changes yet.</p>
            ) : (
                productsInLs.map((product) => (
                <li key={product.productId} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <p>
                        <strong>{product.productName}</strong> (Code: {product.code})
                    </p>
                    <p className="text-sm text-gray-600">Change: {product.value}</p>
                    </div>
                    <button
                    onClick={() => cancelChange(product.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                    Cancel
                    </button>
                </li>
                ))
            )}
            </ul>

            <div className="text-right mt-4 p-1">
                <button onClick={() => setEntryListPopup(false)} className="bg-gray-400 text-white px-4 py-2 ml-1 rounded">
                    Close
                </button>
                <button onClick={() => addEntryList()} className="bg-green-500 text-white px-4 py-2 ml-2 rounded">
                            save
                </button>
            </div>
        </div>
        </div>
    );
};

export default StockEntryList;
