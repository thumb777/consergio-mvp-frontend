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
      if (user.createdAt === user.updatedAt) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      setIsRedirecting(false);
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
