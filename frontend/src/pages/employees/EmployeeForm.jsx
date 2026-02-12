import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Save } from 'lucide-react';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        phone_number: '',
        date_of_joining: '',
        department: '',
        designation: '',
        employment_status: 'active',
        address_street: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'India'
    });

    useEffect(() => {
        if (isEdit) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await api.get(`/employees/${id}`);
            const emp = res.data.employee;
            // Format date for input
            if (emp.date_of_joining) {
                emp.date_of_joining = emp.date_of_joining.split('T')[0];
            }
            setFormData(emp);
        } catch (err) {
            console.error('Failed to fetch employee');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/employees/${id}`, formData);
            } else {
                await api.post('/employees', formData);
            }
            navigate('/employees');
        } catch (err) {
            console.error('Failed to save employee', err);
            alert(err.response?.data?.message || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate('/employees')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Employees
            </button>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                                <input required type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="EMP001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Job Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining *</label>
                                <input required type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department / Vertical</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                >
                                    <option value="">Select Vertical</option>
                                    <option value="Core Team">Core Team</option>
                                    <option value="Oral Cancer Screening Team">Oral Cancer Screening Team</option>
                                    <option value="Breast Cancer Detection Team">Breast Cancer Detection Team</option>
                                    <option value="Diabetes Management Team">Diabetes Management Team</option>
                                    <option value="Retinal Disease Detection Team">Retinal Disease Detection Team</option>
                                    <option value="Mental Health Team">Mental Health Team</option>
                                    <option value="HR & Admin">HR & Admin</option>
                                    <option value="IT & Support">IT & Support</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Software Engineer..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="employment_status" value={formData.employment_status} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </div>
                        </div>

                        {/* Address - Full Width */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="address_street" value={formData.address_street} onChange={handleChange} placeholder="Street Address" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input type="text" name="address_city" value={formData.address_city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input type="text" name="address_state" value={formData.address_state} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input type="text" name="address_zip" value={formData.address_zip} onChange={handleChange} placeholder="ZIP Code" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button type="button" onClick={() => navigate('/employees')} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 mr-4 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors disabled:opacity-50">
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Saving...' : 'Save Employee'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EmployeeForm;
