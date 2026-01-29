import React, { useEffect, useState } from "react";

const StockModel = ({ date, setSelectedEntry }) => {
  const [products, setProducts] = useState([]);

  const currency = (n) => {
    const num = Number(n);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  const fetchRecord = async () => {
    const token = localStorage.getItem("Token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/get-records?dateString=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [date]);

  // ✅ Group duplicate products by productId
  const groupedProducts = Object.values(
    products.reduce((acc, item) => {
      const id = item.productId;

      if (!acc[id]) {
        acc[id] = { ...item };
      } else {
        acc[id].quantity += Number(item.quantity) || 0;
      }

      return acc;
    }, {})
  );

  // ✅ Calculate grand total from grouped data
  const totalSold = groupedProducts.reduce((sum, it) => {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-300/50"
      onClick={() => setSelectedEntry(null)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white w-[min(92vw,900px)] rounded-2xl shadow-2xl ring-1 ring-blue-200 p-0 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-red-200">
          <div className="font-semibold text-blue-800">Date: {date}</div>
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
                {(groupedProducts.length > 0
                  ? groupedProducts
                  : [{ productName: "—", category: "—", quantity: 0, unitPrice: 0 }]
                ).map((it, i) => {
                  const qty = Number(it.quantity) || 0;
                  const price = Number(it.unitPrice) || 0;
                  const rowTotal = qty * price;

                  return (
                    <tr key={it.productId || i} className="[&>td]:px-3 [&>td]:py-2">
                      <td>{i + 1}</td>
                      <td className="font-medium text-blue-900">{it.productName || "—"}</td>
                      <td>{it.category || "—"}</td>
                      <td>{qty}</td>
                      <td>{currency(price)}</td>
                      <td className="font-semibold">{currency(rowTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Total */}
          <div className="mt-4 text-right text-blue-900 font-semibold">
            Total: <span className="ml-1">{currency(totalSold)}</span>
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
  );
};

export default StockModel;
