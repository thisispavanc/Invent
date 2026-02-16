import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Laptop, Package, Calendar, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import { format } from 'date-fns';

const MyDevices = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        fetchMyDevices();
    }, []);

    const fetchMyDevices = async () => {
        try {
            const res = await api.get('/devices/my-devices');
            setAssignments(res.data.assignments);
        } catch (err) {
            console.error('Failed to fetch devices:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (assignmentId, file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        setUploadingId(assignmentId);
        setUploadError(null);
        setUploadSuccess(null);

        const formData = new FormData();
        formData.append('photo', file);

        try {
            await api.post(`/devices/assignment/${assignmentId}/upload-photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadSuccess(assignmentId);
            fetchMyDevices(); // Refresh to show new photo
            setTimeout(() => setUploadSuccess(null), 3000);
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError(err.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploadingId(null);
        }
    };

    const getDeviceIcon = (category) => {
        switch (category) {
            case 'laptop':
            case 'desktop':
                return <Laptop className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assigned Devices</h1>
                <p className="text-gray-600">View and manage devices assigned to you</p>
            </div>

            {uploadError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{uploadError}</p>
                    <button onClick={() => setUploadError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            {assignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Devices Assigned</h2>
                    <p className="text-gray-500">You don't have any devices assigned to you at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Device Photo */}
                            <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-blue-50">
                                {assignment.device_photo_url ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${assignment.device_photo_url}`}
                                        alt={assignment.device.device_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            {getDeviceIcon(assignment.device.device_category)}
                                            <p className="text-sm text-gray-500 mt-2">No photo uploaded</p>
                                        </div>
                                    </div>
                                )}
                                {uploadSuccess === assignment.id && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Uploaded
                                    </div>
                                )}
                            </div>

                            {/* Device Details */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{assignment.device.device_name}</h3>
                                    <p className="text-sm text-gray-500">{assignment.device.asset_tag}</p>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium text-gray-900 capitalize">{assignment.device.device_category.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Assigned:</span>
                                        <span className="font-medium text-gray-900">
                                            {assignment.assignment_date ? format(new Date(assignment.assignment_date), 'MMM dd, yyyy') : '-'}
                                        </span>
                                    </div>
                                    {assignment.device.serial_number && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-600">Serial:</span>
                                            <span className="font-medium text-gray-900">{assignment.device.serial_number}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Photo Button */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <label className="block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(assignment.id, e.target.files[0])}
                                            disabled={uploadingId === assignment.id}
                                            className="hidden"
                                        />
                                        <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                                            uploadingId === assignment.id
                                                ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                                : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
                                        }`}>
                                            {uploadingId === assignment.id ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                                    <span className="text-sm font-medium text-gray-600">Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    {assignment.device_photo_url ? <Camera className="w-4 h-4 text-indigo-600" /> : <Upload className="w-4 h-4 text-indigo-600" />}
                                                    <span className="text-sm font-medium text-indigo-600">
                                                        {assignment.device_photo_url ? 'Update Photo' : 'Upload Photo'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    {assignment.device_photo_url && (
                                        <p className="text-xs text-gray-500 text-center mt-2">Photo already uploaded. You can update it.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDevices;
