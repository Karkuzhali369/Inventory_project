import React, { useState, useEffect } from "react";
import StockModel from "../component/stockEntryPageComponent/StockModel";

const StockEntryPage = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const currency = (n) => n.toLocaleString();

  // Fetch logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('Token');
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/get-entry-logs?page=1&limit=30&stock=entry`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        const data = await res.json();

        if (data.data && data.data.logs) {
          const mapped = data.data.logs.map((log) => ({
            date: log.date,
            totalProducts: log.totalProducts,
            totalCost: log.totalCost,
            profit: log.totalProfit || 0,
            // enteredBy: log.author,
            items: []
          }));
          setEntries(mapped);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

  const totalSold =
    (selectedEntry?.items || []).reduce((sum, it) => sum + it.qty * it.price, 0) || 0;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Stock Entry Details
      </h2>

      <div className="space-y-4">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEntry(entry)}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-4 hover:shadow-lg transition relative cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-600 font-semibold">{entry.date}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-2">
              <div className="text-blue-700 font-medium">
                Total Products:{" "}
                <span className="font-bold text-blue-600">{entry.totalProducts}</span>
              </div>
              <div className="text-blue-700 font-medium">
                Total Cost:{" "}
                <span className="font-bold text-blue-600">{currency(entry.totalCost)}</span>
              </div>
              <div className="text-blue-700 font-medium">
                Profit:{" "}
                <span className="font-bold text-red-500">{currency(entry.profit)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEntry && (
        <StockModel date={selectedEntry.date} setSelectedEntry={setSelectedEntry} />
      )}
    </div>
  );
};

export default StockEntryPage;
