import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Image as ImageIcon, Package, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const DevicePhotosGallery = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchAllDevicePhotos();
    }, []);

    const fetchAllDevicePhotos = async () => {
        try {
            const res = await api.get('/devices/all-with-photos');
            setAssignments(res.data.assignments || []);
        } catch (err) {
            console.error('Failed to fetch device photos:', err);
        } finally {
            setLoading(false);
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
            <button 
                onClick={() => navigate('/inventory')} 
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Inventory
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Photos Gallery</h1>
                <p className="text-gray-600">All device photos uploaded by employees for verification</p>
            </div>

            {assignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Photos Uploaded Yet</h2>
                    <p className="text-gray-500">Employees haven't uploaded any device photos yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Device Photo */}
                            <div 
                                className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                                onClick={() => setSelectedImage(assignment)}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${assignment.device_photo_url}`}
                                    alt={assignment.device?.device_name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                    Click to enlarge
                                </div>
                            </div>

                            {/* Device Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {assignment.device?.device_name}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Package className="w-4 h-4" />
                                        <span className="truncate">{assignment.device?.asset_tag}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Assigned: {assignment.assignment_date ? format(new Date(assignment.assignment_date), 'MMM dd, yyyy') : 'N/A'}</span>
                                    </div>
                                    {assignment.device?.purchase_cost && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-medium">₹{parseFloat(assignment.device.purchase_cost).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Employee:</p>
                                        <p className="font-medium text-gray-900 truncate">{assignment.employee?.full_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{selectedImage.device?.device_name}</h3>
                                <p className="text-sm text-gray-600">{selectedImage.device?.asset_tag}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${selectedImage.device_photo_url}`}
                                alt={selectedImage.device?.device_name}
                                className="w-full rounded-lg"
                            />
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Assigned To:</p>
                                    <p className="font-medium">{selectedImage.employee?.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Assignment Date:</p>
                                    <p className="font-medium">
                                        {selectedImage.assignment_date ? format(new Date(selectedImage.assignment_date), 'PPP') : 'N/A'}
                                    </p>
                                </div>
                                {selectedImage.device?.purchase_cost && (
                                    <div>
                                        <p className="text-gray-500">Device Cost:</p>
                                        <p className="font-medium text-green-600">${parseFloat(selectedImage.device.purchase_cost).toFixed(2)}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-gray-500">Category:</p>
                                    <p className="font-medium capitalize">{selectedImage.device?.device_category?.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicePhotosGallery;
