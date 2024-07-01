import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill } from 'react-bootstrap-icons';

function AboutTeacher() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherId = searchParams.get('teacher');
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const address = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${address}/about/${teacherId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        setTeacher(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teacher data');
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="warning">Teacher not found</Alert>
      </Container>
    );
  }

  const updateFavourite = async () => {
    try {
      const newFavouriteStatus = !teacher.favourite;  // Toggle the favourite status
      setTeacher({ ...teacher, favourite: newFavouriteStatus });

      const token = sessionStorage.getItem("jwtToken");
      const address = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.put(`${address}/favourite/${teacherId}`, { favourite: newFavouriteStatus }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setFavorites(response.data.message);
      } else {
        setError("Błąd serwera");
      }
    } catch (err) {
      setError("Failed to update favourite status");
    }
  };

  return (
    <Container className="my-5">
      {favorites ? <Alert variant="secondary">{favorites}</Alert> : null}
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/300" width="200" height="200" alt={`${teacher.name}'s profile`} />
            <div className="position-absolute top-0 end-0 mt-2 me-2">
              <Button variant='link' onClick={updateFavourite}>
                {teacher.favourite ? <HeartFill style={{ fontSize: '2.5rem', color: 'red' }} /> : <Heart style={{ fontSize: '2.5rem', color: 'red' }} />}
              </Button>
            </div>
            <Card.Body>
              <Card.Title>{teacher.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{teacher.subject} | {teacher.price}zł</Card.Subtitle>
              <Card.Text>
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < teacher.rating ? <StarFill /> : <Star />}
                  </span>
                ))}
              </Card.Text>

              <Card.Text>{teacher.bio}</Card.Text>
              <Card.Text>{teacher.description}</Card.Text>
              <Card.Text>Email: <a href={`mailto:${teacher.email}`}>{teacher.email}</a></Card.Text>
              <Button variant="primary" className="mt-3" href="/teachers">Back to Teachers List</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutTeacher;
