import { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

function WaitListSuccess() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFollowTwitter = () => {
    const twitterProfileUrl = "https://twitter.com/letsgoai"; // Replace 'yourTwitterHandle' with your actual Twitter username
    window.open(twitterProfileUrl, "_blank");
  };

  return (
    <div className="min-h-screen w-[100vw] flex flex-col items-center bg-gradient-to-b from-[#FFFFFF] to-[#FCE5D8] pt-28">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          data-aos="fade-down"
          data-aos-duration="2000"
          className="text-center text-2xl font-serif leading-7 max-w-[400px] pb-12"
        >
          We have your spot in line saved! <br></br> We will be welcoming you in
          soon. Share to move up in line.
        </div>
        <div
          data-aos="fade-down"
          data-aos-duration="2000"
          className="text-center text-2xl font-serif leading-7 max-w-[400px] pb-4"
        >
          Share to move up in line.
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="2000"
          className="w-full flex items-center justify-center gap-4 pb-12"
        >
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
        <div
          data-aos="fade-up"
          data-aos-duration="2000"
          className="text-center text-2xl font-serif leading-7 max-w-[400px] pb-4"
        >
          Follow us for updates!
        </div>
        <a
          data-aos="fade-up"
          data-aos-duration="2000"
          href="https://twitter.com/letsgoai"
          className="w-full flex items-center justify-center gap-4 pb-12"
        >
          <img
            className="cursor-pointer"
            src="/BTwitter.svg"
            alt="BTwitter"
            onClick={handleFollowTwitter}
          />
        </a>
      </div>
    </div>
  );
}

export default WaitListSuccess;
