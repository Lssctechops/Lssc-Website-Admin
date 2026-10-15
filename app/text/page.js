"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Invoice = () => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Invoice",
    onAfterPrint: () => console.log("Print success!"),
  });

  return (
    <div className="p-6">
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Print Invoice
      </button>

      <div
        ref={contentRef}
        className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow"
      >
        <div>
          <h1 className="text-2xl font-bold mb-4">Invoice</h1>
          <div className="mb-2">
            <strong>Invoice #:</strong> 12345
          </div>
          <div className="mb-2">
            <strong>Date:</strong> 06 July 2025
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Bill To:</h2>
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>City, Country</p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Items:</h2>
            <table className="w-full mt-2 text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Product A</td>
                  <td className="p-2 border">2</td>
                  <td className="p-2 border">$20</td>
                </tr>
                <tr>
                  <td className="p-2 border">Product B</td>
                  <td className="p-2 border">1</td>
                  <td className="p-2 border">$10</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <strong>Total: $50</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
