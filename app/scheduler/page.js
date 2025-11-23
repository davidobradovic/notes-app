// "use client";
// import { useState, useEffect } from "react";
// import { Loader2, Plus, Edit, Trash2, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

// export default function SchedulerPage() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [view, setView] = useState('week'); // 'week' or 'day'
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     start: new Date(),
//     end: new Date(),
//     allDay: false
//   });

//   useEffect(() => {
//     const role = localStorage.getItem('role') || 'user';
//     setUserRole(role);
    
//     const fetchEvents = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch("https://notes.gorillapoker.bet/api/events", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const transformedEvents = data.map(event => ({
//             ...event,
//             start: new Date(event.start),
//             end: new Date(event.end)
//           }));
//           setEvents(transformedEvents);
//         }
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const formatDate = (date) => {
//     return date.toLocaleDateString('sr-RS', { weekday: 'short', month: 'short', day: 'numeric' });
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
//   };

//   const getWeekDays = (date) => {
//     const start = new Date(date);
//     start.setDate(start.getDate() - start.getDay() + 1); // Monday
//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(start);
//       day.setDate(start.getDate() + i);
//       days.push(day);
//     }
//     return days;
//   };

//   const getDayHours = () => {
//     const hours = [];
//     for (let i = 0; i < 24; i++) {
//       hours.push(i);
//     }
//     return hours;
//   };

//   const getEventsForDay = (day) => {
//     return events.filter(event => {
//       const eventStart = new Date(event.start);
//       return eventStart.toDateString() === day.toDateString();
//     }).sort((a, b) => a.start - b.start);
//   };

//   const handleTimeSlotClick = (day, hour) => {
//     if (userRole !== 'owner') {
//       const today = new Date();
//       const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//       const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
//       if (day < startOfDay || day >= endOfDay) {
//         alert('Možete kreirati događaje samo za današnji dan.');
//         return;
//       }
//     }

//     const start = new Date(day);
//     start.setHours(hour, 0, 0, 0);
//     const end = new Date(start);
//     end.setHours(hour + 1, 0, 0, 0);

//     setSelectedEvent(null);
//     setFormData({
//       title: '',
//       description: '',
//       start: new Date(start),
//       end: new Date(end),
//       allDay: false
//     });
//     setShowModal(true);
//   };

//   const formatDateTimeLocal = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setFormData({
//       title: event.title,
//       description: event.description || '',
//       start: formatDateTimeLocal(event.start),
//       end: formatDateTimeLocal(event.end),
//       allDay: event.allDay
//     });
//     setShowModal(true);
//   };

//   const handleSaveEvent = async () => {
//     if (!formData.title.trim()) {
//       alert('Molimo unesite naslov događaja');
//       return;
//     }

//     setSaving(true);
//     try {
//       const token = localStorage.getItem("token");
      
//       if (selectedEvent) {
//         const response = await fetch(`https://notes.gorillapoker.bet/api/events/${selectedEvent.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify(formData),
//         });
        
//         if (response.ok) {
//           const updatedEvent = await response.json();
//           setEvents(events.map(event => 
//             event.id === updatedEvent.id 
//               ? { ...updatedEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) }
//               : event
//           ));
//           setShowModal(false);
//         }
//       } else {
//         const response = await fetch("https://notes.gorillapoker.bet/api/events", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify(formData),
//         });
        
//         if (response.ok) {
//           const newEvent = await response.json();
//           setEvents([...events, { 
//             ...newEvent, 
//             start: new Date(newEvent.start), 
//             end: new Date(newEvent.end) 
//           }]);
//           setShowModal(false);
//         }
//       }
//     } catch (error) {
//       console.error("Error saving event:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteEvent = async () => {
//     if (!selectedEvent) return;
    
//     if (!confirm('Da li ste sigurni da želite da obrišete ovaj događaj?')) {
//       return;
//     }

//     setSaving(true);
//     try {
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`https://notes.gorillapoker.bet/api/events/${selectedEvent.id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         setEvents(events.filter(event => event.id !== selectedEvent.id));
//         setShowModal(false);
//       }
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     window.location.href = '/login';
//   };

//   const navigateWeek = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() + (direction * 7));
//     setCurrentDate(newDate);
//   };

//   const navigateDay = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() + direction);
//     setCurrentDate(newDate);
//   };

//   const goToToday = () => {
//     setCurrentDate(new Date());
//   };

//   const weekDays = view === 'week' ? getWeekDays(currentDate) : [currentDate];
//   const hours = getDayHours();

//   return (
//     <div className="w-screen min-h-screen overflow-hidden bg-gray-50 text-gray-900 flex flex-col">
//       <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
//           <div className="hidden sm:flex items-center justify-between gap-3">
//             <div className="flex items-center gap-3 lg:gap-4 min-w-0">
//               <h1 className="text-lg lg:text-xl font-semibold tracking-tight whitespace-nowrap">Raspored</h1>
//             </div>
//             <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
//               <a href="/" className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap">
//                 Notes
//               </a>
//               <a href="/table" className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap">
//                 Tabela
//               </a>
//               <button onClick={handleLogout} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-900 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap">
//                 Logout
//               </button>
//             </div>
//           </div>

//           <div className="sm:hidden flex items-center justify-between">
//             <div className="flex items-center gap-2 min-w-0 flex-1">
//               <h1 className="text-base font-semibold tracking-tight">Raspored</h1>
//             </div>
//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
//               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//           </div>

//           {mobileMenuOpen && (
//             <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 space-y-2">
//               <a href="/" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center">
//                 Notes
//               </a>
//               <a href="/table" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center">
//                 Tabela
//               </a>
//               <button onClick={handleLogout} className="block w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 overflow-auto">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-gray-500">
//             <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mb-3" />
//             <p className="text-sm sm:text-base">Učitavanje rasporeda...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow p-3 sm:p-6 lg:p-8">
//             <div className="mb-4">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//                 <div className="flex items-center gap-2">
//                   <button onClick={goToToday} className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
//                     Danas
//                   </button>
//                   <button onClick={() => view === 'week' ? navigateWeek(-1) : navigateDay(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button onClick={() => view === 'week' ? navigateWeek(1) : navigateDay(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                   <h2 className="text-lg font-semibold ml-2">
//                     {view === 'week' 
//                       ? `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`
//                       : formatDate(currentDate)}
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex bg-gray-100 rounded-lg p-1">
//                     <button onClick={() => setView('day')} className={`px-3 py-1 text-sm font-medium rounded transition-colors ${view === 'day' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
//                       Dan
//                     </button>
//                     <button onClick={() => setView('week')} className={`px-3 py-1 text-sm font-medium rounded transition-colors ${view === 'week' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
//                       Nedelja
//                     </button>
//                   </div>
//                   <button onClick={() => {
//                     const now = new Date();
//                     setFormData({
//                       title: '',
//                       description: '',
//                       start: formatDateTimeLocal(now),
//                       end: formatDateTimeLocal(new Date(now.getTime() + 60 * 60 * 1000)),
//                       allDay: false
//                     });
//                     setSelectedEvent(null);
//                     setShowModal(true);
//                   }} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
//                     <Plus className="w-4 h-4" />
//                     Dodaj
//                   </button>
//                 </div>
//               </div>
              
//               {userRole !== 'owner' && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
//                   <p className="text-sm text-blue-700">
//                     <strong>Napomena:</strong> Kao obični korisnik, možete kreirati i upravljati događajima samo za današnji dan.
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="overflow-x-auto">
//               <div className="min-w-[600px]">
//                 <div className="grid grid-cols-[60px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-200">
//                   <div className="p-2"></div>
//                   {weekDays.map((day, idx) => (
//                     <div key={idx} className="p-2 text-center border-l border-gray-200">
//                       <div className="text-xs text-gray-500 uppercase">
//                         {day.toLocaleDateString('sr-RS', { weekday: 'short' })}
//                       </div>
//                       <div className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''}`}>
//                         {day.getDate()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="relative" style={{ height: '600px', overflowY: 'auto' }}>
//                   {hours.map((hour) => (
//                     <div key={hour} className="grid grid-cols-[60px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-100" style={{ height: '60px' }}>
//                       <div className="p-2 text-xs text-gray-500 text-right pr-2">
//                         {hour.toString().padStart(2, '0')}:00
//                       </div>
//                       {weekDays.map((day, dayIdx) => {
//                         const dayEvents = getEventsForDay(day).filter(event => {
//                           const eventHour = event.start.getHours();
//                           return eventHour === hour;
//                         });

//                         return (
//                           <div key={dayIdx} onClick={() => handleTimeSlotClick(day, hour)} className="border-l border-gray-200 hover:bg-blue-50 cursor-pointer relative transition-colors p-1">
//                             {dayEvents.map((event) => {
//                               const duration = (event.end - event.start) / (1000 * 60 * 60);
//                               const height = Math.min(duration * 60, 60);
                              
//                               return (
//                                 <div key={event.id} onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleEventClick(event);
//                                 }} className="absolute left-1 right-1 bg-blue-600 text-white rounded p-1 text-xs overflow-hidden hover:bg-blue-700 transition-colors cursor-pointer" style={{ height: `${height}px`, zIndex: 10 }}>
//                                   <div className="font-semibold truncate">{event.title}</div>
//                                   <div className="text-xs opacity-90">{formatTime(event.start)}</div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">
//                   {selectedEvent ? 'Izmeni događaj' : 'Novi događaj'}
//                 </h3>
//                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Naslov *</label>
//                   <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Unesite naslov događaja" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
//                   <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Unesite opis događaja" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Početak</label>
//                     <input type="datetime-local" value={formData.start} onChange={(e) => setFormData({...formData, start: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Kraj</label>
//                     <input type="datetime-local" value={formData.end} onChange={(e) => setFormData({...formData, end: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <input type="checkbox" id="allDay" checked={formData.allDay} onChange={(e) => setFormData({...formData, allDay: e.target.checked})} className="mr-2" />
//                   <label htmlFor="allDay" className="text-sm font-medium text-gray-700">Ceo dan</label>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 {selectedEvent && (
//                   <button onClick={handleDeleteEvent} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
//                     <Trash2 className="w-4 h-4" />
//                     Obriši
//                   </button>
//                 )}
//                 <button onClick={() => setShowModal(false)} disabled={saving} className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50">
//                   Otkaži
//                 </button>
//                 <button onClick={handleSaveEvent} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
//                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedEvent ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                   {saving ? 'Čuvanje...' : selectedEvent ? 'Sačuvaj izmene' : 'Kreiraj'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer className="py-4 sm:py-6 text-center text-xs text-gray-400">
//         © {new Date().getFullYear()} — Notes developed by David
//       </footer>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from 'react';
import { X, Edit2, Plus, Trash2, Loader2, ChevronLeft, ChevronRight, Menu, Calendar } from 'lucide-react';

export default function SmartCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    allDay: false
  });

  useEffect(() => {
    const role = localStorage.getItem('role') || 'user';
    setUserRole(role);
    
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://notes.gorillapoker.bet/api/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const transformedEvents = data.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('sr-RS', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  };

  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayHours = () => {
    const hours = [];
    for (let i = 6; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart.toDateString() === day.toDateString();
    }).sort((a, b) => a.start - b.start);
  };

  const handleTimeSlotClick = (day, hour) => {
    if (userRole !== 'owner') {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      if (day < startOfDay || day >= endOfDay) {
        alert('Možete kreirati događaje samo za današnji dan.');
        return;
      }
    }

    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);

    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start: formatDateTimeLocal(start),
      end: formatDateTimeLocal(end),
      allDay: false
    });
    setShowModal(true);
  };

  const formatDateTimeLocal = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start: formatDateTimeLocal(event.start),
      end: formatDateTimeLocal(event.end),
      allDay: event.allDay
    });
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    if (!formData.title.trim()) {
      alert('Molimo unesite naslov događaja');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        start: new Date(formData.start),
        end: new Date(formData.end),
        allDay: formData.allDay
      };
      
      if (selectedEvent) {
        const response = await fetch(`https://notes.gorillapoker.bet/api/events/${selectedEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(eventData),
        });
        
        if (response.ok) {
          const updatedEvent = await response.json();
          setEvents(events.map(event => 
            event.id === updatedEvent.id 
              ? { ...updatedEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) }
              : event
          ));
          setShowModal(false);
        }
      } else {
        const response = await fetch("https://notes.gorillapoker.bet/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(eventData),
        });
        
        if (response.ok) {
          const newEvent = await response.json();
          setEvents([...events, { 
            ...newEvent, 
            start: new Date(newEvent.start), 
            end: new Date(newEvent.end) 
          }]);
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert('Greška pri čuvanju događaja');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj događaj?')) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://notes.gorillapoker.bet/api/events/${selectedEvent.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert('Greška pri brisanju događaja');
    } finally {
      setSaving(false);
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = view === 'week' ? getWeekDays(currentDate) : [currentDate];
  const hours = getDayHours();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-sm md:text-base">Učitavanje kalendara...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600 hidden sm:block" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Raspored</h1>
            </div>

            <nav className="hidden md:flex items-center gap-3">
              <a href="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Notes
              </a>
              <a href="/table" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Tabela
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
              <a href="/" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Notes
              </a>
              <a href="/table" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Tabela
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/login';
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Calendar Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Danas
              </button>
              <button
                onClick={() => view === 'week' ? navigateWeek(-1) : navigateDay(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => view === 'week' ? navigateWeek(1) : navigateDay(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center sm:text-left">
              {view === 'week' 
                ? `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`
                : formatDate(currentDate)}
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors ${
                    view === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Dan
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors ${
                    view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Nedelja
                </button>
              </div>
              <button
                onClick={() => {
                  const now = new Date();
                  setFormData({
                    title: '',
                    description: '',
                    start: formatDateTimeLocal(now),
                    end: formatDateTimeLocal(new Date(now.getTime() + 60 * 60 * 1000)),
                    allDay: false
                  });
                  setSelectedEvent(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj</span>
              </button>
            </div>
          </div>

          {userRole !== 'owner' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Napomena:</strong> Kao obični korisnik, možete kreirati i upravljati događajima samo za današnji dan.
              </p>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                <div className="p-3 border-r border-gray-200"></div>
                {weekDays.map((day, idx) => (
                  <div key={idx} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      {day.toLocaleDateString('sr-RS', { weekday: 'short' })}
                    </div>
                    <div className={`text-xl font-bold ${
                      day.toDateString() === new Date().toDateString() 
                        ? 'text-blue-600' 
                        : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="grid border-b border-gray-100"
                    style={{ gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '60px' }}
                  >
                    <div className="p-2 text-xs font-medium text-gray-500 text-right pr-3 border-r border-gray-200">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const dayEvents = getEventsForDay(day).filter(event => {
                        const eventHour = event.start.getHours();
                        return eventHour === hour;
                      });

                      return (
                        <div
                          key={dayIdx}
                          onClick={() => handleTimeSlotClick(day, hour)}
                          className="border-r border-gray-200 last:border-r-0 hover:bg-blue-50 cursor-pointer relative transition-colors p-1"
                        >
                          {dayEvents.map((event) => {
                            const duration = (event.end - event.start) / (1000 * 60 * 60);
                            const height = Math.min(duration * 60, 58);
                            
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event);
                                }}
                                className="absolute left-1 right-1 bg-blue-600 text-white rounded-md p-2 text-xs overflow-hidden hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                                style={{ height: `${height}px`, zIndex: 10 }}
                              >
                                <div className="font-semibold truncate">{event.title}</div>
                                <div className="text-xs opacity-90">{formatTime(event.start)}</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {weekDays.map((day, dayIdx) => {
              const dayEvents = getEventsForDay(day);
              
              return (
                <div key={dayIdx} className="border-b border-gray-200 last:border-b-0">
                  <div className={`p-4 ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase">
                          {day.toLocaleDateString('sr-RS', { weekday: 'long' })}
                        </div>
                        <div className={`text-lg font-bold ${
                          day.toDateString() === new Date().toDateString() 
                            ? 'text-blue-600' 
                            : 'text-gray-900'
                        }`}>
                          {day.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long' })}
                        </div>
                      </div>
                      <button
                        onClick={() => handleTimeSlotClick(day, new Date().getHours())}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-gray-500 italic py-2">Nema događaja</p>
                    ) : (
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate text-sm">
                                  {event.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatTime(event.start)} - {formatTime(event.end)}
                                </p>
                                {event.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  {selectedEvent ? (
                    <>
                      <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Uredi Događaj
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Novi Događaj
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Unesite naslov događaja"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Unesite opis događaja"
                  rows="3"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Početak
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kraj
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={saving}
                />
                <label htmlFor="allDay" className="ml-2 text-sm font-medium text-gray-700">
                  Ceo dan
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleSaveEvent}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Čuvanje...
                    </>
                  ) : (
                    <>
                      {selectedEvent ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {selectedEvent ? 'Sačuvaj' : 'Kreiraj'}
                    </>
                  )}
                </button>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Brisanje...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Obriši
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} — Notes developed by David
        </p>
      </footer>
    </div>
  );
}