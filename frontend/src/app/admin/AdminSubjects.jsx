import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Pencil, PlusCircle } from 'react-bootstrap-icons';
import { fetchAllSubjects, addSubject, updateSubject } from '../../api/subjectsApi';
import CustomAlert from '../CustomAlert';

const AdminManageSubjectsScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  useEffect(() => {
    loadSubjects();
  }, []);

  // funkcja pobierająca przedmioty
  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetchAllSubjects();
      if (response.success === true) {
        setSubjects(response.subjects);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(response.error);
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // funkcja dodająca przedmiot
  const confirmAddSubject = async () => {
    try {
      const response = await addSubject(newSubjectName.trim());
      if (response.success === true) {
        loadSubjects();
        setShowModal(false);
        setNewSubjectName('');
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Wystąpił błąd podczas dodawania przedmiotu.');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  // funkcja aktualizująca przedmiot
  const confirmUpdateSubject = async () => {
    if (!selectedSubject) return;

    try {
      const response = await updateSubject(selectedSubject.id, newSubjectName);
      if (response.success === true) {
        setSelectedSubject(null);
        setNewSubjectName('');
        setShowModal(false);
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
        loadSubjects();
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      setAlertMessage('Wystąpił błąd podczas aktualizacji przedmiotu.');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
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
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
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
