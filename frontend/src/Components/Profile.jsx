import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';

function Profile() {
  const [profil, setProfil] = useState(null);
  const [reservated, setReservated] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem('jwtToken');

  const hours = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const numbers = [1, 2, 3, 4, 5, 6, 7];

  // Pobieranie danych o użytkowniku
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

  // Pobieranie danych o dostępności
  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const address = import.meta.env.VITE_BACKEND_URL;
    axios.get(`${address}/availability`, { headers })
      .then(response => {
        console.log(response.data.availability);
        const availabilityData = response.data.availability;
        setReservated(transformAvailabilityData(availabilityData));
      })
      .catch(error => {
        console.error('Błąd pobierania danych o dostępności:', error);
      });
  }, []);

  const transformAvailabilityData = (data) => {
    const reservated = [];
    for (const [day, hours] of Object.entries(data)) {
      hours.forEach(hour => {
        reservated.push(`${day}-${hour}`);
      });
    }
    console.log(reservated);
    return reservated;
  };

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
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log(response);
        location.reload();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Błąd zapisu dostępności:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    setShowModal(false);
    deleteAllAvailability();
  };

  const deleteAllAvailability = async () => {
    try {
      const address = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.delete(`${address}/delete_availability`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log(response);
        location.reload();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Błąd usuwania dostępności:', error);
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
              className={`btn ${isReserved ? 'btn-danger' : isSelected ? 'btn-warning' : 'btn-success'} btn-block h-100 w-100 border`}
              value={value}
              onClick={() => {
                if (!isReserved) {
                  handleButtonClick(value);
                }
              }}
            >
            </button>
          </div>
        );
      })}
    </div>
  ));

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
            <Button className='btn btn-danger mt-2' onClick={handleDeleteClick}>Usuń dostępność</Button>
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Potwierdź Usunięcie</Modal.Title>
              </Modal.Header>
              <Modal.Body>Czy na pewno chcesz usunąć twoją całą dostępność?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Anuluj
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Usuń
                </Button>
              </Modal.Footer>
            </Modal>
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
