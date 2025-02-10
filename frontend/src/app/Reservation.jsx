import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { fetchUserBookings, cancelBooking } from '../api/booking';
import { useNavigate } from 'react-router-dom';
import CustomDialog from './CustomDialog';
import CustomAlert from './CustomAlert';

const ManageBookingsScreen = () => {
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [role, setRole] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();

  // Pobierz rolę użytkownika
  const fetchRole = async () => {
    try {
      const role = sessionStorage.getItem('role');
      setRole(role);
    } catch (error) {
      setAlertMessage('Wystąpił błąd podczas pobierania danych');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRole();
  }, []);

  // Pobierz rezerwacje użytkownika
  const fetchBookings = async () => {
    try {
      setIsRefreshing(true);

      const response = await fetchUserBookings();
      if (response.success === true) {
        const now = moment();

        const upcoming = response.bookings
          .filter((booking) => moment(`${booking.date} ${booking.start_time}`).isAfter(now))
          .sort((a, b) => moment(`${a.date} ${a.start_time}`).diff(moment(`${b.date} ${b.start_time}`)));

        const past = response.bookings
          .filter((booking) => moment(`${booking.date} ${booking.start_time}`).isBefore(now))
          .sort((a, b) => moment(`${b.date} ${b.start_time}`).diff(moment(`${a.date} ${a.start_time}`)));

        setFutureBookings(upcoming);
        setPastBookings(past);
      } else {
        setAlertMessage(response.message || 'Nie udało się pobrać rezerwacji.');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił błąd podczas pobierania rezerwacji.');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sprawdź, czy można anulować rezerwację
  const canCancelBooking = (bookingDateTime) => {
    const bookingMoment = moment(bookingDateTime);
    return bookingMoment.diff(moment(), 'hours') >= 24;
  };

  // Potwierdzenie anulowania rezerwacji
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await cancelBooking(selectedBooking.id);

      if (response.success === true) {
        setAlertMessage('Rezerwacja została anulowana.');
        setAlertVariant('success');
        setShowAlert(true);
        fetchBookings(); // Odśwież rezerwacje
      } else {
        setAlertMessage(response.message || 'Nie udało się anulować rezerwacji.');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage('Wystąpił błąd podczas anulowania rezerwacji.');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setShowAlert(true);
      setIsDialogVisible(false);
      setSelectedBooking(null);
    }
  };

  // Wyświetl dialog potwierdzenia
  const showConfirmationDialog = (booking) => {
    if (!canCancelBooking(`${booking.date} ${booking.start_time}`)) {
      setAlertMessage('Rezerwacje można anulować tylko do 24 godzin przed terminem rozpoczęcia.');
      setAlertVariant('warning');
      setShowAlert(true);
      return;
    }

    setSelectedBooking(booking);
    setIsDialogVisible(true);
  };

  return (
    <Container className="mt-4 text-center">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />

      <Row className="text-center mb-4">
        <Col>
          <h3>Zarządzaj swoimi rezerwacjami</h3>
          <p className="text-muted">Tutaj możesz zarządzać swoimi rezerwacjami i oceniać nauczycieli</p>
        </Col>
      </Row>

      {role === '2' || role === '1' ? (
        <Row className="mb-3">
          <Col>
            <Button variant="primary" onClick={() => navigate('/bookings/manage')}>
              Zarządzaj rezerwacjami do mnie
            </Button>
          </Col>
        </Row>
      ) : null}

      <Row>
        <Col>
          <h2>Przyszłe rezerwacje</h2>
          {isRefreshing ? (
            <Spinner animation="border" />
          ) : futureBookings.length > 0 ? (
            futureBookings.map((item) => (
              <Card key={item.id} className="mb-2">
                <Card.Body>
                  <Card.Title>{item.subject} | {item.level}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Nauczyciel: {item.teacher_name}</Card.Subtitle>
                  <Card.Text>
                    <div>{item.date} | {item.start_time} - {item.end_time}</div>
                    <div>Cena: {item.price * item.duration / 60} PLN</div>
                  </Card.Text>
                  <Button
                    variant={canCancelBooking(`${item.date} ${item.start_time}`) ? 'danger' : 'secondary'}
                    onClick={() => showConfirmationDialog(item)}
                    disabled={!canCancelBooking(`${item.date} ${item.start_time}`)}
                  >
                    Anuluj
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">Brak przyszłych rezerwacji</Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Historyczne rezerwacje</h2>
          {pastBookings.length > 0 ? (
            pastBookings.map((item) => (
              <Card key={item.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{item.subject} | {item.level}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Nauczyciel: {item.teacher_name}</Card.Subtitle>
                  <Card.Text>
                  <div>{item.date} | {item.start_time} - {item.end_time}</div>
                  <div>Cena: {item.price * item.duration / 60} PLN</div>
                  </Card.Text>
                  {item.has_rated ? (
                    <Button variant="success" disabled>
                      Oceniono
                    </Button>
                  ) : (
                    <Button variant="warning" onClick={() => navigate(`/teachers/rates/${item.teacher_id}`)}>
                      Oceń
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">Brak historycznych rezerwacji</Alert>
          )}
        </Col>
      </Row>

      <CustomDialog
        show={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        title="Potwierdź anulowanie rezerwacji"
        description="Czy na pewno chcesz anulować rezerwację?"
        onConfirm={handleCancelBooking}
        confirmLabel="Anuluj rezerwację"
        cancelLabel="Zamknij"
      />
    </Container>
  );
};

export default ManageBookingsScreen;
