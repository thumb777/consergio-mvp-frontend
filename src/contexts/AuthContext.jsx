import { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isSignedIn, isLoaded: clerkLoaded, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync user data with our database when Clerk auth state changes
  useEffect(() => {
    const syncUserWithDatabase = async () => {
      if (!clerkLoaded) return;
      
      try {
        if (isSignedIn && clerkUser) {
          // User is signed in, sync with our database
          const userData = await authService.syncUser({
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || null,
            firstName: clerkUser.firstName || null,
            lastName: clerkUser.lastName || null,
            profileImage: clerkUser.imageUrl || null,
          });
          
          setUser(userData);
        } else {
          // User is signed out
          setUser(null);
        }
      } catch (err) {
        console.error("Error syncing user with database:", err);
        setError(err.message || "Authentication error");
      } finally {
        setLoading(false);
      }
    };

    syncUserWithDatabase();
  }, [isSignedIn, clerkUser, clerkLoaded]);

  // Custom sign out that handles both Clerk and our database
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err.message || "Error signing out");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is new (just registered)
  const isNewUser = () => {
    if (!clerkUser) return false;
    
    // Check if created and updated timestamps are close (within 5 minutes)
    const createdAt = new Date(clerkUser.createdAt).getTime();
    const updatedAt = new Date(clerkUser.updatedAt).getTime();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    return Math.abs(updatedAt - createdAt) < fiveMinutesInMs;
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isNewUser: isNewUser(),
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}; 