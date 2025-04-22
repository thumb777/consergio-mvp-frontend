import { Routes, Route } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";
import Home from "./pages/Home";
import ChatPage from "./pages/Chat";
import WaitList from "./pages/waitlists/WaitList";
import WaitListSuccess from "./pages/waitlists/Success";
import AuthenticateCallback from "./pages/AuthenticateCallback";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import Auth from "./components/Auth";
import { useState, useRef, useEffect } from "react";

function App() {
  const { isAuthenticated, user, loading, signOut } = useAuthContext();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const logoutMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleAuthComplete = () => {
    setIsAuthModalOpen(false);
  };

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowLogoutMenu(false);
  };

  // Close the logout menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showLogoutMenu &&
        logoutMenuRef.current &&
        profileButtonRef.current &&
        !logoutMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowLogoutMenu(false);
      }
    };

    if (showLogoutMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showLogoutMenu]);

  return (
    <>
      <header className="flex w-full h-12 items-center justify-end md:px-12 sm:px-8 px-4">
        <div className="relative">
          {isAuthenticated ? (
            <div 
              ref={profileButtonRef}
              onClick={toggleLogoutMenu} 
              className="flex items-center gap-2 cursor-pointer"
            >
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0D5445] text-white flex items-center justify-center">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="hidden md:inline">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
              </span>
              
              {/* Dropdown arrow indicator */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-transform duration-200"
                style={{ transform: showLogoutMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1 rounded-md transition-colors"
            >
              Sign in
            </button>
          )}
          
          {/* Logout Menu */}
          {showLogoutMenu && isAuthenticated && (
            <div 
              ref={logoutMenuRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <a 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </a>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:id" element={<ChatPage />} />
        <Route path="/waitlist" element={<WaitList />} />
        <Route path="/waitlist/success" element={<WaitListSuccess />} />
        <Route path="/authenticate" element={<AuthenticateCallback />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      {isAuthModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <Auth
            onComplete={handleAuthComplete}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}

export default App;
