import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFileText, FiClock, FiCalendar, FiCheckSquare, FiUsers, FiX } from 'react-icons/fi';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const quickLinks = [
    { title: 'Submit Daily Report', path: '/dashboard/reports/submit', icon: FiFileText, category: 'Reports' },
    { title: 'My Daily Reports', path: '/dashboard/reports', icon: FiFileText, category: 'Reports' },
    { title: 'Attendance Check-in / Out', path: '/dashboard/attendance', icon: FiClock, category: 'Attendance' },
    { title: 'Apply for Leave', path: '/dashboard/leaves', icon: FiCalendar, category: 'Leaves' },
    { title: 'Assigned Tasks', path: '/dashboard/tasks', icon: FiCheckSquare, category: 'Tasks' },
    { title: 'Employee Directory', path: '/dashboard/employees', icon: FiUsers, category: 'Admin' },
  ];

  const filteredLinks = quickLinks.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open:globalsearch'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-gray-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
          <FiSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions, or modules... (Esc to close)"
            className="w-full text-sm bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto">
          {filteredLinks.length > 0 ? (
            <div className="space-y-1">
              {filteredLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(link.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600">
                      <link.icon className="text-base" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-900">
                      {link.title}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600">
                    {link.category}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center">No matching navigation shortcuts found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
