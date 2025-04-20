import { useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Tag,
  ExternalLink,
  Share2,
} from "lucide-react";
import CalendarButton from "./CalendarButton";

const EventCards = ({
  name,
  price_min,
  price_max,
  categories,
  start_time,
  start_date,
  venue_name,
  image_url,
  venue_address,
  venue_state,
  url,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Check out ${name} at ${venue_name} on ${start_date} at ${start_time}!`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const generateGoogleCalendarUrl = () => {
    // Convert start_date and start_time to Date object
    const startDateTime = new Date(`${start_date} ${start_time}`);
    // Add 2 hours for end time (you can adjust this default duration)
    const endDateTime = new Date(startDateTime.getTime() + (2 * 60 * 60 * 1000));
    
    // Format dates for Google Calendar URL
    const startDate = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    // Create event details
    const eventDetails = {
      text: name,
      dates: `${startDate}/${endDate}`,
      details: `Event Details: ${url}`,
      location: `${venue_name}, ${venue_address}, ${venue_state}`,
    };

    // Generate Google Calendar URL
    return `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(eventDetails.text)}` +
      `&dates=${eventDetails.dates}` +
      `&details=${encodeURIComponent(eventDetails.details)}` +
      `&location=${encodeURIComponent(eventDetails.location)}` +
      `&sprop=website:${encodeURIComponent(url)}`;
  };

  const addToCalendar = (e) => {
    e.preventDefault();
    window.open(generateGoogleCalendarUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-[300px] md:max-w-[500px] h-full min-h-[200px] shadow-lg overflow-hidden transition-transform hover:scale-[1.02] flex flex-col md:flex-row">
      <div className="relative w-full md:w-2/5">
        <img
          src={image_url || "default-image-url.jpg"}
          alt={name}
          className="w-full h-32 md:h-full object-cover"
        />
        {/* <div className="absolute top-2 left-2 flex gap-1">
          <button
            onClick={handleShare}
            className="p-1 rounded-full bg-white hover:bg-stone-800 text-stone-800 hover:text-white transition-colors"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded-full bg-white hover:bg-stone-800 text-stone-800 hover:text-white transition-colors"
            aria-label="Add to Calendar"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div> */}
      </div>

      <div className="p-3 flex flex-col justify-between w-full md:w-3/5">
        <div>
          <h3 className="text-base max-w-[250px] font-semibold text-gray-800 mb-1 truncate">
            {name}
          </h3>
          {/* <div className="flex flex-wrap gap-1 mb-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-200 text-green-900"
              >
                {category}
              </span>
            ))}
          </div> */}

          <div className="flex flex-col gap-1 text-gray-600 mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <div className="text-xs">
                <div>{venue_name}</div>
                <div className="text-gray-500">
                  {venue_address}, {venue_state}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 mb-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{start_date}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{start_time}</span>
            </div>
            <div className="text-base font-semibold text-gray-900">
            {price_min
              ? `$${price_min}${price_max ? ` - $${price_max}` : ""}`
              : "TBA"}
          </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-row gap-2">
            <button
              onClick={handleShare}
              className="p-1 rounded-full bg-white hover:bg-stone-800 text-stone-800 hover:text-white transition-colors"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <CalendarButton
              eventTitle={name}
              location={`${venue_name}, ${venue_address}, ${venue_state}`}
              startDate={start_date}
              startTime={start_time}
              description={`Event Details: ${url}`}
            />
          </div>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-900 transition-colors text-sm"
          >
            Get Tickets
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCards;
