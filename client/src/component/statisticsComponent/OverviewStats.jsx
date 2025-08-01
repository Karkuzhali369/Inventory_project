

const OverviewStats = ({ overviewStatsData }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow p-4">
                <p className="text-gray-600">Total Products</p>
                <h2 className="text-xl font-bold">{overviewStatsData.totalProducts}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
                <p className="text-gray-600">Categories</p>
                <h2 className="text-xl font-bold">{overviewStatsData.totalCategories}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
                <p className="text-gray-600">Total Net Worth</p>
                <h2 className="text-xl font-bold">₹{overviewStatsData.totalNetWorth}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
                <p className="text-gray-600">Low Stock Items</p>
                <h2 className="text-xl font-bold text-red-600">{overviewStatsData.lowStockCount}</h2>
            </div>
        </div>
        
    )
}

export default OverviewStats