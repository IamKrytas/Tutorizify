import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomDialog from "./CustomDialog";
import CustomAlert from './CustomAlert';
import { fetchUserData, updateUserData, fetchMyTeacherProfile } from '../api/profileApi';
import { deleteUser, changeUserEmail, logoutRequest, changePassword, updateUserAvatar } from '../api/authApi';
import { updateMyTeacherProfile } from '../api/teachersApi';
import { fetchActiveSubjects, fetchAllLevels } from '../api/subjectsApi';
import { Book, Briefcase, Calendar3, CheckCircle, Pencil, Person, PersonPlus, XCircle, People, Trash, BoxArrowRight, Key, Envelope, Award } from 'react-bootstrap-icons';

export default function Profile() {
  // Dane użytkownika
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [username, setUsername] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState(null);


  // Dane nauczyciela
  const [teacherName, setTeacherName] = useState('');
  const [teacherBio, setTeacherBio] = useState('');
  const [teacherDescription, setTeacherDescription] = useState('');
  const [teacherPrice, setTeacherPrice] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherLevel, setTeacherLevel] = useState('');
  const [teacherRating, setTeacherRating] = useState('');
  const [teacherStatus, setTeacherStatus] = useState('');
  const [subjectsList, setSubjectsList] = useState('');
  const [levelsList, setLevelsList] = useState('');

  // Dialogi
  const [editProfile, setEditProfile] = useState(false);
  const [editTeacherProfile, setEditTeacherProfile] = useState(false);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isConfirmDialogProfileVisible, setIsConfirmProfileDialogVisible] = useState(false);
  const [isConfirmDialogProfileTeacherVisible, setIsConfirmProfileTeacherDialogVisible] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEmailDialogVisible, setIsEmailDialogVisible] = useState(false);
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const navigate = useNavigate();


  // Pobiera danych użytkownika
  const getUserData = async () => {
    try {
      const response = await fetchUserData();
      if (response.success === true) {
        setEmail(response.user.email);
        setUsername(response.user.username);
        setRegistrationDate(response.user.registration_date);
        setImageUrl(response.user.avatar);
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

  // Pobieranie roli użytkownika
  const fetchRole = async () => {
    try {
      const role = await sessionStorage.getItem('role');
      setRole(role);
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  // Pobieranie danych nauczyciela
  const fetchTeacherProfile = async () => {
    try {
      const response = await fetchMyTeacherProfile();
      if (response.success === true) {
        setTeacherName(response.teacher.name);
        setTeacherBio(response.teacher.bio);
        setTeacherDescription(response.teacher.description);
        setTeacherPrice(response.teacher.price);
        setTeacherSubject(response.teacher.subject);
        setTeacherRating(response.teacher.rating);
        setTeacherLevel(response.teacher.level);
        setTeacherStatus(response.teacher.status);
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

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        await fetchRole();
        await getUserData();

        if (role === '1' || role === '2') {
          await fetchTeacherProfile();
          await loadSubjects();
          await loadLevels();
        }
      } catch (error) {
        setAlertMessage(error.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        window.scrollTo(0, 0);
      }
    };

    initializeProfile();
  }, [role]);


  // Funkcja do wylogowania
  const handleLogout = async () => {
    try {
      await logoutRequest();
      window.location.reload();
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  // Potwierdzenie wylogowania
  const handleConfirmLogout = () => {
    setIsDialogVisible(false);
    handleLogout();
  };

  // Funkcja do edycji danych użytkownika
  const handleEditProfile = () => {
    if (editProfile) {
      setIsConfirmProfileDialogVisible(true);
    } else {
      setEditProfile(true);
    }
  };

  // Funkcja do edycji danych nauczyciela
  const handleEditProfileTeacher = () => {
    if (editTeacherProfile) {
      setIsConfirmProfileTeacherDialogVisible(true);
    } else {
      setEditTeacherProfile(true);
    }
  };

  // Funkcja do anulowania zmian e-maila
  const handleCancelEmailChange = () => {
    setIsEmailDialogVisible(false);
    setPassword('');
    setNewEmail('');
  };

  // Funkcja do anulowania zmian hasła
  const handleCancelChangePassword = () => {
    setIsPasswordDialogVisible(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };


  // Funkcja do potwierdzenia zapisu zmian profilu
  const handleConfirmSaveProfile = async () => {
    const validUsername = username.trim();
    const regex = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
    if (validUsername.length === 0 || !validUsername.match(regex)) {
      setAlertMessage('Nazwa użytkownika nie może być pusta ani zawierać znaków specjalnych');
      setAlertVariant('danger');
      setShowAlert(true);
      setIsConfirmProfileDialogVisible(false);
      return;
    }
    setIsConfirmProfileDialogVisible(false);
    try {
      const response = await updateUserData(validUsername);
      if (response.success) {
        setEditProfile(false);
        getUserData();
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  // Funkcja do potwierdzenia zapisu zmian profilu nauczyciela
  const handleConfirmSaveProfileTeacher = async () => {
    if (typeof teacherName !== 'string' || teacherName.trim().length < 6 || teacherPrice <= 0 || !teacherSubject) {
      setAlertMessage('Imię i nazwisko musi mieć minimum 6 znaków, a cena i przedmiot nie mogą być puste.');
      setAlertVariant('danger');
      setShowAlert(true);
      setIsConfirmProfileTeacherDialogVisible(false);
      return;
    }

    const validName = teacherName.trim();
    const validBio = typeof teacherBio === 'string' ? teacherBio.trim() : "";
    const validDescription = typeof teacherDescription === 'string' ? teacherDescription.trim() : "";
    const validPrice = teacherPrice;

    setIsConfirmProfileTeacherDialogVisible(false);
    try {
      const response = await updateMyTeacherProfile(validName, validBio, validDescription, validPrice, teacherSubject, teacherLevel);
      if (response.success) {
        setEditTeacherProfile(false);
        fetchTeacherProfile();
        setAlertMessage(response.message);
        setAlertVariant('success');
        setShowAlert(true);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };


  // Funkcja do anulowania zapisu zmian profilu
  const handleCancelProfileSave = () => {
    setIsConfirmProfileDialogVisible(false);
    setEditProfile(false);
    getUserData();
  };

  // Funkcja do anulowania zapisu zmian profilu nauczyciela
  const handleCancelProfileTeacherSave = () => {
    setIsConfirmProfileTeacherDialogVisible(false);
    setEditTeacherProfile(false);
    fetchTeacherProfile();
  };

  // Funkcja do zmiany e-maila
  const handleEmailChange = async () => {
    if (!newEmail.includes('@')) {
      setAlertMessage('Wprowadź prawidłowy adres e-mail');
      setAlertVariant('danger');
      setShowAlert(true);
      setIsEmailDialogVisible(false);
      window.scrollTo(0, 0);
      return;
    }
    try {
      const response = await changeUserEmail(newEmail, password);
      if (response.success === true) {
        setEmail(newEmail);
        setPassword('');
        setNewEmail('');
        setIsEmailDialogVisible(false);
        setAlertMessage(response.message || 'E-mail został zmieniony pomyślnie');
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        setIsEmailDialogVisible(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
    }
  };

  // Funkcja do usunięcia konta
  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser();
      if (response.success === true) {
        window.location.reload();
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

  // Funkcja do zmiany hasła
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setAlertMessage('Podane hasła nie są identyczne');
      setAlertVariant('danger');
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    }
    try {
      const response = await changePassword(newPassword, password);
      if (response.success) {
        setAlertMessage(response.message || 'Twoje hasło zostało zmienione');
        setAlertVariant('success');
        setShowAlert(true);
        setIsPasswordDialogVisible(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        window.scrollTo(0, 0);
      } else {
        setAlertMessage(response.message || 'Wystąpił problem z serwerem');
        setAlertVariant('danger');
        setShowAlert(true);
        setIsPasswordDialogVisible(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setAlertMessage(error.message || 'Wystąpił problem z serwerem');
      setAlertVariant('danger');
      setShowAlert(true);
      setIsPasswordDialogVisible(false);
      window.scrollTo(0, 0);
    }
  }

  // Funkcja do przechwycenia wyboru zdjęcia
  const handlerFileSelect = async () => {
    const input = document.getElementById('fileInput');
    input.click();
  };

  // Funkcja do zmiany zdjęcia profilowego
  const handlerChangeImage = async (e) => {
    try {
      const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

      if (!file) {
        console.log("No image selected.");
        return;
      }

      const uri = URL.createObjectURL(file);

      if (!uri) {
        console.log("No URI found in the selected image.");
        return;
      }

      setImageUrl(uri);
      const response = await updateUserAvatar(file);
      if (response.success === true) {
        setAlertMessage(response.message || 'Zaktualizowano twój avatar');
        setAlertVariant('success');
        setShowAlert(true);
        window.scrollTo(0, 0);
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

  // Funkcja do pobrania przedmiotów
  const loadSubjects = async () => {
    try {
      const response = await fetchActiveSubjects();
      if (response.success === true) {
        setSubjectsList(response.subjects);
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

  // Funkcja do pobierania poziomów nauczania
  const loadLevels = async () => {
    try {
      const response = await fetchAllLevels();
      if (response.success === true) {
        setLevelsList(response.levels);
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
    <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
      <CustomAlert
        show={showAlert}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
      />
      <Row className="mb-4 text-center">
        <Col>
          <Button variant="link" onClick={handlerFileSelect}>
            <Card.Img
              src={imageUrl || 'https://via.placeholder.com/100'}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #007bff',
                marginBottom: '10px'
              }}
            />
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlerChangeImage}
          />
          <h3 style={{ fontWeight: 'bold', color: '#333' }}>{username}</h3>
        </Col>
      </Row>

      <Card className="mb-4 text-center">
        <Card.Title className="text-center mt-4" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>Panel Użytkownika</Card.Title>
        <Row className="text-center mb-3">
          <Col>
            <Button variant="outline-primary" onClick={handleEditProfile} className="transparent-btn">
              {editProfile ? (
                <CheckCircle size={28} />
              ) : (
                <Pencil size={28} />
              )}
            </Button>

            {editProfile ? (
              <Button variant="outline-danger" onClick={() => setEditProfile(false)} className="transparent-btn">
                <XCircle size={28} />
              </Button>
            ) : null}
          </Col>
        </Row>
        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Nazwa użytkownika:</h5>
        <div className="d-flex justify-content-center">
          {editProfile ? (
            <Form.Control
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="text-center"
              style={{ maxWidth: '400px' }}
            />
          ) : (
            <p style={{ color: '#666' }}>{username}</p>
          )}
        </div>
        <div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>E-mail:</h5>
          <p style={{ color: '#666' }}>{email}</p>
        </div>
        <div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Data rejestracji:</h5>
          <p style={{ color: '#666' }}>{registrationDate}</p>
        </div>
      </Card>

      {(role === '2' || role === '1') && (
        <Card className="mb-4 text-center">
          <Card.Title className="text-center mt-4" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>Panel Nauczyciela</Card.Title>
          <Row className="text-center mb-3">
            <Col>
              <Button variant="outline-primary" onClick={handleEditProfileTeacher} className="transparent-btn">
                {editTeacherProfile ? (
                  <CheckCircle size={28} />
                ) : (
                  <Pencil size={28} />
                )}
              </Button>
              {editTeacherProfile ? (
                <Button variant="outline-danger" onClick={() => setEditTeacherProfile(false)} className="transparent-btn">
                  <XCircle size={28} />
                </Button>
              ) : null}
            </Col>
          </Row>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Imię i nazwisko:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Control
                value={teacherName}
                placeholder="Wpisz imię i nazwisko"
                onChange={e => setTeacherName(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              />
            ) : (
              <p style={{ color: '#666' }}>{teacherName}</p>
            )}
          </div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Bio:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Control
                value={teacherBio}
                placeholder="Wpisz swoje bio"
                onChange={e => setTeacherBio(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              />
            ) : (
              <p style={{ color: '#666' }}>{teacherBio}</p>
            )}
          </div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Opis:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Control
                value={teacherDescription}
                placeholder="Wpisz opis"
                onChange={e => setTeacherDescription(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              />
            ) : (
              <p style={{ color: '#666' }}>{teacherDescription}</p>
            )}
          </div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Cena za godzinę:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Control
                value={teacherPrice.toString()}
                placeholder="Wpisz cenę"
                type="number"
                onChange={e => setTeacherPrice(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              />
            ) : (
              <p style={{ color: '#666' }}>{teacherPrice.toString()}</p>
            )}
          </div>
          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Przedmiot:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Select
                value={teacherSubject}
                onChange={e => setTeacherSubject(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              >
                <option>Wybierz przedmiot</option>
                {subjectsList.map(subj => (
                  <option key={subj.id} value={subj.name}>
                    {subj.name}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <p style={{ color: '#666' }}>{teacherSubject}</p>
            )}
          </div>

          <h5 style={{ fontWeight: 'bold', color: '#333' }}>Poziom:</h5>
          <div className="d-flex justify-content-center">
            {editTeacherProfile ? (
              <Form.Select
                value={teacherLevel}
                onChange={e => setTeacherLevel(e.target.value)}
                className="text-center"
                style={{ maxWidth: '400px' }}
              >
                <option>Wybierz poziom</option>
                {levelsList.map(level => (
                  <option key={level.id} value={level.name}>
                    {level.name}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <p style={{ color: '#666' }}>{teacherLevel}</p>
            )}
          </div>


          <div>
            <h5 style={{ fontWeight: 'bold', color: '#333' }}>Ocena:</h5>
            <p style={{ color: '#666' }}>
              {teacherRating === 0 ? 'Brak ocen' : teacherRating}
            </p>
          </div>
          <div>
            <h5 style={{ fontWeight: 'bold', color: '#333' }}>Status:</h5>
            <p style={{ color: '#666' }}>
              {teacherStatus === 1 ? 'Aktywny' : 'Nieaktywny'}
            </p>
          </div>
        </Card>
      )}

      {(role === '3' || role === '1') && (
        <Card className="mb-4 mx-auto p-4 justify-content-center" style={{ maxWidth: '400px' }}>
          <Card.Title className="text-center" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>Zostań nauczycielem</Card.Title>
          <Button variant="outline-success" onClick={() => navigate('/teachers/register')} className="align-items-center">
            <PersonPlus size={20} color="#198754" className="me-2" />
            Zostań nauczycielem
          </Button>
        </Card>
      )}
      {role === '1' && (
        <Card className="mb-4 mx-auto p-4 justify-content-center" style={{ maxWidth: '400px' }}>
          <Card.Title className="text-center" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>
            Administrator Panel
          </Card.Title>

          <Button variant="outline-primary" onClick={() => navigate('/admin/users')} className="mb-2 align-items-center">
            <People size={20} color="#0d6efd" className="me-2" />
            Panel Użytkowników
          </Button>

          <Button variant="outline-primary" onClick={() => navigate('/admin/teachers')} className="mb-2 align-items-center">
            <Briefcase size={20} color="#0d6efd" className="me-2" />
            Panel Nauczycieli
          </Button>

          <Button variant="outline-primary" onClick={() => navigate('/admin/subjects')} className="mb-2 align-items-center">
            <Book size={20} color="#0d6efd" className="me-2" />
            Panel Przedmiotów
          </Button>

          <Button variant="outline-primary" onClick={() => navigate('/admin/bookings')} className="mb-2 align-items-center">
            <Calendar3 size={20} color="#0d6efd" className="me-2" />
            Panel Rezerwacji
          </Button>

          <Button variant="outline-primary" onClick={() => navigate('/admin/rates')} className="align-items-center">
            <Award size={20} color="#0d6efd" className="me-2" />
            Panel Ocen
          </Button>
        </Card>
      )}

      <Card className="mb-4 mx-auto p-4" style={{ maxWidth: '400px' }}>
        <Card.Title className="text-center" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>
          Zarządzaj kontem
        </Card.Title>
        <Button variant="outline-primary" onClick={() => setIsEmailDialogVisible(true)} className="mb-2 align-items-center">
          <Envelope size={20} color="#0d6efd" className="me-2" />
          Zmień e-mail
        </Button>
        <Button variant="outline-primary" onClick={() => setIsPasswordDialogVisible(true)} className="mb-2 align-items-center">
          <Key size={20} color="#0d6efd" className="me-2" />
          Zmień hasło
        </Button>
        <Button variant="outline-danger" onClick={() => setIsDeleteDialogVisible(true)} className="mb-2 align-items-center">
          <Trash size={20} color="#dc3545" className="me-2" />
          Usuń konto
        </Button>
        <Button variant="outline-danger" onClick={() => setIsDialogVisible(true)} className="align-items-center">
          <BoxArrowRight size={20} color="#dc3545" className="me-2" />
          Wyloguj się
        </Button>
      </Card>

      {/* Dialog potwierdzający zmiany profilu */}
      <CustomDialog
        show={isConfirmDialogProfileVisible}
        onHide={handleCancelProfileSave}
        title="Potwierdź zmiany"
        description="Czy chcesz zapisać wprowadzone zmiany?"
        onConfirm={handleConfirmSaveProfile}
        confirmLabel="Zapisz"
        cancelLabel="Anuluj"
      />

      {/* Dialog potwierdzający zmiany profilu nauczyciela */}
      <CustomDialog
        show={isConfirmDialogProfileTeacherVisible}
        onHide={handleCancelProfileTeacherSave}
        title="Potwierdź zmiany"
        description="Czy chcesz zapisać wprowadzone zmiany?"
        onConfirm={handleConfirmSaveProfileTeacher}
        confirmLabel="Zapisz"
        cancelLabel="Anuluj"
      />

      {/* Dialog zmiany hasła */}
      <CustomDialog
        show={isPasswordDialogVisible}
        onHide={handleCancelChangePassword}
        title="Zmień hasło"
        inputs={[
          {
            placeholder: 'Nowe hasło',
            type: 'password',
            value: newPassword,
            onChange: e => setNewPassword(e.target.value),
          },
          {
            placeholder: 'Powtórz hasło',
            type: 'password',
            value: confirmPassword,
            onChange: e => setConfirmPassword(e.target.value),
          },
          {
            placeholder: 'Stare hasło',
            type: 'password',
            value: password,
            onChange: e => setPassword(e.target.value),
          },
        ]}
        onConfirm={handleChangePassword}
        confirmLabel="Zapisz"
        cancelLabel="Anuluj"
      />

      {/* Dialog zmiany e-maila */}
      <CustomDialog
        show={isEmailDialogVisible}
        onHide={handleCancelEmailChange}
        title="Zmień e-mail"
        inputs={[
          {
            placeholder: 'Nowy e-mail',
            type: 'email',
            value: newEmail,
            onChange: e => setNewEmail(e.target.value),
          },
          {
            placeholder: 'Hasło',
            type: 'password',
            value: password,
            onChange: e => setPassword(e.target.value),
          },
        ]}
        onConfirm={handleEmailChange}
        confirmLabel="Zapisz"
        cancelLabel="Anuluj"
      />

      {/* Dialog potwierdzający wylogowanie */}
      <CustomDialog
        show={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        title="Wylogowanie"
        description="Czy na pewno chcesz się wylogować?"
        onConfirm={handleConfirmLogout}
        confirmLabel="Tak"
        cancelLabel="Nie"
      />

      {/* Dialog potwierdzający usunięcie konta */}
      <CustomDialog
        show={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        title="Usuwanie konta"
        description="Czy na pewno chcesz usunąć swoje konto?"
        onConfirm={handleDeleteAccount}
        confirmLabel="Tak"
        cancelLabel="Nie"
      />

    </Container>
  )
};