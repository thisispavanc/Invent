import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Save } from 'lucide-react';

const DeviceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        asset_tag: '',
        device_name: '',
        device_category: 'laptop',
        serial_number: '',
        brand: '',
        specifications: '',
        purchase_cost: '',
        purchase_date: '',
        warranty_expiry_date: '',
        vendor: '',
        device_status: 'available',
        device_condition: 'new',
        location: 'Office',
        currently_assigned_to: '', // This will be employee ID
        assignment_date: '',
        assignment_notes: ''
    });

    useEffect(() => {
        fetchEmployees();
        if (isEdit) {
            fetchDevice();
        }
    }, [id]);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees?status=active');
            setEmployees(res.data.employees);
        } catch (err) {
            console.error('Failed to fetch employees');
        }
    };

    const fetchDevice = async () => {
        try {
            const res = await api.get(`/devices/${id}`);
            const dev = res.data.device;
            // Format dates
            ['purchase_date', 'warranty_expiry_date', 'assignment_date'].forEach(field => {
                if (dev[field]) dev[field] = dev[field].split('T')[0];
            });
            // Handle null assignment
            if (!dev.currently_assigned_to) dev.currently_assigned_to = '';

            setFormData(dev);
        } catch (err) {
            console.error('Failed to fetch device');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Logic to autoset status if assigned
        let submitData = { ...formData };
        if (submitData.currently_assigned_to && submitData.device_status === 'available') {
            submitData.device_status = 'assigned';
            if (!submitData.assignment_date) {
                submitData.assignment_date = new Date().toISOString().split('T')[0];
            }
        } else if (!submitData.currently_assigned_to && submitData.device_status === 'assigned') {
            submitData.device_status = 'available';
            submitData.assignment_date = null;
            submitData.assignment_notes = null;
        }

        // If selecting empty string for assignment, send null
        if (submitData.currently_assigned_to === '') {
            submitData.currently_assigned_to = null;
        }

        // Sanitize optional fields (convert empty strings to null)
        const optionalFields = ['serial_number', 'brand', 'specifications', 'vendor', 'purchase_cost', 'purchase_date', 'warranty_expiry_date', 'assignment_date', 'assignment_notes'];
        optionalFields.forEach(field => {
            if (submitData[field] === '') {
                submitData[field] = null;
            }
        });

        try {
            if (isEdit) {
                await api.put(`/devices/${id}`, submitData);
            } else {
                await api.post('/devices', submitData);
            }
            navigate('/inventory');
        } catch (err) {
            console.error('Failed to save device', err);
            alert(err.response?.data?.message || 'Failed to save device');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate('/inventory')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Inventory
            </button>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Device' : 'Add New Device'}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Device Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                                <input required type="text" name="asset_tag" value={formData.asset_tag} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="TAG-001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name *</label>
                                <input required type="text" name="device_name" value={formData.device_name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Latitude 5420" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select required name="device_category" value={formData.device_category} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="laptop">Laptop</option>
                                    <option value="desktop">Desktop</option>
                                    <option value="workstation">Workstation</option>
                                    <option value="gpu">GPU</option>
                                    <option value="assembled_system">Assembled System</option>
                                    <option value="monitor">Monitor</option>
                                    <option value="mobile_phone">Mobile Phone</option>
                                    <option value="tablet">Tablet</option>
                                    <option value="accessory">Accessory</option>
                                    <option value="software_license">Software License</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {formData.device_category === 'other' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specify Device Type</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Projector, Printer..."
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
                                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value + (formData.specifications ? ` - ${formData.specifications}` : '') })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This will be saved in specifications.</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dell, Apple, HP..." />
                            </div>
                        </div>

                        {/* Status & Assignment */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Status & Assignment</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="device_status" value={formData.device_status} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="available">Available</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_repair">In Repair</option>
                                    <option value="retired">Retired</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                <select name="device_condition" value={formData.device_condition} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="new">New</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Employee</label>
                                <select name="currently_assigned_to" value={formData.currently_assigned_to || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2">
                                    <option value="">-- Unassigned --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                                    ))}
                                </select>
                                {formData.currently_assigned_to && (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Assignment Date</label>
                                        <input type="date" name="assignment_date" value={formData.assignment_date} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Financials - Full Width */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Purchase Details (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost (₹)</label>
                                    <input 
                                        type="number" 
                                        name="purchase_cost" 
                                        value={formData.purchase_cost} 
                                        onChange={handleChange} 
                                        placeholder="Enter device cost"
                                        step="0.01"
                                        min="0"
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                                    <input type="text" name="vendor" value={formData.vendor} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                                    <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
                                    <input type="date" name="warranty_expiry_date" value={formData.warranty_expiry_date} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button type="button" onClick={() => navigate('/inventory')} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 mr-4 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors disabled:opacity-50">
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Saving...' : 'Save Device'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeviceForm;
