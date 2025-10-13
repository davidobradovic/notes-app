"use client";
import { useState } from "react";
import { Trash2, Plus, DollarSign } from "lucide-react";

export default function TablePage() {
  const [rows, setRows] = useState([
    { id: Date.now(), title: "", price: "" },
  ]);

  const addRow = () => setRows([...rows, { id: Date.now(), title: "", price: "" }]);
  
  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(newRows);
  };

  const total = rows.reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tabela</h1>
          <p className="text-gray-500 text-sm">Upravljanje uslugama i cijenama</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-6">Naziv usluge</div>
            <div className="col-span-4">Cijena (KM)</div>
            <div className="col-span-2"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 transition-colors group">
                <div className="col-span-6 flex items-center">
                  <input
                    type="text"
                    value={row.title}
                    onChange={e => updateRow(row.id, "title", e.target.value)}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                    placeholder="Unesite naziv usluge..."
                  />
                </div>
                <div className="col-span-4 flex items-center">
                  <input
                    type="number"
                    value={row.price}
                    onChange={e => updateRow(row.id, "price", e.target.value)}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <button
                    onClick={() => deleteRow(row.id)}
                    disabled={rows.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
                    title="Obriši red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          <div className="px-6 py-3 border-t border-gray-100">
            <button
              onClick={addRow}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
            >
              <Plus size={16} />
              <span>Dodaj red</span>
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign size={20} />
              <span className="text-sm font-medium">Ukupna cijena</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {total.toFixed(2)} <span className="text-xl text-gray-500">KM</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Broj stavki:</span>
              <span className="font-medium text-gray-700">{rows.length}</span>
            </div>
            {rows.length > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Prosječna cijena:</span>
                <span className="font-medium text-gray-700">
                  {(total / rows.length).toFixed(2)} KM
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}