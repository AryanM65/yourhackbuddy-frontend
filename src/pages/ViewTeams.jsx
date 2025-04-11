import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewTeams = () => {
  const { hackathonId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/teams/hackathon/${hackathonId}`, {
          withCredentials: true,
        });
        setTeams(res.data.teams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [hackathonId]);

  if (loading) return <p className="text-center mt-10">Loading teams...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">Teams for Hackathon</h2>
      {teams.length === 0 ? (
        <p>No teams created yet.</p>
      ) : (
        teams.map((team) => (
          <div key={team._id} className="border p-4 rounded mb-4 shadow">
            <h3 className="text-xl font-semibold">{team.name}</h3>
            <p><strong>Idea:</strong> {team.idea}</p>
            <p><strong>Leader:</strong> {team.leader?.name} ({team.leader?.username})</p>
            <div>
              <strong>Members:</strong>
              <ul className="list-disc ml-5">
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.name} ({member.username})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewTeams;
