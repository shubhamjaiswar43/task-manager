import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate()
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <nav className="flex space-x-4">
          <Link
            to="/dashboard"
            className="text-gray-700 text-xl font-semibold hover:text-purple-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className="text-gray-700 text-xl font-semibold hover:text-purple-600 transition"
          >
            Task List
          </Link>
        </nav>
        <button onClick={handleSignOut} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
