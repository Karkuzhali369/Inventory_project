import React, { useEffect, useState } from 'react';

const StockCard = ({ product }) => {
    const [expanded, setExpanded] = useState(false);
    const [pendingChange, setPendingChange] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'add' or 'entry'
    const [inputQty, setInputQty] = useState('');

    const toggleExpand = () => setExpanded(!expanded);

    const openModal = (type) => {
        setActionType(type);
        setInputQty('');
        setShowModal(true);
    };
    
    const baseQty = pendingChange ? pendingChange.currentQuantity : product.currentQuantity;
    const bgColor =
        baseQty === 0
            ? 'bg-red-300'
            : baseQty <= product.minQuantity
            ? 'bg-yellow-200'
            : 'bg-blue-300';

    const isEdited = !!pendingChange;
    const borderColor = isEdited ? 'bg-pink-300' : 'border-transparent';
    

    useEffect(() => {
    const handleBeforeUnload = (e) => {
        const unsavedChanges = JSON.parse(localStorage.getItem('stock_changes')) || {};
        if (Object.keys(unsavedChanges).length > 0) {
        e.preventDefault();
        e.returnValue = ''; // this shows the browser confirmation
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    }, []);

    // Inside StockCard.jsx, where you handle confirm for ADD or ENTRY
    const handleConfirm = () => {
        const qty = parseInt(inputQty);
        if (isNaN(qty) || qty < 0) return;

        const updatedQty = actionType === 'add'
            ? handleAdd()
            : handleEntry();

        // setPendingChange(updatedProduct);
        setShowModal(false);
    };

    const handleAdd = () => {
        if(!localStorage.getItem('StockAdd')) {
            localStorage.setItem('StockAdd', JSON.stringify([]));
        }
        const productsInLs = JSON.parse(localStorage.getItem('StockAdd'));
        console.log(productsInLs)
        let i = 0;
        for(i=0; i<productsInLs.length; i++) {
            if(productsInLs[i].productId === product._id) {
                productsInLs[i].value = inputQty;
                break;
            }
        }
        console.log(i)
        if(i === productsInLs.length) {
            productsInLs.push({
                productId: product._id,
                productName: product.productName,
                code: product.code,
                value: inputQty
            });
        }
        
        localStorage.setItem('StockAdd', JSON.stringify(productsInLs));
    }
    const handleEntry = () => {
        if(!localStorage.getItem('StockEntry')) {
            localStorage.setItem('StockEntry', JSON.stringify([]));
        }
        const productsInLs = JSON.parse(localStorage.getItem('StockEntry'));
        let i = 0;
        for(i=0; i<productsInLs.length; i++) {
            if(productsInLs[i].productId === product._id) {
                productsInLs[i].value = inputQty
                break;
            }
        }
        if(i === productsInLs.length) {
            productsInLs.push({
                productId: product._id,
                productName: product.productName,
                code: product.code,
                value: inputQty
            });
        }
        localStorage.setItem('StockEntry', JSON.stringify(productsInLs));
    }

    return (
        <>
            <div
                className={`${bgColor} border-transparent p-3 sm:p-4 rounded-xl shadow my-3 mx-3 transition-transform transform hover:scale-[1.01] hover:shadow-md cursor-pointer`}
                onClick={toggleExpand}
            >
                <div className="grid grid-cols-1 md:grid-cols-5 sm:gap-2 text-blue-700 text-sm sm:text-base">
                    <div><span>Code:</span> <strong>{product.code}</strong></div>
                    <div><span>Name:</span> <strong>{product.productName}</strong></div>
                    <div><span>Category:</span> <strong>{product.category}</strong></div>
                    <div><span>Quantity:</span> <strong>{baseQty} {product.unit}</strong></div>
                    <div>
                        <button className="bg-green-500 text-white px-4 py-1 rounded mb-1"
                            onClick={(e) => { e.stopPropagation(); openModal('add'); }}>
                            ADD +
                        </button>{' '}
                        <button className="bg-blue-500 text-white px-4 py-1 rounded"
                            onClick={(e) => { e.stopPropagation(); openModal('entry'); }}>
                            ENTRY -
                        </button>
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-400 ease-in-out ${expanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-wrap gap-2 space-y-[-8px] md:space-y-0 md:gap-5 text-sm text-blue-700">
                        {product.material && <div>Material:<strong> {product.material}</strong></div>}
                        {product.size && <div>Size:<strong> {product.size}</strong></div>}
                        {product.make && <div>Make:<strong> {product.make}</strong></div>}
                        <div>Price:<strong> ₹{product.price}</strong></div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80 shadow-xl border border-blue-500">
                        <h2 className="text-lg font-bold text-blue-700 mb-3">Update Stock</h2>
                        <p><strong>Code:</strong> {product.code}</p>
                        <p><strong>Name:</strong> {product.productName}</p>
                        <p><strong>Qty:</strong>{baseQty}</p>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-700 mb-1">
                                {actionType === 'add' ? 'Quantity to ADD' : 'Quantity to SUBTRACT'}:
                            </label>
                            <input
                                type="number"
                                value={inputQty}
                                onChange={(e) => setInputQty(e.target.value)}
                                className="w-full border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
                                min={0}
                            />
                        </div>
                        <div className="flex justify-end mt-5 gap-2">
                            <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
                                Cancel
                            </button>
                            <button onClick={() => handleConfirm()} className="bg-blue-600 text-white px-3 py-1 rounded">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StockCard;
