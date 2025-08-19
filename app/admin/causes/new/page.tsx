'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../../../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../../../components/layout/Footer'), {
  ssr: false
});

const AdminProtected = dynamicImport(() => import('../../../components/auth/AdminProtected'), {
  ssr: false
});

import { Plus, Upload, X, Image as ImageIcon, ArrowLeft, Save } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: number;
}

export default function NewCausePage() {
  const router = useRouter();
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
    try {
      // Simulate API call
      const newCause = {
        id: Date.now().toString(),
        ...formData,
        imageUrl: finalImageUrl,
        raisedAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('New cause created:', newCause);
      alert('Cause created successfully!');
      
      // Redirect back to causes list
      router.push('/admin/causes');
    } catch (error) {
      alert('Failed to create cause. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => router.push('/admin/causes')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Causes</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Cause</h1>
            <p className="text-gray-600">Add a new fundraising cause to your platform</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cause Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Clean Water for Rural Communities"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
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
                    <option value="Environment">Environment</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Youth Development">Youth Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    value={formData.targetAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="50000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Northern Ghana, Accra"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Describe the cause, its impact, and why people should donate..."
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cause Image (Optional)
                </label>
                
                <div className="space-y-4">
                  {/* File Input */}
                  <div className="flex items-center space-x-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-new"
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
                    <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{selectedImage.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(selectedImage.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <img 
                        src={selectedImage.preview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}

                  {/* Help Text */}
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF. Max size: 5MB. 
                    You can also provide an image URL instead. High-quality images help increase engagement.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/admin/causes')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Cause</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </AdminProtected>
  );
}
