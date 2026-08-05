import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiUser, FiMail, FiHash, FiBriefcase, FiPhone, FiCheckCircle } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'User Profile' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card Sidebar */}
        <Card className="text-center p-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{user?.designation || 'Staff Member'}</p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {user?.role}
            </span>
          </div>
        </Card>

        {/* Profile Info Details */}
        <div className="lg:col-span-2">
          <Card title="Account Details" subtitle="Your personal and employment details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiUser className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Full Name</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiMail className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Email Address</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiHash className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Employee ID</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.employeeId}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiBriefcase className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Department</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.department || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiPhone className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Phone Number</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <FiCheckCircle className="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Account Status</p>
                  <p className="text-sm font-bold text-green-600 mt-0.5">{user?.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
