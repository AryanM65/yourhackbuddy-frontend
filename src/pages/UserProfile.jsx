import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaEdit, FaUser, FaMapMarkerAlt, FaGraduationCap, FaEnvelope } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/v1/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-5xl text-gray-400 mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't load your profile information</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Generate gradient background for avatar based on name
  const getNameInitials = () => {
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Calculated stats
  const hackathonCount = user.hackathonsParticipated?.length || 0;
  const skillCount = user.skills?.length || 0;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="px-6 py-8 md:px-10 md:py-8 md:flex relative">
            {/* Avatar */}
            <div className="absolute -top-12 left-10 md:relative md:top-0 md:left-0 md:mr-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-lg">
                {getNameInitials()}
              </div>
            </div>

            {/* Name and Username */}
            <div className="mt-12 md:mt-0 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                <button
                  className="mt-4 md:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  onClick={() => navigate("/edit-profile")}
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Personal Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
                
                {user.institute && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <FaGraduationCap />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Institute</p>
                      <p className="text-gray-800">{user.institute}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(user.linkedin || user.github) && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Connect</h3>
                  <div className="flex gap-4">
                    {user.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white text-xl transition"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    {user.github && (
                      <a
                        href={user.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-black flex items-center justify-center text-white text-xl transition"
                      >
                        <FaGithub />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{hackathonCount}</div>
                  <div className="text-sm text-gray-600">Hackathons</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">{skillCount}</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio */}
            {user.bio && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📝</span> About Me
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💪</span> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hackathons */}
            {user.hackathonsParticipated?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🚀</span> Hackathon History
                </h2>
                <div className="space-y-4">
                  {user.hackathonsParticipated.map((hackathon, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-4 transition cursor-pointer"
                      onClick={() => hackathon._id && navigate(`/hackathon/${hackathon._id}`)}
                    >
                      <h3 className="font-medium text-gray-900">{hackathon.title || `Hackathon ${idx + 1}`}</h3>
                      {hackathon.date && <p className="text-sm text-gray-500">{hackathon.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;