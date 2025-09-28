import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getMyTeacherBookingsController, deleteMyTeacherBookingByIdController } from '../controllers/bookingController';
import CustomDialog from '../components/CustomDialog';
import { toast } from 'react-toastify';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    useEffect(() => {
        handleFetchBookings();
    }, []);

    const handleFetchBookings = async () => {
        try {
            const response = await getMyTeacherBookingsController();
            setBookings(response.bookings);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas pobierania rezerwacji');
        }
    };

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setIsDialogVisible(true);
    };

    const confirmCancelBooking = async () => {
        try {
            const response = await deleteMyTeacherBookingByIdController(selectedBooking.id);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Rezerwacja została pomyślnie anulowana');
            isDialogVisible(false);
            fetchBookings();
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas anulowania rezerwacji');
        } finally {
            setShowModal(false);
            setSelectedBooking(null);
        }
    };

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
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

export default ManageBookings;