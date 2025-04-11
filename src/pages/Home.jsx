import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/v1/allhackathons");
        setHackathons(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hackathons", err);
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Get current date for filtering
  const currentDate = new Date();

  const filteredHackathons = hackathons.filter(hackathon => {
    if (filter === "upcoming") {
      return new Date(hackathon.startDate) > currentDate;
    } else if (filter === "ongoing") {
      return new Date(hackathon.startDate) <= currentDate && new Date(hackathon.endDate) >= currentDate;
    } else if (filter === "past") {
      return new Date(hackathon.endDate) < currentDate;
    }
    return true; // "all" filter
  });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pt-8 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Next Hackathon</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover exciting coding competitions, meet talented developers, and launch your next big project with HackMate.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            {["all", "upcoming", "ongoing", "past"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-md transition ${
                  filter === option
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Hackathon Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-blue-600 text-xl">Loading hackathons...</div>
          </div>
        ) : filteredHackathons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hackathons found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredHackathons.map((hackathon) => {
              const isUpcoming = new Date(hackathon.startDate) > currentDate;
              const isOngoing = new Date(hackathon.startDate) <= currentDate && new Date(hackathon.endDate) >= currentDate;
              const isPast = new Date(hackathon.endDate) < currentDate;
              
              let statusColor = "bg-gray-100 text-gray-600";
              let statusText = "";
              
              if (isUpcoming) {
                statusColor = "bg-green-100 text-green-700";
                statusText = "Upcoming";
              } else if (isOngoing) {
                statusColor = "bg-yellow-100 text-yellow-700";
                statusText = "In Progress";
              } else if (isPast) {
                statusColor = "bg-red-100 text-red-700";
                statusText = "Ended";
              }
              
              // Calculate days remaining for registration
              const daysToRegister = Math.ceil((new Date(hackathon.registrationDeadline) - currentDate) / (1000 * 60 * 60 * 24));
              
              return (
                <Link
                  to={`/hackathon/${hackathon._id}`}
                  key={hackathon._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
                >
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{hackathon.title}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 flex-grow">{hackathon.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{hackathon.location} • {hackathon.mode}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="mr-2">🗓️</span>
                        <span>
                          {new Date(hackathon.startDate).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric'
                          })} - {new Date(hackathon.endDate).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {isUpcoming && daysToRegister > 0 && (
                        <div className="flex items-center">
                          <span className="mr-2">⏰</span>
                          <span className="font-medium text-blue-600">
                            {daysToRegister} day{daysToRegister !== 1 ? 's' : ''} left to register
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {hackathon.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {hackathon.tags.length > 4 && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          +{hackathon.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;