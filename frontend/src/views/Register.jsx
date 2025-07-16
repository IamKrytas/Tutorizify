import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { registerUserController } from '../controllers/authController';
import { isPasswordsMatch, isValidEmail, getPasswordStrength } from '../utils/validators';
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = new FormData();
        userData.append('username', username);
        userData.append('email', email);
        userData.append('password', password);
        userData.append('confirmPassword', confirmPassword);
        if (avatar) {
            userData.append('avatar', avatar, 'avatar.jpg');
        }

        const isValid = isPasswordsMatch(password, confirmPassword);
        if (!isValid) {
            toast.error('Hasła nie pasują do siebie');
            window.scrollTo(0, 0);
            return;
        }

        try {
            const result = await registerUserController(userData);
            window.scrollTo(0, 0);
            toast.success(result || 'Rejestracja zakończona sukcesem');
            setTimeout(() => {
                location.reload();
            }, 3000);

        } catch (error) {
            toast.error(error.message || 'Błąd rejestracji');
            window.scrollTo(0, 0);
        }
    }


    return (
        <Container className="justify-content-center align-items-center mt-3">
            <Row className="justify-content-center h-100">
                <Col xs={12} md={8} lg={6}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-4">
                            <h3 className="text-center mb-3 text-primary">Rejestracja</h3>
                            <h6 className="text-center mb-3 text-muted"> Utwórz konto, aby korzystać z aplikacji</h6>
                            <Form onSubmit={handleSubmit}>

                                {/* Nazwa użytkownika */}
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Nazwa użytkownika <span className="text-danger">*</span> <span className="text-muted">(Pozostało {30 - username.length} znaków)</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Wprowadź nazwę"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        maxLength={30}
                                        isInvalid={username && username.length < 3}
                                        isValid={username && username.length >= 3}
                                    />
                                    {username && (
                                        <Form.Text className={username.length >= 3 ? 'text-success' : 'text-danger'}>
                                            {username.length >= 3 ? 'Nazwa użytkownika jest poprawna' : 'Nazwa użytkownika musi mieć co najmniej 3 znaki'}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                {/* Email */}
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Adres E-mail <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Wprowadź email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        isInvalid={email && !isValidEmail(email)}
                                        isValid={email && isValidEmail(email)}
                                        required
                                    />
                                    {email && (
                                        <Form.Text className={isValidEmail(email) ? 'text-success' : 'text-danger'}>
                                            {isValidEmail(email) ? 'Poprawny adres email' : 'Niepoprawny adres email'}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                {/* Hasło */}
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Hasło <span className="text-danger">*</span></Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Wprowadź hasło"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            isValid={password.length >= 6}
                                            isInvalid={password && password.length < 6}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeSlash /> : <Eye />}
                                        </Button>
                                    </div>
                                    {password && (
                                        <div className="mt-2">
                                            <ProgressBar
                                                now={getPasswordStrength(password).percentage}
                                                variant={getPasswordStrength(password).color}
                                                label={getPasswordStrength(password).label}
                                                animated
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                {/* Powtórz hasło */}
                                <Form.Group className="mb-3" controlId="formConfirmPassword">
                                    <Form.Label>Powtórz hasło <span className="text-danger">*</span></Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Powtórz hasło"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            isValid={confirmPassword && confirmPassword === password}
                                            isInvalid={confirmPassword && confirmPassword !== password}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeSlash /> : <Eye />}
                                        </Button>
                                    </div>
                                    {confirmPassword && (
                                        <Form.Text className={confirmPassword === password ? 'text-success' : 'text-danger'}>
                                            {confirmPassword === password ? 'Hasła się zgadzają' : 'Hasła się różnią'}
                                        </Form.Text>
                                    )}
                                </Form.Group>



                                {/* Avatar */}
                                <Form.Group className="mb-3" controlId="formAvatar">
                                    <Form.Label>Wybierz avatar</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setAvatar(e.target.files[0])}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Zarejestruj się
                                </Button>

                                <Form.Text className="text-muted d-block mt-2">
                                    <span className="text-danger">*</span> Pola wymagane
                                </Form.Text>
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