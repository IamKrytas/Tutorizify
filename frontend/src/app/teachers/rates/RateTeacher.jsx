import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { StarFill, Star } from 'react-bootstrap-icons';
import { rateTeacher } from '../../../api/teachersApi';
import CustomDialog from "../../CustomDialog";
import CustomAlert from "../../CustomAlert";

const RateTeacherScreen = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');

    const handleSetRating = (newRating) => setRating(newRating);

    const confirmAndSubmit = async () => {
        if (rating === 0) {
            setAlertMessage('Nie wybrano oceny');
            setAlertVariant('danger');
            setShowAlert(true);
            setIsDialogVisible(false);
            window.scrollTo(0, 0);
            return;
        }

        try {
            const result = await rateTeacher(id, rating, comment);
            if (result.success === true) {
                setIsDialogVisible(false);
                setAlertMessage(result.message);
                setAlertVariant('success');
                setShowAlert(true);
                window.scrollTo(0, 0);
                setTimeout(() => navigate('/home'), 3000);
            } else {
                setAlertMessage(result.message);
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

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
            <CustomAlert
                show={showAlert}
                message={alertMessage}
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
            />
            <Row className="text-center mb-4">
                <Col>
                    <h3>Oceń nauczyciela</h3>
                    <p className="text-muted">Oceń swojego nauczyciela i napisz komentarz</p>
                </Col>
            </Row>
            <Row className="justify-content-center mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Col key={i} xs="auto">
                        <div
                            className="fd-row justify-content-center mb-3"
                            onClick={() => handleSetRating(i)}
                            style={{ cursor: 'pointer', fontSize: '2rem', color: '#ffd700' }}
                        >
                            {i <= rating ? <StarFill /> : <Star />}
                        </div>
                    </Col>
                ))}
            </Row>

            <Form.Group controlId="comment" className="text-center">
                <Form.Label className='mb-3'>Komentarz (opcjonalnie):</Form.Label>
                <Form.Control
                    className='w-50 text-center mx-auto'
                    as="textarea"
                    rows={5}
                    placeholder="Napisz komentarz..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button variant="primary" className="mt-3" onClick={() => setIsDialogVisible(true)}>
                    Zatwierdź ocenę
                </Button>
            </Form.Group>

            {/* Dialog potwierdzający ocenę */}
            <CustomDialog
                show={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                title="Potwierdzenie oceny"
                description="Czy na pewno chcesz ocenić nauczyciela?"
                onConfirm={confirmAndSubmit}
                confirmLabel="Zapisz"
                cancelLabel="Anuluj"
            />
        </Container>
    );
};

export default RateTeacherScreen;
