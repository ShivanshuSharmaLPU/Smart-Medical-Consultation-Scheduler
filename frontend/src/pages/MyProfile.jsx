import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      // Append image if available
      if (image) {
        formData.append('image', image);
      }

      // Append other profile data
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address)); // Ensure it's stringified
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);

      // Log the URL and data being sent
      console.log("Sending request to:", `${backendURL}/api/user/update-profile`);
      console.log("Form data:", formData);

      // Use PUT request to update user profile
      const { data } = await axios.put(
        `${backendURL}/api/user/update-profile`,  // Ensure the backend URL is correct
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending the token in headers
          },
        }
      );

      // Handle response after profile update
      if (data.success) {
        toast.success(data.message);  // Show success message
        await loadUserProfileData();  // Reload user profile data
        setIsEdit(false);             // Exit edit mode
      } else {
        toast.error(data.message || 'Failed to update profile'); // Show error message
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'An unexpected error occurred'); // Handle unexpected errors
    }
  };

  // Prevent rendering if userData is undefined or null
  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="max-w-lg flex-col gap-2 text-sm">
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />
            <img className="w-10 absolute bottom-12 right-12" src={image ? '' : assets.upload_icon} alt="Upload Icon" />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="Profile" />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name || ''}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} // Update name on change
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name || 'N/A'}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* Contact Information */}
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email || 'N/A'}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone || ''}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} // Update phone on change
            />
          ) : (
            <p className="text-blue-400">{userData.phone || 'N/A'}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || { line1: '', line2: '' }), line1: e.target.value },
                  }))
                }
                value={userData?.address?.line1 || ''}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || { line1: '', line2: '' }), line2: e.target.value },
                  }))
                }
                value={userData?.address?.line2 || ''}
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {userData?.address?.line1 || 'N/A'} <br />
              {userData?.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} 
              value={userData.gender || ''}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender || 'N/A'}</p>
          )}

          <p className="font-medium">Birthday</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} 
              value={userData.dob ? userData.dob.split('T')[0] : ''}
            />
          ) : (
            <p className="text-gray-400">{userData.dob ? userData.dob.split('T')[0] : 'N/A'}</p>
          )}
        </div>
      </div>

      {/* Edit / Save Button */}
      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateUserProfileData} // Trigger the save function
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)} // Enter edit mode
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
