import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomAlert from './CustomAlert';
import { registerRequest } from '../api/authApi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sprawdzenie, czy hasła się zgadzają
    if (password !== confirmPassword) {
      setAlertMessage('Hasła muszą być takie same.');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const response = await registerRequest(username, email, password, confirmPassword, avatar);
      if (response.success === true) {
        setAlertMessage('Rejestracja zakończona sukcesem!');
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          location.reload();
        }, 3000);
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

  return (
    <Container className="justify-content-center align-items-center mt-3">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="justify-content-center h-100">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <h3 className="text-center mb-3 text-primary">Rejestracja</h3>
              <h6 className="text-center mb-3 text-muted"> Utwórz konto, aby korzystać z aplikacji</h6>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nazwa użytkownika</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Wprowadź nazwę"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Wprowadź email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Powtórz hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAvatar">
                  <Form.Label>Wybierz avatar</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                >
                  Zarejestruj się
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="bg-white text-center py-3">
              <p className="mb-0">
                Masz już konto?{' '}
                <a href="/logowanie" className="text-primary">
                  Zaloguj się
                </a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
