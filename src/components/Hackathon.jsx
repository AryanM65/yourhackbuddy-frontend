import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaLaptop, 
  FaCalendarAlt, 
  FaClock,
  FaUsers,
  FaBuilding,
  FaChevronLeft,
  FaRocket,
  FaPlus,
  FaSearch,
  FaExternalLinkAlt,
  FaUserPlus,
  FaRegCalendarCheck,
  FaQuestionCircle,
  FaAward
} from "react-icons/fa";

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerExpanded, setRegisterExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/hackathon/${id}`, {
          withCredentials: true,
        });
        setHackathon(res.data.data);
      } catch (err) {
        console.error("Failed to load hackathon:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHackathon();
  }, [id]);
  
  // Calculate time remaining for registration deadline
  useEffect(() => {
    if (!hackathon) return;
    
    const deadline = new Date(hackathon.registrationDeadline);
    const now = new Date();
    
    if (now > deadline) {
      setTimeRemaining({ expired: true });
      return;
    }
    
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = deadline - now;
      
      if (timeDiff <= 0) {
        setTimeRemaining({ expired: true });
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds, expired: false });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [hackathon]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading hackathon details...</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-5xl text-gray-400 mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Hackathon Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the hackathon you're looking for</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Format dates more nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if registration is still open
  const isRegistrationOpen = new Date() < new Date(hackathon.registrationDeadline);
  
  // Check if hackathon has started
  const hasStarted = new Date() >= new Date(hackathon.startDate);
  
  // Check if hackathon has ended
  const hasEnded = new Date() > new Date(hackathon.endDate);
  
  // Get hackathon status
  const getHackathonStatus = () => {
    if (hasEnded) return { label: "Ended", color: "bg-red-100 text-red-700" };
    if (hasStarted) return { label: "In Progress", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Upcoming", color: "bg-green-100 text-green-700" };
  };
  
  const status = getHackathonStatus();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaRegCalendarCheck className="mr-2" /> },
    { id: 'rules', label: 'Rules & Info', icon: <FaQuestionCircle className="mr-2" /> },
    { id: 'prizes', label: 'Prizes', icon: <FaAward className="mr-2" /> }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
          >
            <FaChevronLeft className="mr-2" />
            Back to Hackathons
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span className={`inline-block px-4 py-2 rounded-full font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            
            {/* Hackathon Title */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
              <div className="flex flex-wrap gap-2 mb-2">
                {hackathon.tags?.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {hackathon.tags?.length > 5 && (
                  <span className="bg-gray-500/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    +{hackathon.tags.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Registration Deadline Countdown */}
            {isRegistrationOpen && !timeRemaining.expired && (
              <div className="mb-6 bg-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <FaClock className="mr-2" /> Registration Deadline Countdown
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{timeRemaining.days || 0}</div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{timeRemaining.hours || 0}</div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{timeRemaining.minutes || 0}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{timeRemaining.seconds || 0}</div>
                    <div className="text-xs text-gray-500">Seconds</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`flex items-center py-3 px-4 font-medium transition ${
                      activeTab === tab.id 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'overview' && (
                <div>
                  <p className="text-gray-700 text-lg mb-6">{hackathon.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaMapMarkerAlt />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-gray-800 font-medium">{hackathon.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaLaptop />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mode</p>
                            <p className="text-gray-800 font-medium">{hackathon.mode}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaCalendarAlt />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Event Dates</p>
                            <p className="text-gray-800 font-medium">
                              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaClock />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Registration Deadline</p>
                            <p className={`font-medium ${isRegistrationOpen ? 'text-gray-800' : 'text-red-600'}`}>
                              {formatDate(hackathon.registrationDeadline)}
                              {!isRegistrationOpen && " (Closed)"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team & Organizer Info */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Team & Organizer</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaUsers />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Team Size</p>
                            <p className="text-gray-800 font-medium">{hackathon.minTeamSize} - {hackathon.maxTeamSize} members</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FaBuilding />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Organizer</p>
                            <p className="text-gray-800 font-medium">{hackathon.organizer?.name}</p>
                            {hackathon.organizer?.email && (
                              <a 
                                href={`mailto:${hackathon.organizer.email}`} 
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                              >
                                {hackathon.organizer.email}
                                <FaExternalLinkAlt className="ml-1 text-xs" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Rules & Guidelines</h3>
                  {hackathon.rules ? (
                    <div className="prose max-w-none text-gray-700">
                      <p>{hackathon.rules}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-xl text-center">
                      <p className="text-gray-600">No specific rules have been provided for this hackathon. Contact the organizer for more information.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'prizes' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Prizes & Rewards</h3>
                  {hackathon.prizes ? (
                    <div className="prose max-w-none text-gray-700">
                      <p>{hackathon.prizes}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-xl text-center">
                      <p className="text-gray-600">Prize information hasn't been specified yet. Check back later or contact the organizer.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Registration Section */}
            <div className="border-t border-gray-100 pt-6">
              <div className={`${!isRegistrationOpen && !hasEnded ? 'opacity-50' : ''} text-center`}>
                {hasEnded ? (
                  <div className="bg-gray-100 py-4 px-6 rounded-xl">
                    <h3 className="font-medium text-gray-700 mb-1">This hackathon has ended</h3>
                    <p className="text-gray-500 text-sm">Check out other ongoing and upcoming hackathons</p>
                  </div>
                ) : !isRegistrationOpen ? (
                  <div className="bg-red-50 py-4 px-6 rounded-xl">
                    <h3 className="font-medium text-red-700 mb-1">Registration is closed</h3>
                    <p className="text-red-500 text-sm">The registration deadline has passed</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setRegisterExpanded(!registerExpanded)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition flex items-center mx-auto"
                    >
                      <FaRocket className="mr-2" />
                      Register for this Hackathon
                    </button>
                    
                    {registerExpanded && (
                      <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
                        <button
                          onClick={() => navigate(`/hackathon/${id}/create-team`)}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center"
                        >
                          <FaPlus className="mr-2" />
                          Create a New Team
                        </button>

                        <button
                          onClick={() => navigate(`/hackathon/${id}/view-teams`)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center"
                        >
                          <FaSearch className="mr-2" />
                          Find a Team to Join
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;