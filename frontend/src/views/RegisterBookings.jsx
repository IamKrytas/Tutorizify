import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { addBookingController } from '../controllers/bookingController';
import CustomDialog from "../components/CustomDialog";
import { toast } from 'react-toastify';

const RegisterBookings = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const availableDurations = ['30', '60', '90'];
    const availableTimes = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

    const bookingData = {
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
        teacherId: id
    }


    const onDayChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const showDialog = () => {
        if (!selectedDate || !selectedTime || !selectedDuration) {
            window.scrollTo(0, 0);
            toast.error("Wypełnij wszystkie pola");
            return;
        }

        const selectedDateTime = moment(`${selectedDate} ${selectedTime}`);
        const currentDateTime = moment();

        if (selectedDateTime.isBefore(currentDateTime)) {
            window.scrollTo(0, 0);
            toast.error("Nie można zarezerwować terminu na dzień, który już minął");
            return;
        }

        if (selectedDateTime.diff(currentDateTime, 'hours') < 24) {
            window.scrollTo(0, 0);
            toast.error("Nie można zarezerwować na mniej niż 24 godziny przed rozpoczęciem");
            return;
        }

        setIsConfirmDialogVisible(true);
    };

    const handleConfirm = async () => {
        setIsConfirmDialogVisible(false);
        try {
            const response = await addBookingController(bookingData);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Rezerwacja została pomyślnie dodana');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas dodawania rezerwacji');
        }
    };

    const handleCancelRegister = () => {
        setIsConfirmDialogVisible(false);
    };

    const handleConfirmDialog = (e) => {
        e.preventDefault();
        handleConfirm();
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <h1 className="text-center mb-4">Rezerwacja Zajęć</h1>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={onDayChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTime" className="mt-3">
                            <Form.Label>Czas rozpoczęcia</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                            >
                                <option value="">Wybierz godzinę</option>
                                {availableTimes.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formDuration" className="mt-3">
                            <Form.Label>Czas trwania (w minutach)</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                required
                            >
                                <option value="">Wybierz czas trwania</option>
                                {availableDurations.map((duration) => (
                                    <option key={duration} value={duration}>{`${duration} minut`}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button className="mt-4 w-100" variant="primary" onClick={showDialog}>
                            Potwierdź rezerwację
                        </Button>
                    </Form>
                    <Button className="mt-3 w-100" variant="danger" onClick={() => navigate(-1)}>
                        Cofnij
                    </Button>
                </Col>
            </Row>

            {/* Dialog potwierdzający rezerwacje */}
            <CustomDialog
                show={isConfirmDialogVisible}
                onHide={handleCancelRegister}
                title="Potwierdź rezerwację"
                description={`Czy na pewno chcesz zarezerwować zajęcia na ${selectedDate} o godzinie ${selectedTime} na ${selectedDuration} minut?`}
                onConfirm={handleConfirmDialog}
                confirmLabel="Rezerwuj"
                cancelLabel="Anuluj"
            />
        </Container>
    );
};

export default RegisterBookings;