import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/"); // Redirect to homepage after onboarding
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Consigero!</h1>
        <p className="text-gray-600 mb-6">
          We're glad to have you here. Let us help you find amazing experiences.
        </p>
        <button
          onClick={handleContinue}
          className="w-full bg-[#0D5445] text-white py-3 rounded-lg hover:bg-[#0A3F34] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Onboarding;