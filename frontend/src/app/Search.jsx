import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Col, Row, Spinner, Container } from 'react-bootstrap';
import { fetchTeachers } from '../api/searchApi';
import { fetchActiveSubjects, fetchAllLevels } from '../api/subjectsApi';
import RenderStars from './RenderStars';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';

export default function Teachers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSort, setSelectedSort] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

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
      const response = await fetchTeachers();
      if (response.success === true) {
        setTeachers(response.teachers);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchActiveSubjects();
      if (response.success === true) {
        setSubjects(response.subjects);
      } else {
        setAlertMessage(response.message);
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

  // Pobieranie poziomów
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      if (response.success === true) {
        setLevels(response.levels);
      } else {
        setAlertMessage(response.message);
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

  useEffect(() => {
    loadSubjects();
    loadTeachers();
    loadLevels();
  }, []);

  return (
    <Container className="mt-4 mb-4 text-center">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="my-4">
        <Col>
          <h2>Znajdź nauczycieli</h2>
          <p>Użyj poniższych opcji, aby znaleźć idealnego nauczyciela.</p>
        </Col>
      </Row>

      {/* Wyszukiwanie */}
      <Row className="mb-4">
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Wyszukaj nauczyciela lub przedmiot"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Button variant="danger" onClick={ResetFilters}>
            Resetuj filtry
          </Button>
        </Col>
      </Row>

      {/* Filtruj według przedmiotu */}
      <Row className="mb-4">
        <Col>
          <h4>Filtruj według przedmiotu:</h4>
          <div className="btn-group">
          <Col xs={12} sm="auto">
            <Button className=' m-1 p-2' variant={selectedSubject === 'all' ? 'primary' : 'secondary'} onClick={() => setSelectedSubject('all')}>
              Wszystkie
            </Button>
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.name ? 'primary' : 'secondary'}
                onClick={() => setSelectedSubject(subject.name)}
                className=' fd-row flex-wrap wrap justify-content-flex-start m-1 p-2'
              >
                {subject.name}
              </Button>
            ))}
            </Col>
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
              Wszystkie
            </Button>
            {levels.map((level) => (
              <Button
                key={level.id}
                variant={selectedLevel === level.name ? 'primary' : 'secondary'}
                onClick={() => setSelectedLevel(level.name)}
                className=' fd-row flex-wrap wrap justify-content-flex-start m-1 p-2'
              >
                {level.name}
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
              Brak
            </Button>
            <Button className='m-1 p-2' variant={selectedSort === 'rating' ? 'primary' : 'secondary'} onClick={() => setSelectedSort('rating')}>
              Oceny
            </Button>
            <Button className='m-1 p-2' variant={selectedSort === 'price' ? 'primary' : 'secondary'} onClick={() => setSelectedSort('price')}>
              Cena
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
                  <Card.Text>
                    <RenderStars rating={teacher.rating} />
                    <div>{teacher.subject}</div>
                    <div>{teacher.level}</div>
                    <div>{teacher.price} PLN/H</div>
                  </Card.Text>
                  <Button variant="info" onClick={() => navigate(`/teachers/${teacher.id}`)}>
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
