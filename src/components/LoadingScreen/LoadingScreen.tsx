import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed z-40 flex items-center justify-center h-full w-full bg-[rgba(0,0,0,0.1)] top-0 left-0">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-primary_orange"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary_blue animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
