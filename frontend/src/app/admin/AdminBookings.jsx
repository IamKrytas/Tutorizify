import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { fetchAllBookings } from '../../api/booking';
import CustomAlert from '../CustomAlert';

const AdminManageBookingsScreen = () => {
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  useEffect(() => {
    fetchBookings();
  }, []);

  // Funkcja pobierająca rezerwacje
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBookings();
      if (response.success === true) {
        const now = moment();

        // Podział i sortowanie rezerwacji według daty
        const upcoming = response.bookings
          .filter((booking) =>
            moment(`${booking.date} ${booking.start_time}`).isAfter(now)
          )
          .sort((a, b) =>
            moment(`${a.date} ${a.start_time}`).diff(moment(`${b.date} ${b.start_time}`))
          );

        const past = response.bookings
          .filter((booking) =>
            moment(`${booking.date} ${booking.start_time}`).isBefore(now)
          )
          .sort((a, b) =>
            moment(`${b.date} ${b.start_time}`).diff(moment(`${a.date} ${a.start_time}`))
          );

        setFutureBookings(upcoming);
        setPastBookings(past);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingCard = (booking) => (
    <Card className="mb-3 shadow-sm" key={booking.id}>
      <Card.Body className="text-center">
        <div>
          <Card.Title>{booking.subject} | {booking.level}</Card.Title>
          <Card.Text className="text-muted mb-1">Rezerwujący: {booking.user_name}</Card.Text>
          <Card.Text className="text-muted mb-1">Nauczyciel: {booking.teacher_name}</Card.Text>
          <Card.Text className="text-primary">
            {booking.date} | {booking.start_time} - {booking.end_time}
          </Card.Text>
          <Card.Text className="text-muted">Cena: {booking.price * booking.duration / 60} PLN</Card.Text>

        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="my-4">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="text-center mb-4">
        <Col>
          <h3>Zarządzaj rezerwacjami</h3>
          <p className="text-muted">Tutaj możesz zarządzać rezerwacjami użytkowników</p>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      ) : (
        <div>
          <Row>
            <Col className="text-center">
              <h3>Przyszłe rezerwacje</h3>
              {futureBookings.length > 0 ? (
                futureBookings.map((booking) => renderBookingCard(booking))
              ) : (
                <Alert variant="info">Brak przyszłych rezerwacji</Alert>
              )}
            </Col>
          </Row>

          <Row className="mt-4">
          <Col className="text-center">
              <h3>Historyczne rezerwacje</h3>
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => renderBookingCard(booking))
              ) : (
                <Alert variant="info">Brak historycznych rezerwacji</Alert>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default AdminManageBookingsScreen;
