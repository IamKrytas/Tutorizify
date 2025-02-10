import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { Calendar3, People, Briefcase, Book, Search } from 'react-bootstrap-icons';
import { fetchUserData, fetchDashboardData, fetchMyCurrentBookings, fetchMostPopularTeachers } from '../api/dashboardApi';
import RenderStars from './RenderStars';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [myBookings, setMyBookings] = useState([]);
  const [mostPopularTeachers, setMostPopularTeachers] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  // Funkcja pobierająca informacje o użytkowniku
  const getData = async () => {
    try {
      const response = await fetchUserData();
      if (response.success === true) {
        setUserName(response.user.username);

        // Dashboard info
        const dashboardData = await fetchDashboardData();
        setTotalUsers(dashboardData.info.totalUsers);
        setTotalTeachers(dashboardData.info.totalTeachers);
        setTotalCourses(dashboardData.info.totalCourses);

        // Bookings info
        const myBookings = await fetchMyCurrentBookings();
        setMyBookings(myBookings);

        // Most popular teachers
        const mostPopularTeachers = await fetchMostPopularTeachers();
        setMostPopularTeachers(mostPopularTeachers);

      } else {
        setAlertMessage(response.message);
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage('Wystąpił błąd podczas pobierania danych');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="mb-4 text-center">
        <Col>
          <h1>Witaj {userName}!</h1>
          <p>Dobrze Cię widzieć ponownie</p>
        </Col>
      </Row>

      <Row className="mb-4 text-center">
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Card.Title>Użytkownicy</Card.Title>
              <Card.Text className='fs-5'>{totalUsers}</Card.Text>
              <People size={44} color="#3c8c40" />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Card.Title>Nauczyciele</Card.Title>
              <Card.Text className='fs-5'>{totalTeachers}</Card.Text>
              <Briefcase size={44} color="#6200ea" />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Card.Title>Przedmioty</Card.Title>
              <Card.Text className='fs-5'>{totalCourses}</Card.Text>
              <Book size={44} color="#ff9800" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 text-center">
        <Col>
          <h3>Twoje najbliższe rezerwacje</h3>
          {myBookings.bookings && myBookings.bookings.length > 0 ? (
            <div>
              {myBookings.bookings.map((booking, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Calendar3 size={30} color="#6200ea" className="mb-2" />
                    <div className="ms-3">
                      <Card.Title>{booking.subject}</Card.Title>
                      <Card.Subtitle>{booking.teacher_name}</Card.Subtitle>
                      <Card.Text>
                        {new Date(booking.date).toLocaleDateString('pl-PL', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          weekday: 'long',
                        })}, {booking.start_time} - {booking.end_time}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              <Button variant="primary" onClick={() => navigate('/reservations')}>
                <Calendar3 size={30} color="white" className='me-2' />
                Zarządzaj rezerwacjami
              </Button>
            </div>
          ) : (
            <div>
              <p>Brak rezerwacji do wyświetlenia</p>
              <Button variant="primary" onClick={() => navigate('/search')}>
                <Search size={18} color="white" />
                Znajdź zajęcia
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="text-center mb-4">Proponowani nauczyciele</h3>
          <div className="d-flex overflow-x-auto">
            {mostPopularTeachers.teachers && mostPopularTeachers.teachers.map((teacher, index) => (
              <div className="class-card me-3" style={{ minWidth: '200px', cursor: 'pointer' }} key={index} onClick={() => navigate(`/teachers/${teacher.id}`)}>
                <Card className='text-center'>
                  <Card.Img variant="top" src={teacher.image} />
                  <Card.Body>
                    <Card.Title>{teacher.name}</Card.Title>
                    <Card.Subtitle>{teacher.subject}</Card.Subtitle>
                    <Card.Text>{teacher.level}</Card.Text>
                    <Card.Text> <RenderStars rating={teacher.rating} /> </Card.Text>
                    <Card.Text>{teacher.price} PLN/H</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
