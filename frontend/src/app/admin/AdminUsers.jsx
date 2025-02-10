import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import { fetchAllUsers, changeUserRole } from '../../api/usersApi';
import { fetchAllRoles } from '../../api/authApi';
import CustomDialog from "../CustomDialog";
import CustomAlert from '../CustomAlert';

function AdminManageUsersScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const [isConfirmDialogChangeRoleVisible, setIsConfirmDialogChangeRoleVisible] = useState(false);
  const [isDialogInfoVisible, setIsDialogInfoVisible] = useState(false);

  const defaultRole = newRole || selectedUser?.role || (roles[0] ? roles[0].name : null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // funkcja pobierająca użytkowników
  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      if (response.success === true) {
        setUsers(response.users);
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
    }
  };

  // funkcja pobierająca role
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetchAllRoles();
      if (response.success === true) {
        setRoles(response.roles);
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

  // funkcja zmieniająca rolę użytkownika
  const changeRole = async (userId, role) => {
    try {
      const response = await changeUserRole(userId, role);
      if (response.success === true) {
        handleCloseChangeRoleModal();
        handleCloseModal();
        fetchUsers();
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
        setNewRole('');
        window.scrollTo(0, 0);
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
    }
  }

  // funkcja wywołująca modal z informacjami o użytkowniku
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsDialogInfoVisible(true);
  };

  // funkcja zamykająca modal z informacjami o użytkowniku
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsDialogInfoVisible(false);
    setNewRole('');
  };

  // Modal zamkykajacy modal z potwierdzeniem zmiany roli
  const handleCloseChangeRoleModal = () => {
    setIsConfirmDialogChangeRoleVisible(false);
  };

  // funkcja wywołująca modal z potwierdzeniem zmiany roli
  const handleShowChangeRoleModal = () => {
    setIsConfirmDialogChangeRoleVisible(true);
  };

  // funkcja wywołująca modal z informacjami o użytkowniku
  const renderUsers = () =>
    users.map((user) => (
      <Card
        key={user.id}
        className="mb-2 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={() => handleSelectUser(user)}
      >
        <Card.Body className="d-flex justify-content-between align-items-center">
          <span className="text-truncate">{user.username}</span>
        </Card.Body>
      </Card>
    ));

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
          <h3>Zarządzaj użytkownikami</h3>
          <p className="text-muted">Tutaj możesz zarządzać rolami użytkowników</p>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          <Col md={{ span: 8, offset: 2 }}>{renderUsers()}</Col>
        </Row>
      )}

      {/* Dialog potwierdzający zmianę roli */}
      <CustomDialog
        show={isConfirmDialogChangeRoleVisible}
        onHide={handleCloseChangeRoleModal}
        title="Potwierdź zmianę roli"
        description="Czy chcesz zmienić rolę użytkownika?"
        onConfirm={() => changeRole(selectedUser.id, newRole)}
        confirmLabel="Zmień"
        cancelLabel="Anuluj"
      />

      {/* Modal z informacjami o użytkowniku */}
      {selectedUser && (
        <Modal
          show={isDialogInfoVisible}
          onHide={() => setIsDialogInfoVisible(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? selectedUser.username : 'Szczegóły użytkownika'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <>
                <p>
                  <strong>E-mail:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Data rejestracji:</strong> {selectedUser.registrationDate}
                </p>
                <p>
                  <strong>Aktualna rola:</strong> {selectedUser.role}
                </p>
                <Form.Group controlId="formNewRole">
                  <Form.Label>
                    <strong>Wybierz nową rolę:</strong>
                  </Form.Label>
                  <Form.Select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => handleShowChangeRoleModal()}
              disabled={!newRole}
            >
              <CheckCircle className="me-2" />
              Zatwierdź
            </Button>
            <Button variant="danger" onClick={handleCloseModal}>
              <XCircle className="me-2" />
              Anuluj
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};


export default AdminManageUsersScreen;