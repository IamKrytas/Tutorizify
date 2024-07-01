import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';

function AboutTeacher() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherId = searchParams.get('teacher');
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const address = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${address}/about/${teacherId}`);
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

  const handleAddToFavorites = () => {
    if (teacher.favourite == "true") {
      setTeacher({ ...teacher, favourite: "false" });
    } else {
      setTeacher({ ...teacher, favourite: "true" });
    }

    const address = import.meta.env.VITE_BACKEND_URL;
    axios.put(`${address}/favourite/${teacherId}`, { favourite: teacher.favourite });
    

  };

  

  return (
    <Container className="my-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/300" width="200" height="200" wid alt={`${teacher.name}'s profile`}/>
            <div className="position-absolute top-0 end-0 mt-2 me-2">
            <Button variant='link' onClick={handleAddToFavorites}>
                  {teacher.favourite == "true" ? <HeartFill style={{ fontSize: '2.5rem', color: 'red' }} /> : <Heart style={{ fontSize: '2.5rem', color: 'red' }} />}
              </Button>
                </div>
            <Card.Body>
              <Card.Title>{teacher.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{teacher.subject} | {teacher.price}zł</Card.Subtitle>
              
              <Card.Text>bio: {teacher.bio}</Card.Text>
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
