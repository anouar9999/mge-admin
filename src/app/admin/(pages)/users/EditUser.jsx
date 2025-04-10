import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, EyeOff, User, Mail, Shield, Award, Star, CheckCircle, ImageIcon, FileText, Save, ArrowLeft, Upload, Trash2, ChevronRight, Settings, FileEdit, Camera, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    points: '',
    rank: '',
    is_verified: false,
    bio: '',
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        ...user,
        points: user.points?.toString() || '',
        rank: user.rank?.toString() || '',
        is_verified: user.is_verified === 1 || user.is_verified === '1' || user.is_verified === true
      });
      setNewPassword('');
      setImagePreview(null);
      setActiveTab('profile');
      setSaving(false);
    }
  }, [user, isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    if (name === 'is_verified') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '1' || value === true || value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? e.target.checked : value
      }));
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert("Only JPG, PNG & GIF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  }, []);

  const handleRemoveImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      avatar: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSaving(true);
    
    const submitData = new FormData();
    
    // Add basic fields
    submitData.append('id', formData.id);
    console.log("Submitting ID:", formData.id, typeof formData.id); // Debug logging

    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('type', formData.type || 'participant');
    submitData.append('points', formData.points || '0');
    submitData.append('is_verified', formData.is_verified ? '1' : '0');
    submitData.append('bio', formData.bio || '');
    
    // Only append password if it was changed
    if (newPassword) {
      submitData.append('password', newPassword);
    }
    
    // Handle avatar file
    if (formData.avatar instanceof File) {
      submitData.append('avatar', formData.avatar);
    }

    // Simulate network delay for demo
    setTimeout(() => {
      onSave(submitData);
      setSaving(false);
    }, 600);
  }, [formData, newPassword, onSave]);

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(newPassword)) strength += 25;
    
    // Contains number
    if (/[0-9]/.test(newPassword)) strength += 25;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;
    
    return strength;
  };
  
  const passwordStrength = getPasswordStrength();
  const passwordStrengthColor = passwordStrength <= 25 ? 'bg-red-500' : 
                              passwordStrength <= 50 ? 'bg-orange-500' : 
                              passwordStrength <= 75 ? 'bg-yellow-500' : 
                              'bg-green-500';

  // Custom form field component
  const FormField = ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    placeholder = "", 
    icon: Icon,
    isSelect = false,
    selectOptions = [],
    disabled = false,
    hint = null
  }) => (
    <div className="space-y-1.5 relative group">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-gray-300 text-sm font-medium flex items-center">
          {Icon && <Icon className="h-3.5 w-3.5 mr-1.5 text-primary/80" />}
          {label}
        </label>
        {hint && (
          <div className="group relative">
            <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-xs text-gray-300 p-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {hint}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        {isSelect ? (
          <div className="relative">
            <select
              id={name}
              name={name}
              value={value ? "1" : "0"}
              onChange={onChange}
              disabled={disabled}
              className="w-full pl-3 pr-8 py-2.5 bg-secondary angular-cut text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/70 transition-all duration-200 appearance-none"
            >
              {selectOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2.5 bg-secondary angular-cut text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-600"
          />
        )}
        
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/0 scale-x-0 group-focus-within:scale-x-100 group-focus-within:bg-primary/70 origin-left transition-all duration-300"></div>
      </div>
    </div>
  );

  // Tab content components
  const ProfileTabContent = () => (
    <div className="space-y-8">
      {/* Avatar Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-8 pb-6 border-b border-gray-800/30">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-gray-800/70 shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer bg-gradient-to-b from-gray-800 to-gray-900"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={`${formData.username}'s avatar`}
                  className="w-full h-full object-cover"
                />
              ) : formData.avatar ? (
                <img
                  src={typeof formData.avatar === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.avatar}` : ''}
                  alt={`${formData.username}'s avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${formData.username}&background=random`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-700" />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            {(imagePreview || formData.avatar) && (
              <motion.button
                type="button"
                onClick={handleRemoveImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
        </div>
        
        <div className="space-y-2 flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-lg font-medium text-white">Profile Picture</h3>
          <p className="text-sm text-gray-400 max-w-sm">Upload a clear photo to help others recognize you.</p>
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center mt-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-md transition-colors"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload Image
          </motion.button>
        </div>
      </div>

      {/* Basic Info Fields */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
          <User className="w-3.5 h-3.5 mr-1.5" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mt-3">
          <FormField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            icon={User}
          />
          
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            icon={Mail}
          />

          <FormField
            label="Points"
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            placeholder="0"
            icon={Award}
            hint="Points earned by the user through platform activities"
          />

          <FormField
            label="Rank"
            name="rank"
            type="text"
            value={formData.rank}
            onChange={handleChange}
            placeholder="User Rank"
            icon={Star}
          />

          <FormField
            label="Verification Status"
            name="is_verified"
            value={formData.is_verified}
            onChange={handleChange}
            icon={CheckCircle}
            isSelect={true}
            selectOptions={[
              { value: "0", label: "Not Verified" },
              { value: "1", label: "Verified" }
            ]}
          />
        </div>
      </div>
    </div>
  );

  const SecurityTabContent = () => (
    <div className="px-2">
      <div className="max-w-lg mx-auto py-4 space-y-8">
        <div className="bg-gradient-to-r from-amber-900/20 to-amber-700/5 border border-amber-800/20 rounded-lg p-4">
          <p className="text-amber-400/90 text-sm flex items-start">
            <Shield className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            <span>Leave the password field empty if you don't want to change it. The current password will remain unchanged.</span>
          </p>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Password Management
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-gray-300 text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-gray-900/40 border border-gray-700/50 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/70 transition-all duration-200"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {newPassword && (
              <div className="mt-3 space-y-2">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-gray-800">
                    <div
                      style={{ width: `${passwordStrength}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${passwordStrengthColor}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Weak</span>
                    <span>Strong</span>
                  </div>
                </div>
                
                <ul className="space-y-1 text-xs text-gray-500">
                  <li className={`flex items-center ${newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    Include uppercase letters
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    Include numbers
                  </li>
                  <li className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    Include special characters
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const BioTabContent = () => (
    <div className="py-2 space-y-6">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
        <FileEdit className="w-3.5 h-3.5 mr-1.5" />
        Biography
      </h3>
      
      <div className="space-y-2">
        <div className="relative">
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-secondary text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/70 transition-all duration-200"
            rows="8"
            placeholder="Write something about yourself..."
          />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/0 scale-x-0 focus-within:scale-x-100 focus-within:bg-primary/70 origin-left transition-all duration-300"></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {formData.bio ? formData.bio.length : 0} characters
          </span>
          <span>Maximum 500 characters</span>
        </div>
      </div>
    </div>
  );

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, content: ProfileTabContent },
    { id: 'security', label: 'Security', icon: Shield, content: SecurityTabContent },
    { id: 'bio', label: 'Biography', icon: FileEdit, content: BioTabContent },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0
          }}
          className="z-50 flex items-center justify-center backdrop-blur-lg"
        >
          <motion.div 
            ref={modalRef}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            style={{
              height: '100vh',
              margin: "20px",
              display: 'flex',
              flexDirection: 'column'
            }}
            className="bg-dark w-full max-w-4xl overflow-hidden shadow-2xl angular-cut  m-2"
          >
            {/* Header */}
            <div 
              className="p-6 pb-5 flex items-center justify-between border-b border-gray-800/50 relative overflow-hidden"
              style={{
                backgroundImage: "url('https://wallpapers.com/images/hd/3d-valorant-logo-lotk82bx6kv65d3u.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0
              }}
            >
              {/* Add an overlay to ensure text remains readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-gray-900/80 z-0"></div>
              
              {/* Content - now with z-10 to appear above the background */}
              <div className="flex items-center z-10 relative">
                <div className="bg-primary/20 backdrop-blur-sm rounded-lg p-2 mr-3">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-gray-100 text-xl font-valorant">Edit User Profile</h2>
                  <p className="text-gray-500 text-sm font-mono mt-0.5">
                    {formData.username || "User"}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-red-500/20 rounded-full p-2 transition-colors z-10 relative"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800/80 flex-shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center px-5 py-3.5 font-medium text-sm transition-colors ${
                    activeTab === tab.id 
                      ? 'text-primary bg-primary/5 relative' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className={`h-4 w-4 mr-1.5 ${activeTab === tab.id ? 'text-primary' : 'text-gray-500'}`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content - Flex-grow to fill available space */}
            <div className="flex-grow overflow-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <form onSubmit={handleSubmit} className="space-y-6 h-full">
                    {tabs.find(tab => tab.id === activeTab)?.content()}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer - Flex-shrink-0 to prevent it from shrinking */}
            <div className="p-6 border-t border-gray-800/50 bg-gradient-to-b from-gray-900/0 to-gray-900/60 flex-shrink-0">
              <div className="flex justify-between items-center">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ x: -2 }}
                  className="px-4 py-2 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={handleSubmit}
                  disabled={saving}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white angular-cut flex items-center font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 ${saving ? 'opacity-80' : ''}`}
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;