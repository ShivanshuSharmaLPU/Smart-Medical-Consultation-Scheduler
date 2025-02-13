import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext'; // Import DoctorContext
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext); // Admin Context
  const { dToken, setDToken } = useContext(DoctorContext); // Doctor Context

  const navigate = useNavigate();

  const logout = () => {
    // Remove both Admin and Doctor tokens
    setAToken(null);
    setDToken(null);
    localStorage.removeItem('aToken');
    localStorage.removeItem('dToken');

    // Redirect to Login/Signup page
    navigate('/login'); // Ensure this matches your Login page route
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="Admin Logo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'Admin' : dToken ? 'Doctor' : 'Guest'}
        </p>
      </div>
      {(aToken || dToken) && (
        <button onClick={logout} className='bg-[#5F6FFF] text-white text-sm px-10 py-2 rounded-full'>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
