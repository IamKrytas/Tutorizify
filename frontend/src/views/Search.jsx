import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Col, Row, Spinner, Container, InputGroup, FormControl } from 'react-bootstrap';
import { getTeachersController } from '../controllers/teacherController';
import { getAllSubjectsController, getAllLevelsController } from '../controllers/subjectController';
import RenderStars from '../components/RenderStars';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { XCircle, PersonCircle } from 'react-bootstrap-icons';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedSort, setSelectedSort] = useState('all');
    const [subjects, setSubjects] = useState([]);
    const [levels, setLevels] = useState([]);

    const navigate = useNavigate();

    // Funkcja do resetowania filtrów
    const ResetFilters = () => {
        setSearchQuery('');
        setSelectedSubject('all');
        setSelectedLevel('all');
        setSelectedSort('all');
    };

    // Filtrowanie i sortowanie
    useEffect(() => {
        const applyFiltersAndSort = () => {
            let updatedTeachers = [...teachers];

            // Filtrowanie po przedmiocie
            if (selectedSubject !== 'all') {
                updatedTeachers = updatedTeachers.filter(
                    (teacher) => teacher.subject.toLowerCase() === selectedSubject.toLowerCase()
                );
            }

            // Filtrowanie po poziomie
            if (selectedLevel !== 'all') {
                updatedTeachers = updatedTeachers.filter(
                    (teacher) => teacher.level.toLowerCase() === selectedLevel.toLowerCase()
                );
            }

            // Sortowanie
            if (selectedSort === 'rating') {
                updatedTeachers.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            } else if (selectedSort === 'price') {
                updatedTeachers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            }

            // Wyszukiwanie
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                updatedTeachers = updatedTeachers.filter(
                    (teacher) =>
                        teacher.name.toLowerCase().includes(query) ||
                        teacher.subject.toLowerCase().includes(query) ||
                        teacher.level.toLowerCase().includes(query)
                );
            }

            setFilteredTeachers(updatedTeachers);
        };

        applyFiltersAndSort();
    }, [searchQuery, selectedSubject, selectedLevel, selectedSort, teachers]);

    // Pobieranie danych
    const loadTeachers = async () => {
        try {
            const response = await getTeachersController();
            setTeachers(response.teachers);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania nauczycieli');
        } finally {
            setLoading(false);
        }
    };

    // Pobieranie przedmiotów
    const loadSubjects = async () => {
        try {
            const response = await getAllSubjectsController();
            setSubjects(response.subjects);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania przedmiotów');
        }
    };

    // Pobieranie poziomów
    const loadLevels = async () => {
        try {
            const response = await getAllLevelsController();
            setLevels(response.levels);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania poziomów');
        }
    };

    useEffect(() => {
        loadSubjects();
        loadTeachers();
        loadLevels();
    }, []);

    return (
        <Container className="mt-4 mb-4 text-center">
            <Row className="my-4">
                <Col>
                    <h2>Znajdź nauczycieli</h2>
                    <p>Użyj poniższych opcji, aby znaleźć idealnego nauczyciela.</p>
                </Col>
            </Row>

            {/* Wyszukiwarka */}
            <Row className="mb-4">
                <Col xs={12} md={8} className="mx-auto">
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="🔍 Wyszukaj nauczyciela lub przedmiot"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="shadow-sm px-3 py-2"
                        />
                        {searchQuery && (
                            <Button
                                variant="outline-danger"
                                onClick={ResetFilters}
                                style={{ borderLeft: 'none' }}
                            >
                                <XCircle size={20} />
                            </Button>
                        )}
                    </InputGroup>
                </Col>
            </Row>


            {/* Filtruj według przedmiotu */}
            <Row className="mb-4">
                <Col>
                    <h4>Filtruj według przedmiotu:</h4>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        <Button
                            variant={selectedSubject === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setSelectedSubject('all')}
                            className="p-2"
                        >
                            Wszystkie
                        </Button>
                        {subjects.map((subject) => (
                            <Button
                                key={subject.id}
                                variant={selectedSubject === subject.name ? 'primary' : 'secondary'}
                                onClick={() => setSelectedSubject(subject.name)}
                                className="p-2"
                            >
                                {subject.name}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>

            {/* Filtruj według poziomu */}
            <Row className="mb-4">
                <Col>
                    <h4>Filtruj według poziomu:</h4>
                    <div className="btn-group">
                        <Col xs={12} sm="auto">
                            <Button className=' m-1 p-2' variant={selectedLevel === 'all' ? 'primary' : 'secondary'} onClick={() => setSelectedLevel('all')}>
                                <div>Wszystkie</div>
                            </Button>
                            {levels.map((level) => (
                                <Button
                                    key={level.id}
                                    variant={selectedLevel === level.name ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedLevel(level.name)}
                                    className=' fd-row flex-wrap wrap justify-content-flex-start m-1 p-2'
                                >
                                    <div>{level.name}</div>
                                </Button>
                            ))}
                        </Col>
                    </div>
                </Col>
            </Row>


            {/* Sortowanie */}
            <Row className="mb-4">
                <Col>
                    <h4>Sortuj według:</h4>
                    <div className="btn-group">
                        <Col xs={12} sm="auto">
                            <Button className='m-1 p-2' variant={selectedSort === 'all' ? 'primary' : 'secondary'} onClick={() => setSelectedSort('all')}>
                                <div>Brak</div>
                            </Button>
                            <Button className='m-1 p-2' variant={selectedSort === 'rating' ? 'primary' : 'secondary'} onClick={() => setSelectedSort('rating')}>
                                <div>Ocena</div>
                            </Button>
                            <Button className='m-1 p-2' variant={selectedSort === 'price' ? 'primary' : 'secondary'} onClick={() => setSelectedSort('price')}>
                                <div>Cena</div>
                            </Button>
                        </Col>
                    </div>
                </Col>
            </Row>

            {/* Wyniki */}
            <Row>
                {loading ? (
                    <Col className="text-center">
                        <Spinner animation="border" />
                    </Col>
                ) : filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                        <Col key={teacher.id} xs={12} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{teacher.name}</Card.Title>
                                    <Card.Text className="d-flex flex-column align-items-center">
                                        <RenderStars rating={teacher.rating} />
                                        <span>{teacher.subject}</span>
                                        <span>{teacher.level}</span>
                                        <span>{teacher.price} PLN/H</span>
                                    </Card.Text>
                                    <Button variant="outline-primary" onClick={() => navigate(`/teachers/${teacher.id}`)}>
                                        <PersonCircle size={20} className="me-2" />
                                        Zobacz profil
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p>Brak wyników</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}