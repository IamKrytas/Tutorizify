import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
// Register icon
import { PersonPlus } from 'react-bootstrap-icons';
import { getAllSubjectsController, getAllLevelsController } from '../controllers/subjectController';
import { registerTeacherController } from '../controllers/authController';
import CustomDialog from "../components/CustomDialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function RegisterTeacher() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [subject, setSubject] = useState('');
    const [price, setPrice] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [levelsList, setLevelsList] = useState([]);
    const [level, setLevel] = useState('');
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

    const teacherData = {
        name: firstName.trim(),
        surname: lastName.trim(),
        subject: subject,
        price: price,
        level: level
    }

    const navigate = useNavigate();

    useEffect(() => {
        loadSubjects();
        loadLevels();
    }, []);

    // Funkcja pobierająca listę przedmiotów
    const loadSubjects = async () => {
        try {
            const response = await getAllSubjectsController();
            setSubjectsList(response.subjects);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania przedmiotów');
        }
    };

    // Funkcja pobierająca poziomy nauczania
    const loadLevels = async () => {
        try {
            const response = await getAllLevelsController();
            setLevelsList(response.levels);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania poziomów nauczania');
        }
    };


    // Funkcja do rejestracji nauczyciela
    const handleRegister = async () => {
        if (!firstName || !lastName || !subject || !price || !level) {
            window.scrollTo(0, 0);
            toast.error("Wszystkie pola są wymagane");
            return;
        }
        setIsConfirmDialogVisible(false);
        try {
            const result = await registerTeacherController(teacherData);
            window.scrollTo(0, 0);
            toast.success(result.message || 'Nauczyciel zarejestrowany pomyślnie');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        }
        catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas rejestracji nauczyciela');
        }
    }

    const handleCancelRegister = () => {
        setIsConfirmDialogVisible(false);
    };

    const handleConfirmDialog = (e) => {
        e.preventDefault();
        setIsConfirmDialogVisible(true)
    };

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
            <Card className="p-4 shadow-sm">
                <Row className="justify-content-center mb-2">
                    <Row className="text-center mb-3">
                        <Col>
                            <h3>Zarejestruj się jako nauczyciel</h3>
                            <p className="text-muted">Wypełnij poniższe pola, aby zarejestrować się jako nauczyciel</p>
                        </Col>
                    </Row>
                    <Form onSubmit={handleConfirmDialog}>
                        {/* Imię */}
                        <Form.Group controlId="name" className="mb-3 text-center">
                            <Form.Label className="fw-bold">Imię</Form.Label>
                            <div className="d-flex flex-column align-items-center">
                                <small className={`mb-1 ${15 - firstName.length < 5 ? 'text-danger' : 'text-muted'}`}>
                                    Pozostało {15 - firstName.length} znaków
                                </small>
                                <Form.Control
                                    type="text"
                                    placeholder="Wprowadź imię"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="text-center"
                                    style={{ maxWidth: '600px' }}
                                    maxLength={15}
                                    required
                                />
                            </div>
                        </Form.Group>

                        {/* Nazwisko */}
                        <Form.Group controlId="surname" className="mb-3 text-center">
                            <Form.Label className="fw-bold">Nazwisko</Form.Label>
                            <div className="d-flex flex-column align-items-center">
                                <small className={`mb-1 ${35 - lastName.length < 5 ? 'text-danger' : 'text-muted'}`}>
                                    Pozostało {35 - lastName.length} znaków
                                </small>
                                <Form.Control
                                    type="text"
                                    placeholder="Wprowadź nazwisko"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="text-center"
                                    style={{ maxWidth: '600px' }}
                                    maxLength={35}
                                    required
                                />
                            </div>
                        </Form.Group>

                        {/* Przedmiot */}
                        <Form.Group controlId="subject" className="mb-3 text-center">
                            <Form.Label className="fw-bold">Przedmiot</Form.Label>
                            <Form.Select
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="text-center mx-auto"
                                style={{ maxWidth: '600px' }}
                                required
                            >
                                <option value="">Wybierz przedmiot</option>
                                {subjectsList.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Poziom nauczania */}
                        <Form.Group controlId="level" className="mb-3 text-center">
                            <Form.Label className="fw-bold">Poziom nauczania</Form.Label>
                            <Form.Select
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                                className="text-center mx-auto"
                                style={{ maxWidth: '600px' }}
                                required
                            >
                                <option value="">Wybierz poziom nauczania</option>
                                {levelsList.map(level => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Cena */}
                        <Form.Group controlId="price" className="mb-3 text-center">
                            <Form.Label className="fw-bold">Cena (PLN/H)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Wprowadź cenę"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="text-center mx-auto"
                                style={{ maxWidth: '600px' }}
                                required
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="outline-success" type="submit" className="mt-3 px-4">
                                <PersonPlus size={20} className="me-2" />
                                Zarejestruj się
                            </Button>
                        </div>
                    </Form>
                </Row>

                {/* Dialog potwierdzający zmiany profilu nauczyciela */}
                <CustomDialog
                    show={isConfirmDialogVisible}
                    onHide={handleCancelRegister}
                    title="Potwierdzenie rejestracji"
                    description="Czy na pewno chcesz zarejestrować nauczyciela?"
                    onConfirm={handleRegister}
                    confirmLabel="Zarejestruj"
                    cancelLabel="Anuluj"
                />
            </Card>
        </Container >
    );
}

export default RegisterTeacher;