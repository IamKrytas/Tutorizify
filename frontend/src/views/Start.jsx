import { Container, Row, Col, Button } from 'react-bootstrap';

const Start = () => {
    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <Row className="text-center mb-3">
                <Col>
                    <h1 className="display-4">Tutorizify</h1>
                </Col>
            </Row>
            <Row className="text-center mb-4">
                <Col>
                    <p className="lead">Twój sukces zaczyna się tutaj.</p>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center gap-3">
                    <Button variant="primary" href="/logowanie">
                        Logowanie
                    </Button>
                    <Button variant="secondary" href="/rejestracja">
                        Rejestracja
                    </Button>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="text-center">
                    <p>&copy; 2024 - {new Date().getFullYear()} Tutorizify. Wszelkie prawa zastrzeżone.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Start;