import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ProductFormModal = ({ isOpen, onClose, onSubmit, selectedProduct, isEditing, categories }) => {
    const [categorySearch, setCategorySearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCategories = categories.filter(
        (cat) => cat !== "ALL" && cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

    useEffect(() => {
        if (isEditing && selectedProduct) setCategorySearch(selectedProduct.category);
        else setCategorySearch("");
    }, [isEditing, selectedProduct]);

    return (
        <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        open={isOpen}
        onClose={onClose}
        >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6  hide-scrollbar"
        >
            <Dialog.Title className="text-2xl font-semibold mb-6 text-gray-800">
            {isEditing ? "Edit Product" : "Add Product"}
            </Dialog.Title>

            <form onSubmit={onSubmit} className="space-y-4">
            {/* Grid layout for label left / input right */}
            <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-4 text-gray-600 font-medium">Product Code</label>
                <input
                name="code"
                type="number"
                required
                defaultValue={selectedProduct?.code}
                placeholder="Enter code"
                className="col-span-8 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                />
            </div>

            <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-4 text-gray-600 font-medium">Product Name</label>
                <input
                name="productName"
                required
                defaultValue={selectedProduct?.productName}
                placeholder="Enter name"
                className="col-span-8 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                />
            </div>

            {/* Category with autocomplete */}
            <div className="relative grid grid-cols-12 gap-3 items-center">
                <label className="col-span-4 text-gray-600 font-medium">Category</label>
                <div className="col-span-8 relative">
                <input
                    name="category"
                    required
                    value={categorySearch}
                    onChange={(e) => { setCategorySearch(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search or select a category"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {showSuggestions && filteredCategories.length > 0 && (
                    <div className="absolute w-full z-10 bg-white border mt-1 max-h-40 overflow-y-auto rounded-lg shadow-md">
                    {filteredCategories.map((cat, index) => (
                        <p
                        key={index}
                        onClick={() => { setCategorySearch(cat); setShowSuggestions(false); }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                        >{cat}</p>
                    ))}
                    </div>
                )}
                </div>
            </div>

            {/* Other fields */}
            {["unit",'cp', 'sp', 'dealer', "currentQuantity","minQuantity","size","material","make"].map((field) => (
                <div key={field} className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-4 text-gray-600 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                    name={field}
                    type={["cp", 'sp',"currentQuantity","minQuantity"].includes(field) ? "number" : "text"}
                    step={field==="cp" || field==='sp'? "0.01" : undefined}
                    required={!['dealer', "size","material","make"].includes(field)}
                    defaultValue={selectedProduct?.[field]}
                    placeholder={`Enter ${field}`}
                    className="col-span-8 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                />
                </div>
            ))}

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-95 transition cursor-pointer">
                {isEditing ? "Update Product" : "Add Product"}
                </button>
            </div>
            </form>
        </motion.div>
        </Dialog>
    );
};

export default ProductFormModal;
