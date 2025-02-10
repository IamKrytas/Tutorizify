import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { fetchAllRates, deleteRate } from '../../api/teachersApi';
import RenderStars from '../RenderStars';
import CustomDialog from "../CustomDialog";
import CustomAlert from '../CustomAlert';

const AdminManageRatesScreen = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchRates();
    }, []);

    // funkcja pobierająca oceny
    const fetchRates = async () => {
        setLoading(true);
        try {
            const response = await fetchAllRates();
            if (response.success === true) {
                setRates(response.rates);
            } else {
                setAlertMessage(response.message);
                setAlertVariant('danger');
                setShowAlert(true);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            setAlertMessage('Error fetching rates');
            setAlertVariant('danger');
            setShowAlert(true);
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    // funkcja usuwająca ocenę
    const deleteComment = async (id) => {
        try {
            const response = await deleteRate(id);
            if (response.success === true) {
                fetchRates();
                setAlertMessage(response.message);
                setAlertVariant('success');
                setShowAlert(true);
                window.scrollTo(0, 0);
            } else {
                setAlertMessage(response.message);
                setAlertVariant('danger');
                setShowAlert(true);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            setAlertMessage('Error deleting rate');
            setAlertVariant('danger');
            setShowAlert(true);
            window.scrollTo(0, 0);
        }
    };

    // funkcja wywołująca alert z pytaniem o potwierdzenie usunięcia oceny
    const handleDeleteComment = (id) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    // Funkcja renderująca ocenę
    const renderRateCard = (rate) => (
        <Card className="mb-3 shadow-sm" key={rate.id}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title className="mb-1">{rate.teacher_name}</Card.Title>
                    <Card.Text className="text-muted mb-1">Oceniający: {rate.user_name}</Card.Text>
                    <Card.Text className="text-muted mb-1">Data: {rate.date}</Card.Text>
                    <RenderStars rating={rate.rating} />
                    <Card.Text className="mt-2">Komentarz: {rate.comment}</Card.Text>
                </div>
                <Button variant="danger" size="sm" onClick={() => handleDeleteComment(rate.id)}>
                    <Trash className="me-1" /> Usuń
                </Button>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="my-4">
            <CustomAlert
                show={showAlert}
                message={alertMessage}
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
            />
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
