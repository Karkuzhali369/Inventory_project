import React, { useState, useEffect } from "react";

const currency = (n) => n.toLocaleString();

const StockEntryPage = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/product/get-entry-logs?page=1&limit=5&stock=entry",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJkOGYwMGQzYzVmMWYxYTM3MzUxOGEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTcyNTQyMTUsImV4cCI6MTc4ODc5MDIxNX0.OdIXXTSM6xvVaUPlddSudjnYGim01fB6xmylMkT9tVM`, 
            },
          }
        );
        const data = await res.json();

        if (data.data && data.data.logs) {
          const mapped = data.data.logs.map((log) => ({
            date: new Date(log.dateAndTime).toLocaleDateString(),
            totalProducts: log.totalProducts,
            totalCost: log.totalCost,
            profit: log.profit || 0,
            enteredBy: log.author,
            items: [], // currently empty, or map if your backend sends item details
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
              <span className="text-sm font-medium text-red-400">
                entered by: {entry.enteredBy}
              </span>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-300/50"
          onClick={() => setSelectedEntry(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white w-[min(92vw,900px)] rounded-2xl shadow-2xl ring-1 ring-blue-200 p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Date + Entered by */}
            <div className="flex items-center justify-between px-4 py-3 bg-red-200">
              <div className="font-semibold text-blue-800">Date: {selectedEntry.date}</div>
              <div className="text-blue-800 text-sm">
                entered by: <span className="font-semibold">{selectedEntry.enteredBy}</span>
              </div>
            </div>

            {/* Table */}
            <div className="p-5">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 text-blue-800">
                    <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                      <th className="w-14">S.No</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th className="w-16">Qty</th>
                      <th className="w-36">Price of 1</th>
                      <th className="w-36">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-gray-300">
                    {(selectedEntry.items.length > 0 ? selectedEntry.items : [{ name: "—", category: "—", qty: 0, price: 0 }]).map((it, i) => {
                      const rowTotal = it.qty * it.price;
                      return (
                        <tr key={i} className="[&>td]:px-3 [&>td]:py-2">
                          <td>{i + 1}</td>
                          <td className="font-medium text-blue-900">{it.name}</td>
                          <td>{it.category}</td>
                          <td>{it.qty}</td>
                          <td>{currency(it.price)}</td>
                          <td className="font-semibold">{currency(rowTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer: Total sold */}
              <div className="mt-4 text-right text-blue-900 font-semibold">
                Total sold: <span className="ml-1">{currency(totalSold)}</span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockEntryPage;
