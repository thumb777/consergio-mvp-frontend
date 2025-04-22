import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Play, Square } from "lucide-react";
import EventCards from "../components/EventCards";
import Loading from "../components/Loading";
import Auth from "../components/Auth";
import { useAuthContext } from "../contexts/AuthContext";
import "../App.css";
import axios from "axios";
import { motion } from "framer-motion";

const categories = ["concerts", "sports", "theater"];

function Home() {
  const [message, setMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(categories);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/events`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setEvents(response.data.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePlay = async () => {
    if (!message.trim()) return;

    if (!isAuthenticated) {
      // If user is not authenticated, open the Auth modal
      setIsModalOpen(true);
      return;
    }

    // If authenticated, navigate to Chat page
    setIsLoading(true);
    const chatId = Date.now().toString(); // Generate a unique chat ID
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/s/${chatId}`, {
        state: { initialMessage: message },
      });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      togglePlay();
    }
  };

  const handleAuthComplete = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-[calc(100vh-48px)] w-full flex flex-col items-center bg-gradient-to-b from-[#FFFFFF] to-[#FCE5D8] relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Consigero</h1>
          </div>
          <p className="text-[20px] text-gray-600">
            Let me help you find a fun experience...
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center pt-12 md:w-[60%] w-[90%] max-w-[800px] min-w-[320px]"
        >
          <div className="bg-white w-full flex flex-col items-end pr-4 pb-4 rounded-[32px] shadow-lg transition-shadow duration-200 max-h-[60vh] overflow-y-auto focus-within:shadow-xl focus-within:ring-2 focus-within:ring-stone-300">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I am interested in..."
              className="w-full max-h-[40vh] px-6 pt-6 text-gray-800 rounded-[32px] focus:outline-none bg-transparent resize-none text-lg"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(209 213 219) transparent",
              }}
            />
            {message.trim() && (
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`bottom-4 w-fit h-fit p-3 rounded-full transition-all duration-200
                  ${
                    isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-100 hover:bg-orange-200 text-orange-600"
                  }`}
              >
                {isLoading ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          <div className="flex gap-3 mt-6 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-lg min-w-24 ${
                  category === "concerts"
                    ? "bg-[#0D5445]"
                    : category === "sports"
                    ? "bg-[#FFEB3B]"
                    : "bg-[#FFC09A]"
                } bg-opacity-25 text-black font-['Roboto'] transition-shadow duration-100
                ${
                  selectedCategories.includes(category)
                    ? ""
                    : "border-2 border-black border-opacity-50"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full p-12 pt-24 gap-6 pb-4 relative flex overflow-x-hidden"
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="event-card flex-shrink-0 md:w-[500px] w-[300px] animate-marquee whitespace-nowrap"
            >
              <EventCards {...event} />
            </div>
          ))}
        </motion.div>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <Auth onComplete={handleAuthComplete} onClose={() => setIsModalOpen(false)} />
          </div>
        )}
      </div>
    </Loading>
  );
}

export default Home;