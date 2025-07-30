import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const One = () => {
  const overviewStats = {
    totalProducts: 150,
    totalCategories: 10,
    totalQuantity: 1350,
    lowStockCount: 12
  };

  const stockByCategory = [
    { category: 'Dairy', quantity: 350 },
    { category: 'Snacks', quantity: 300 },
    { category: 'Beverages', quantity: 250 },
    { category: 'Bakery', quantity: 150 },
    { category: 'Vegetables', quantity: 300 }
  ];

  const lowStockItems = [
    { product: 'Milk Packet', currentQty: 12, minQty: 20 },
    { product: 'Bread', currentQty: 8, minQty: 15 },
    { product: 'Butter', currentQty: 3, minQty: 10 }
  ];

  const weeklyStockMovement = [
    { day: 'Mon', quantity: 50 },
    { day: 'Tue', quantity: 40 },
    { day: 'Wed', quantity: 30 },
    { day: 'Thu', quantity: 60 },
    { day: 'Fri', quantity: 70 },
    { day: 'Sat', quantity: 45 },
    { day: 'Sun', quantity: 55 }
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Inventory Statistics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-600">Total Products</p>
          <h2 className="text-xl font-bold">{overviewStats.totalProducts}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-600">Categories</p>
          <h2 className="text-xl font-bold">{overviewStats.totalCategories}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-600">Total Quantity</p>
          <h2 className="text-xl font-bold">{overviewStats.totalQuantity}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-600">Low Stock Items</p>
          <h2 className="text-xl font-bold text-red-600">{overviewStats.lowStockCount}</h2>
        </div>
      </div>

      {/* Bar Chart - Stock by Category */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Stock by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockByCategory}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table - Low Stock Items */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Current Qty</th>
              <th className="px-4 py-2 text-left">Min Qty</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.product}</td>
                <td className="px-4 py-2">{item.currentQty}</td>
                <td className="px-4 py-2">{item.minQty}</td>
                <td className="px-4 py-2 text-red-500 font-bold">Low</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Line Chart - Weekly Stock Movement */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Stock Movement</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyStockMovement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="quantity" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default One;
