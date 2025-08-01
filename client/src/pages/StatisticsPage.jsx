import OverviewStats from '../component/statisticsComponent/OverviewStats';
import PieCharComponent from '../component/statisticsComponent/PieCharComponent';
import GroupedBarChart from '../component/statisticsComponent/GroupedBarChart';
import StockMovementStats from '../component/statisticsComponent/StockMovementStats';
import { useEffect, useState } from 'react';

const StatisticsPage = () => {
    const [overviewStats, setOverviewStats] = useState({});
    const [stockByCategory, setStockByCategory] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [lastEightWeeksStock, setLastEightWeekStock] = useState([]);

    const token = localStorage.getItem('Token');
    const getStatisticsData = async () => {
        try {
            const response = await fetch('https://inventory-project-d3mr.onrender.com/api/product/get-statistics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setOverviewStats(data.data.overviewStats);
            setStockByCategory(data.data.stockByCategory);
            setGroupedData(data.data.lastThreeMonthData);
            setLastEightWeekStock(data.data.lastEightWeekSale);
        }
        catch(err) {

        }
    }

    useEffect(() => {
        getStatisticsData();
    }, []);

    return (
        <div className="px-6 py-6 max-md:px-1 space-y-8">
            <h1 className="text-3xl font-bold">Inventory Statistics</h1>

            <OverviewStats overviewStatsData={overviewStats} />
            
            {/* Pie Chart - Stock by Category */}
            <div className="bg-white rounded-2xl shadow p-6 max-md:p-0">
                <h2 className="text-xl font-semibold mb-4">Stock by Category</h2>
                <PieCharComponent stockByCategory={stockByCategory} />
            </div>

            {/* Grouped Bar Chart - Last three months sale */}
            <div className="bg-white rounded-2xl shadow p-6 max-md:p-0">
                <h2 className="text-xl font-semibold mb-4">Last three months sale</h2>
                <GroupedBarChart groupedData={groupedData} />
            </div>

            {/* Line Chart - Weekly Stock Movement */}
            <div className="bg-white rounded-2xl shadow p-6 max-md:p-0">
                <h2 className="text-xl font-semibold mb-4">Last 8 Weeks Stock Movement</h2>
                <StockMovementStats lastEightWeeksStock={lastEightWeeksStock} />
            </div>

        </div>
    );
};

export default StatisticsPage;