import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { Link, Button } from '@/components/ui/button'
import { ChevronDown, Users, MessageSquare, Dumbbell, UtensilsCrossed, Settings, LogOut, UserCircle } from 'lucide-react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../components/AdminDashboard'
import AdminUsers from '../components/AdminUsers'
import AdminFeedback from '../components/AdminFeedback'
import AdminSettings from '../components/AdminSettings'
import AdminFitnessPlans from '../components/AdminFitnessPlans'

const AdminRoutes = () => {
  const router = useRouter()
  const { user, session, isLoading, role } = useAuth()

  const superAdminNavItems = [
    {
      href: "/admin/users",
      icon: <Users size={20} />,
      label: "Users Management",
    },
    {
      href: "/admin/feedback",
      icon: <MessageSquare size={20} />,
      label: "User Feedback",
    },
    {
      href: "/admin/fitness-plans",
      icon: <Dumbbell size={20} />,
      label: "Fitness Plans",
    },
    {
      href: "/admin/nutrition-plans",
      icon: <UtensilsCrossed size={20} />,
      label: "Nutrition Plans",
    },
    {
      href: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ]

  const adminFitnessNavItems = [
    {
      href: "/admin/users",
      icon: <Users size={20} />,
      label: "Users Management",
    },
    {
      href: "/admin/fitness-plans",
      icon: <Dumbbell size={20} />,
      label: "Fitness Plans",
    },
    {
      href: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ]

  const adminNutritionNavItems = [
    {
      href: "/admin/users",
      icon: <Users size={20} />,
      label: "Users Management",
    },
    {
      href: "/admin/nutrition-plans",
      icon: <UtensilsCrossed size={20} />,
      label: "Nutrition Plans",
    },
    {
      href: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ]

  const currentNavItems = useMemo(() => {
    if (role === "admin_super") {
      return superAdminNavItems;
    } else if (role === "admin_fitness") {
      return adminFitnessNavItems;
    } else if (role === "admin_nutritionist") {
      return adminNutritionNavItems;
    }
    return [];
  }, [role]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || !user || !role || !currentNavItems.length) {
    router.push("/auth/login");
    return null;
  }

  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-green-400 border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {currentNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-3 rounded-md transition-colors
                ${router.pathname === item.href ? "bg-green-600" : "hover:bg-gray-700"}
              `}
            >
              {item.icon}
              <span className="ml-3 text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/logout"
            className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="text-lg">Logout</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, {user.name}!
          </h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {role.replace("admin_", "").replace(/\b\w/g, (char) => char.toUpperCase())} Admin
            </span>
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => {}}
              >
                <UserCircle size={24} className="text-gray-600" />
                <span className="text-gray-800">{user.name}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
      <Route path="/admin/feedback" element={<AdminLayout><AdminFeedback /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
      <Route path="/admin/fitness-plans" element={<AdminLayout><AdminFitnessPlans /></AdminLayout>} />
    </Routes>
  )
}

export default AdminRoutes 