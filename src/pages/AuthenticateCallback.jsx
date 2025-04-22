import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoading from "../components/Authloading";
import { useAuthContext } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const AuthenticateCallback = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth error:", error);
        navigate("/");
        return;
      }

      if (session) {
        // You can add additional logic here if needed
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <AuthLoading isLoading={true} />;
};

export default AuthenticateCallback;