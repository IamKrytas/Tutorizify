import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { getAllRatesController, deleteRateByIdController } from '../controllers/ratesController';
import RenderStars from '../components/RenderStars';
import CustomDialog from "../components/CustomDialog";
import { toast } from 'react-toastify';


const AdminManageRatesScreen = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchRates();
    }, []);

    // funkcja pobierająca oceny
    const fetchRates = async () => {
        setLoading(true);
        try {
            const response = await getAllRatesController();
            setRates(response.rates);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania ocen');
        } finally {
            setLoading(false);
        }
    };

    // funkcja usuwająca ocenę
    const deleteComment = async (id) => {
        try {
            const response = await deleteRateByIdController(id);
            fetchRates();
            window.scrollTo(0, 0);
            toast.success(response.message || 'Ocena została pomyślnie usunięta');
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas usuwania oceny');
        }
    };

    // funkcja wywołująca alert z pytaniem o potwierdzenie usunięcia oceny
    const handleDeleteComment = (id) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    const renderRateCard = (rate) => (
        <Card className="mb-3 shadow-sm" key={rate.id}>
            <Card.Body className="d-flex justify-content-between">
                <div className="me-3 flex-grow-1">
                    {/* Nagłówek nauczyciela */}
                    <Card.Title className="mb-1">{rate.teacher_name}</Card.Title>

                    {/* Ocena i autor */}
                    <div className="d-flex align-items-center mb-1">
                        <RenderStars rating={rate.rating} />
                        <Card.Text className="text-muted ms-2 mb-0">Oceniający: {rate.user_name}</Card.Text>
                    </div>

                    {/* Data */}
                    <Card.Text className="text-muted mb-2">{new Date(rate.date).toLocaleString()}</Card.Text>

                    {/* Komentarz – wyświetlany tylko jeśli istnieje */}
                    {rate.comment ? (
                        <Card.Text className="border rounded p-2 bg-light">{rate.comment}</Card.Text>
                    ) : (
                        <Card.Text className="text-muted fst-italic">Brak komentarza</Card.Text>
                    )}
                </div>

                {/* Przycisk Usuń */}
                <div className="d-flex align-items-start">
                    <Button
                        variant="outline-danger"
                        onClick={() => handleDeleteComment(rate.id)}
                    >
                        <Trash className="me-1" /> Usuń
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );


    return (
        <Container className="my-4">
            <Row className="text-center mb-4">
                <Col>
                    <h3>Zarządzaj ocenami</h3>
                    <p className="text-muted">Tutaj możesz zarządzać ocenami wystawionymi nauczycielom</p>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    {rates.length > 0 ? (
                        <Row>
                            <Col>
                                {rates.map((rate) => renderRateCard(rate))}
                            </Col>
                        </Row>
                    ) : (
                        <Alert variant="info" className="text-center">
                            Brak ocen do wyświetlenia.
                        </Alert>
                    )}
                </>
            )}
            <CustomDialog
                show={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                title="Potwierdzenie usunięcia oceny"
                description="Czy na pewno chcesz usunąć tę ocenę?"
                onConfirm={() => {
                    deleteComment(deleteId);
                    setShowDeleteDialog(false);
                }}
                confirmLabel="Usuń"
                cancelLabel="Anuluj"
            />
        </Container>
    );
};

export default AdminManageRatesScreen;