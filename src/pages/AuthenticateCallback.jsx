import { useEffect } from "react";
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const AuthenticateCallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading isLoading={true} />
      <AuthenticateWithRedirectCallback 
        afterSignInUrl="/"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
};

export default AuthenticateCallback;
