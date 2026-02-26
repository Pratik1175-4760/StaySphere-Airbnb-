import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlashMessage from './FlashMessage';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [flashMessage, setFlashMessage] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };
    
    setErrors(newErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      setFlashMessage({ 
        message: 'Please fix all errors before submitting', 
        type: 'error' 
      });
      return;
    }
    
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await signup(
        signupData.username,
        signupData.email,
        signupData.password
      );
      
      setFlashMessage({ 
        message: response.message || 'Account created successfully!', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error("Error creating account", err);
      setFlashMessage({ 
        message: err.response?.data?.error || 'Error creating account. Please try again.', 
        type: 'error' 
      });
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-xl outline-none transition-all placeholder:text-gray-400";
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName];
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50`;
    } else if (isValid) {
      return `${baseClasses} border-green-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-green-50`;
    } else {
      return `${baseClasses} border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent`;
    }
  };

  return (
    <>
      <FlashMessage 
        message={flashMessage.message} 
        type={flashMessage.type}
        onClose={() => setFlashMessage({ message: '', type: '' })}
      />

      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-rose-100 p-3 rounded-xl">
              <i className="fa-solid fa-user-plus text-rose-600 text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500">Join our community today</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-user mr-2 text-rose-500"></i>
                Username
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="john_doe"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                className={getInputClasses('username')}
              />
              {touched.username && errors.username && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.username}</span>
                </div>
              )}
              {touched.username && !errors.username && formData.username && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Looks good!</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-envelope mr-2 text-rose-500"></i>
                Email
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={getInputClasses('email')}
              />
              {touched.email && errors.email && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.email}</span>
                </div>
              )}
              {touched.email && !errors.email && formData.email && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Valid email!</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-lock mr-2 text-rose-500"></i>
                Password
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={getInputClasses('password')}
              />
              {touched.password && errors.password && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.password}</span>
                </div>
              )}
              {touched.password && !errors.password && formData.password && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Strong password!</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-lock mr-2 text-rose-500"></i>
                Confirm Password
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={getInputClasses('confirmPassword')}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
              {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Passwords match!</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Create Account</span>
              </button>
              
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-rose-600 font-semibold hover:underline">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;