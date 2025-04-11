import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeamDetails = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:4000/api/v1/team/${teamId}`, {
          withCredentials: true,
        });
        setTeam(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch team", err);
        setError("Failed to load team details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 shadow rounded-xl border bg-red-50">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700">Error Loading Team</h2>
        </div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!team) return null;

  // Separate leader from members
  const leader = team.members[0];
  const otherMembers = team.members.slice(1);

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white overflow-hidden shadow-lg rounded-xl border">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active Team
          </span>
        </div>
        <p className="mt-2 text-gray-500">Team ID: {teamId}</p>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Project idea */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Project Idea
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            {team.idea ? (
              <p className="text-gray-700">{team.idea}</p>
            ) : (
              <p className="text-gray-500 italic">No project idea has been defined yet.</p>
            )}
          </div>
        </div>

        {/* Team composition */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Team Members ({team.members.length})
          </h2>

          {/* Team leader */}
          <div className="mb-4">
            <div className="flex items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {leader.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-800">{leader.name}</h3>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Team Leader</span>
                </div>
                <p className="text-gray-600">{leader.email}</p>
              </div>
            </div>
          </div>

          {/* Other team members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherMembers.map((member, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Management</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Members
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Members
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Team
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;