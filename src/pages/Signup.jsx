import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    institute: "",
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/v1/signup", form);
      setAlert({ type: "success", message: "User registered successfully!" });
      setForm({ name: "", username: "", email: "", password: "", institute: "" });

      setTimeout(() => {
        setAlert(null);
        navigate("/login");
      }, 1500);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Signup failed" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>

        {alert && (
          <div
            className={`text-sm text-center p-2 rounded ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {alert.message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="institute" className="block text-gray-700 font-medium mb-1">
            Institute <span className="text-red-500">*</span>
          </label>
          <input
            id="institute"
            type="text"
            value={form.institute}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          Register
        </button>
      </form>
    </div>
  );
}
