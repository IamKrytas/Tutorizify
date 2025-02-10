import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { fetchMyTeacherBookings, cancelMyTeacherBooking } from '../../api/teachersApi';
import CustomDialog from '../CustomDialog';
import CustomAlert from '../CustomAlert';

const BookingsManage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetchMyTeacherBookings();
      if (response.success === true) {
        setBookings(response.bookings);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setIsDialogVisible(true);
  };

  const confirmCancelBooking = async () => {
    try {
      const response = await cancelMyTeacherBooking(selectedBooking.id);
      if (response.success === true) {
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
        fetchBookings();
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  return (
    <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row>
        <Col>
          <h1 className="text-center mb-4">Rezerwacje uczniów na twoje zajęcia</h1>

          {bookings.length === 0 ? (
            <p className="text-center text-muted">Brak rezerwacji</p>
          ) : (
            bookings.map((item) => {
              const canCancel = new Date(item.date) > new Date();
              return (
                <Card key={item.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>Użytkownik: {item.user_name}</Card.Title>
                    <Card.Text>
                      <strong>Przedmiot:</strong> {item.subject}
                      <br />
                      <strong>Poziom:</strong> {item.level}
                      <br />
                      <strong>Cena:</strong> {item.price * item.duration / 60} PLN
                      <br />
                      <strong>Data:</strong> {item.date}
                      <br />
                      <strong>Godziny:</strong> {item.start_time} - {item.end_time}
                    </Card.Text>

                    {canCancel ? (
                      <Button variant="danger" onClick={() => handleCancelBooking(item)}>
                        Anuluj
                      </Button>
                    ) : (
                      null
                    )}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
      <CustomDialog
        show={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        title="Anulowanie rezerwacji"
        description="Czy na pewno chcesz anulować rezerwację?"
        onConfirm={() => {
          confirmCancelBooking();
          setIsDialogVisible(false);
        }}
        confirmLabel="Potwierdź"
        cancelLabel="Anuluj"
      />
    </Container>
  );
};

export default BookingsManage;
