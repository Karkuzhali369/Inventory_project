import { useState, useEffect } from "react";
import ProductRow from "../component/productManagementComponent/ProductRow";
import DeleteConfirmationModal from "../component/productManagementComponent/DeleteConfirmationModal";
import ProductFormModal from "../component/productManagementComponent/ProductFormModal";
import Filters from "../component/productManagementComponent/Filters";
import Pagination from "../component/productManagementComponent/Pagination";

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

    const [endPage, setEndPage] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem("Token");
        try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-product?page=${page}&limit=${limit}&search=${search.trim()}&category=${selectedCategory}&sortBy=${sortBy}&order=${sortOrder}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEndPage(data.data.paging.pages);
        setProducts(data.condition === "SUCCESS" ? data.data.products : []);
        } catch (err) { console.error(err); setProducts([]); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, [search, selectedCategory, sortBy, sortOrder, page]);

    useEffect(() => {
        const fetchCategory = async () => {
        const token = localStorage.getItem("Token");
        try {
            const res = await fetch('http://localhost:5000/api/product/get-category', {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.condition === "SUCCESS") setCategories(["ALL", ...data.data.categories]);
        } catch (err) { console.error(err); }
        };
        fetchCategory();
    }, []);

    const handleOrder = () => setSortOrder(prev => prev === "asc" ? "desc" : "asc");

    const openAddModal = () => { setSelectedProduct(null); setIsEditing(false); setIsModalOpen(true); };
    const openEditModal = (product) => { setSelectedProduct(product); setIsEditing(true); setIsModalOpen(true); };
    const openConfirmDelete = (product) => setConfirmModal({ open: true, product });

    const confirmDelete = async () => {
        const token = localStorage.getItem("Token");
        try {
        const res = await fetch(`http://localhost:5000/api/product/delete-product`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: confirmModal.product._id }),
        });
        const result = await res.json();
        if (result.condition === "SUCCESS") { fetchProducts(); setConfirmModal({ open: false, product: null }); }
        } catch (err) { console.error(err); }
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
        cp: parseFloat(form.cp.value),
        sp: parseFloat(form.sp.value),
        dealer: form.dealer.value,
        minQuantity: parseInt(form.minQuantity.value),
        };
        const endpoint = isEditing
        ? `http://localhost:5000/api/product/modify-product`
        : `http://localhost:5000/api/product/add-product`;
        const method = isEditing ? "PUT" : "POST";
        const body = isEditing ? { productId: selectedProduct._id, ...newProduct } : newProduct;

        try {
        const res = await fetch(endpoint, {
            method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });
        const result = await res.json();
        if (result.condition === "SUCCESS") { setIsModalOpen(false); fetchProducts(); }
        } catch (err) { console.error(err); }
    };

    return (
        <section className="min-h-screen w-full p-4 md:p-6">
        <h1 className="text-center md:text-xl text-sm text-blue-700 font-bold my-2">PRODUCTS MANAGEMENT</h1>

        <Filters
            search={search} setSearch={setSearch}
            sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} handleOrder={handleOrder}
            categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        />

        <div className="flex justify-end mb-4">
            <button onClick={openAddModal} className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded shadow-lg transition-all duration-200 cursor-pointer">+ Add Product</button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-200 text-gray-700">
                <tr>
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">CP</th>
                <th className="py-2 px-4">SP</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : products.length > 0 ? (
                products.map((product) => <ProductRow key={product._id} product={product} onEdit={openEditModal} onDelete={openConfirmDelete} />)
                ) : (
                <tr><td colSpan="6" className="text-center py-4">No products found</td></tr>
                )}
            </tbody>
            </table>
        </div>

        <Pagination page={page} setPage={setPage} endPage={endPage} />

        <DeleteConfirmationModal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, product: null })} onConfirm={confirmDelete} />

        <ProductFormModal
            isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}
            selectedProduct={selectedProduct} isEditing={isEditing} categories={categories}
        />
        </section>
    );
};

export default ProductManagementPage;
