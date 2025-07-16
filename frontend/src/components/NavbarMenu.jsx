import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Calendar3, Person, PersonPlus, People, Briefcase, Book, Award, Bell, BoxArrowRight } from 'react-bootstrap-icons';
import { logoutUserController } from '../controllers/authController';
import { toast } from 'react-toastify';

const NavbarMenu = ({ closeNavbar, onOpenNotifications }) => {
    const role = localStorage.getItem("role");

    return (
        <Nav className="me-auto">
            <Nav.Link as={Link} to="/search" className="me-2" onClick={closeNavbar}>
                <Search size={18} className="me-2" />
                Wyszukaj
            </Nav.Link>

            <Nav.Link as={Link} to="/reservations" className="me-2" onClick={closeNavbar}>
                <Calendar3 size={18} className="me-2" />
                Rezerwacje
            </Nav.Link>

            <Nav.Link as={Link} to="/profile" className="me-2" onClick={closeNavbar}>
                <Person size={18} className="me-2" />
                Profil
            </Nav.Link>

            {(role === "3" || role === "1") && (
                <Nav.Link as={Link} to="/teachers/register" className="me-2" onClick={closeNavbar}>
                    <PersonPlus size={18} className="me-2" />
                    Zostań nauczycielem
                </Nav.Link>
            )}

            {role === "1" && (
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
            )}

            <Nav.Link className="me-2" onClick={onOpenNotifications}>
                <Bell size={18} className="me-2" />
                Powiadomienia
            </Nav.Link>

            <Nav.Link onClick={() => {
                logoutUserController();
                closeNavbar();
                toast.success("Pomyślnie wylogowano");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }}>
                <BoxArrowRight size={18} className="me-2" />
                Wyloguj
            </Nav.Link>
        </Nav>
    );
};

export default NavbarMenu;
