import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Smartphone, AlertTriangle, CheckCircle, Package, Clock, X, Bell, Camera, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { formatDistanceToNow, format } from 'date-fns';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDevices: 0,
        assignedDevices: 0,
        expiringWarranties: 0,
        totalEmployees: 0
    });
    const [verticalStats, setVerticalStats] = useState({});
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActivityDrawer, setShowActivityDrawer] = useState(false);
    const [myDevices, setMyDevices] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        if (user?.role === 'employee') {
            fetchMyDevices();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            if (res.data.success) {
                setStats(res.data.stats);
                setActivities(res.data.recentActivity);
                setVerticalStats(res.data.verticalStats || {});
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyDevices = async () => {
        try {
            const res = await api.get('/devices/my-devices');
            setMyDevices(res.data.assignments || []);
        } catch (err) {
            console.error('Failed to fetch my devices:', err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="relative">
            {/* Header Section with Toggle */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.username}</p>
                </div>
                <button
                    onClick={() => setShowActivityDrawer(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    <span className="hidden md:inline">Recent Activity</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            {user?.role !== 'employee' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 duration-200">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4 shadow-sm">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Devices</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalDevices}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 duration-200">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600 mr-4 shadow-sm">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Assigned</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.assignedDevices}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 duration-200">
                        <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600 mr-4 shadow-sm">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Expiring Warranties</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.expiringWarranties}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 duration-200">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mr-4 shadow-sm">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee View */}
            {user?.role === 'employee' && (
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Assigned Devices</h2>
                            <p className="text-gray-500 mt-1">Devices currently assigned to you</p>
                        </div>
                        <Link to="/my-devices" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            View All
                        </Link>
                    </div>

                    {myDevices.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Devices Assigned</h3>
                            <p className="text-gray-500">You don't have any devices assigned to you at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myDevices.slice(0, 3).map((assignment) => (
                                <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-blue-50">
                                        {assignment.device_photo_url ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${assignment.device_photo_url}`}
                                                alt={assignment.device.device_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Smartphone className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">{assignment.device.device_name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{assignment.device.asset_tag}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Calendar className="w-3 h-3" />
                                            <span>Assigned: {assignment.assignment_date ? format(new Date(assignment.assignment_date), 'MMM dd, yyyy') : '-'}</span>
                                        </div>
                                        {!assignment.device_photo_url && (
                                            <Link to="/my-devices" className="mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                Upload Photo
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Quick Actions (Admin Only) */}
            {user?.role === 'super_admin' && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link to="/employees/new" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                            <Users className="w-4 h-4 mr-2" />
                            Add Employee
                        </Link>
                        <Link to="/inventory/new" className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                            <Package className="w-4 h-4 mr-2" />
                            Add Device
                        </Link>
                    </div>
                </div>
            )}

            {/* Vertical Overview - Admin Only */}
            {user?.role !== 'employee' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Vertical Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(verticalStats).length > 0 ? (
                            Object.entries(verticalStats).map(([dept, data]) => (
                                <div key={dept} className="relative group">
                                    <Link to={`/admin/vertical/${encodeURIComponent(dept)}`} className="block">
                                        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-800 truncate" title={dept}>{dept}</h3>
                                                <button 
                                                    onClick={(e) => e.preventDefault()}
                                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                                    title="View detailed information"
                                                >
                                                    <Info className="w-4 h-4 text-blue-600" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Employees: <span className="font-medium text-gray-900">{data.employees}</span></span>
                                                <span>Devices: <span className="font-bold text-blue-600">{data.devices}</span></span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No data available.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Right Drawer - Recent Activity */}
            {showActivityDrawer && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
                        onClick={() => setShowActivityDrawer(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0">
                            <h3 className="font-bold text-lg text-gray-800">Recent Activity</h3>
                            <button onClick={() => setShowActivityDrawer(false)} className="p-1 hover:bg-gray-200 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {activities.length > 0 ? (
                                activities.map((log) => (
                                    <div key={log.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="bg-indigo-50 p-2 rounded-full mr-3 text-indigo-500 mt-1">
                                            <Clock className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 leading-snug">{log.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })} • {log.username}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center mt-10">No recent activity.</p>
                            )}
                            <div className="text-center pt-4">
                                <Link to="/admin/audit-logs" className="text-xs text-blue-600 hover:underline">View Full Log</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Dashboard;
