import { useState } from 'react'
import ProductCard from '../component/ProductCard';

const products = [
    {
        _id: "P001",
        productName: "Steel Rod",
        category: "Construction",
        currentQuantity: 120,
        unit: "pcs",
        material: "Steel",
        size: "6ft",
        make: "Tata"
    },
    {
        _id: "P002",
        productName: "Acrylic Paint",
        category: "Art Supplies",
        currentQuantity: 40,
        unit: "Litres",
        material: "Acrylic",
        size: "500ml",
        make: "Camel"
    },
    {
        _id: "P003",
        productName: "PVC Pipe",
        category: "Plumbing",
        currentQuantity: 85,
        unit: "meters",
        material: "PVC",
        size: "1 inch",
        make: "Supreme"
    },
    {
        _id: "P004",
        productName: "Glass Sheet",
        category: "Construction",
        currentQuantity: 25,
        unit: "sheets",
        material: "Tempered Glass",
        size: "4x6 ft",
        make: "Saint Gobain"
    },
    {
        _id: "P005",
        productName: "LED Light",
        category: "Electrical",
        currentQuantity: 200,
        unit: "pcs",
        material: "Plastic/Metal",
        size: "15W",
        make: "Philips"
    },
    {
        _id: "P001",
        productName: "Steel Rod",
        category: "Construction",
        currentQuantity: 120,
        unit: "pcs",
        material: "Steel",
        size: "6ft",
        make: "Tata"
    },
    {
        _id: "P002",
        productName: "Acrylic Paint",
        category: "Art Supplies",
        currentQuantity: 40,
        unit: "Litres",
        material: "Acrylic",
        size: "500ml",
        make: "Camel"
    },
    {
        _id: "P003",
        productName: "PVC Pipe",
        category: "Plumbing",
        currentQuantity: 85,
        unit: "meters",
        material: "PVC",
        size: "1 inch",
        make: "Supreme"
    },
    {
        _id: "P004",
        productName: "Glass Sheet",
        category: "Construction",
        currentQuantity: 25,
        unit: "sheets",
        material: "Tempered Glass",
        size: "4x6 ft",
        make: "Saint Gobain"
    },
    {
        _id: "P005",
        productName: "LED Light",
        category: "Electrical",
        currentQuantity: 200,
        unit: "pcs",
        material: "Plastic/Metal",
        size: "15W",
        make: "Philips"
    }
];
const categories = ['All', 'Furniture', 'Electrical', 'Construction', 'Art'];



const ProductsListingPage = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');


    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.productName.toLowerCase().includes(search.toLowerCase()) ||
            product._id.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    return (
        <div className=''>
            <div className='flex justify-center'><h1 className='md:text-xl text-sm text-bold text-blue-700 font-bold my-2'>PRODUCTS</h1></div>
            <div className="mx-5 flex md:flex-row items-center justify-between mb-6 gap-x-2 ">

                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover-shadow-md"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 "></i>
                </div>

                <div className="relative w-full md:w-1/4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg shadow-sm hover:shadow-md"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <i className="fas fa-chevron-down" /> 
                    </div>
                </div>

            </div>
            <div className=''>{filteredProducts.map((product) => (<ProductCard product={product} />))}</div>
        </div>
    )
}

export default ProductsListingPage;
