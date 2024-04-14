import React from 'react';
import Navigation from "./Components/Navigation";
import MainContent from "./Components/MainContent";
import Logowanie from "./Components/Logowanie";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Rejestracja from "./Components/Rejestracja";
import Profile from "./Components/Profile";
import Wyloguj from "./Components/Wyloguj";
import Teachers from "./Components/Teachers";

function App() {
  //rcfe
  if (sessionStorage.getItem("jwtToken")) {
    return (
      <>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/wyloguj"element={<Wyloguj />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </>
    )
  }
  else {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/logowanie" element={<Logowanie />} />
            <Route path="/rejestracja" element={<Rejestracja />} />
            <Route path="*" element={<Navigate to="/logowanie" />} />
          </Routes>
        </Router>
      </>
    );
  }
};

export default App;