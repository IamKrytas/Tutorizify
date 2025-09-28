import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { addBookingController } from '../controllers/bookingController';
import CustomDialog from "../components/CustomDialog";
import { Calendar3, ArrowLeft, Envelope } from 'react-bootstrap-icons';
import { getAboutByIdController } from '../controllers/teacherController';
import { toast } from 'react-toastify';
import RenderStars from '../components/RenderStars';

const RegisterBookings = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const [teacher, setTeacher] = useState(null);

    const availableDurations = ['30', '60', '90'];
    const availableTimes = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

    const bookingData = {
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
        teacherId: id
    };

    useEffect(() => {
        if (id) {
            loadTeacher(id);
        }
    }, [id]);

    const loadTeacher = async (id) => {
        try {
            const response = await getAboutByIdController(id);
            setTeacher(response.teacher);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania danych nauczyciela');
        } finally {
            setLoading(false);
        }
    };

    const showError = (message) => {
        window.scrollTo(0, 0);
        toast.error(message);
    };

    const validateBooking = () => {
        if (!selectedDate || !selectedTime || !selectedDuration) {
            showError("Wypełnij wszystkie pola");
            return false;
        }

        const selectedDateTime = moment(`${selectedDate} ${selectedTime}`, "YYYY-MM-DD HH:mm");
        const currentDateTime = moment();

        if (selectedDateTime.isBefore(currentDateTime)) {
            showError("Nie można zarezerwować terminu na dzień, który już minął");
            return false;
        }

        if (selectedDateTime.diff(currentDateTime, 'hours') < 24) {
            showError("Nie można zarezerwować na mniej niż 24 godziny przed rozpoczęciem");
            return false;
        }

        return true;
    };

    const showDialog = useCallback((e) => {
        e.preventDefault();
        if (validateBooking()) {
            setIsConfirmDialogVisible(true);
        }
    }, [selectedDate, selectedTime, selectedDuration]);

    const handleConfirm = useCallback(async () => {
        setIsConfirmDialogVisible(false);
        try {
            const response = await addBookingController(bookingData);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Rezerwacja została pomyślnie dodana');
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            showError(error.message || 'Błąd podczas dodawania rezerwacji');
        }
    }, [bookingData, navigate]);


    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    {/* Karta z danymi nauczyciela */}
                    {teacher ? (
                        <Card className="shadow-sm mb-4">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                {/* Dane nauczyciela */}
                                <div className="text-start">
                                    <h4 className="fw-bold mb-2">{teacher.name}</h4>
                                    <RenderStars rating={teacher.rating} /> <span className="ms-2">{teacher.rating} / 5.0 ({teacher.ratingCount})</span>

                                    <div className="mb-1">
                                        <span className="text-primary fw-bold">{teacher.subject}</span>
                                        <span className="mx-2">•</span>
                                        <span>{teacher.price} PLN/h</span>
                                    </div>

                                    <div className="text-danger fw-bold mb-2">{teacher.level}</div>

                                    <div>
                                        <Envelope size={18} className="me-2 text-secondary" />
                                        <a
                                            href={`mailto:${teacher.email}`}
                                            className="text-decoration-none text-dark fw-bold"
                                        >
                                            {teacher.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <Card.Img
                                    src={teacher.image || 'https://via.placeholder.com/60'}
                                    alt="Avatar"
                                    className="rounded-circle"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        border: '2px solid #007bff'
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    ) : (
                        null
                    )}

                    {/* Formularz rezerwacji */}
                    <Card className="p-3 mt-3 shadow-md">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4 fw-bold">
                                <Calendar3 size={28} className="me-2 text-success" />
                                Rezerwacja Zajęć
                            </h2>

                            <Form onSubmit={showDialog}>
                                <Form.Group controlId="formDate" className="mb-3">
                                    <Form.Label className="fw-semibold">Data</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTime" className="mb-3">
                                    <Form.Label className="fw-semibold">Czas rozpoczęcia</Form.Label>
                                    <Form.Select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        required
                                    >
                                        <option value="">Wybierz godzinę</option>
                                        {availableTimes.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formDuration" className="mb-4">
                                    <Form.Label className="fw-semibold">Czas trwania (w minutach)</Form.Label>
                                    <Form.Select
                                        value={selectedDuration}
                                        onChange={(e) => setSelectedDuration(e.target.value)}
                                        required
                                    >
                                        <option value="">Wybierz czas trwania</option>
                                        {availableDurations.map((duration) => (
                                            <option key={duration} value={duration}>{`${duration} minut`}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        className="me-2 p-2 fs-5"
                                        variant="success"
                                    >
                                        <Calendar3 size={20} className="me-2" />
                                        Potwierdź
                                    </Button>
                                    <Button
                                        className="me-2 p-2 fs-5"
                                        variant="outline-danger"
                                        onClick={() => navigate(-1)}
                                    >
                                        <ArrowLeft size={20} className="me-2" />
                                        Cofnij
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Dialog potwierdzający rezerwacje */}
            <CustomDialog
                show={isConfirmDialogVisible}
                onHide={() => setIsConfirmDialogVisible(false)}
                title="Potwierdź rezerwację"
                description={
                    <div>
                        <p><strong>Nauczyciel:</strong> {teacher?.name}</p>
                        <p><strong>Przedmiot:</strong> {teacher?.subject}</p>
                        <p><strong>Poziom:</strong> {teacher?.level}</p>
                        <p><strong>Data:</strong> {selectedDate}</p>
                        <p><strong>Godzina:</strong> {selectedTime}</p>
                        <p><strong>Czas trwania:</strong> {selectedDuration} minut</p>
                        <p><strong>Cena:</strong> {teacher ? (teacher.price * (selectedDuration / 60)).toFixed(2) : ''} PLN</p>
                    </div>
                }
                onConfirm={handleConfirm}
                confirmLabel="Rezerwuj"
                cancelLabel="Anuluj"
            />

        </Container>
    );
};

export default RegisterBookings;
