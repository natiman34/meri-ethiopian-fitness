"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2, UserPlus, Filter, X } from "lucide-react";
import Button from "../../components/ui/Button";
import { supabase } from '../../lib/supabase';
import { Dialog } from '@headlessui/react';
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'user'
    });
    const [addFormErrors, setAddFormErrors] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormErrors, setEditFormErrors] = useState({});
    const [addSuccess, setAddSuccess] = useState(null);
    const [editSuccess, setEditSuccess] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching users...');
            // Fetch users from user_profiles table
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, full_name, email, role, created_at');
            console.log('Fetch result:', { data, error });
            if (error)
                throw error;
            console.log('Users fetched successfully:', data?.length || 0, 'users');
            setUsers(data || []);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase() || ''); // Include role in search
        const matchesRole = selectedRole === "all" || user.role === selectedRole;
        return matchesSearch && matchesRole; // && matchesStatus
    });
    const handleAddUser = async () => {
        const errors = {};
        if (!newUser.email.trim())
            errors.email = 'Email is required';
        if (!newUser.password.trim())
            errors.password = 'Password is required';
        if (newUser.password.trim().length < 6)
            errors.password = 'Password must be at least 6 characters';
        if (!newUser.full_name.trim())
            errors.full_name = 'Full Name is required';
        setAddFormErrors(errors);
        if (Object.keys(errors).length > 0)
            return;
        setIsLoading(true);
        setError(null);
        setAddSuccess(null);
        try {
            // Create user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newUser.email,
                password: newUser.password,
                options: {
                    data: {
                        full_name: newUser.full_name,
                        role: newUser.role
                    }
                }
            });
            if (authError)
                throw authError;
            if (authData.user) {
                // Insert user profile
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert([{
                        id: authData.user.id,
                        email: newUser.email,
                        full_name: newUser.full_name,
                        role: newUser.role
                    }]);
                if (profileError) {
                    console.warn('Profile insert error (may already exist):', profileError);
                }
            }
            console.log('User added successfully');
            setAddSuccess('User added successfully!');
            fetchUsers(); // Refetch users to update the list
            setIsAddModalOpen(false);
            setNewUser({ email: '', password: '', full_name: '', role: 'user' });
        }
        catch (error) {
            console.error('Error adding user:', error);
            setError(error instanceof Error ? error.message : 'Failed to add user. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleEditUser = async () => {
        if (!editingUser)
            return;
        const errors = {};
        if (!editingUser.full_name?.trim())
            errors.full_name = 'Full Name is required';
        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0)
            return;
        setIsLoading(true);
        setError(null);
        setEditSuccess(null);
        try {
            // Update user profile directly in Supabase
            const { error } = await supabase
                .from('user_profiles')
                .update({
                full_name: editingUser.full_name,
                role: editingUser.role
            })
                .eq('id', editingUser.id);
            if (error)
                throw error;
            console.log('User updated successfully');
            setEditSuccess('User updated successfully!');
            fetchUsers(); // Refetch users to update the list
            setIsEditModalOpen(false);
            setEditingUser(null);
        }
        catch (error) {
            console.error('Error updating user:', error);
            setError(error instanceof Error ? error.message : 'Failed to update user. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This will also delete their authentication account.")) {
            setIsLoading(true);
            setError(null);
            setDeleteSuccess(null);
            try {
                // First delete from user_profiles table
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .delete()
                    .eq('id', userId);
                if (profileError)
                    throw profileError;
                console.log('User deleted successfully');
                setDeleteSuccess('User deleted successfully!');
                // Update state after successful deletion
                setUsers(users.filter((user) => user.id !== userId));
            }
            catch (error) {
                console.error('Error deleting user:', error);
                setError(error instanceof Error ? error.message : 'Failed to delete user. Please try again.');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    const getRoleDisplay = (role) => {
        switch (role) {
            case "admin_super":
                return "Super Admin";
            case "admin_nutritionist":
                return "Nutritionist Admin";
            case "admin_fitness":
                return "Fitness Admin";
            default:
                return "User";
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md", children: error })), _jsxs(Dialog, { open: isAddModalOpen, onClose: () => setIsAddModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md rounded bg-white p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Add New User" }), _jsx("button", { onClick: () => setIsAddModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        handleAddUser();
                                    }, className: "mt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { type: "email", value: newUser.email, onChange: (e) => setNewUser({ ...newUser, email: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), addFormErrors.email && _jsx("p", { className: "mt-1 text-sm text-red-600", children: addFormErrors.email })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { type: "password", value: newUser.password, onChange: (e) => setNewUser({ ...newUser, password: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), addFormErrors.password && _jsx("p", { className: "mt-1 text-sm text-red-600", children: addFormErrors.password })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Full Name" }), _jsx("input", { type: "text", value: newUser.full_name, onChange: (e) => setNewUser({ ...newUser, full_name: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), addFormErrors.full_name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: addFormErrors.full_name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Role" }), _jsxs("select", { value: newUser.role, onChange: (e) => setNewUser({ ...newUser, role: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "admin_fitness", children: "Fitness Admin" }), _jsx("option", { value: "admin_nutritionist", children: "Nutritionist Admin" }), _jsx("option", { value: "admin_super", children: "Super Admin" })] })] }), _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full", children: isLoading ? 'Adding...' : 'Add User' }), addSuccess && _jsx("p", { className: "mt-2 text-sm text-green-600 text-center", children: addSuccess })] })] }) })] }), _jsxs(Dialog, { open: isEditModalOpen, onClose: () => setIsEditModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md rounded bg-white p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Edit User" }), _jsx("button", { onClick: () => setIsEditModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), editingUser && (_jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        handleEditUser();
                                    }, className: "mt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Full Name" }), _jsx("input", { type: "text", value: editingUser.full_name || '', onChange: (e) => setEditingUser({ ...editingUser, full_name: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), editFormErrors.full_name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: editFormErrors.full_name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { type: "email", value: editingUser.email || '', disabled // Email is usually not editable via this simple form
                                                    : true, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Role" }), _jsxs("select", { value: editingUser.role, onChange: (e) => setEditingUser({ ...editingUser, role: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "admin_fitness", children: "Fitness Admin" }), _jsx("option", { value: "admin_nutritionist", children: "Nutritionist Admin" }), _jsx("option", { value: "admin_super", children: "Super Admin" })] })] }), _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full", children: isLoading ? 'Saving...' : 'Save Changes' }), editSuccess && _jsx("p", { className: "mt-2 text-sm text-green-600 text-center", children: editSuccess })] }))] }) })] }), _jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: " " }), _jsx(Button, { onClick: () => {
                            setIsAddModalOpen(true);
                            setAddFormErrors({}); // Clear errors when opening modal
                            setAddSuccess(null);
                        }, leftIcon: _jsx(UserPlus, { size: 18 }), children: "Add New User" })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-6", children: [_jsxs("div", { className: "relative flex-grow", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Search users by name, email or role...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "relative", children: [_jsx(Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }), _jsxs("select", { value: selectedRole, onChange: (e) => setSelectedRole(e.target.value), className: "w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 appearance-none", children: [_jsx("option", { value: "all", children: "All Roles" }), _jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "admin_fitness", children: "Fitness Admin" }), _jsx("option", { value: "admin_nutritionist", children: "Nutritionist Admin" }), _jsx("option", { value: "admin_super", children: "Super Admin" })] }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700", children: _jsx("svg", { className: "fill-current h-4 w-4", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" }) }) })] })] }), isLoading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading users..." })) : filteredUsers.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No users found." })) : (_jsx("div", { className: "bg-white shadow overflow-hidden rounded-lg", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Full Name" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Email" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Role" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Created At" }), _jsx("th", { scope: "col", className: "relative px-6 py-3", children: _jsx("span", { className: "sr-only", children: "Actions" }) })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredUsers.map((user) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: user.full_name }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: user.email }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: getRoleDisplay(user.role) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(user.created_at).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                    setEditingUser(user);
                                                    setIsEditModalOpen(true);
                                                    setEditFormErrors({}); // Clear errors when opening modal
                                                    setEditSuccess(null);
                                                }, className: "text-blue-600 hover:text-blue-900 mr-2", leftIcon: _jsx(Edit, { size: 16 }), children: "Edit" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteUser(user.id), className: "text-red-600 hover:text-red-900", leftIcon: _jsx(Trash2, { size: 16 }), children: "Delete" })] })] }, user.id))) })] }) })), addSuccess && _jsx("p", { className: "mt-4 text-sm text-green-600 text-center", children: addSuccess }), editSuccess && _jsx("p", { className: "mt-4 text-sm text-green-600 text-center", children: editSuccess }), deleteSuccess && _jsx("p", { className: "mt-4 text-sm text-green-600 text-center", children: deleteSuccess })] }));
};
export default AdminUsers;
