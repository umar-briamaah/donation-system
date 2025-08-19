'use client';

import { useState, useEffect, useRef } from 'react';
import dynamicImport from 'next/dynamic'; // Renamed import to avoid conflicts

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../../components/layout/Footer'), {
  ssr: false
});

const AdminProtected = dynamicImport(() => import('../../components/auth/AdminProtected'), {
  ssr: false
});

import { Plus, Edit, Trash2, Heart, DollarSign, Users, MapPin, Upload, X, Image as ImageIcon } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

interface Cause {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  imageUrl?: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: number;
}

export default function AdminCausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    category: '',
    location: '',
    status: 'ACTIVE',
    imageUrl: '',
  });

  useEffect(() => {
    // Mock causes data - in real app, fetch from API
    const mockCauses: Cause[] = [
      {
        id: '1',
        title: 'Clean Water for Rural Communities in Northern Ghana',
        description: 'Help provide clean drinking water to rural communities in Northern Ghana through the construction of water wells and purification systems.',
        targetAmount: 50000,
        raisedAmount: 32000,
        category: 'Health & Sanitation',
        location: 'Northern Ghana',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        createdAt: '2024-08-01T00:00:00Z',
        updatedAt: '2024-08-15T00:00:00Z',
      },
      {
        id: '2',
        title: 'Education for Underprivileged Children in Accra',
        description: 'Support education initiatives for children from low-income families in Accra, including school supplies, uniforms, and tuition assistance.',
        targetAmount: 30000,
        raisedAmount: 18500,
        category: 'Education',
        location: 'Accra',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        createdAt: '2024-08-05T00:00:00Z',
        updatedAt: '2024-08-15T00:00:00Z',
      },
      {
        id: '3',
        title: 'Healthcare Access for Rural Villages',
        description: 'Establish mobile health clinics and provide medical supplies to underserved rural communities across Ghana.',
        targetAmount: 75000,
        raisedAmount: 42000,
        category: 'Healthcare',
        location: 'Rural Ghana',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        createdAt: '2024-08-10T00:00:00Z',
        updatedAt: '2024-08-15T00:00:00Z',
      },
    ];

    setCauses(mockCauses);
    setLoading(false);
  }, []);

  const handleCreateCause = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: 0,
      category: '',
      location: '',
      status: 'ACTIVE',
      imageUrl: '',
    });
    setSelectedImage(null);
    setShowCreateModal(true);
  };

  const handleEditCause = (cause: Cause) => {
    setSelectedCause(cause);
    setFormData({
      title: cause.title,
      description: cause.description,
      targetAmount: cause.targetAmount,
      category: cause.category,
      location: cause.location,
      status: cause.status,
      imageUrl: cause.imageUrl || '',
    });
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const imageFile: ImageFile = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    };

    setSelectedImage(imageFile);
  };

  const removeSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateImageUpload = async (): Promise<string> => {
    return new Promise((resolve) => {
      setUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadProgress(0);
            // Simulate successful upload - in real app, this would be an API call
            resolve('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop');
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = formData.imageUrl;
    
    // If there's a selected image, upload it first
    if (selectedImage) {
      try {
        finalImageUrl = await simulateImageUpload();
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }
    
    // In real app, send to API
    if (showCreateModal) {
      const newCause: Cause = {
        id: Date.now().toString(),
        ...formData,
        imageUrl: finalImageUrl,
        raisedAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCauses(prev => [...prev, newCause]);
      setShowCreateModal(false);
      setSelectedImage(null);
    } else if (showEditModal && selectedCause) {
      const updatedCauses = causes.map(cause =>
        cause.id === selectedCause.id
          ? { ...cause, ...formData, imageUrl: finalImageUrl, updatedAt: new Date().toISOString() }
          : cause
      );
      setCauses(updatedCauses);
      setShowEditModal(false);
      setSelectedCause(null);
      setSelectedImage(null);
    }
  };

  const handleDeleteCause = (causeId: string) => {
    if (confirm('Are you sure you want to delete this cause?')) {
      setCauses(prev => prev.filter(cause => cause.id !== causeId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'PAUSED':
        return 'text-yellow-600 bg-yellow-100';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Causes Management</h1>
            <p className="text-gray-600">Create and manage fundraising causes</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/causes/new'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Cause</span>
          </button>
        </div>

        {/* Causes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cause
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {causes.map((cause) => (
                  <tr key={cause.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {cause.imageUrl ? (
                            <img 
                              src={cause.imageUrl} 
                              alt={cause.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                              <Heart className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{cause.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {cause.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {cause.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>₵{cause.raisedAmount.toLocaleString()}</span>
                          <span>₵{cause.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(cause.raisedAmount, cause.targetAmount)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getProgressPercentage(cause.raisedAmount, cause.targetAmount).toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cause.status)}`}>
                        {cause.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCause(cause)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCause(cause.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Cause Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Cause</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (GHS)</label>
                  <input
                    type="number"
                    value={formData.targetAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Health & Sanitation">Health & Sanitation</option>
                    <option value="Economic Development">Economic Development</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Enhanced Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cause Image (Optional)</label>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-3">
                    {/* File Input */}
                    <div className="flex items-center space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors duration-200"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Choose Image</span>
                      </button>
                      
                      {/* URL Input as Alternative */}
                      <div className="flex-1">
                        <input
                          type="url"
                          placeholder="Or enter image URL"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Selected Image Preview */}
                    {selectedImage && (
                      <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">{selectedImage.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(selectedImage.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <img 
                          src={selectedImage.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Help Text */}
                    <p className="text-xs text-gray-500">
                      Supported formats: JPEG, PNG, GIF. Max size: 5MB. 
                      You can also provide an image URL instead.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedImage(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>Create Cause</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cause Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Cause</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (GHS)</label>
                  <input
                    type="number"
                    value={formData.targetAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Health & Sanitation">Health & Sanitation</option>
                    <option value="Economic Development">Economic Development</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                
                {/* Enhanced Image Upload Section for Edit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cause Image</label>
                  
                  {/* Current Image Display */}
                  {formData.imageUrl && !selectedImage && (
                    <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Image</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <img 
                        src={formData.imageUrl} 
                        alt="Current" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {/* Image Upload Area */}
                  <div className="space-y-3">
                    {/* File Input */}
                    <div className="flex items-center space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-edit"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors duration-200"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload New Image</span>
                      </button>
                      
                      {/* URL Input as Alternative */}
                      <div className="flex-1">
                        <input
                          type="url"
                          placeholder="Or enter new image URL"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Selected Image Preview */}
                    {selectedImage && (
                      <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">{selectedImage.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(selectedImage.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <img 
                          src={selectedImage.preview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Help Text */}
                    <p className="text-xs text-gray-500">
                      Supported formats: JPEG, PNG, GIF. Max size: 5MB. 
                      You can also provide an image URL instead.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCause(null);
                      setSelectedImage(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Cause</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        <Footer />
      </div>
    </AdminProtected>
  );
}
