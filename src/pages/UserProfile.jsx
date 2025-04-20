import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import authService from "../services/authService";
import { UserCircle } from "lucide-react";

const UserProfile = () => {
  const { user, loading, error, signOut, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  // Set form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      await authService.updateUserProfile(user.id, formData);
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      await authService.deleteUserAccount(user.id);
      await signOut();
      navigate("/");
    } catch (err) {
      setUpdateError(err.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-neutral-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            
            {/* Profile Image */}
            <div className="mt-4 flex justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-24 w-24 text-gray-400" />
              )}
            </div>
            
            {/* Email (non-editable) */}
            <div className="mt-2 text-sm text-gray-500">{user?.email}</div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D5445] focus:ring-[#0D5445] sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D5445] focus:ring-[#0D5445] sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="profileImage"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D5445] focus:ring-[#0D5445] sm:text-sm"
                />
              </div>
              
              {updateError && (
                <div className="text-red-500 text-sm">{updateError}</div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D5445] hover:bg-[#0A3F34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D5445]"
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">First Name</h2>
                <p className="mt-1 text-sm text-gray-900">{user?.firstName || "Not set"}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500">Last Name</h2>
                <p className="mt-1 text-sm text-gray-900">{user?.lastName || "Not set"}</p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D5445] hover:bg-[#0A3F34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D5445]"
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={signOut}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          {/* Delete Account Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
            <p className="mt-1 text-sm text-gray-500">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className={`mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                deleteConfirm 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-red-500 hover:bg-red-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {deleteConfirm ? "Confirm Delete Account" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 