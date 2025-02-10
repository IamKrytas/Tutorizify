import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { fetchActiveSubjects, fetchAllLevels } from '../../api/subjectsApi';
import { registerNewTeacher } from '../../api/teachersApi';
import CustomDialog from "../CustomDialog";
import CustomAlert from '../CustomAlert';
import { useNavigate } from 'react-router-dom';

function RegisterTeacher() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subject, setSubject] = useState('');
  const [price, setPrice] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [level, setLevel] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    loadSubjects();
    loadLevels();
  }, []);

  // Funkcja pobierająca listę przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchActiveSubjects();
      setSubjectsList(response.subjects);
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  // Funkcja pobierająca poziomy nauczania
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      setLevelsList(response.levels);
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };


  // Funkcja do rejestracji nauczyciela
  const handleRegister = async () => {
    if (!firstName || !lastName || !subject || !price || !level) {
      setAlertMessage("Wszystkie pola są wymagane");
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }
    setIsConfirmDialogVisible(false);
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      const response = await registerNewTeacher(trimmedFirstName, trimmedLastName, subject, price, level);
      if (response.success === true) {
        setAlertMessage(response.message || 'Nauczyciel został zarejestrowany');
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          location.href = "/";
        }, 3000);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    }
    catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
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
    <Container className="mt-4 mb-4">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="mb-4 text-center">
        <Row className="text-center mb-3">
          <Col>
            <h3>Zarejestruj się jako nauczyciel</h3>
            <p className="text-muted">Wypełnij poniższe pola, aby zarejestrować się jako nauczyciel</p>
          </Col>
        </Row>
        <Form onSubmit={handleConfirmDialog}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="fw-bold">Imię</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź imię"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="text-center mx-auto"
              style={{ maxWidth: '600px' }}
              required
            />
          </Form.Group>

          <Form.Group controlId="surname" className="mb-3">
            <Form.Label className="fw-bold">Nazwisko</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź nazwisko"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="text-center mx-auto"
              style={{ maxWidth: '600px' }}
              required
            />
          </Form.Group>

          <Form.Group controlId="subject" className="mb-3">
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

          <Form.Group controlId="level" className="mb-3">
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

          <Form.Group controlId="price" className="mb-3">
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
            <Button variant="primary" type="submit" className="mt-3 px-4">
              Zarejestruj
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
    </Container >
  );
}

export default RegisterTeacher;
