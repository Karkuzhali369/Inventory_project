import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import Product from "../../../server/src/model/productModel";

const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="text-center hover:bg-gray-50 transition-all duration-200">
    <td className="py-2 px-4 border-b">{product.code}</td>
    <td className="py-2 px-4 border-b">{product.productName}</td>
    <td className="py-2 px-4 border-b">{product.category}</td>
    <td className="py-2 px-4 border-b">{product.unit}</td>
    <td className="py-2 px-4 border-b">₹{product.price}</td>
    <td className="py-2 px-4 border-b">{product.currentQuantity}</td>
    <td className="py-2 px-4 border-b space-x-2">
      <button onClick={() => onEdit(product)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded shadow-md">Edit</button>
      <button onClick={() => onDelete(product)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow-md">Delete</button>
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, product: null });
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchProducts = async (categoryFilter = selectedCategory, pageNum = page) => {
  setLoading(true);
  const token = localStorage.getItem("Token");

  try {
    const res = await fetch(`http://localhost:5000/api/product/get-product?page=${pageNum}&limit=${limit}&search=&category=${categoryFilter}&sortBy=productName&order=asc`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.condition === "SUCCESS" && Array.isArray(data.data.products)) {
      setProducts(data.data.products);
    } else {
      console.error("Fetch error from server:", data);
      setProducts([]);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page]);

  const handleCategoryFilter = (e) => {
    const selected = e.target.value.trim().toUpperCase() || 'ALL';
    setSelectedCategory(selected);
    setPage(1);
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
      const res = await fetch(`http://localhost:5000/api/product/delete-product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: confirmModal.product._id })
      });
      const result = await res.json();
      if (result.condition === "SUCCESS") {
        fetchProducts();
        setConfirmModal({ open: false, product: null });
      } else {
        console.error(result.message);
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
      minQuantity: parseInt(form.minQuantity.value)
    };

    try {
      const endpoint = isEditing
        ? `http://localhost:5000/api/product/modify-product`
        : `http://localhost:5000/api/product/add-product`;

      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { productId: selectedProduct._id, ...newProduct } : newProduct;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();
      if (result.condition === "SUCCESS") {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Product Management</h2>
        <div className="flex items-center space-x-4">
          <input onChange={handleCategoryFilter} value={selectedCategory} placeholder="Filter by Category (optional)" className="border p-2 rounded bg-white" />
          <button onClick={openAddModal} className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded shadow-lg transition-all duration-200">
            + Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Unit</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
            ) : Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <ProductRow key={product._id} product={product} onEdit={openEditModal} onDelete={openConfirmDelete} />
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-4">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Modal and Delete Confirmation logic stays unchanged */}

      <DeleteConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, product: null })}
        onConfirm={confirmDelete}
      />
      {/* Add/Edit Product Modal */}
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
      <input name="code" type="number" required defaultValue={selectedProduct?.code} placeholder="Code" className="w-full border p-2 rounded" />
      <input name="productName" required defaultValue={selectedProduct?.productName} placeholder="Product Name" className="w-full border p-2 rounded" />
      <input name="category" required defaultValue={selectedProduct?.category} placeholder="Category" className="w-full border p-2 rounded" />
      <input name="unit" required defaultValue={selectedProduct?.unit} placeholder="Unit (e.g., kg, pcs)" className="w-full border p-2 rounded" />
      <input name="price" type="number" step="0.01" required defaultValue={selectedProduct?.price} placeholder="Price" className="w-full border p-2 rounded" />
      <input name="currentQuantity" type="number" required defaultValue={selectedProduct?.currentQuantity} placeholder="Quantity" className="w-full border p-2 rounded" />
      <input name="minQuantity" type="number" required defaultValue={selectedProduct?.minQuantity} placeholder="Min Quantity" className="w-full border p-2 rounded" />
      <input name="size" defaultValue={selectedProduct?.size} placeholder="Size (optional)" className="w-full border p-2 rounded" />
      <input name="material" defaultValue={selectedProduct?.material} placeholder="Material (optional)" className="w-full border p-2 rounded" />
      <input name="make" defaultValue={selectedProduct?.make} placeholder="Make (optional)" className="w-full border p-2 rounded" />
      
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
