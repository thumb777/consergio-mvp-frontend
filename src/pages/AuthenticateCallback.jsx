import { useEffect, useState } from "react";
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuthContext } from "../contexts/AuthContext";

const AuthenticateCallback = () => {
  const { user, isLoaded } = useAuth();
  const { loading } = useAuthContext();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if the user is new (createdAt === updatedAt)
      if (user.createdAt === user.updatedAt) {
        console.log("New user detected, redirecting to onboarding...");
        setTimeout(() => {
          navigate("/onboarding");
          setIsRedirecting(false);
        }, 1000);
      } else {
        console.log("Existing user, redirecting to homepage...");
        setTimeout(() => {
          navigate("/");
          setIsRedirecting(false);
        }, 1000);
      }
    }
  }, [user, isLoaded, navigate]);

  return (
    <>
      {(loading || isRedirecting) && <Loading isLoading={true} />}
      <AuthenticateWithRedirectCallback />
    </>
  );
};

export default AuthenticateCallback;