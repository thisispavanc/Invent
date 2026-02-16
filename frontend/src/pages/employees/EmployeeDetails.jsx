import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Laptop, Image as ImageIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeDetails = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await api.get(`/employees/${id}`);
            setEmployee(res.data.employee);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading profile...</div>;
    if (!employee) return <div className="text-center p-10 text-red-500">Employee not found</div>;
    // Calculate total cost of assigned devices
    const totalDeviceCost = employee.devices?.reduce((sum, dev) => {
        const cost = parseFloat(dev.purchase_cost) || 0;
        return sum + cost;
    }, 0) || 0;
    return (
        <div className="space-y-6">
            <button onClick={() => window.history.back()} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">
                    {employee.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">{employee.full_name}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                        <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {employee.designation || 'No Designation'}</div>
                        <div className="flex items-center"><User className="w-4 h-4 mr-2" /> {employee.department || 'No Dept'}</div>
                        <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {employee.email}</div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to={`/employees/${id}/edit`} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500">Employee ID</span>
                                <span className="font-medium text-gray-900">{employee.employee_id}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Employment Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${employee.employment_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {employee.employment_status?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Phone</span>
                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                    {employee.phone_number || '-'}
                                </div>
                            </div>
                            <div>
                                <span className="block text-gray-500">Date of Joining</span>
                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {employee.date_of_joining ? format(new Date(employee.date_of_joining), 'PPP') : '-'}
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <span className="block text-gray-500">Address</span>
                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {employee.address_street}, {employee.address_city}, {employee.address_state}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Devices */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Assigned Assets</h2>
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">
                                    Total: ₹{totalDeviceCost.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {employee.devices && employee.devices.length > 0 ? (
                            <div className="space-y-3">
                                {employee.devices.map(dev => {
                                    // Find the active assignment for this device
                                    const activeAssignment = employee.assignmentHistory?.find(
                                        a => a.device_id === dev.id && a.assignment_status === 'active'
                                    );
                                    const deviceCost = parseFloat(dev.purchase_cost) || 0;
                                    
                                    return (
                                        <div key={dev.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="p-2 bg-white rounded-md border border-gray-200">
                                                        <Laptop className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{dev.device_name}</div>
                                                        <div className="text-xs text-gray-500">{dev.asset_tag} • {dev.device_category}</div>
                                                        {deviceCost > 0 && (
                                                            <div className="text-xs font-medium text-green-600 mt-1">
                                                                Cost: ₹{deviceCost.toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link to={`/inventory/${dev.id}`} className="text-blue-600 text-sm hover:underline">View</Link>
                                            </div>
                                            
                                            {/* Show uploaded photo if exists */}
                                            {activeAssignment?.device_photo_url && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                        <ImageIcon className="w-3 h-3" />
                                                        <span>Device Photo (Employee Verified)</span>
                                                    </div>
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${activeAssignment.device_photo_url}`}
                                                        alt="Device"
                                                        className="w-full max-w-xs rounded-md border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                No assets currently assigned.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Timeline/Activity (Placeholder for now) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                                Generate Handover Form
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                                View Audit History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
