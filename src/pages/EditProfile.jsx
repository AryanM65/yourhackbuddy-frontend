import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setFormData({
          bio: res.data.user.bio || "",
          skills: res.data.user.skills?.join(", ") || "",
          linkedin: res.data.user.linkedin || "",
          github: res.data.user.github || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      await axios.put("http://localhost:4000/api/v1/profile/edit", updatedData, {
        withCredentials: true,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">✏️ Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Read-only fields */}
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold">Institute</label>
          <input
            type="text"
            value={user.institute}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block font-semibold">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">GitHub</label>
          <input
            type="text"
            name="github"
            value={formData.github}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
