import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getAboutByIdController } from '../controllers/teacherController';
import { getRatesByIdController } from '../controllers/ratesController';
import RenderStars from '../components/RenderStars';
import { Calendar3, ArrowLeft } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadTeacher(id);
            loadRates(id);
        }
    }, [id]);

    const loadTeacher = async (id) => {
        try {
            const response = await getAboutByIdController(id);
            setTeacher(response.teacher);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania danych nauczyciela');
        } finally {
            setLoading(false);
        }
    };

    const loadRates = async (id) => {
        try {
            const response = await getRatesByIdController(id);
            setRates(response.rates);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania opinii');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
    }

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
            {teacher ? (
                <Card className="p-4 shadow-md">
                    <Row className="justify-content-center mb-2">
                        <Col xs="auto">
                            <Card.Img
                                variant="top"
                                src={teacher.image || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '2px solid #007bff'
                                }}
                            />
                        </Col>
                    </Row>
                    <Card.Body className="text-center">
                        <Card.Title as="h2">{teacher.name}</Card.Title>
                        <Row className="justify-content-center mb-3">
                            <Col xs={10} className="text-center bg-light py-2 rounded">
                                <strong className="text-primary">{teacher.subject}</strong> &bull; {teacher.price} PLN/H
                                <br />
                                <strong className="text-danger">{teacher.level}</strong>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-center mb-4 gap-2">
                                <RenderStars rating={teacher.rating} /> {teacher.rating} / 5.0 ({teacher.ratingCount})
                            </div>

                        </div>
                        <h4 className="text-primary">Dane nauczyciela:</h4>
                        <p><strong>Email:</strong> {teacher.email}</p>
                        <hr />
                        <h4 className="text-primary">Biogram:</h4>
                        <p>{teacher.bio}</p>
                        <hr />
                        <h4 className="text-primary">Opis:</h4>
                        <p>{teacher.description}</p>
                    </Card.Body>
                    <div className="text-center">
                        <Button variant="outline-primary" className="me-2 p-2 fs-5" onClick={() => navigate(`/bookings/${teacher.id}`)}>
                            <Calendar3 size={22} className="me-2" />
                            Zarezerwuj lekcję
                        </Button>
                        <Button variant="outline-danger" className='me-2 p-2 fs-5' onClick={() => navigate(-1)}>
                            <ArrowLeft size={22} className="me-2" />
                            Powrót
                        </Button>
                    </div>
                </Card>
            ) : (
                null
            )}
            {rates.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-center">Opinie uczniów</h2>
                    {rates.map((rate, index) => (
                        <Card key={index} className="p-3 mt-3 shadow-sm">
                            <Card.Body>
                                <Card.Subtitle className="mb-2 text-muted">{new Date(rate.createdAt).toLocaleString()}</Card.Subtitle>
                                <Card.Title>{rate.username}</Card.Title>
                                <Card.Text><RenderStars rating={rate.rating} /></Card.Text>
                                {rate.comment ? (
                                    <Card.Text className="border rounded p-2 bg-light">{rate.comment}</Card.Text>
                                ) : (
                                    <Card.Text className="text-muted fst-italic">Brak komentarza</Card.Text>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4">
                    <Alert variant="info">Brak opinii</Alert>
                </div>
            )}
        </Container>
    );
};

export default TeacherProfile;