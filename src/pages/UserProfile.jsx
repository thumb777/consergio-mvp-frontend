import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { UserCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const { user, loading, signOut, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    avatarUrl: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

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
        fullName: user.user_metadata?.full_name || "",
        avatarUrl: user.user_metadata?.avatar_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      let avatarUrl = formData.avatarUrl;

      // If there's a new avatar file, upload it
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          avatar_url: avatarUrl,
        }
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
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
      // Delete user's data from Supabase
      const { error } = await supabase.rpc('delete_user_data');
      if (error) throw error;

      // Sign out the user
      await signOut();
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || "Failed to delete account");
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-neutral-800 animate-spin" />
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
            <div className="mt-4 flex flex-col items-center">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-24 w-24 text-gray-400" />
              )}
              
              {isEditing && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Change Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#0D5445] file:text-white
                      hover:file:bg-[#0A3F34]"
                  />
                </div>
              )}
            </div>
            
            {/* Email (non-editable) */}
            <div className="mt-2 text-sm text-gray-500">{user?.email}</div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D5445] focus:ring-[#0D5445] sm:text-sm"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D5445] hover:bg-[#0A3F34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D5445] ${
                    updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.user_metadata?.full_name || "Not set"}
                </p>
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
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
            <p className="mt-1 text-sm text-gray-500">
              Once you delete your account, it cannot be recovered.
            </p>
            <button
              onClick={handleDeleteAccount}
              className={`mt-4 px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                deleteConfirm ? 'bg-red-600 text-white hover:bg-red-700' : ''
              }`}
            >
              {deleteConfirm ? 'Click again to confirm' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 