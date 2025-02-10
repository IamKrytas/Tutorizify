import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';

function CustomAlert({ show, message, onClose, variant }) {
  if (!show) return null;

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6} lg={4}>
        <Alert variant={variant} onClose={onClose} dismissible>
          {message}
        </Alert>
      </Col>
    </Row>
  );
}

export default CustomAlert;
