// components/AutoRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AutoRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null; // No UI, just redirecting
};

export default AutoRedirect;
