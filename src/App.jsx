import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Hackathon from "./components/Hackathon";
import CreateTeam from "./pages/CreateTeam";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import TeamDetails from './pages/TeamDetails';
import ViewTeams from './pages/ViewTeams'; // ✅ Import your ViewTeams component
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";

// Layout Component
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Routes with Navbar and Footer */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/hackathon/:id" element={<Hackathon />} />
          <Route path="/hackathon/:id/create-team" element={<CreateTeam />} />
          <Route path="/hackathon/:id/view-teams" element={<ViewTeams />} /> {/* ✅ New route added */}
          <Route path="/team-details/:teamId" element={<TeamDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path = '/edit-profile' element = {<EditProfile />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
