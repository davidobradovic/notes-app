"use client";
import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function TablePage() {
  const [rows, setRows] = useState([
    { id: Date.now(), title: "", price: "" },
  ]);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [allTables, setAllTables] = useState([]);
  const saveTimeout = useRef(null);

  // Load tables on component mount
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    const fetchTables = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://triplexphoenix.davidtesla.online/api/tables", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            if (role === 'owner') {
              // Owner sees all tables
              setAllTables(data);
              // Load the first table
              const firstTable = data[0];
              setRows(JSON.parse(firstTable.rows));
              setCurrentTableId(firstTable.id);
            } else {
              // Regular user sees only today's table
              const todaysTable = data[0];
              setRows(JSON.parse(todaysTable.rows));
              setCurrentTableId(todaysTable.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const addRow = () => {
    const newRows = [...rows, { id: Date.now(), title: "", price: "" }];
    setRows(newRows);
    handleSave(newRows);
  };
  
  const deleteRow = (id) => {
    if (rows.length > 1) {
      const newRows = rows.filter(row => row.id !== id);
      setRows(newRows);
      handleSave(newRows);
    }
  };

  const updateRow = (id, field, value) => {
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(newRows);
    handleSave(newRows);
  };

  // Auto-save when data changes
  const handleSave = (newRows) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      setJustSaved(false);
      try {
        const token = localStorage.getItem("token");
        
        if (currentTableId) {
          // Update existing table
          const response = await fetch(`https://triplexphoenix.davidtesla.online/api/tables/${currentTableId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
              name: "Tabela", 
              rows: newRows 
            }),
          });
          if (response.ok) {
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
          }
        } else {
          // Create new table
          const response = await fetch("https://triplexphoenix.davidtesla.online/api/tables", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
              name: "Tabela", 
              rows: newRows 
            }),
          });
          if (response.ok) {
            const newTable = await response.json();
            setCurrentTableId(newTable.id);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
          }
        }
      } catch (error) {
        console.error("Error saving table:", error);
      } finally {
        setSaving(false);
      }
    }, 1000);
  };

  const loadTable = (table) => {
    setRows(JSON.parse(table.rows));
    setCurrentTableId(table.id);
  };

  const total = rows.reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">Tabele</h1>
            {saving && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Čuvanje...</span>
              </div>
            )}
            {justSaved && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sačuvano</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Notes
            </a>
            <a
              href="/scheduler"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Raspored
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{}</h1>
              <p className="text-gray-500 text-sm">Upravljanje uslugama i cijenama</p>
            </div>
            {userRole === 'owner' && allTables.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Odaberite tabelu:</label>
                <select
                  value={currentTableId || ''}
                  onChange={(e) => {
                    const selectedTable = allTables.find(t => t.id === parseInt(e.target.value));
                    if (selectedTable) loadTable(selectedTable);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allTables.map(table => (
                    <option key={table.id} value={table.id}>
                      {new Date(table.createdAt).toLocaleDateString('sr-RS')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mb-3" />
            <p>Učitavanje tabela...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}