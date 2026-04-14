import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import "./App.css";
import AppointmentList from "./components/AppointmentList";
import ConsultationRoom from "./components/ConsultationRoom";
import CreateAppointment from "./components/CreateAppointment";

// 👇 OPTIONAL (only if you created them)
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <header className="app-header">
            <div>
              <p className="eyebrow">DSY3S1 Telemedicine Platform</p>
              <h1>Video consultations with appointment-based Jitsi rooms</h1>
              <p className="app-subtitle">
                Create a video appointment, then join the consultation as the
                patient or the doctor from the appointment list.
              </p>
            </div>

            <nav className="main-nav">
              <Link to="/">Appointments</Link>
              <Link to="/appointments/new">Create Appointment</Link>

              {/* 👇 optional auth links */}
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </nav>
          </header>

          <main className="page-content">
            <Routes>
              {/* EXISTING ROUTES (UNCHANGED) */}
              <Route path="/" element={<AppointmentList />} />
              <Route path="/appointments/new" element={<CreateAppointment />} />
              <Route
                path="/consultation/:appointmentId"
                element={<ConsultationRoom />}
              />

              {/* NEW AUTH ROUTES (SAFE ADDITION) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;