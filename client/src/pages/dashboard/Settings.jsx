import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/ui/Button';

const Settings = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Settings' }]} />

      <Card title="Application Preferences" subtitle="Manage your portal settings and notification preferences">
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
              <p className="text-xs text-gray-500">Receive email alerts for task assignments & leave updates</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded-xs border-gray-300" />
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Daily Report Reminders</h4>
              <p className="text-xs text-gray-500">Receive a reminder at 05:00 PM to submit your daily report</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded-xs border-gray-300" />
          </div>

          <div className="pt-2">
            <Button variant="primary">Save Preferences</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
