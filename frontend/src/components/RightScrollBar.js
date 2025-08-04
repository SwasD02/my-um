import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  GraduationCap,
  Briefcase,
  Coffee,
  Car,
  View,
  Lightbulb,
  Brain
} from "lucide-react";

const RouteScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState("morning");

  // Section content and colors
  const sectionData = [
    {
      id: 1,
      title: "Meet Routeine",
      subtitle: "Right Place At The Right Time",
      content:
        "Transform your daily schedule into beautiful, interactive route visualizations. See your entire day mapped out across the city with intuitive color-coding and smooth animations.",
      backgroundColor: "#F59E0B",
      icon: Home,
    },
    {
      id: 2,
      title: "Why Routeine?",
      subtitle: "Planning Made Visual",
      content:
        "Stop juggling multiple apps and confusing schedules. Routeine gives you a bird's eye view of your day, making it easy to spot conflicts, optimize your time, and stay organized.",
      backgroundColor: "#E31E31",
      icon: GraduationCap,
    },
    {
      id: 3,
      title: "See It In Action",
      subtitle: "Interactive Demo",
      content:
        "Watch as your daily activities come to life on an interactive map. Each location is color-coded, timed, and connected with smooth route animations that make planning feel like a game.",
      backgroundColor: "#6FC965",
      icon: Briefcase,
    },
    {
      id: 4,
      title: "Coming Soon",
      subtitle: "More Features",
      content:
        "We're building advanced features like team collaboration, smart suggestions, traffic integration, and much more. Stay tuned for updates!",
      backgroundColor: "#1F5E18",
      icon: Coffee,
    },
    {
      id: 5,
      title: "Ready to Start?",
      subtitle: "Join Routeine Today",
      content:
        "Join thousands of users who've transformed how they plan their days. Start mapping your daily journey with Routeine's intuitive visual planning system.",
      backgroundColor: "#B00516",
      icon: Home,
    },
  ];

  // Solid color mappings for route line
  const routeColors = {
    morning: "#F59E0B",
    afternoon: "#F97316",
    evening: "#A855F7",
    night: "#3730A3",
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      if (progress < 0.25) {
        setCurrentTimeOfDay("morning");
      } else if (progress < 0.5) {
        setCurrentTimeOfDay("afternoon");
      } else if (progress < 0.75) {
        setCurrentTimeOfDay("evening");
      } else {
        setCurrentTimeOfDay("night");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getArrowPoints = (position) => {
    const y = 10 + position * 380;
    return `28,${y} 32,${y} 30,${y + 8}`;
  };

  const getBorderClass = (isPassed, isDark) => {
    if (isPassed) {
      return "border-white shadow-xl";
    }
    return isDark ? "border-gray-600" : "border-gray-400";
  };

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100); // slight delay adds polish
        return () => clearTimeout(timer); 
    }, []);

    const navigate = useNavigate();
    const moveToNext = () => {
        navigate("/login");
    }


  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      {/*<button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 left-6 z-50 p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 group shadow-lg"
        style={{
          backgroundColor: isDark ? currentBgColor : "white",
          borderColor: isDark ? "rgba(255,255,255,0.2)" : currentBgColor,
          color: isDark ? "white" : currentBgColor,
        }}
      >
        <div className="w-6 h-6 relative">
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isDark ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
            }`}
          >
            <Moon />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isDark ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
            }`}
          >
            <Sun />
          </div>
        </div>
      </button>*/}

      {/* Main Content */}
      
      <div
        className= {`min-h-screen transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-80'}`}
      >
        {sectionData.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.id}
              className= {"w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 relative bg-slate-950"}
              /*style={{
                backgroundColor: section.backgroundColor,
              }}*/
              
            >
              <div className="w-full max-w-6xl mx-auto space-y-10 sm:space-y-14 md:space-y-20 ">
                {/* Header with icon */}
                <div className={`flex sm:flex-row sm:items-center sm:space-x-6 space-y-6 sm:space-y-0 transform transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}>
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: section.backgroundColor}}
                  >
                    <Icon
                      className="w-10 h-10 transition-transform duration-300 hover:rotate-45 hover:scale-125"
                      style={{ color: "slate-950" }}
                    />
                  </div>
                  <div className="flex-1 ">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                      {section.title}
                    </h2>
                    <p className="text-base sm:text-lg opacity-90 font-bold mt-1"
                    style={{color : section.backgroundColor}}>
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="text-white space-y-8 text-base sm:text-lg leading-relaxed font-light opacity-95 ">
                  <p>{section.content}</p>

                  {/* Your conditional content blocks for each section (e.g., features, demo, etc.) go here */}

                  {section.id === 1 && (
                    <div className={"grid grid-cols-3 gap-6 text-center"}>
                        {['Visual', 'Intuitive', 'Smart'].map((feature) => (
                          <div 
                            key={feature}
                            className=" backdrop-blur-sm hover:bg-opacity-30  duration-300 transition-all hover:shadow-xl hover:shadow-blue-500/50 p-6 rounded-lg text-center hover:scale-105"
                            style={{backgroundColor: section.backgroundColor}}
                          >
                            <div className="flex justify-center items-center text-2xl font-bold text-slate-900 mb-2">{feature}</div>
                            {feature === 'Visual' && <div className="flex justify-center items-center text-slate-900"><View/></div>}
                            {feature === 'Intuitive' && <div className="flex justify-center items-center text-slate-900"><Lightbulb/></div>}
                            {feature === 'Smart' && <div className="flex justify-center items-center text-slate-900"><Brain/></div>}

                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === 2 && (
                      <div className="space-y-4">
                        {['Save 30+ minutes daily', 'Never miss appointments', 'Reduce planning stress'].map((benefit) => (
                          <div 
                            key={benefit}
                            className="flex items-center space-x-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-30 transition-all duration-300 hover:translate-x-2"
                            style={{backgroundColor: section.backgroundColor}}
                          >
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                            <span className="text-white font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === 3 && (
                      <div className="bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-30 transition-all duration-300"
                      style={{backgroundColor: section.backgroundColor}}
                      >
                        <div className="flex items-center justify-center space-x-4 mb-6">
                          <div className="w-4 h-4 rounded-full bg-white animate-ping" />
                          <span className="text-white font-semibold">Live Demo Available</span>
                          <div className="w-4 h-4 rounded-full bg-white animate-ping opacity-75" style={{ animationDelay: '1s' }} />
                        </div>
                        <p className="text-white opacity-90 text-center">
                          Interactive visualization showing your daily route in real-time
                        </p>
                      </div>
                    )}

                    {section.id === 4 && (
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3"
                        style={{backgroundColor: section.backgroundColor}}
                        >
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                          <span className="text-white font-medium">More features coming soon...</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-m">
                          <div className="bg-red-200 bg-opacity-100 rounded-xl p-4 text-slate-900 opacity-80">Team Collaboration</div>
                          <div className="bg-green-200 bg-opacity-100 rounded-xl p-4 text-slate-900 opacity-80">Smart Suggestions</div>
                          <div className="bg-blue-200 bg-opacity-100 rounded-xl p-4 text-slate-900 opacity-80">Traffic Integration</div>
                          <div className="bg-teal-200 bg-opacity-100 rounded-xl p-4 text-slate-900 opacity-80">Mobile App</div>
                        </div>
                      </div>
                    )}


                    {section.id === 5 && (
                      <div className="text-center space-y-8">
                        <button 
                            onClick = {() => {moveToNext()}}
                          className="group bg-white hover:bg-opacity-90 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center space-x-3"
                          style={{ color: section.backgroundColor }
                        }>
                          <span>Start Your Journey</span>
                          <div className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300">→</div>
                        </button>
                        
                        <div className="flex justify-center space-x-8 text-white opacity-80">
                          <div className="text-center">
                            <div className="text-2xl font-bold">2.4K+</div>
                            <div className="text-sm">Active Users</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">98%</div>
                            <div className="text-sm">Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">Free</div>
                            <div className="text-sm">To Start</div>
                          </div>
                        </div>
                      </div>
                    )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Route Scrollbar - UNCHANGED */}
      <div className="hidden sm:block fixed right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40 w-16 sm:w-20 md:w-24 h-80 sm:h-96">
        <svg
          className="absolute left-1/2 transform -translate-x-1/2 w-16 h-full"
          viewBox="0 0 60 400"
        >
          <path
            d="M30,10 Q35,50 25,80 Q20,120 35,160 Q40,200 25,240 Q15,280 30,320 Q35,360 30,390"
            stroke={"#374151"}
            strokeWidth="4"
            fill="none"
            className="opacity-30"
          />

          <path
            d="M30,10 Q35,50 25,80 Q20,120 35,160 Q40,200 25,240 Q15,280 30,320 Q35,360 30,390"
            stroke={routeColors[currentTimeOfDay]}
            strokeWidth="4"
            fill="none"
            strokeDasharray="380"
            strokeDashoffset={380 - scrollProgress * 380}
            className="transition-all duration-300 drop-shadow-lg"
          />

          {[0.2, 0.4, 0.6, 0.8].map((position, index) => (
            <g key={index} opacity={scrollProgress > position ? 1 : 0.3}>
              <polygon
                points={getArrowPoints(position)}
                fill={
                  scrollProgress > position
                    ? routeColors[currentTimeOfDay] : "#6B7280"
                }
                className="transition-all duration-300"
              />
            </g>
          ))}
        </svg>

        {sectionData.map((section, index) => {
          const Icon = section.icon;
          const positions = [
            { x: 30, y: 10 },
            { x: 25, y: 80 },
            { x: 35, y: 160 },
            { x: 25, y: 240 },
            { x: 30, y: 320 },
          ];

          const position = positions[index];
          const progress = index / (sectionData.length - 1);
          const isPassed = scrollProgress >= progress;

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${(position.x / 60) * 100}%`,
                top: `${(position.y / 400) * 100}%`,
              }}
            >
              <div
                className={`relative transition-all duration-300 ${
                  isPassed ? "scale-110" : "scale-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-300 ${getBorderClass(
                    isPassed,
                  )}`}
                  style={{
                    backgroundColor: isPassed
                      ? section.backgroundColor
                      : "#374151",
                    boxShadow: isPassed
                      ? `0 0 20px ${section.backgroundColor}40`
                      : undefined,
                  }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isPassed
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                </div>

                {isPassed && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ backgroundColor: section.backgroundColor }}
                  />
                )}

                <div
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-all duration-300 ${
                    isPassed ? "opacity-100" : "opacity-30"
                  }`}
                  style={{
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: `8px solid ${
                      isPassed
                        ? section.backgroundColor
                        : "#374151"
                    }`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10"
          style={{
            left: "50%",
            top: `${Math.min(scrollProgress * 100, 95)}%`,
          }}
        >
          <div
            className="relative w-8 h-8 rounded-full shadow-lg flex items-center justify-center transform rotate-0 transition-all duration-300"
            style={{
              backgroundColor: routeColors[currentTimeOfDay],
              boxShadow: `0 4px 12px ${routeColors[currentTimeOfDay]}40`,
            }}
          >
            <Car className="w-4 h-4 text-white transform rotate-90" />

            <div
              className="absolute inset-0 rounded-full opacity-50 animate-pulse"
              style={{ backgroundColor: routeColors[currentTimeOfDay] }}
            />
          </div>

          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-60">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-0.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: routeColors[currentTimeOfDay],
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 shadow-lg border bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          {Math.round(scrollProgress * 24)}km
        </div>
      </div>
    </div>
  );
};

export default RouteScrollbar;
