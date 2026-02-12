import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, User, Calendar, CreditCard, Tag, Settings, Cpu, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const DeviceDetails = () => {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevice();
    }, [id]);

    const fetchDevice = async () => {
        try {
            const res = await api.get(`/devices/${id}`);
            setDevice(res.data.device);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading device...</div>;
    if (!device) return <div className="text-center p-10 text-red-500">Device not found</div>;

    return (
        <div className="space-y-6">
            <button onClick={() => window.history.back()} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-3xl">
                    <Cpu className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">{device.device_name}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                        <div className="flex items-center"><Tag className="w-4 h-4 mr-2" /> {device.asset_tag}</div>
                        <div className="flex items-center"><Settings className="w-4 h-4 mr-2" /> {device.serial_number || 'No Serial'}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center ${device.device_status === 'available' ? 'bg-green-100 text-green-800' :
                                device.device_status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {device.device_status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to={`/inventory/${id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Device
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Device Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500">Category</span>
                                <span className="font-medium text-gray-900 capitalize">{device.device_category.replace('_', ' ')}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Brand</span>
                                <span className="font-medium text-gray-900">{device.brand || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Condition</span>
                                <span className="font-medium text-gray-900 capitalize">{device.device_condition}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Location</span>
                                <span className="font-medium text-gray-900 flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {device.location}
                                </span>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <span className="block text-gray-500">Specifications</span>
                                <p className="font-medium text-gray-900 whitespace-pre-wrap">{device.specifications || 'No specs listed.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Check In/Out History (Placeholder for now, or just show current assignment) */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Current Assignment</h2>
                        {device.employee ? (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                        {device.employee.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{device.employee.full_name}</div>
                                        <div className="text-xs text-gray-600">{device.employee.employee_id} • {device.employee.department}</div>
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="text-gray-500">Assigned on</div>
                                    <div className="font-medium">{device.assignment_date ? format(new Date(device.assignment_date), 'PPP') : '-'}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                                Currently not assigned to anyone.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Financials */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Purchase & Warranty</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Vendor</span>
                                <span className="font-medium text-gray-900">{device.vendor || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Purchase Date</span>
                                <span className="font-medium text-gray-900">{device.purchase_date ? format(new Date(device.purchase_date), 'PPP') : '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Warranty Expiry</span>
                                <span className="font-medium text-gray-900">{device.warranty_expiry_date ? format(new Date(device.warranty_expiry_date), 'PPP') : '-'}</span>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center">
                                <span className="text-gray-500 flex items-center gap-1"><CreditCard className="w-4 h-4" /> Cost</span>
                                <span className="font-bold text-gray-900">${device.purchase_cost || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetails;
