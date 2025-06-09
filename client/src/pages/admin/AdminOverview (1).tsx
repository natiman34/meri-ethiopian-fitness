import { Users, Dumbbell, Utensils, MessageSquare } from "lucide-react"

// Mock data for the dashboard



const AdminOverview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium">+12%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fitness Plans</p>
              <p className="text-2xl font-bold">64</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium">+8%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Utensils size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nutrition Plans</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium">+5%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Feedback</p>
              <p className="text-2xl font-bold">128</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium">+18%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Growth Overview</h2>
        <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Chart will appear here after installing recharts</p>
            <p className="text-sm text-gray-400">Run: npm install recharts</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">Abebe Kebede joined the platform</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">2 hours ago</div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Dumbbell size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">New fitness plan created</p>
                <p className="text-sm text-gray-500">30-Day Strength Training added</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">5 hours ago</div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <Utensils size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">New nutrition plan created</p>
                <p className="text-sm text-gray-500">Ethiopian Healthy Diet Plan added</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">Yesterday</div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium">New feedback received</p>
                <p className="text-sm text-gray-500">Sara Haile left a 5-star review</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
