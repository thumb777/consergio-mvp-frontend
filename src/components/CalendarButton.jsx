import { useState, useRef, useEffect } from "react";
import { Calendar, Apple } from "lucide-react";

const CalendarButton = ({ eventTitle, location, startDate, startTime, description = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  // Generate calendar URLs
  const generateGoogleCalendarUrl = () => {
    // Parse the date and time correctly
    const [hours, minutes] = startTime.split(':').map(Number);
    const [year, month, day] = startDate.split('-').map(Number);
    
    // Create date object with exact time
    const startDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const endDateTime = new Date(startDateTime.getTime() + (2 * 60 * 60 * 1000));

    // Format for Google Calendar
    const formatDateForCalendar = (date) => {
      return date.toISOString()
        .replace(/-|:|\.\d{3}/g, '')
        .replace(/Z$/, '');
    };

    const formattedStart = formatDateForCalendar(startDateTime);
    const formattedEnd = formatDateForCalendar(endDateTime);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(eventTitle)}` +
      `&dates=${formattedStart}/${formattedEnd}` +
      `&details=${encodeURIComponent(description)}` +
      `&location=${encodeURIComponent(location)}`;
  };

  const generateAppleCalendarUrl = () => {
    // Parse the date and time correctly
    const [hours, minutes] = startTime.split(':').map(Number);
    const [year, month, day] = startDate.split('-').map(Number);
    
    // Create date object with exact time
    const startDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const endDateTime = new Date(startDateTime.getTime() + (2 * 60 * 60 * 1000));

    // Format for iCal
    const formatDateForICal = (date) => {
      return date.toISOString()
        .replace(/-|:|\.\d{3}/g, '')
        .replace(/Z$/, '');
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${formatDateForICal(startDateTime)}`,
      `DTEND:${formatDateForICal(endDateTime)}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowTooltip(!showTooltip)}
        className="p-1 rounded-full bg-white hover:bg-stone-800 text-stone-800 hover:text-white transition-colors"
        aria-label="Add to Calendar"
      >
        <Calendar className="w-4 h-4" />
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 w-48 border border-gray-200 z-10"
        >
          <div className="flex flex-col space-y-2">
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                className="h-5 w-5"
                alt="Google logo"
              />
              <span className="text-sm">Google Calendar</span>
            </a>
            <a
              href={generateAppleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
              download={`${eventTitle.replace(/\s+/g, "-")}.ics`}
            >
              <Apple className="w-4 h-4" />
              <span className="text-sm">Apple Calendar</span>
            </a>
          </div>
          <div className="absolute w-3 h-3 bg-white transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5 border-r border-b border-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarButton;
