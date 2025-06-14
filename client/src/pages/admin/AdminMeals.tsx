import React from 'react';
import MealManager from '../../components/admin/MealManager';

const AdminMeals: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meal Management</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage individual meals that can be used across nutrition plans.
          </p>
        </div>
      </div>

      <MealManager />
    </div>
  );
};

export default AdminMeals;
