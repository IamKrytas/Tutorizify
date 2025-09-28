import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomDialog from "../components/CustomDialog";
import { toast } from 'react-toastify';
import { getUserInfoController, updateProfileController, updateAvatarController, updatePasswordController, deleteUserController } from '../controllers/userController';
import { getMyTeacherProfileController, updateMyTeacherProfileController } from '../controllers/teacherController';
import { getAllSubjectsController, getAllLevelsController } from '../controllers/subjectController';
import { logoutUserController } from '../controllers/authController';
import { Book, Briefcase, Calendar3, CheckCircle, Pencil, PersonPlus, XCircle, People, Trash, BoxArrowRight, Key, Award } from 'react-bootstrap-icons';

export default function Profile() {
    // Dane użytkownika
    const [email, setEmail] = useState('');
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
    const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);

    const navigate = useNavigate();

    const userData = {
        email,
        username,
    }

    const teacherData = {
        name: teacherName.trim(),
        bio: teacherBio ? teacherBio.trim() : "",
        description: teacherDescription ? teacherDescription.trim() : "",
        price: teacherPrice,
        subject: teacherSubject,
        level: teacherLevel,
    };

    const passwordData = {
        old_password: password,
        new_password: newPassword,
    }


    // Pobiera danych użytkownika
    const getUserData = async () => {
        try {
            const response = await getUserInfoController();
            setEmail(response.user.email);
            setUsername(response.user.username);
            setRegistrationDate(response.user.registration_date);
            setImageUrl(response.user.avatar);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas pobierania danych użytkownika');
        }
    };

    // Pobieranie roli użytkownika
    const fetchRole = async () => {
        try {
            const role = localStorage.getItem('role');
            setRole(role);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas pobierania roli użytkownika');
        }
    };

    // Pobieranie danych nauczyciela
    const fetchTeacherProfile = async () => {
        try {
            const response = await getMyTeacherProfileController();
            setTeacherName(response.teacher_profile.name);
            setTeacherBio(response.teacher_profile.bio);
            setTeacherDescription(response.teacher_profile.description);
            setTeacherPrice(response.teacher_profile.price);
            setTeacherSubject(response.teacher_profile.subject);
            setTeacherRating(response.teacher_profile.rating);
            setTeacherLevel(response.teacher_profile.level);
            setTeacherStatus(response.teacher_profile.status);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas pobierania profilu nauczyciela');
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
                window.scrollTo(0, 0);
                toast.error(error.message || 'Błąd podczas inicjalizacji profilu');
            }
        };

        initializeProfile();
    }, [role]);


    // Funkcja do wylogowania
    const handleLogout = async () => {
        try {
            await logoutUserController();
            toast.success("Pomyślnie wylogowano");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas wylogowania');
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
            toast.error('Nazwa użytkownika nie może być pusta ani zawierać znaków specjalnych');
            setIsConfirmProfileDialogVisible(false);
            return;
        }
        setIsConfirmProfileDialogVisible(false);
        try {
            const response = await updateProfileController(userData);
            toast.success(response.message || 'Profil został pomyślnie zaktualizowany');
            setEditProfile(false);
            getUserData();
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas aktualizacji profilu');
        }
    };

    // Funkcja do potwierdzenia zapisu zmian profilu nauczyciela
    const handleConfirmSaveProfileTeacher = async () => {
        if (typeof teacherName !== 'string' || teacherName.trim().length < 6 || teacherPrice <= 0 || !teacherSubject) {
            toast.error('Imię i nazwisko musi mieć minimum 6 znaków, cena i przedmiot nie mogą być puste oraz musi być wybrany przedmiot oraz poziom nauczania');
            setIsConfirmProfileTeacherDialogVisible(false);
            return;
        }

        setIsConfirmProfileTeacherDialogVisible(false);
        try {
            const response = await updateMyTeacherProfileController(teacherData);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Profil nauczyciela został pomyślnie zaktualizowany');
            setEditTeacherProfile(false);
            fetchTeacherProfile();
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Wystąpił błąd podczas aktualizacji profilu nauczyciela');
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


    // Funkcja do usunięcia konta
    const handleDeleteAccount = async () => {
        try {
            const response = await deleteUserController();
            toast.success(response.message || 'Konto zostało pomyślnie usunięte');
            setIsDeleteDialogVisible(false);
            setTimeout(() => {
                handleLogout();
                window.location.reload();
            }, 3000);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas usuwania konta');
        }
    };

    // Funkcja do zmiany hasła
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            window.scrollTo(0, 0);
            toast.error('Podane hasła nie są identyczne');
            return;
        }
        try {
            const response = await updatePasswordController(passwordData);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Hasło zostało pomyślnie zmienione');
            setIsPasswordDialogVisible(false);
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas zmiany hasła');
            setIsPasswordDialogVisible(false);
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
            const response = await updateAvatarController(file);
            window.scrollTo(0, 0);
            toast.success(response.message || 'Zdjęcie profilowe zostało pomyślnie zaktualizowane');
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas aktualizacji zdjęcia profilowego');
        }
    };

    // Funkcja do pobrania przedmiotów
    const loadSubjects = async () => {
        try {
            const response = await getAllSubjectsController();
            setSubjectsList(response.subjects);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania przedmiotów');
        }
    };

    // Funkcja do pobierania poziomów nauczania
    const loadLevels = async () => {
        try {
            const response = await getAllLevelsController();
            setLevelsList(response.levels);
        } catch (error) {
            window.scrollTo(0, 0);
            toast.error(error.message || 'Błąd podczas ładowania poziomów nauczania');
        }
    };

    return (
        <Container className="mt-4 mb-4" style={{ maxWidth: '800px' }}>
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

            <Card className="mb-4 text-center px-4 py-3">
                <Card.Title className="text-center mt-2" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>
                    Panel Użytkownika
                </Card.Title>

                <Row className="text-center mb-3">
                    <Col>
                        <Button
                            variant={editProfile ? "outline-success" : "outline-primary"}
                            onClick={handleEditProfile}
                            className="transparent-btn me-2"
                        >
                            {editProfile ? <CheckCircle size={28} /> : <Pencil size={28} />}
                        </Button>

                        {editProfile && (
                            <Button
                                variant="outline-danger"
                                onClick={() => setEditProfile(false)}
                                className="transparent-btn"
                            >
                                <XCircle size={28} />
                            </Button>
                        )}
                    </Col>
                </Row>


                {/* Username Field */}
                <div className="d-flex flex-column align-items-center">
                    <h5 style={{ fontWeight: 'bold', color: '#333' }}>Nazwa użytkownika:</h5>
                    {editProfile ? (
                        <div className="d-flex flex-column align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
                            <small
                                className={`mb-1 ${30 - username.length < 5 ? 'text-danger' : 'text-muted'
                                    }`}
                            >
                                Pozostało {30 - username.length} znaków
                            </small>
                            <Form.Control
                                value={username ?? ''}
                                onChange={(e) => setUsername(e.target.value)}
                                className="text-center"
                                maxLength={30}
                                type="text"
                            />
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>{username}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-2">
                    <h5 style={{ fontWeight: 'bold', color: '#333' }}>E-mail:</h5>
                    <p style={{ color: '#666' }}>{email}</p>
                </div>

                {/* Registration Date */}
                <div className="mb-2">
                    <h5 style={{ fontWeight: 'bold', color: '#333' }}>Data rejestracji:</h5>
                    <p style={{ color: '#666' }}>{new Date(registrationDate).toLocaleString()}</p>
                </div>
            </Card>


            {(role === '2' || role === '1') && (
                <Card className="mb-4 text-center px-4 py-3">
                    <Card.Title className="text-center mt-2" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>
                        Panel Nauczyciela
                    </Card.Title>

                    <Row className="text-center mb-3">
                        <Col>
                            <Button
                                variant={editTeacherProfile ? "outline-success" : "outline-primary"}
                                onClick={handleEditProfileTeacher}
                                className="transparent-btn me-2"
                            >
                                {editTeacherProfile ? <CheckCircle size={28} /> : <Pencil size={28} />}
                            </Button>


                            {editTeacherProfile && (
                                <Button
                                    variant="outline-danger"
                                    onClick={() => setEditTeacherProfile(false)}
                                    className="transparent-btn"
                                >
                                    <XCircle size={28} />
                                </Button>
                            )}
                        </Col>
                    </Row>

                    {/* Imię i nazwisko */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Imię i nazwisko:</h5>
                        {editTeacherProfile ? (
                            <div className="d-flex flex-column align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
                                <small className={`mb-1 ${50 - (teacherName?.length || 0) < 10 ? 'text-danger' : 'text-muted'}`}>
                                    Pozostało {50 - (teacherName?.length || 0)} znaków
                                </small>
                                <Form.Control
                                    value={teacherName ?? ''}
                                    placeholder="Wpisz imię i nazwisko"
                                    onChange={e => setTeacherName(e.target.value)}
                                    className="text-center"
                                    maxLength={50}
                                />
                            </div>
                        ) : (
                            <p style={{ color: '#666' }}>{teacherName}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Bio:</h5>
                        {editTeacherProfile ? (
                            <div className="d-flex flex-column align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
                                <small className={`mb-1 ${50 - (teacherBio?.length || 0) < 10 ? 'text-danger' : 'text-muted'}`}>
                                    Pozostało {50 - (teacherBio?.length || 0)} znaków
                                </small>
                                <Form.Control
                                    value={teacherBio ?? ''}
                                    placeholder="Wpisz swoje bio"
                                    onChange={e => setTeacherBio(e.target.value)}
                                    className="text-center"
                                    maxLength={50}
                                />
                            </div>
                        ) : (
                            <p style={{ color: '#666' }}>{teacherBio}</p>
                        )}
                    </div>

                    {/* Opis */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Opis:</h5>
                        {editTeacherProfile ? (
                            <div className="d-flex flex-column align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
                                <small className={`mb-1 ${100 - (teacherDescription?.length || 0) < 15 ? 'text-danger' : 'text-muted'}`}>
                                    Pozostało {100 - (teacherDescription?.length || 0)} znaków
                                </small>
                                <Form.Control
                                    value={teacherDescription ?? ''}
                                    placeholder="Wpisz opis"
                                    onChange={e => setTeacherDescription(e.target.value)}
                                    className="text-center"
                                    maxLength={100}
                                />
                            </div>
                        ) : (
                            <p style={{ color: '#666' }}>{teacherDescription}</p>
                        )}
                    </div>

                    {/* Cena */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Cena za godzinę (zł):</h5>
                        {editTeacherProfile ? (
                            <Form.Control
                                value={teacherPrice.toString() ?? ''}
                                placeholder="Wpisz cenę"
                                type="number"
                                onChange={e => setTeacherPrice(e.target.value)}
                                className="text-center"
                                style={{ maxWidth: '400px' }}
                                min="0"
                            />
                        ) : (
                            <p style={{ color: '#666' }}>{teacherPrice.toString()}</p>
                        )}
                    </div>

                    {/* Przedmiot */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Przedmiot:</h5>
                        {editTeacherProfile ? (
                            <Form.Select
                                value={teacherSubject ?? ''}
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

                    {/* Poziom */}
                    <div className="mb-2 d-flex flex-column align-items-center">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Poziom:</h5>
                        {editTeacherProfile ? (
                            <Form.Select
                                value={teacherLevel ?? ''}
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

                    {/* Ocena */}
                    <div className="mb-2">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Ocena:</h5>
                        <p style={{ color: '#666' }}>{teacherRating === 0 ? 'Brak ocen' : teacherRating}</p>
                    </div>

                    {/* Status */}
                    <div className="mb-2">
                        <h5 style={{ fontWeight: 'bold', color: '#333' }}>Status:</h5>
                        <p style={{ color: '#666' }}>{teacherStatus === 0 ? 'Nieaktywny' : 'Aktywny'}</p>
                    </div>
                </Card>

            )}


            {(role === '3' || role === '1') && (
                <Card className="mb-4 mx-auto p-4 justify-content-center" style={{ maxWidth: '400px' }}>
                    <Card.Title className="text-center" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>Zostań nauczycielem</Card.Title>
                    <Button variant="outline-success" onClick={() => navigate('/teachers/register')} className="align-items-center">
                        <PersonPlus size={20} className="me-2" />
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
                        <People size={20} className="me-2" />
                        Panel Użytkowników
                    </Button>

                    <Button variant="outline-primary" onClick={() => navigate('/admin/teachers')} className="mb-2 align-items-center">
                        <Briefcase size={20} className="me-2" />
                        Panel Nauczycieli
                    </Button>

                    <Button variant="outline-primary" onClick={() => navigate('/admin/subjects')} className="mb-2 align-items-center">
                        <Book size={20} className="me-2" />
                        Panel Przedmiotów
                    </Button>

                    <Button variant="outline-primary" onClick={() => navigate('/admin/bookings')} className="mb-2 align-items-center">
                        <Calendar3 size={20} className="me-2" />
                        Panel Rezerwacji
                    </Button>

                    <Button variant="outline-primary" onClick={() => navigate('/admin/rates')} className="align-items-center">
                        <Award size={20} className="me-2" />
                        Panel Ocen
                    </Button>
                </Card>
            )}

            <Card className="mb-4 mx-auto p-4" style={{ maxWidth: '400px' }}>
                <Card.Title className="text-center" style={{ fontSize: '22px', fontWeight: '600', color: '#333' }}>
                    Zarządzaj kontem
                </Card.Title>
                <Button variant="outline-primary" onClick={() => setIsPasswordDialogVisible(true)} className="mb-2 align-items-center">
                    <Key size={20} className="me-2" />
                    Zmień hasło
                </Button>
                <Button variant="outline-danger" onClick={() => setIsDeleteDialogVisible(true)} className="mb-2 align-items-center">
                    <Trash size={20} className="me-2" />
                    Usuń konto
                </Button>
                <Button variant="outline-danger" onClick={() => setIsDialogVisible(true)} className="align-items-center">
                    <BoxArrowRight size={20} className="me-2" />
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