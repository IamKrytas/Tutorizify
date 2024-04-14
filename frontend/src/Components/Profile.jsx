import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Profile() {
  const [profil, setProfil] = useState(null);
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    axios.get('http://localhost:5000/profile', { headers })
      .then(response => {
        console.log(response.data.user)
        setProfil(response.data.user);
      })
      .catch(error => {
        console.error('Błąd pobierania danych o profilu:', error);
      });
  }, []);

  return (
    <Container>
      <Row>
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
      </Row>
    </Container>
  );
}

export default Profile;
