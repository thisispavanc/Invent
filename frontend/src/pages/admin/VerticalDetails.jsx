import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Users, Smartphone, Package } from 'lucide-react';

const VerticalDetails = () => {
    const { verticalName } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ employees: [], devices: [] });

    useEffect(() => {
        const fetchVerticalDetails = async () => {
            try {
                // We need a new endpoint for this.
                // Or we can filter via existing endpoints, but a dedicated one is better.
                // Let's assume GET /dashboard/vertical/:verticalName
                const res = await api.get(`/dashboard/vertical/${encodeURIComponent(verticalName)}`);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch vertical details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVerticalDetails();
    }, [verticalName]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{decodeURIComponent(verticalName)} Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employees Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{data.employees.length} Members</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.employees.length > 0 ? (
                            data.employees.map((emp) => (
                                <div key={emp.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <p className="font-medium text-gray-900">{emp.full_name}</p>
                                    <p className="text-sm text-gray-500">{emp.designation || 'No Designation'} • {emp.email}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">No employees in this vertical.</div>
                        )}
                    </div>
                </div>

                {/* Devices Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Assigned Devices</h2>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{data.devices.length} Devices</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.devices.length > 0 ? (
                            data.devices.map((dev) => (
                                <div key={dev.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{dev.device_name}</p>
                                            <p className="text-sm text-gray-500">{dev.device_category} • {dev.asset_tag}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Assigned to</p>
                                            <p className="text-sm font-medium text-gray-700">{dev.employee?.full_name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">No devices assigned to this vertical.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerticalDetails;
