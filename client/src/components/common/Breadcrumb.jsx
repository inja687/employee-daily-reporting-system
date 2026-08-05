import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Link to="/dashboard" className="flex items-center hover:text-blue-600 transition-colors">
        <FiHome className="text-base mr-1.5" />
        <span>Dashboard</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <FiChevronRight className="mx-2 text-gray-400 text-xs" />
          {item.path ? (
            <Link to={item.path} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
