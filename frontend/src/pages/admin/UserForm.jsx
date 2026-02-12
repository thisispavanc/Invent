import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Check, Lock, User, Mail, Shield } from 'lucide-react';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'employee',
        password: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/users/${id}`)
                .then(res => {
                    const { username, email, role, is_active } = res.data.user;
                    setFormData({ username, email, role, is_active, password: '' });
                })
                .catch(err => setError('Failed to load user'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEdit) {
                // Update basic info
                await api.put(`/users/${id}`, formData);
                // Update password if provided
                if (formData.password) {
                    await api.put(`/users/${id}/password`, { password: formData.password });
                }
            } else {
                await api.post('/users', formData);
            }
            navigate('/admin/users');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Users
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                    {isEdit ? 'Edit User Account' : 'Create New User'}
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm p-2.5 border"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="jdoe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm p-2.5 border"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <select
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm p-2.5 border bg-white"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className={`md:col-span-2 ${isEdit ? 'bg-yellow-50 p-4 rounded-lg border border-yellow-100' : ''}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required={!isEdit}
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm p-2.5 border bg-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={isEdit ? "********" : "Enter secure password"}
                                />
                            </div>
                        </div>

                        {isEdit && (
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span className="text-gray-900 font-medium">Active Account</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center shadow-lg transform active:scale-95 transition-all font-medium"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            {isEdit ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
