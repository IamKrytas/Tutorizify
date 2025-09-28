import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { getAllBookingsController } from '../controllers/bookingController';
import { toast } from 'react-toastify';

const AdminManageBookingsScreen = () => {
    const [futureBookings, setFutureBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Funkcja pobierająca rezerwacje
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await getAllBookingsController();
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
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania rezerwacji');
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
                    <Card.Text className="text-muted mb-1">Cena: {(booking.price * booking.duration / 60).toFixed(2).replace('.', ',')} zł</Card.Text>
                    <Card.Text className="text-primary">
                        {booking.date} | {booking.start_time} - {booking.end_time}
                    </Card.Text>

                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="my-4">
            <Row className="text-center mb-4">
                <Col>
                    <h3>Zarządzaj rezerwacjami</h3>
                    <p className="text-muted">Tutaj możesz przeglądać rezerwacje wszystkich użytkowników</p>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" variant="primary" />
                </div>
            ) : (
                <div>
                    {/* Przyszłe rezerwacje */}
                    <Row className="mb-4">
                        <Col>
                            <h3 className="text-center mb-3">Przyszłe rezerwacje</h3>
                            {futureBookings.length > 0 ? (
                                futureBookings.map((booking) => renderBookingCard(booking))
                            ) : (
                                <Alert variant="info" className="text-center">
                                    Brak przyszłych rezerwacji
                                </Alert>
                            )}
                        </Col>
                    </Row>

                    {/* Historyczne rezerwacje */}
                    <Row>
                        <Col>
                            <h3 className="text-center mb-3">Historyczne rezerwacje</h3>
                            {pastBookings.length > 0 ? (
                                pastBookings.map((booking) => renderBookingCard(booking))
                            ) : (
                                <Alert variant="info" className="text-center">
                                    Brak historycznych rezerwacji
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </div>
            )}

        </Container>
    );
};

export default AdminManageBookingsScreen;