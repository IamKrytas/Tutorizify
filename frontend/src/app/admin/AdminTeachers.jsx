import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Container, Row, Col, ListGroup, Accordion, Spinner } from 'react-bootstrap';
import { CheckCircle, Trash, Ban, XCircle } from 'react-bootstrap-icons';
import { fetchAllTeachers, changeStatusTeacher, deleteTeacher } from '../../api/teachersApi';
import RenderStars from '../RenderStars';
import CustomDialog from "../CustomDialog";
import CustomAlert from '../CustomAlert';


const AdminManageTeachersScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const [isConfirmDialogChangeStatusVisible, setIsConfirmDialogChangeStatusVisible] = useState(false);
  const [isConfirmDialogDeleteTeacherVisible, setIsConfirmDialogDeleteTeacherVisible] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Rozdzielenie nauczycieli na zaakceptowanych i oczekujących
  const acceptedTeachers = teachers.filter((teacher) => teacher.status === 1);
  const waitingTeachers = teachers.filter((teacher) => teacher.status === 0);

  // funkcja pobierająca nauczycieli
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllTeachers();
      if (response.success === true) {
        setTeachers(response.teachers);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // Zmiana statusu nauczyciela
  const confirmChangeStatusTeacher = async (teacherId) => {
    try {
      const response = await changeStatusTeacher(teacherId);
      if (response.success === true) {
        fetchTeachers();
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        setIsConfirmDialogChangeStatusVisible(false);
        setSelectedTeacher(null);
        window.scrollTo(0, 0);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        setIsConfirmDialogChangeStatusVisible(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  // Usunięcie nauczyciela
  const confirmDeleteTeacher = async (teacherId) => {
    try {
      const response = await deleteTeacher(teacherId);
      if (response.success === true) {
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        fetchTeachers();
        setIsConfirmDialogDeleteTeacherVisible(false);
        setSelectedTeacher(null);
        window.scrollTo(0, 0);
      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        setIsConfirmDialogDeleteTeacherVisible(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  const handleChangeStatusTeacher = (teacherId) => {
    setIsConfirmDialogChangeStatusVisible(true);
    setSelectedTeacher(teacherId);
  };


  const handleDeleteTeacher = (teacherId) => {
    setIsConfirmDialogDeleteTeacherVisible(true);
    setSelectedTeacher(teacherId);
  };

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalVisible(true);
  };

  const renderTeachers = (teacherList, title) => (
    <Accordion.Item eventKey={title}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>
        <ListGroup>
          {teacherList.map((teacher) => (
            <ListGroup.Item key={teacher.id} className="d-flex justify-content-between align-items-center">
              <div className="text-truncate" style={{ maxWidth: '70%' }} onClick={() => handleSelectTeacher(teacher)}>
                {teacher.name}
              </div>
              <div>
                {waitingTeachers.includes(teacher) ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleChangeStatusTeacher(teacher.id)}
                    >
                      <CheckCircle />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      <Trash />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleChangeStatusTeacher(teacher.id)}
                  >
                    <Ban />
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );

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
          <h3>Zarządzaj nauczycielami</h3>
          <p className="text-muted">Tutaj możesz zarządzać nauczycielami</p>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Accordion>
          {renderTeachers(waitingTeachers, 'Oczekujący na akceptację')}
          {renderTeachers(acceptedTeachers, 'Zaakceptowani')}
        </Accordion>
      )}

      {/* Modal */}
      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTeacher ? selectedTeacher.name : 'Szczegóły nauczyciela'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeacher && (
            <>
              <p>
                <strong>Email:</strong> {selectedTeacher.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedTeacher.subject}
              </p>
              <p>
                <strong>Poziom:</strong> {selectedTeacher.level}
              </p>
              <p>
                <strong>Price:</strong> {selectedTeacher.price} PLN/H
              </p>
              <RenderStars rating={selectedTeacher.rating} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setIsModalVisible(false)}>
            <XCircle className="me-2" />
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Dialog potwierdzający zmianę statusu nauczyciela */}
      <CustomDialog
        show={isConfirmDialogChangeStatusVisible}
        onHide={() => setIsConfirmDialogChangeStatusVisible(false)}
        title="Potwierdź zmianę statusu nauczyciela"
        description="Czy chcesz zmienić status nauczyciela?"
        onConfirm={() => confirmChangeStatusTeacher(selectedTeacher)}
        confirmLabel="Zmień"
        cancelLabel="Anuluj"
      />

      {/* Dialog potwierdzający usunięcie nauczyciela */}
      <CustomDialog
        show={isConfirmDialogDeleteTeacherVisible}
        onHide={() => setIsConfirmDialogDeleteTeacherVisible(false)}
        title="Potwierdź usunięcie nauczyciela"
        description="Czy chcesz usunąć nauczyciela?"
        onConfirm={() => confirmDeleteTeacher(selectedTeacher)}
        confirmLabel="Usuń"
        cancelLabel="Anuluj"
      />

    </Container>
  );
};

export default AdminManageTeachersScreen;
