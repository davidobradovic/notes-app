"use client";
import { useState, useEffect, useRef } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Loader2, CheckCircle2 } from "lucide-react";

function getSerbianDate() {
  const days = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];
  const d = new Date();
  const day = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${day}, ${dd}.${mm}.${yyyy}`;
}

export default function NotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const saveTimeout = useRef(null);

  // Check auth and fetch notes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3001/notes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const latest = data[data.length - 1];
            setTitle(latest.title || "");
            setContent(latest.content || "");
          }
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Auto-save when typing stops
  const handleSave = (newContent) => {
    setContent(newContent);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      setJustSaved(false);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title, content: newContent }),
        });
        if (response.ok) {
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 2000);
        }
      } catch (error) {
        console.error("Error saving notes:", error);
      } finally {
        setSaving(false);
      }
    }, 1000); // Save 1s after typing stops
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Notes</h1>
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
          <a
            href="/table"
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Tabela
          </a>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Date Badge */}
        <div className="mb-8 flex justify-between items-center">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {getSerbianDate()}
          </span>
        </div>
        {/* Title input and Editor or Loading */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 md:p-8 transition-all">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mb-3" />
              <p>Učitavanje beleški...</p>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  handleSave(content);
                }}
                className="w-full text-3xl font-bold mb-6 px-2 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Naslov beleške"
              />
              <SimpleEditor initialContent={content} onSave={handleSave} />
            </>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} — Notes
      </footer>
    </div>
  );
}