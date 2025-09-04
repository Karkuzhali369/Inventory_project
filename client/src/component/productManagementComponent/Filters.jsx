import arrowIcon from "../../assets/icons/right-arrow.png";

const Filters = ({ search, setSearch, sortBy, setSortBy, sortOrder, handleOrder, categories, selectedCategory, setSelectedCategory }) => (
  <div className="mx-1 md:mx-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
      />
    </div>

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

    <div className="relative w-full md:w-1/3 flex items-center gap-2">
      <label htmlFor="category" className="whitespace-nowrap font-medium text-sm w-20">Category:</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="appearance-none cursor-pointer border border-gray-300 px-4 py-2 rounded-lg w-full pr-10 shadow-sm hover:shadow-md"
      >
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
  </div>
);

export default Filters;
