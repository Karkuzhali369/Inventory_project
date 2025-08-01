import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import arrowIcon from "../assets/icons/right-arrow.png";

const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="text-center hover:bg-gray-50 transition-all duration-200">
    <td className="py-2 px-4 border-b">{product.code}</td>
    <td className="py-2 px-4 border-b">{product.productName}</td>
    <td className="py-2 px-4 border-b">{product.category}</td>
    <td className="py-2 px-4 border-b">₹{product.price}</td>
    <td className="py-2 px-4 border-b">{product.currentQuantity}&nbsp;{product.unit}</td>
    <td className="py-2 px-4 border-b space-x-2">
      <button onClick={() => onEdit(product)} className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-white py-1 px-3 rounded shadow-md mb-2">Edit</button>
      <button onClick={() => onDelete(product)} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white py-1 px-3 rounded shadow-md">Delete</button>
    </td>
  </tr>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
  <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30" open={isOpen} onClose={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
    >
      <Dialog.Title className="text-lg font-medium mb-4">Confirm Deletion</Dialog.Title>
      <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </motion.div>
  </Dialog>
);

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(["ALL"]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("productName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 30;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false, product: null });

    const fetchProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem("Token");
        try {
        const res = await fetch(`https://inventory-project-d3mr.onrender.com/api/product/get-product?page=${page}&limit=${limit}&search=${search.trim()}&category=${selectedCategory}&sortBy=${sortBy}&order=${sortOrder}`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (data.condition === "SUCCESS") {
            setProducts(data.data.products);
        } else {
            console.error("Fetch error:", data);
            setProducts([]);
        }
        } catch (err) {
        console.error("Error fetching:", err);
        setProducts([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, selectedCategory, sortBy, sortOrder, page]);

    useEffect(() => {
        const fetchCategory = async () => {
            const token = localStorage.getItem("Token");
            try {
                const response = await fetch('https://inventory-project-d3mr.onrender.com/api/product/get-category', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                if (data.condition === "SUCCESS") {
                    setCategories(['ALL', ...data.data.categories]);
                }
                else {
                    console.error("Failed to fetch categories:", data);
                }
            }
            catch (err) {
            console.error("Category fetch error:", err);
            }
        };
    fetchCategory();
    }, []);


    const handleOrder = () => {
        setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    };

    const openAddModal = () => {
        setSelectedProduct(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openConfirmDelete = (product) => {
        setConfirmModal({ open: true, product });
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("Token");
        try {
        const res = await fetch(`https://inventory-project-d3mr.onrender.com/api/product/delete-product`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: confirmModal.product._id }),
        });
        const result = await res.json();
        if (result.condition === "SUCCESS") {
            fetchProducts();
            setConfirmModal({ open: false, product: null });
        }
        } catch (err) {
        console.error("Delete failed:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("Token");
        const form = e.target;

        const newProduct = {
        code: parseInt(form.code.value),
        productName: form.productName.value,
        size: form.size.value || null,
        category: form.category.value.toUpperCase(),
        material: form.material.value || null,
        make: form.make.value || null,
        currentQuantity: parseInt(form.currentQuantity.value),
        unit: form.unit.value,
        price: parseFloat(form.price.value),
        minQuantity: parseInt(form.minQuantity.value),
        };

        const endpoint = isEditing
        ? `https://inventory-project-d3mr.onrender.com/api/product/modify-product`
        : `https://inventory-project-d3mr.onrender.com/api/product/add-product`;

        const method = isEditing ? "PUT" : "POST";
        const body = isEditing ? { productId: selectedProduct._id, ...newProduct } : newProduct;

        try {
        const res = await fetch(endpoint, {
            method,
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const result = await res.json();
        if (result.condition === "SUCCESS") {
            setIsModalOpen(false);
            fetchProducts();
        }
        } catch (error) {
        console.error("Submit Error:", error);
        }
    };

    const [categorySearch, setCategorySearch] = useState("");
const [showSuggestions, setShowSuggestions] = useState(false);
// Filtered list excluding "ALL"
const filteredCategories = categories.filter(
  (category) =>
    category !== "ALL" &&
    category.toLowerCase().includes(categorySearch.toLowerCase())
);
useEffect(() => {
  if (isEditing && selectedProduct) {
    setCategorySearch(selectedProduct.category);
  } else {
    setCategorySearch("");
  }
}, [isEditing, selectedProduct]);


    return (
        <section className="min-h-screen w-full p-4 md:p-6">

        <div className='flex justify-center'>
                <h1 className='md:text-xl text-sm text-bold text-blue-700 font-bold my-2'>
                PRODUCTS MANAGEMENT
                </h1>
            </div>
        {/* FILTERS */}
        <div className="mx-1 md:mx-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
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
            <label htmlFor="sortBy" className="whitespace-nowrap font-medium text-sm w-20">Sort by:</label>
            <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border cursor-pointer border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
            >
                <option value="productName">Product Name</option>
                <option value="currentQuantity">Quantity</option>
            </select>
            <button onClick={handleOrder} className="bg-blue-600 cursor-pointer p-2 rounded-md hover:bg-blue-800 transition-all shrink-0">
                <img src={arrowIcon} alt="Sort Order" className={`w-4 invert transition-transform duration-200 ${sortOrder === 'asc' ? '-rotate-90' : 'rotate-90'}`} />
            </button>
            </div>

            {/* Category Filter */}
            <div className="relative w-full md:w-1/3 flex items-center gap-2">
            <label htmlFor="category" className="whitespace-nowrap font-medium text-sm w-20">Category:</label>
            <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none cursor-pointer border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
            >
                {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            </div>
        </div>

        {/* ADD/EDIT BUTTON */}
        <div className="flex justify-end mb-4">
            <button onClick={openAddModal} className="bg-green-500 cursor-pointer hover:bg-green-600 text-white py-2 px-6 rounded shadow-lg transition-all duration-200">
            + Add Product
            </button>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-200 text-gray-700">
                <tr>
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                ) : products.length > 0 ? (
                products.map((product) => (
                    <ProductRow key={product._id} product={product} onEdit={openEditModal} onDelete={openConfirmDelete} />
                ))
                ) : (
                <tr><td colSpan="6" className="text-center py-4">No products found</td></tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-600 hover:bg-blue-800 transition-all text-white rounded disabled:bg-gray-300 cursor-pointer">Prev</button>
            <span className="px-4 py-2">Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-all">Next</button>
        </div>

        {/* Modals */}
        <DeleteConfirmationModal
            isOpen={confirmModal.open}
            onClose={() => setConfirmModal({ open: false, product: null })}
            onConfirm={confirmDelete}
        />

        {/* Add/Edit Modal stays unchanged (from your existing code) */}
        <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
  >
    <Dialog.Title className="text-xl font-semibold mb-4">
      {isEditing ? "Edit Product" : "Add Product"}
    </Dialog.Title>
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
      <input name="code" type="number" required defaultValue={selectedProduct?.code} placeholder="Code" className="w-full border p-2 rounded" />
      <input name="productName" required defaultValue={selectedProduct?.productName} placeholder="Product Name" className="w-full border p-2 rounded" />



<div className="relative w-full">
  <input
    name="category"
    required
    value={categorySearch}
    onChange={(e) => {
      setCategorySearch(e.target.value);
      setShowSuggestions(true);
    }}
    onFocus={() => setShowSuggestions(true)}
    placeholder="Category"
    className="w-full border p-2 rounded"
  />

  {/* Suggestions dropdown */}
  {showSuggestions && filteredCategories.length > 0 && (
    <div className="absolute w-full z-10 bg-white border mt-1 max-h-48 overflow-y-auto rounded shadow">
      {filteredCategories.map((category, index) => (
        <p
          key={index}
          onClick={() => {
            setCategorySearch(category);
            setShowSuggestions(false);
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {category}
        </p>
      ))}
    </div>
  )}
</div>




      <input name="unit" required defaultValue={selectedProduct?.unit} placeholder="Unit (e.g., kg, pcs)" className="w-full border p-2 rounded" />
      <input name="price" type="number" step="0.01" required defaultValue={selectedProduct?.price} placeholder="Price" className="w-full border p-2 rounded" />
      <input name="currentQuantity" type="number" required defaultValue={selectedProduct?.currentQuantity} placeholder="Quantity" className="w-full border p-2 rounded" />
      <input name="minQuantity" type="number" required defaultValue={selectedProduct?.minQuantity} placeholder="Min Quantity" className="w-full border p-2 rounded" />
      <input name="size" defaultValue={selectedProduct?.size} placeholder="Size (optional)" className="w-full border p-2 rounded" />
      <input name="material" defaultValue={selectedProduct?.material} placeholder="Material (optional)" className="w-full border p-2 rounded" />
      <input name="make" defaultValue={selectedProduct?.make} placeholder="Make (optional)" className="w-full border p-2 rounded" />
  </div>    
      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  </motion.div>
</Dialog>
        </section>
    );
};

export default ProductManagementPage;
