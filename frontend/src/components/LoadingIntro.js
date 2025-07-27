import React, { useState, useEffect } from "react";

const words = ["Plan.", "Plot.", "Place.", " Routeine. "];

const LandingIntro = ({ onFinish }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [circleDone, setCircleDone] = useState(false);
  const [fadeCircle, setFadeCircle] = useState(false);


  useEffect(() => {
    // Control word sequencing
    if (wordIndex < words.length) {
      const showTimer = setTimeout(() => {
        setCurrentWord(words[wordIndex]);
      }, 500);

      const hideTimer = setTimeout(() => {
        setCurrentWord("");
        setWordIndex((prev) => prev + 1);
      }, 1500);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }  else {
  // Start the zoom
  const circleTimer = setTimeout(() => {
    setShowCircle(true);
  }, 500);

  // Trigger page load *while* circle is large
  const revealTimer = setTimeout(() => {
    onFinish();          // Show Home.js
    setFadeCircle(true); // Start fading the overlay
  }, 2000);

  // After fade, remove overlay
  const doneTimer = setTimeout(() => {
    setCircleDone(true); // Fully remove from DOM
  }, 3000);

  return () => {
    clearTimeout(circleTimer);
    clearTimeout(revealTimer);
    clearTimeout(doneTimer);
  };
  }

}, [wordIndex, onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden">
      {/* Word fade in/out */}
      <h1
        className={`text-5xl font-bold text-gray-800 transition-opacity duration-500 ease-in-out ${
          currentWord ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentWord}
      </h1>

      {/* Circle expand transition */}

      {showCircle && !circleDone && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-1000 ${
            fadeCircle ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-950 to-slate-950 animate-zoomWipe transition-opacity"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingIntro;
