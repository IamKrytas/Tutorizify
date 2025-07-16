import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CustomDialog({ show, onHide, title, description, inputs = [], onConfirm, confirmLabel, cancelLabel }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {description && <p>{description}</p>}
                {inputs.map((input, index) => (
                    <Form.Group controlId={`input-${index}`} key={index} className="mb-3">
                        <Form.Control
                            type={input.type || 'text'}
                            placeholder={input.placeholder}
                            value={input.value}
                            onChange={input.onChange}
                            className="text-dark"
                        />
                    </Form.Group>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {cancelLabel || 'Anuluj'}
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    {confirmLabel || 'Zapisz'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CustomDialog;