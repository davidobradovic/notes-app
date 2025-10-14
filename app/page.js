"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
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
  const saveTimeout = useRef(null);

  // Fetch notes
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3001/api/notes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            if (role === 'owner') {
              // Owner sees all notes
              setAllNotes(data);
              // Load the first note
              const firstNote = data[0];
              setTitle(firstNote.title || "");
              setContent(firstNote.content || "");
              setCurrentNoteId(firstNote.id);
            } else {
              // Regular user sees only today's note
              const todaysNote = data[0];
              setTitle(todaysNote.title || "");
              setContent(todaysNote.content || "");
              setCurrentNoteId(todaysNote.id);
            }
          } else {
            // No notes, start with empty state
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
          // Update existing note
          const response = await fetch(`http://localhost:3001/api/notes/${currentNoteId}`, {
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
          // Create new note
          const response = await fetch("http://localhost:3001/api/notes", {
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
    }, 1000); // Save 1s after typing stops
  };

  // Save with specific title (used when title changes)
  const handleSaveWithTitle = async (newTitle, newContent) => {
    setSaving(true);
    setJustSaved(false);
    try {
      const token = localStorage.getItem("token");
      
      if (currentNoteId) {
        // Update existing note
        const response = await fetch(`http://localhost:3001/api/notes/${currentNoteId}`, {
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
        // Create new note
        const response = await fetch("http://localhost:3001/api/notes", {
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
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-3">
            <a
              href="/table"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Tabela
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
      {/* Main Content */}
      <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-auto">
        {/* Date Badge */}
        <div className="mb-8 flex justify-between items-center flex-wrap">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {getSerbianDate()}
          </span>
          {userRole === 'owner' && allNotes.length > 1 && (
              <div className="flex items-center gap-2">
                <select
                  value={currentNoteId || ''}
                  onChange={(e) => {
                    const selectedNote = allNotes.find(n => n.id === parseInt(e.target.value));
                    if (selectedNote) loadNote(selectedNote);
                  }}
                  className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {/* Title input and Editor or Loading */}
        <div className=" rounded-2xl shadow p-4 sm:p-6 md:p-8">
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
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  // Save with the new title, not the old one
                  if (saveTimeout.current) clearTimeout(saveTimeout.current);
                  saveTimeout.current = setTimeout(() => {
                    handleSaveWithTitle(newTitle, content);
                  }, 1000);
                }}
                className="w-full text-3xl font-bold mb-6 px-2 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Naslov beleške"
              />
            <SimpleEditor 
              key={currentNoteId} // Ovo će prisiliti re-render kada se promeni noteId
              initialContent={content} 
              onSave={handleSave} 
            />
            </>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} — Notes developed by David
      </footer>
      </div>
    </AuthGuard>
  );
}