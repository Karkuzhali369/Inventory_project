import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="text-center hover:bg-gray-50 transition-all duration-200">
    <td className="py-2 px-4 border-b">{product.id}</td>
    <td className="py-2 px-4 border-b">{product.name}</td>
    <td className="py-2 px-4 border-b">{product.category}</td>
    <td className="py-2 px-4 border-b">₹{product.price}</td>
    <td className="py-2 px-4 border-b">{product.stock}</td>
    <td className="py-2 px-4 border-b space-x-2">
      <button onClick={() => onEdit(product)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded shadow-md">
        Edit
      </button>
      <button onClick={() => onDelete(product)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow-md">
        Delete
      </button>
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

  const dummyProducts = [
    { id: 1, name: "Hammer", category: "Tools", price: 150, stock: 30 },
    { id: 2, name: "Screwdriver", category: "Tools", price: 80, stock: 50 },
    { id: 3, name: "Pliers", category: "Tools", price: 120, stock: 40 },
    { id: 4, name: "Drill", category: "Power Tools", price: 2000, stock: 15 },
    { id: 5, name: "Paint Brush", category: "Painting", price: 60, stock: 100 },
    { id: 6, name: "Wrench", category: "Tools", price: 130, stock: 25 },
    { id: 7, name: "Nails Pack", category: "Hardware", price: 40, stock: 200 },
    { id: 8, name: "PVC Pipe", category: "Plumbing", price: 250, stock: 10 },
    { id: 9, name: "Wire Roll", category: "Electrical", price: 800, stock: 5 },
    { id: 10, name: "Bulb", category: "Electrical", price: 100, stock: 60 }
  ];

  useEffect(() => {
    setLoading(true);
    // Uncomment for real API
    // fetch("http://localhost:5000/api/product/get-product?page=1&limit=5&search=&category=&sortBy=productName&order=asc")
    //   .then((res) => res.json())
    //   .then((data) => setProducts(data.products))
    //   .catch((err) => console.error(err))
    //   .finally(() => setLoading(false));

    setProducts(dummyProducts);
    setLoading(false);
  }, []);

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

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== confirmModal.product.id));
    setConfirmModal({ open: false, product: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newProduct = {
      id: isEditing ? selectedProduct.id : Date.now(),
      code: form.code.value,
      name: form.name.value,
      category: form.category.value,
      price: parseFloat(form.price.value),
      stock: parseInt(form.stock.value),
      make: form.make.value,
      unitSize: form.unitSize.value
    };

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === newProduct.id ? newProduct : p)));
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }
    setIsModalOpen(false);
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Product Management</h2>
        <button onClick={openAddModal} className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded shadow-lg transition-all duration-200">
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-center animate-pulse">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={openEditModal}
                  onDelete={openConfirmDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="min-h-screen px-4 text-center backdrop-blur-sm bg-black/30 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              >
                <Dialog.Title className="text-lg font-medium mb-4">
                  {isEditing ? "Edit Product" : "Add Product"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="code" defaultValue={selectedProduct?.code || ""} required placeholder="Product Code" className="w-full border p-2 rounded" />
                  <input name="name" defaultValue={selectedProduct?.name || ""} required placeholder="Name" className="w-full border p-2 rounded" />
                  <input name="category" defaultValue={selectedProduct?.category || ""} required placeholder="Category" className="w-full border p-2 rounded" />
                  <input name="price" type="number" defaultValue={selectedProduct?.price || ""} required placeholder="Price" className="w-full border p-2 rounded" />
                  <input name="stock" type="number" defaultValue={selectedProduct?.stock || ""} required placeholder="Stock" className="w-full border p-2 rounded" />
                  <input name="make" defaultValue={selectedProduct?.make || ""} placeholder="Make (Optional)" className="w-full border p-2 rounded" />
                  <input name="unitSize" defaultValue={selectedProduct?.unitSize || ""} placeholder="Unit Size (Optional)" className="w-full border p-2 rounded" />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      {isEditing ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal.open && (
          <DeleteConfirmationModal
            isOpen={confirmModal.open}
            onClose={() => setConfirmModal({ open: false, product: null })}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductManagementPage;
