import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Pencil, PlusCircle } from 'react-bootstrap-icons';
import { getAllSubjectsController, addSubjectController, updateSubjectController } from '../controllers/subjectController';
import { toast } from 'react-toastify';

const AdminManageSubjectsScreen = () => {
    const [subjects, setSubjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [loading, setLoading] = useState(false);

    const subjectData = {
        name: newSubjectName.trim()
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    // funkcja pobierająca przedmioty
    const loadSubjects = async () => {
        setLoading(true);
        try {
            const response = await getAllSubjectsController();
            setSubjects(response.subjects);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania przedmiotów');
        } finally {
            setLoading(false);
        }
    };

    // funkcja dodająca przedmiot
    const confirmAddSubject = async () => {
        try {
            const response = await addSubjectController(subjectData);
            loadSubjects();
            window.scrollTo(0, 0);
            toast.success(response.message || 'Przedmiot został pomyślnie dodany');
            setShowModal(false);
            setNewSubjectName('');
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas dodawania przedmiotu');
        }
    };

    // funkcja aktualizująca przedmiot
    const confirmUpdateSubject = async () => {
        if (!selectedSubject) return;

        try {
            const response = await updateSubjectController(selectedSubject.id, subjectData);
            loadSubjects();
            window.scrollTo(0, 0);
            toast.success(response.message || 'Przedmiot został pomyślnie zaktualizowany');
            setSelectedSubject(null);
            setNewSubjectName('');
            setShowModal(false);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas aktualizacji przedmiotu');
        }
    };

    // obsługa formularza
    const handleModalSave = () => {
        if (selectedSubject) {
            confirmUpdateSubject();
        } else {
            confirmAddSubject();
        }
    };

    // Funkcja renderująca przedmioty
    const renderSubjects = (subject) => (
        <Card className="mb-3" key={subject.id}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <Card.Text className="mb-0">{subject.name}</Card.Text>
                <div>
                    <Button variant="outline-primary" className="me-2" onClick={() => handleEditSubject(subject)}>
                        <Pencil />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );

    const handleEditSubject = (subject) => {
        setSelectedSubject(subject);
        setNewSubjectName(subject.name);
        setShowModal(true);
    };

    return (
        <Container className="mt-4">
            <Row className="text-center mb-4">
                <Col>
                    <h3>Zarządzaj przedmiotami</h3>
                    <p className="text-muted">Tutaj możesz zarządzać przedmiotami</p>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : subjects.length > 0 ? (
                <>
                    <Button
                        variant="success"
                        className="mb-4 d-flex align-items-center"
                        onClick={() => {
                            setSelectedSubject(null);
                            setNewSubjectName('');
                            setShowModal(true);
                        }}
                    >
                        <PlusCircle className="me-2" />
                        Dodaj nowy przedmiot
                    </Button>
                    <Row>
                        {subjects.map((subject) => (
                            <Col sm={12} md={6} lg={4} key={subject.id}>
                                {renderSubjects(subject)}
                            </Col>
                        ))}
                    </Row>
                </>
            ) : (
                <p>Brak przedmiotów do wyświetlenia</p>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSubject ? 'Edytuj przedmiot' : 'Dodaj przedmiot'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nazwa przedmiotu</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Wpisz nazwę przedmiotu"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleModalSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminManageSubjectsScreen;