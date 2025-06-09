"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, UserPlus, Filter, X } from "lucide-react"
import Button from "../../components/ui/Button"
import { supabase } from '../../lib/supabase'
import { Dialog } from '@headlessui/react'
import { useAuth } from '../../contexts/AuthContext'

// Remove mock data
// const mockUsers = [ ... ]

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  // Assuming status is derived or added to profile table
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  // const [selectedStatus, setSelectedStatus] = useState("all") // Status from auth.users might not be directly in user_profiles
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user'
  })
  const [addFormErrors, setAddFormErrors] = useState<{[key: string]: string}>({})

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editFormErrors, setEditFormErrors] = useState<{[key: string]: string}>({})

  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const { session } = useAuth(); // Get the session from AuthContext

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch users from user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, created_at');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase() || '') // Include role in search
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    // Status is not directly in user_profiles, can't filter by it easily here without joining/RPC
    // const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole // && matchesStatus
  })

  const handleAddUser = async () => {
    const errors: {[key: string]: string} = {};
    if (!newUser.email.trim()) errors.email = 'Email is required';
    if (!newUser.password.trim()) errors.password = 'Password is required';
    if (newUser.password.trim().length < 6) errors.password = 'Password must be at least 6 characters';
    if (!newUser.full_name.trim()) errors.full_name = 'Full Name is required';
    setAddFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setError(null);
    setAddSuccess(null);
    try {
      // Make API call to Supabase Edge Function
      const response = await fetch('https://dhcgrpsgvaggrtfcykyf.supabase.co/functions/v1/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add user via API');
      }

      console.log('User added successfully:', result);
      setAddSuccess('User added successfully!');
      fetchUsers(); // Refetch users to update the list
      setIsAddModalOpen(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'user' });

    } catch (error: any) {
      console.error('Error adding user:', error);
      setError(error.message || 'Failed to add user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    const errors: {[key: string]: string} = {};
    if (!editingUser.full_name?.trim()) errors.full_name = 'Full Name is required';
    setEditFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setError(null);
    setEditSuccess(null);
    try {
      // Make API call to Supabase Edge Function
      const response = await fetch(`https://dhcgrpsgvaggrtfcykyf.supabase.co/functions/v1/edit-user/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ full_name: editingUser.full_name, role: editingUser.role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user via API');
      }

      console.log('User updated successfully:', result);
      setEditSuccess('User updated successfully!');
      fetchUsers(); // Refetch users to update the list
      setIsEditModalOpen(false);
      setEditingUser(null);

    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true);
      setError(null);
      setDeleteSuccess(null);
      try {
        // Make API call to Supabase Edge Function
        const response = await fetch(`https://dhcgrpsgvaggrtfcykyf.supabase.co/functions/v1/delete-user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete user via API');
        }

        console.log('User deleted successfully:', result);
        setDeleteSuccess('User deleted successfully!');
        // Update state after successful deletion
        setUsers(users.filter((user) => user.id !== userId));

      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError(error.message || 'Failed to delete user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin_super":
        return "Super Admin"
      case "admin_nutritionist":
        return "Nutritionist Admin"
      case "admin_fitness":
        return "Fitness Admin"
      default:
        return "User"
    }
  }

  return (
    <div className="space-y-6">
      {/* ... existing error/success messages for general operations ... */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Add New User Modal */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Add New User</Dialog.Title>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addFormErrors.email && <p className="mt-1 text-sm text-red-600">{addFormErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                 {addFormErrors.password && <p className="mt-1 text-sm text-red-600">{addFormErrors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addFormErrors.full_name && <p className="mt-1 text-sm text-red-600">{addFormErrors.full_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="user">User</option>
                  <option value="admin_fitness">Fitness Admin</option>
                  <option value="admin_nutritionist">Nutritionist Admin</option>
                  <option value="admin_super">Super Admin</option>
                </select>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Adding...' : 'Add User'}
              </Button>
              {addSuccess && <p className="mt-2 text-sm text-green-600 text-center">{addSuccess}</p>}
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Edit User</Dialog.Title>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {editingUser && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditUser();
              }} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.full_name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {editFormErrors.full_name && <p className="mt-1 text-sm text-red-600">{editFormErrors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    disabled // Email is usually not editable via this simple form
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="user">User</option>
                    <option value="admin_fitness">Fitness Admin</option>
                    <option value="admin_nutritionist">Nutritionist Admin</option>
                    <option value="admin_super">Super Admin</option>
                  </select>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                {editSuccess && <p className="mt-2 text-sm text-green-600 text-center">{editSuccess}</p>}
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <Button onClick={() => {
          setIsAddModalOpen(true);
          setAddFormErrors({}); // Clear errors when opening modal
          setAddSuccess(null);
        }} leftIcon={<UserPlus size={18} />}>Add New User</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin_fitness">Fitness Admin</option>
            <option value="admin_nutritionist">Nutritionist Admin</option>
            <option value="admin_super">Super Admin</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No users found.</div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleDisplay(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user);
                        setIsEditModalOpen(true);
                        setEditFormErrors({}); // Clear errors when opening modal
                        setEditSuccess(null);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      leftIcon={<Edit size={16} />} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                      leftIcon={<Trash2 size={16} />} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* General success/error messages for user operations */}
      {addSuccess && <p className="mt-4 text-sm text-green-600 text-center">{addSuccess}</p>}
      {editSuccess && <p className="mt-4 text-sm text-green-600 text-center">{editSuccess}</p>}
      {deleteSuccess && <p className="mt-4 text-sm text-green-600 text-center">{deleteSuccess}</p>}

    </div>
  )
}

export default AdminUsers
