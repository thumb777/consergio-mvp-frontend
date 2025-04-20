import React from "react";

const Loading = ({ isLoading, children }) => {
  return (
    <div className="relative">
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-[#FDF8F6] bg-opacity-80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-neutral-800 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-neutral-800 border-t-transparent animate-ping opacity-20" />
            </div>
            <div className="text-neutral-800 font-medium animate-pulse">
              Loading events...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
