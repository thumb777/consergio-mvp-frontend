import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify styles

function WaitList() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      easing: "ease-in-out", // Easing function
    });
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await axios.post(
          "http://localhost:5001/api/waitlist/register",
          {
            email,
          }
        );

        if (response.status === 200) {
          setIsSubmitted(true);
          toast.success("Email registered successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          // Delay navigation to the success page
          setTimeout(() => {
            navigate("/waitlist/success");
          }, 3000);
        }
      } catch (error) {
        // Handle duplicate email or other errors
        if (error.response && error.response.status === 400) {
          toast.warning("Email is already registered", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("Registration failed. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } finally {
        // Re-enable the button only if not successful
        if (!isSubmitted) {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleTwitterShare = () => {
    const twitterText =
      "Get early access to LetsGo.ai, your personal AI event concierge. Sign up now!";
    const twitterUrl = "https://letsgo.ai"; // Replace with your actual website URL
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterText
    )}&url=${encodeURIComponent(twitterUrl)}`;

    // Open the Twitter share URL in a new tab
    window.open(twitterShareUrl, "_blank");
  };

  const handleShare = () => {
    const shareData = {
      title: "Join the Waitlist for LetsGo.ai!",
      text: "Get early access to LetsGo.ai, your personal AI event concierge. Sign up now!",
      url: window.location.href, // Use the current URL
    };

    // Check if the Web Share API is available
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {})
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-[100vw] flex flex-col items-center bg-gradient-to-b from-[#FFFFFF] to-[#FCE5D8] justify-center">
        <div className="text-center w-fit p-4 space-y-4">
          <div className=" text-2xl font-serif">
            LetsGo.ai is launching soon!
          </div>
          <div className="h-1 w-[95%] bg-gray-400 rounded-full overflow-hidden">
            <div className="h-full w-full loading-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100vw] flex flex-col items-center bg-gradient-to-b from-[#FFFFFF] to-[#FCE5D8] pt-28">
      <ToastContainer />
      {/* Add ToastContainer to enable toast notifications */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          data-aos="fade-down"
          data-aos-duration="1000"
          className="text-center text-2xl font-serif leading-7 max-w-[400px] pb-12"
        >
          LetsGo.ai is launching soon! <br /> Sign up to get early access to
          your personal AI event concierge.
        </div>
        <form
          onSubmit={handleSubmit}
          className="  space-y-4 w-[90%] max-w-[400px]"
        >
          <input
            data-aos="fade-right"
            data-aos-duration="2000"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-6 py-4 rounded-full border-2 border-gray-100 text-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting} // Disable the button if submitting
            className={`w-full bg-black text-white py-4 rounded-full text-lg font-medium flex items-center justify-center transition-all duration-300 ${
              isSubmitting ? "cursor-wait opacity-50" : "hover:bg-gray-900"
            }`}
          >
            {isSubmitting ? (
              <div className="loader"></div> // Circular animation
            ) : (
              "Sign up"
            )}
          </button>
        </form>
        <div
          data-aos="fade-down"
          data-aos-duration="1000"
          className="w-full text-center text-2xl font-serif leading-7 max-w-[400px] pt-16 pb-4"
        >
          Share the love <br /> and move up the wait list!
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <img
            data-aos="fade-up"
            data-aos-duration="1000"
            className="cursor-pointer"
            src="/Twitter.svg"
            alt="Twitter"
            onClick={handleTwitterShare}
          />
          <img
            data-aos="fade-up"
            data-aos-duration="1000"
            className="cursor-pointer"
            src="/Share.svg"
            alt="Share"
            onClick={handleShare} // Attach the share handler here
          />
        </div>
      </div>
    </div>
  );
}

export default WaitList;
