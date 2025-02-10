import React from 'react';
import Navbar from "./app/Navbar";
import Home from "./app/Home";
import Logowanie from "./app/Logowanie";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Rejestracja from "./app/Rejestracja";
import Profile from "./app/Profile";
import Wyloguj from "./app/Wyloguj";
import Search from "./app/Search";
import Reservation from "./app/Reservation";
import AboutTeacher from "./app/teachers/AboutTeacher";
import RegisterTeacher from "./app/teachers/RegisterTeacher";
import RegisterBookings from "./app/bookings/RegisterBookings";
import ManageBookings from "./app/bookings/ManageBookings";
import RateTeacher from "./app/teachers/rates/RateTeacher";
import Start from "./app/Start";
import AdminBookings from "./app/admin/AdminBookings";
import AdminRates from "./app/admin/AdminRates";
import AdminSubjects from "./app/admin/AdminSubjects";
import AdminTeachers from "./app/admin/AdminTeachers";
import AdminUsers from "./app/admin/AdminUsers";


function App() {
  if (sessionStorage.getItem("token")) {
    switch (sessionStorage.getItem("role")) {
      case "1":
        return (
          <>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/reservations" element={<Reservation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/teachers/:id" element={<AboutTeacher />} />
                <Route path="/bookings/:id" element={<RegisterBookings />} />
                <Route path="/bookings/manage" element={<ManageBookings />} />
                <Route path="/teachers/rates/:id" element={<RateTeacher />} />
                <Route path="/teachers/register" element={<RegisterTeacher />} />
                <Route path="/wyloguj" element={<Wyloguj />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/rates" element={<AdminRates />} />
                <Route path="/admin/subjects" element={<AdminSubjects />} />
                <Route path="/admin/teachers" element={<AdminTeachers />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </>
        );
      default:
        return (
          <>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="reservations" element={<Reservation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/teachers/:id" element={<AboutTeacher />} />
                <Route path="/bookings/:id" element={<RegisterBookings />} />
                <Route path="/bookings/manage" element={<ManageBookings />} />
                <Route path="/teachers/rates/:id" element={<RateTeacher />} />
                <Route path="/teachers/register" element={<RegisterTeacher />} />
                <Route path="/wyloguj" element={<Wyloguj />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </>
        );
    }
  }
  else {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/logowanie" element={<Logowanie />} />
            <Route path="/rejestracja" element={<Rejestracja />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </>
    );
  }
};

export default App;