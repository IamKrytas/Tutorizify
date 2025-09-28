import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { StarFill, Star } from 'react-bootstrap-icons';
import { addRateByIdController } from '../controllers/ratesController';
import { toast } from 'react-toastify';
import CustomDialog from '../components/CustomDialog';

const RateTeacher = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const rateData = {
        rating: rating,
        comment: comment,
    };

    const ratingDescriptions = {
        1: 'Fatalnie!',
        2: 'Słabo',
        3: 'Średnio',
        4: 'Dobrze',
        5: 'Świetnie!',
    };

    const navigate = useNavigate();
    const handleSetRating = (newRating) => setRating(newRating);

    const confirmAndSubmit = async () => {
        if (rating === 0) {
            window.scrollTo(0, 0);
            toast.error('Nie wybrano oceny');
            setIsDialogVisible(false);
            return;
        }

        try {
            const result = await addRateByIdController(id, rateData);
            window.scrollTo(0, 0);
            toast.success(result.message || 'Ocena została pomyślnie dodana');
            setIsDialogVisible(false);
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas zapisywania oceny');
            setIsDialogVisible(false);
        }
    };

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
            <Row className="text-center mb-4">
                <Col>
                    <h3>Oceń nauczyciela</h3>
                    <p className="text-muted">Oceń swojego nauczyciela i napisz komentarz</p>
                </Col>
            </Row>
            <>
                <Row className="justify-content-center">
                    <p
                        className={`text-center ${rating === 1 ? 'text-danger' :
                            rating === 5 ? 'text-success' : 'text-muted'
                            }`}
                        style={{ fontSize: '2rem', fontWeight: '700' }}
                    >
                        {rating > 0 ? ratingDescriptions[rating] : 'Wybierz ocenę'}
                    </p>
                </Row>
                <Row className="justify-content-center mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Col key={i} xs="auto">
                            <div
                                className="fd-row justify-content-center mb-3"
                                onClick={() => handleSetRating(i)}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: '#ffd700',
                                }}
                            >
                                {i <= rating ? <StarFill /> : <Star />}
                            </div>
                        </Col>
                    ))}
                </Row>
            </>


            <Form.Group controlId="comment" className="text-center">
                <Form.Label className="mb-2" style={{ fontWeight: 'bold', color: '#333' }}>
                    Komentarz (opcjonalnie):
                </Form.Label>

                <div className="d-flex flex-column align-items-center mb-2">
                    <small className={`mb-1 ${200 - comment.length < 20 ? 'text-danger' : 'text-muted'}`}>
                        Pozostało {200 - comment.length} znaków
                    </small>
                    <Form.Control
                        className="w-50 text-center"
                        as="textarea"
                        rows={5}
                        placeholder="Napisz komentarz..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={200}
                    />
                </div>

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

export default RateTeacher;