"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, Menu, X } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

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
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const saveTimeout = useRef(null);

  // Fetch notes
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://notes.gorillapoker.bet/api/notes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            if (role === 'owner') {
              setAllNotes(data);
              const firstNote = data[0];
              setTitle(firstNote.title || "");
              setContent(firstNote.content || "");
              setCurrentNoteId(firstNote.id);
            } else {
              const todaysNote = data[0];
              setTitle(todaysNote.title || "");
              setContent(todaysNote.content || "");
              setCurrentNoteId(todaysNote.id);
            }
          } else {
            setTitle("");
            setContent("");
            setCurrentNoteId(null);
          }
        } else {
          console.error('Failed to fetch notes:', response.status, response.statusText);
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
        
        if (currentNoteId) {
          const response = await fetch(`https://notes.gorillapoker.bet/api/notes/${currentNoteId}`, {
            method: "PUT",
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
        } else {
          const response = await fetch("https://notes.gorillapoker.bet/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, content: newContent }),
          });
          if (response.ok) {
            const newNote = await response.json();
            setCurrentNoteId(newNote.id);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
          }
        }
      } catch (error) {
        console.error("Error saving notes:", error);
      } finally {
        setSaving(false);
      }
    }, 1000);
  };

  const handleSaveWithTitle = async (newTitle, newContent) => {
    setSaving(true);
    setJustSaved(false);
    try {
      const token = localStorage.getItem("token");
      
      if (currentNoteId) {
        const response = await fetch(`https://notes.gorillapoker.bet/api/notes/${currentNoteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });
        if (response.ok) {
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 2000);
        }
      } else {
        const response = await fetch("https://notes.gorillapoker.bet/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });
        if (response.ok) {
          const newNote = await response.json();
          setCurrentNoteId(newNote.id);
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 2000);
        }
      }
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  };

  const loadNote = (note) => {
    setTitle(note.title || "");
    setContent(note.content || "");
    setCurrentNoteId(note.id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <AuthGuard>
      <div className="w-screen min-h-screen overflow-hidden bg-gray-50 text-gray-900 flex flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                <h1 className="text-lg lg:text-xl font-semibold tracking-tight whitespace-nowrap">Notes</h1>
                {saving && (
                  <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                    <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin flex-shrink-0" />
                    <span className="hidden md:inline">Čuvanje...</span>
                  </div>
                )}
                {justSaved && (
                  <div className="flex items-center gap-1 text-xs lg:text-sm text-green-600 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span className="hidden md:inline">Sačuvano</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                <a
                  href="/scheduler"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap"
                >
                  Raspored
                </a>
                <a
                  href="/table"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap"
                >
                  Tabela
                </a>
                <button
                  onClick={handleLogout}
                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-900 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h1 className="text-base font-semibold tracking-tight">Notes</h1>
                {saving && <Loader2 className="w-3 h-3 animate-spin text-gray-500 flex-shrink-0" />}
                {justSaved && <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 space-y-2">
                <a
                  href="/scheduler"
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  Raspored
                </a>
                <a
                  href="/table"
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  Tabela
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 overflow-auto">
          {/* Date Badge and Note Selector */}
          <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
              {getSerbianDate()}
            </span>
            {userRole === 'owner' && allNotes.length > 1 && (
              <div className="w-full sm:w-auto">
                <select
                  value={currentNoteId || ''}
                  onChange={(e) => {
                    const selectedNote = allNotes.find(n => n.id === parseInt(e.target.value));
                    if (selectedNote) loadNote(selectedNote);
                  }}
                  className="w-full sm:w-auto min-w-0 p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {allNotes.map(note => (
                    <option key={note.id} value={note.id}>
                      {note.title || 'Bez naslova'} - {new Date(note.createdAt).toLocaleDateString('sr-RS')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Editor Container */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow p-3 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-gray-500">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mb-3" />
                <p className="text-sm sm:text-base">Učitavanje beleški...</p>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setTitle(newTitle);
                    if (saveTimeout.current) clearTimeout(saveTimeout.current);
                    saveTimeout.current = setTimeout(() => {
                      handleSaveWithTitle(newTitle, content);
                    }, 1000);
                  }}
                  className="w-full text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 px-2 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent"
                  placeholder="Naslov beleške"
                />
                <div className="min-h-[300px] sm:min-h-[400px]">
                  <SimpleEditor 
                    key={currentNoteId}
                    initialContent={content} 
                    onSave={handleSave} 
                  />
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 sm:py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} — Notes developed by David
        </footer>
      </div>
    </AuthGuard>
  );
}