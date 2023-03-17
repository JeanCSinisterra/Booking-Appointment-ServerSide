import React from "react";
import "antd/dist/reset.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Homepage from "./pages/Homepage.tsx";
import ApplyDoctor from "./pages/ApplyDoctor.jsx";
import PublicRoute from "./components/PublicRoute.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useSelector } from "react-redux";
import Notifications from "./pages/Notifications.jsx";
import DoctorList from "./pages/Admin/DoctorsList.jsx";
import Userlist from "./pages/Admin/Userlist.jsx";
import Profile from "./pages/Doctor/Profile.jsx";
import BookAppointment from "./pages/Bookings/BookAppointment.jsx";
import Appointments from "./pages/Bookings/Appointments.jsx";


function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <div className="App">
      <BrowserRouter>
        {loading && (
          <div className="spinner-parent">
            <div className="spinner-border" role="status">
            </div>
          </div>
        )}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>} />
          <Route path="/apply-doctor"
            element={
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>} />
          <Route path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>} />
          <Route path="/admin/doctorslist"
            element={
              <ProtectedRoute>
                <DoctorList />
              </ProtectedRoute>} />
          <Route path="/admin/users"
            element={
              <ProtectedRoute>
                <Userlist/>
              </ProtectedRoute>} />
          <Route 
            path="/doctor/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>} />
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
