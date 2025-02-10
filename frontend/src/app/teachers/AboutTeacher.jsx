import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { fetchTeacherById, fetchTeacherReviewsById } from '../../api/teachersApi';
import RenderStars from '../RenderStars';
import { Calendar3, ArrowLeft } from 'react-bootstrap-icons';
import CustomAlert from '../CustomAlert';

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadTeacher(id);
      loadReviews(id);
    }
  }, [id]);

  const loadTeacher = async (id) => {
    try {
      const response = await fetchTeacherById(id);
      if (response.success === true) {
        setTeacher(response.teacher);
      } else {
        setAlertMessage(response.message);
        setShowAlert(true);
        setAlertVariant('danger');
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      setAlertVariant('danger');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (id) => {
    try {
      const response = await fetchTeacherReviewsById(id);
      if (response.success === true) {
        setReviews(response.reviews);
      } else {
        setAlertMessage(response.message);
        setShowAlert(true);
        setAlertVariant('danger');
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      setAlertVariant('danger');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      {teacher ? (
        <Card className="p-4 shadow-sm">
          <Row className="justify-content-center mb-2">
            <Col xs="auto">
              <Card.Img
                variant="top"
                src={teacher.image || 'https://via.placeholder.com/150'}
                alt="Profile"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid #007bff'
                }}
              />
            </Col>
          </Row>
          <Card.Body className="text-center">
            <Card.Title as="h2">{teacher.name}</Card.Title>
            <Row className="justify-content-center mb-3">
              <Col xs={10} className="text-center bg-light py-2 rounded">
                <strong className="text-primary">{teacher.subject}</strong> &bull; {teacher.price} PLN/H
                <br />
                <strong className="text-danger">{teacher.level}</strong>
              </Col>
            </Row>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center mb-4 gap-2">
                <RenderStars rating={teacher.rating} /> {teacher.rating} / 5.0 ({teacher.ratingCount})
              </div>

            </div>
            <h4 className="text-primary">Dane nauczyciela:</h4>
            <p><strong>Email:</strong> {teacher.email}</p>
            <hr />
            <h4 className="text-primary">Biogram:</h4>
            <p>{teacher.bio}</p>
            <hr />
            <h4 className="text-primary">Opis:</h4>
            <p>{teacher.description}</p>
          </Card.Body>
          <div className="text-center">
            <Button variant="success" className="me-2 p-2 fs-5" onClick={() => navigate(`/bookings/${teacher.id}`)}>
              <Calendar3 size={22} className="me-2" />
              Zarezerwuj lekcję
            </Button>
            <Button variant="outline-primary" className='me-2 p-2 fs-5' onClick={() => navigate(-1)}>
              <ArrowLeft size={22} className="me-2" />
              Powrót
            </Button>
          </div>
        </Card>
      ) : (
        null
      )}
      {reviews.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-center">Opinie uczniów</h2>
          {reviews.map((review, index) => (
            <Card key={index} className="p-3 mt-3 shadow-sm">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{review.createdAt}</Card.Subtitle>
                <Card.Title>{review.username}</Card.Title>
                <Card.Text><RenderStars rating={review.rating} /></Card.Text>
                <Card.Text>{review.comment}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <Alert variant="info">Brak opinii</Alert>
        </div>
      )}
    </Container>
  );
};

export default TeacherProfile;
