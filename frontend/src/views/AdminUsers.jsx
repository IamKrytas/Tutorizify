import { useState, useEffect } from 'react';
import { Modal, Button, Card, Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import { getUsersController, updateUserRoleController } from '../controllers/userController';
import { getRolesController } from '../controllers/userController';
import CustomDialog from "../components/CustomDialog";
import { toast } from 'react-toastify';

function AdminManageUsersScreen() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isConfirmDialogChangeRoleVisible, setIsConfirmDialogChangeRoleVisible] = useState(false);
    const [isDialogInfoVisible, setIsDialogInfoVisible] = useState(false);

    const defaultRole = newRole || selectedUser?.role || (roles[0] ? roles[0].name : null);

    const roleData = {
        role: newRole
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // funkcja pobierająca użytkowników
    const fetchUsers = async () => {
        try {
            const response = await getUsersController();
            setUsers(response.users);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania użytkowników');
        }
    };

    // funkcja pobierająca role
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await getRolesController();
            setRoles(response.roles);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania ról');
        } finally {
            setLoading(false);
        }
    };

    // funkcja zmieniająca rolę użytkownika
    const changeRole = async (userId) => {
        try {
            const response = await updateUserRoleController(userId, roleData);
            fetchUsers();
            window.scrollTo(0, 0);
            toast.success(response.message || 'Rola użytkownika została pomyślnie zmieniona');
            handleCloseChangeRoleModal();
            handleCloseModal();
            setNewRole('');
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas zmiany roli użytkownika');
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
                onConfirm={() => changeRole(selectedUser.id)}
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
                                    <strong>Data rejestracji:</strong> {new Date(selectedUser.registrationDate).toLocaleString() }
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