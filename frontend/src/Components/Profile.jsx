import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Profile() {
  const [profil, setProfil] = useState(null);
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const address = import.meta.env.VITE_BACKEND_URL;
    axios.get(`${address}/profile`, { headers })
      .then(response => {
        console.log(response.data.user)
        setProfil(response.data.user);
      })
      .catch(error => {
        console.error('Błąd pobierania danych o profilu:', error);
      });
  }, []);

  
  
  
  // Tworzenie siatki przycisków
  const reservated = ['1-16:00', '2-17:00', '3-17:00', '4-17:00', '5-19:00', '6-19:00', '7-16:00'];
  const numbers = [1, 2, 3, 4, 5, 6, 7];
  const hours = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const [selected, setSelected] = useState([]);
  

  const handleButtonClick = (value) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    
    try {
        const address = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.put(`${address}/update_availability`, { selected }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Dodaj nagłówek Authorization z tokenem JWT
            }
        });
        if (response.status === 200) {
            console.log(response)
            location.reload();
        }
        else {
            // Add comunication with user about error
            console.log(response)
        }
    } catch (error) {
        console.error('Błąd zapisu dostępności:', error);
    }
};


  const rows = hours.map((hour, rowIndex) => (
    <div key={rowIndex} className="row g-0">
      <div className="col-2">
        <p className="m-1">{hour}</p>
      </div>
      {Array.from({ length: numbers.length }, (_, colIndex) => {
        const value = `${numbers[colIndex]}-${hour}`;
        const isReserved = reservated.includes(value);
        const isSelected = selected.includes(value);
        return (
          <div key={colIndex} className="col p-1">
            <button
              type="button"
              className={`btn ${isReserved ? 'btn-warning' : isSelected ? 'btn-success' : 'btn-primary'} btn-block h-100 w-100 border`}
              value={value}
              onClick={() => {
                if (!isReserved) {
                  handleButtonClick(value);
                }
              }}
              disabled={isReserved}
            >
              {/* Puste pole - brak tekstu */}
            </button>
          </div>
        );
      })}
    </div>
  ));

  // Dodanie napisów na dole
  const bottomNumbers = (
    <div className="row g-0">
      <div className="col-2"></div>
      {numbers.map((number, index) => (
        <div key={index} className="col p-1">
          <p className="m-0 text-center">{number}</p>
        </div>
      ))}
    </div>
  );


  return (
    <Container>
      <Col md={6} className="mx-auto mt-5">
        <Card>
          <Card.Body>
            <Card.Title className="text-center">Mój Profil</Card.Title>
            <Card.Text>
              {profil ? (
                <>
                  <p>ID: {profil[0]}</p>
                  <p>username: {profil[1]}</p>
                  <p>email: {profil[2]}</p>
                  <p>password: {profil[3]}</p>
                </>
              ) : (
                <p>Ładowanie danych...</p>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} className="mx-auto mt-5">
        <Card>
          <Card.Body>
            <Card.Title className="text-center">Wybierz dostępność</Card.Title>
            {rows}
            {bottomNumbers}
            <Button className="btn btn-primary mt-2" onClick={handleSaveAvailability}>Zapisz dostępność</Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} className="mx-auto mt-5">
        <Card>
          <Card.Body>
            <Card.Title className="text-center">Zostań nauczycielem</Card.Title>
            <Card.Text>
              <p>Jeśli chcesz zostać nauczycielem, kliknij poniższy przycisk:</p>
              <a href="/registerTeacher" className="btn btn-primary">Zarejestruj się jako nauczyciel</a>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

    </Container>
  );
}

export default Profile;
