import { UserCircle } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated, user, signOut } = useAuthContext();

  return (
    <footer className="w-full fixed bottom-0 bg-gray-100 py-4 flex justify-center">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {/* User Profile Picture */}
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-gray-700" />
          )}

          {/* User Name */}
          <p className="text-gray-700">
            {user?.user_metadata?.full_name || user?.email || "User"}
          </p>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="ml-4 text-red-600 underline"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p className="text-gray-700">Not Signed In</p>
      )}
    </footer>
  );
};

export default Footer;