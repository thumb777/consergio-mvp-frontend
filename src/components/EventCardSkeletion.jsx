import React from "react";

const EventSkeleton = () => {
  return (
    <div className="bg-white rounded-lg w-full max-w-[300px] md:max-w-[500px] h-full min-h-[200px] shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
      {/* Image section */}
      <div className="relative w-full md:w-2/5">
        <div className="w-full h-32 md:h-full bg-gray-200" />
        <div className="absolute top-2 left-2 flex gap-1">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="w-6 h-6 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Content section */}
      <div className="p-3 flex flex-col justify-between w-full md:w-3/5">
        <div>
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            <div className="w-16 h-4 bg-gray-200 rounded-full" />
            <div className="w-20 h-4 bg-gray-200 rounded-full" />
          </div>

          {/* Venue info */}
          <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-32 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Date and time */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-full" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-full" />
              <div className="w-12 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="w-20 h-6 bg-gray-200 rounded" />
          <div className="w-24 h-8 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EventSkeleton;
