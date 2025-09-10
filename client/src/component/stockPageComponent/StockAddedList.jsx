import { useState, useEffect } from "react";

const StockAddedList = ({ setAdditionListPopup }) => {
    const [productsInLs, setProductsInLs] = useState([]);

    // On mount, get items from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("StockAdd")) || [];
        setProductsInLs(stored);
    }, []);

    const cancelChange = (productId) => {
        const newArray = productsInLs.filter((item) => item.productId !== productId);
        setProductsInLs(newArray);
        localStorage.setItem("StockAdd", JSON.stringify(newArray));
    };

    const addAddedList = async () => {
        const stored = JSON.parse(localStorage.getItem("StockAdd")) || [];
        if(stored.length === 0) return;
        const inp = {
            stocks: []
        };
        stored.map(product => {
            // console.log(product)
            inp.stocks.push({
                productId: product.productId,
                productName: product.productName,
                code: product.code,
                cost: product.cost,
                quantity: product.quantity
            })
        });
        try {
            const token = localStorage.getItem('Token');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/stock-addition`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(inp)
            })
            const data = await response.json();
            if(response.status) {
                localStorage.setItem('StockAdd', JSON.stringify([]));
                window.location.reload(true);
            }
        }
        catch(err) {

        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl">
                <h2 className="text-lg font-bold mb-4">Modified Products (Added)</h2>

                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {
                    productsInLs.length === 0 ? (
                        <p className="text-gray-500">No changes yet.</p>
                    ) : (
                        productsInLs.map((product) => (
                        <li key={product.productId} className="flex justify-between items-center border-b pb-2">
                            <div>
                            <p>
                                <strong>{product.productName}</strong> (Code: {product.code})
                            </p>
                            <p className="text-sm text-gray-600 inline mr-5">Quantity: <strong>{product.quantity}</strong></p>
                            <p className="text-sm text-gray-600 inline">Cost (cp): <strong>{product.cost}</strong> (per item)</p>
                            </div>
                            <button
                            onClick={() => cancelChange(product.productId)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                            Cancel
                            </button>
                        </li>
                        ))
                    )
                }
                </ul>

                <div className="text-right mt-4 p-1">
                    <button onClick={() => setAdditionListPopup(false)} className="bg-gray-400 text-white px-4 py-2 ml-1 rounded">
                        Close
                    </button>
                    <button onClick={() => addAddedList()} className="bg-green-500 text-white px-4 py-2 ml-2 rounded">
                        save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockAddedList;
