import React, { useState, useEffect } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarMenu from './NavbarMenu';
import NotificationPanel from './NotificationPanel';
import { getNotificationsController } from '../controllers/notificationController';

function Navigation() {
    const [expanded, setExpanded] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleToggle = () => setExpanded(!expanded);
    const closeNavbar = () => setExpanded(false);

    const handleOpenNotifications = async () => {
        setShowNotifications(true);
        if (notifications.length === 0) {
            try {
                const response = await getNotificationsController();
                setNotifications(response.notifications);
            } catch (error) {
                console.error(error);
            }
        }
        closeNavbar();
    };

    const handleCloseNotifications = () => setShowNotifications(false);

    return (
        <Navbar expand="lg" expanded={expanded} className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Tutorizify</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <NavbarMenu
                        closeNavbar={closeNavbar}
                        onOpenNotifications={handleOpenNotifications}
                    />
                </Navbar.Collapse>
            </Container>

            <NotificationPanel
                show={showNotifications}
                onClose={handleCloseNotifications}
                notifications={notifications}
            />
        </Navbar>
    );
}

export default Navigation;
