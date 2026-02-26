import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlashMessage from './FlashMessage';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [flashMessage, setFlashMessage] = useState({
    message: '',
    type: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData.username, formData.password);

      setFlashMessage({
        message: response.message || "Login successful!",
        type: "success"
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setFlashMessage({
        message: err.response?.data?.error || "Invalid username or password",
        type: "error"
      });
      setIsLoading(false);
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
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-3 rounded disabled:bg-gray-400"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;