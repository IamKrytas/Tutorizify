import React from 'react';
import { Offcanvas, ListGroup } from 'react-bootstrap';

const NotificationPanel = ({ show, onClose, notifications }) => {
    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Powiadomienia</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {notifications.length > 0 ? (
                    <ListGroup>
                        {notifications.map((notification) => (
                            <ListGroup.Item key={notification.id} className="text-center mt-2">
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
    );
};

export default NotificationPanel;
