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
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import srLocale from '@fullcalendar/core/locales/sr';
import { LogOut, X, Edit2, Plus, Trash2, Loader2 } from 'lucide-react';

export default function SmartCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userRole, setUserRole] = useState('');
  const calendarRef = useRef(null);
  
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
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay || false,
            description: event.description || '',
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
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

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (userRole !== 'owner') {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const selectedDate = new Date(selectInfo.start);
      
      if (selectedDate < startOfDay || selectedDate >= endOfDay) {
        alert('Možete kreirati događaje samo za današnji dan.');
        return;
      }
    }

    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start: new Date(selectInfo.start),
      end: new Date(selectInfo.end),
      allDay: selectInfo.allDay
    });
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      description: event.extendedProps.description || ''
    });
    setFormData({
      title: event.title,
      description: event.extendedProps.description || '',
      start: event.start,
      end: event.end,
      allDay: event.allDay
    });
    setShowModal(true);
  };

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
        start: typeof formData.start === 'string' ? new Date(formData.start) : formData.start,
        end: typeof formData.end === 'string' ? new Date(formData.end) : formData.end,
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
              ? {
                  id: updatedEvent.id,
                  title: updatedEvent.title,
                  start: updatedEvent.start,
                  end: updatedEvent.end,
                  allDay: updatedEvent.allDay,
                  description: updatedEvent.description || '',
                  backgroundColor: '#3b82f6',
                  borderColor: '#2563eb'
                }
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
            id: newEvent.id,
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
            allDay: newEvent.allDay,
            description: newEvent.description || '',
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Učitavanje kalendara...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">Raspored</h1>
            {saving && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Čuvanje...</span>
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

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale={srLocale}
            buttonText={{
              today: 'Danas',
              month: 'Mesec',
              week: 'Nedelja',
              day: 'Dan'
            }}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            height="auto"
            events={events}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            allDaySlot={true}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </div>

        {/* Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {selectedEvent ? <Edit2 className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
                  {selectedEvent ? 'Uredi Događaj' : 'Novi Događaj'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={saving}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Naslov *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unesite opis događaja"
                    rows="3"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Početak
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateTimeLocal(formData.start)}
                    onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kraj
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateTimeLocal(formData.end)}
                    onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={saving}
                  />
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
                  <label htmlFor="allDay" className="ml-2 text-sm text-gray-700">
                    Ceo dan
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveEvent}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Čuvanje...' : (selectedEvent ? 'Sačuvaj' : 'Kreiraj')}
                  </button>
                  {selectedEvent && (
                    <button
                      onClick={handleDeleteEvent}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {saving ? 'Brisanje...' : 'Obriši'}
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        .fc-event {
          cursor: pointer;
        }
        .fc-event:hover {
          opacity: 0.9;
        }
        .fc-button {
          text-transform: none !important;
        }
      `}</style>
    </div>
  );
}