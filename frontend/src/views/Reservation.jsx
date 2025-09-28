import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { getMyBookingsController, deleteBookingByIdController } from '../controllers/bookingController';
import { useNavigate } from 'react-router-dom';
import CustomDialog from '../components/CustomDialog';
import { Check, FileText, ListUl, XCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const Reservation = () => {
    const [futureBookings, setFutureBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [role, setRole] = useState(null);

    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);


    const navigate = useNavigate();

    // Pobierz rolę użytkownika
    const fetchRole = async () => {
        try {
            const role = localStorage.getItem('role');
            setRole(role);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas pobierania roli użytkownika');
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

            const response = await getMyBookingsController();
            const now = moment();

            const upcoming = response.bookings
                .filter((booking) => moment(`${booking.date} ${booking.start_time}`).isAfter(now))
                .sort((a, b) => moment(`${a.date} ${a.start_time}`).diff(moment(`${b.date} ${b.start_time}`)));

            const past = response.bookings
                .filter((booking) => moment(`${booking.date} ${booking.start_time}`).isBefore(now))
                .sort((a, b) => moment(`${b.date} ${b.start_time}`).diff(moment(`${a.date} ${a.start_time}`)));

            setFutureBookings(upcoming);
            setPastBookings(past);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas pobierania rezerwacji');
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
            const response = await deleteBookingByIdController(selectedBooking.id);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Rezerwacja anulowana pomyślnie');
            setIsDialogVisible(false);
            fetchBookings();
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas anulowania rezerwacji');
        }
    };

    // Wyświetl dialog potwierdzenia
    const showConfirmationDialog = (booking) => {
        if (!canCancelBooking(`${booking.date} ${booking.start_time}`)) {
            toast.error('Rezerwacje można anulować tylko do 24 godzin przed terminem rozpoczęcia.');
            return;
        }

        setSelectedBooking(booking);
        setIsDialogVisible(true);
    };

    return (
        <Container className="mt-4 text-center">
            <Row className="text-center mb-4">
                <Col>
                    <h3>Zarządzaj swoimi rezerwacjami</h3>
                    <p className="text-muted">Tutaj możesz zarządzać swoimi rezerwacjami i oceniać nauczycieli</p>
                </Col>
            </Row>

            {role === '2' || role === '1' ? (
                <Row className="mb-3">
                    <Col>
                        <Button variant="outline-primary" onClick={() => navigate('/bookings/manage')}>
                            <ListUl size={22} className="me-2" />
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
                                        <div>Cena: {(item.price * item.duration / 60).toFixed(2).replace('.', ',')} PLN</div>
                                    </Card.Text>
                                    <Button
                                        variant={canCancelBooking(`${item.date} ${item.start_time}`) ? 'outline-danger' : 'outline-secondary'}
                                        onClick={() => showConfirmationDialog(item)}
                                        disabled={!canCancelBooking(`${item.date} ${item.start_time}`)}
                                    >
                                    <XCircle size={22} className="me-2" />
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
                                        <div>Cena: {(item.price * item.duration / 60).toFixed(2).replace('.', ',')} PLN</div>
                                    </Card.Text>
                                    {item.has_rated ? (
                                        <Button variant="success" disabled>
                                            <Check size={22} className="me-2" />
                                            Oceniono
                                        </Button>
                                    ) : (
                                        <Button variant="outline-warning" onClick={() => navigate(`/teachers/rates/${item.teacher_id}`)}>
                                            <FileText size={22} className="me-2" />
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

export default Reservation;