import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navigation from './components/Navigation';
import TeacherProfile from './views/TeacherProfile';
import AdminBookings from './views/AdminBookings';
import AdminRates from './views/AdminRates';
import AdminUsers from './views/AdminUsers';
import AdminTeachers from './views/AdminTeachers';
import AdminSubjects from './views/AdminSubjects';
import Home from './views/Home';
import Login from './views/Login';
import ManageBookings from './views/ManageBookings';
import Profile from './views/Profile';
import RateTeacher from './views/RateTeacher';
import Register from './views/Register';
import RegisterBookings from './views/RegisterBookings';
import RegisterTeacher from './views/RegisterTeacher';
import Reservation from './views/Reservation';
import Search from './views/Search';
import Start from './views/Start';

function App() {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
        switch (localStorage.getItem("role")) {
            case "1":
                return (
                    <>
                        <ToastContainer />
                        <Router>
                            <Navigation />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/reservations" element={<Reservation />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/teachers/:id" element={<TeacherProfile />} />
                                <Route path="/bookings/:id" element={<RegisterBookings />} />
                                <Route path="/bookings/manage" element={<ManageBookings />} />
                                <Route path="/teachers/rates/:id" element={<RateTeacher />} />
                                <Route path="/teachers/register" element={<RegisterTeacher />} />
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
                        <ToastContainer />
                        <Router>
                            <Navigation />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="reservations" element={<Reservation />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/teachers/:id" element={<TeacherProfile />} />
                                <Route path="/bookings/:id" element={<RegisterBookings />} />
                                <Route path="/bookings/manage" element={<ManageBookings />} />
                                <Route path="/teachers/rates/:id" element={<RateTeacher />} />
                                <Route path="/teachers/register" element={<RegisterTeacher />} />
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
                <ToastContainer />
                <Router>
                    <Routes>
                        <Route path="/" element={<Start />} />
                        <Route path="/logowanie" element={<Login />} />
                        <Route path="/rejestracja" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </>
        );
    }
};

export default App;