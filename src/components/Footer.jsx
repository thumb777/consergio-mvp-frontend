import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCircle } from "lucide-react";

const Footer = () => {
  const { isSignedIn, signOut } = useAuth(); // Clerk hooks for auth status and sign-out
  const { user } = useUser(); // Clerk hook to get the signed-in user

  return (
    <footer className="w-full fixed bottom-0 bg-gray-100 py-4 flex justify-center">
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          {/* User Profile Picture */}
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-gray-700" />
          )}

          {/* User Name */}
          <p className="text-gray-700">{user?.firstName || "User"}</p>

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