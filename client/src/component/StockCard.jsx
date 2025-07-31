import React, { useState } from 'react'

const StockCard = ({ product }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);

    const bgColor = product.currentQuantity == 0 ? 'bg-red-300' : product.currentQuantity <= product.minQuantity ? 'bg-yellow-200' : 'bg-blue-300';
    return (
        <div className={`${bgColor} p-3 sm:p-4 rounded-xl shadow my-3 mx-3 transition-transform transform hover:scale-[1.01] hover:shadow-md cursor-pointer border border-transparent hover:border-blue-500`} onClick={toggleExpand}>
            <div className="grid grid-cols-1 md:grid-cols-5 sm:gap-2 text-blue-700 text-sm sm:text-base">
                <div><span>Code:</span> <strong>{product.code}</strong></div>
                <div><span>Name:</span> <strong>{product.productName}</strong></div>
                <div><span>Category:</span> <strong>{product.category}</strong></div>
                <div><span>Quantity:</span><strong>{product.currentQuantity}</strong></div>
                <div><strong><button className="bg-green-500 text-white px-4 py-1 rounded mb-1">ADD +</button></strong><strong>   <button className="bg-blue-500 text-white px-4 py-1 rounded">ENTRY -</button></strong></div>
                
            </div>
            <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${expanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-wrap gap-2 space-y-[-8px] md:space-y-0 md:gap-5 text-sm text-blue-700">
                    {product.unit && (
                        <div>Unit:<strong> {product.unit} </strong></div>
                    )}
                    {product.material && (
                        <div>Material:<strong> {product.material}</strong></div>
                    )}
                    {product.size && (
                        <div>Size:<strong> {product.size}</strong></div>
                    )}
                    {product.make && (
                        <div>Make:<strong> {product.make}</strong></div>
                    )}
                    {
                        <div>Price:<strong> ₹{product.price}</strong></div>
                    }
                </div>
            </div>
        </div>
    );
};

export default StockCard
