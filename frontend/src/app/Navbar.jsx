import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Offcanvas, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Calendar3, Person, Bell, Gear, BoxArrowRight, People, PersonPlus, Briefcase, Book, Award } from 'react-bootstrap-icons';
import { fetchNotifications } from '../api/dashboardApi';

function Navigation() {
    const [expanded, setExpanded] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const handleToggle = () => setExpanded(!expanded);
    const closeNavbar = () => setExpanded(false);
    const handleOpenNotifications = () => setShowNotifications(true);
    const handleCloseNotifications = () => setShowNotifications(false);

    const getNotifications = async () => {
        if (notifications.length > 0) {
            return;
        }
        try {
            const response = await fetchNotifications();
            setNotifications(response.notifications);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Navbar expand="lg" expanded={expanded} className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Tutorizify</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Wyszukaj */}
                        <Nav.Link as={Link} to="/search" className="me-2" onClick={closeNavbar}>
                            <Search size={18} className="me-2" />
                            Wyszukaj
                        </Nav.Link>

                        {/* Rezerwacje */}
                        <Nav.Link as={Link} to="/reservations" className="me-2" onClick={closeNavbar}>
                            <Calendar3 size={18} className="me-2" />
                            Rezerwacje
                        </Nav.Link>

                        {/* Profil */}
                        <Nav.Link as={Link} to="/profile" className="me-2" onClick={closeNavbar}>
                            <Person size={18} className="me-2" />
                            Profil
                        </Nav.Link>

                        {/* Rejestracja jako nauczyciel */}
                        {(sessionStorage.getItem("role") === "3" || sessionStorage.getItem("role") === "1") ? (
                            <Nav.Link as={Link} to="/teachers/register" className="me-2" onClick={closeNavbar}>
                                <PersonPlus size={18} className="me-2" />
                                Zostań nauczycielem
                            </Nav.Link>
                        ) : null}


                        {/* Profil admina (opcjonalnie) */}
                        {(sessionStorage.getItem("role") === "1") ? (
                            <NavDropdown title="Panel Admistratora">
                                <NavDropdown.Item as={Link} to="/admin/users" className="me-2" onClick={closeNavbar}>
                                    <People size={18} className="me-2" />
                                    Użytkownicy
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/teachers" className="me-2" onClick={closeNavbar}>
                                    <Briefcase size={18} className="me-2" />
                                    Nauczyciele
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/subjects" className="me-2" onClick={closeNavbar}>
                                    <Book size={18} className="me-2" />
                                    Przedmioty
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/bookings" className="me-2" onClick={closeNavbar}>
                                    <Calendar3 size={18} className="me-2" />
                                    Rezerwacje
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/rates" className="me-2" onClick={closeNavbar}>
                                    <Award size={18} className="me-2" />
                                    Oceny
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : null}

                        {/* Powiadomienia */}
                        <Nav.Link className="me-2" onClick={() => { handleOpenNotifications(); getNotifications(); closeNavbar(); }}>
                            <Bell size={18} className="me-2" />
                            Powiadomienia
                        </Nav.Link>


                        {/* Sekcja Powiadomień */}
                        <Offcanvas
                            show={showNotifications}
                            onHide={handleCloseNotifications}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Powiadomienia</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                {notifications.length > 0 ? (
                                    <ListGroup>
                                        {notifications.map((notification) => (
                                            <ListGroup.Item key={notification.id} className='text-center mt-2'>
                                                <p>{notification.created_at}</p>
                                                <strong>{notification.message}</strong>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>Brak powiadomień</p>
                                )}
                            </Offcanvas.Body>
                        </Offcanvas>
                        

                    {/* Wyloguj */}
                    <Nav.Link as={Link} to="/wyloguj" className="me-2" >
                        <BoxArrowRight size={18} className="me-2" />
                        Wyloguj
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar >
    );
}

export default Navigation;
