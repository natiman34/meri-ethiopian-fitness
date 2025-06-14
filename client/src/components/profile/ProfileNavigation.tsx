import React from 'react';
import { User, Edit2, Calendar, Dumbbell } from 'lucide-react';

export type ProfileSection = 'overview' | 'personal-info' | 'activity' | 'routines';

interface ProfileNavigationProps {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
  userRole?: string;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeSection,
  onSectionChange,
  userRole = 'user'
}) => {
  const navigationItems = [
    {
      id: 'overview' as ProfileSection,
      label: 'Overview',
      icon: User,
      description: 'Profile summary and progress'
    },
    {
      id: 'personal-info' as ProfileSection,
      label: 'Personal Info',
      icon: Edit2,
      description: 'Edit your personal information'
    },
    ...(userRole === 'user' ? [
      {
        id: 'activity' as ProfileSection,
        label: 'Activity',
        icon: Calendar,
        description: 'Track your daily activities'
      },
      {
        id: 'routines' as ProfileSection,
        label: 'Routines',
        icon: Dumbbell,
        description: 'Manage your fitness routines'
      }
    ] : [])
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-8">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Sections</h2>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeSection === item.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    activeSection === item.id
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Description */}
        <div className="mt-4 hidden md:block">
          <p className="text-sm text-gray-600">
            {navigationItems.find(item => item.id === activeSection)?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
