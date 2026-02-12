import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Plus, Edit2, Trash2, Search, Laptop, Monitor, Smartphone, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchDevices();
    }, [categoryFilter]); // Refetch when filter changes

    const fetchDevices = async () => {
        try {
            let url = '/devices';
            if (categoryFilter) {
                url += `?category=${categoryFilter}`;
            }
            const res = await api.get(url);
            setDevices(res.data.devices);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to retire this device?')) return;
        try {
            await api.delete(`/devices/${id}`);
            fetchDevices();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredDevices = devices.filter(dev =>
        dev.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dev.serial_number && dev.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getIcon = (category) => {
        switch (category) {
            case 'laptop': return <Laptop className="w-5 h-5" />;
            case 'desktop': return <Monitor className="w-5 h-5" />;
            case 'mobile_phone': return <Smartphone className="w-5 h-5" />;
            default: return <HardDrive className="w-5 h-5" />;
        }
    };

    if (loading) return <div className="text-center p-10">Loading devices...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage IT assets and devices</p>
                </div>
                <Link to="/inventory/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Device
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search devices by name, tag, or serial..."
                        className="flex-1 outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 outline-none text-gray-700"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="laptop">Laptops</option>
                    <option value="desktop">Desktops</option>
                    <option value="monitor">Monitors</option>
                    <option value="mobile_phone">Mobile Phones</option>
                    <option value="tablet">Tablets</option>
                    <option value="accessory">Accessories</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDevices.map((dev) => (
                            <tr key={dev.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                                            {getIcon(dev.device_category)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{dev.device_name}</div>
                                            <div className="text-xs text-gray-500">Tag: {dev.asset_tag}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {dev.device_category.replace('_', ' ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dev.device_status === 'available' ? 'bg-green-100 text-green-800' :
                                            dev.device_status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                                dev.device_status === 'in_repair' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {dev.device_status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dev.employee ? (
                                        <Link to={`/employees/${dev.employee.id}`} className="text-blue-600 hover:underline">
                                            {dev.employee.full_name}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link to={`/inventory/${dev.id}`} className="text-gray-600 hover:text-gray-900 inline-block" title="View Details">
                                        <Laptop className="w-5 h-5" />
                                    </Link>
                                    <Link to={`/inventory/${dev.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-block" title="Edit">
                                        <Edit2 className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(dev.id)} className="text-red-600 hover:text-red-900" title="Retire">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeviceList;
