import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    idea: "",
  });

  const [leaderId, setLeaderId] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:4000/api/v1/hackathon/${id}`, {
          withCredentials: true,
        });
        setHackathon(res.data.data);
        setLeaderId(res.data.leader.id);
        setLeaderName(res.data.leader.name);
      } catch (err) {
        console.error("Failed to fetch hackathon data", err);
        setError("Failed to load hackathon information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMemberCountChange = (e) => {
    const count = parseInt(e.target.value);
    setMemberCount(count);
    // Preserve existing member data when possible
    setMembers(prevMembers => {
      const newMembers = Array(count).fill().map((_, i) => 
        i < prevMembers.length ? prevMembers[i] : { name: "", email: "" }
      );
      return newMembers;
    });
  };

  const handleMemberInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    const minRequired = hackathon?.minTeamSize || 1;

    if (memberCount < minRequired - 1) {
      return setError(`Your team needs at least ${minRequired - 1} additional member${minRequired - 1 > 1 ? 's' : ''}.`);
    }

    for (let i = 0; i < memberCount; i++) {
      if (!members[i].name || !members[i].email) {
        return setError("All member fields are required.");
      }
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "http://localhost:4000/api/v1/create-team",
        {
          name: formData.name,
          hackathonId: id,
          leaderId,
          idea: formData.idea,
          members,
        },
        {
          withCredentials: true,
        }
      );
      
      const teamId = res.data.team._id;
      setMessage("Team created successfully!");
      setTimeout(() => {
        navigate(`/team-details/${teamId}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creating team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 mt-6 mb-12 bg-white border shadow-lg rounded-xl">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create Your Team</h2>
        <p className="text-gray-600 mt-2">for {hackathon.title}</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
          <input
            id="teamName"
            type="text"
            name="name"
            placeholder="Enter a creative team name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Team Leader</label>
          <div className="flex items-center p-3 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
              <span className="font-medium">{leaderName.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-gray-700">{leaderName} (You)</span>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700">Project Idea</label>
          <textarea
            id="idea"
            name="idea"
            placeholder="Describe your hackathon project idea"
            value={formData.idea}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700">
            Team Size (excluding you)
          </label>
          <div className="flex items-center">
            <input
              id="memberCount"
              type="range"
              value={memberCount}
              onChange={handleMemberCountChange}
              min={hackathon.minTeamSize - 1}
              max={hackathon.maxTeamSize - 1}
              step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-3 w-12 text-center font-medium">{memberCount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Min: {hackathon.minTeamSize - 1}, Max: {hackathon.maxTeamSize - 1}
          </p>
        </div>

        {memberCount > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Team Members</h3>
            
            {members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Member {index + 1}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Pending
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`member-name-${index}`} className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                    <input
                      id={`member-name-${index}`}
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) => handleMemberInputChange(index, "name", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`member-email-${index}`} className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                    <input
                      id={`member-email-${index}`}
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => handleMemberInputChange(index, "email", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-3"></span>
                Creating Team...
              </>
            ) : (
              'Create Team'
            )}
          </button>
          
          {/* <p className="text-xs text-center text-gray-500 mt-4">
            Once created, invitations will be sent to all team members
          </p> */}
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;