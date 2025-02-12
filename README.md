# Tutorizify 
Multi-platform tutoring booking system for students and tutors. The application allows users to browse, book, and manage tutoring sessions using advanced search and filtering options. It is available for both web and Android platforms. Check out the [https://iamkrytas.smallhost.pl](https://iamkrytas.smallhost.pl).

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project structure](#project-structure)

## Features
- Registration & login system
- Advanced search system with filtering & sorting options
- Booking system
- Booking management system
- Rating system
- User profile management
- Admin panel for managing users, teachers, bookings, subjects, and rates
- Responsive design
- Multi-platform support (web & Android)

## Technologies Used
### Core:
![Technologies Used](https://skillicons.dev/icons?i=react,python,mysql)

### Others:
![Technologies Used](https://skillicons.dev/icons?i=js,flask,bootstrap,vite,babel)


## Project structure
```
.
├── backend
│   ├── requirements.txt
│   ├── server.py
│   └── static.py
├── frontend
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── api
│       |   ├── authApi.jsx
│       |   ├── bookingsApi.jsx
│       |   ├── dashboardApi.jsx
│       |   ├── levelsApi.jsx
│       |   ├── profileApi.jsx
│       |   ├── searchApi.jsx
│       |   ├── subjectsApi.jsx
│       |   ├── teachersApi.jsx
│       |   └── usersApi.jsx
│       └── app
│           ├── admin
│           |   ├── AdminBookings.jsx
│           |   ├── AdminRates.jsx
│           |   ├── AdminSubjects.jsx
│           |   ├── AdminTeachers.jsx
│           |   └── AdminUsers.jsx
│           ├── bookings
│           |   ├── ManageBookings.jsx
│           |   └── RegisterBookings.jsx
│           ├── teachers
│           |   ├── AboutTeacher.jsx
│           |   ├── RegisterTeacher.jsx
│           |   └── rates
│           |       └── RateTeacher.jsx
│           ├── CustomAlert.jsx
│           ├── CustomDialog.jsx
│           ├── Home.jsx
│           ├── Logowanie.jsx
│           ├── Navbar.jsx
│           ├── Profile.jsx
│           ├── Rejestracja.jsx
│           ├── RenderStars.jsx
│           ├── Reservation.jsx
│           ├── Search.jsx
│           ├── Start.jsx
│           ├── Wyloguj.jsx
│           └── getBackendAddress.jsx
|
└── mobile
    ├── api
    |   ├── authApi.jsx
    |   ├── bookingsApi.jsx
    |   ├── dashboardApi.jsx
    |   ├── levelsApi.jsx
    |   ├── profileApi.jsx
    |   ├── searchApi.jsx
    |   ├── subjectsApi.jsx
    |   ├── teachersApi.jsx
    |   └── usersApi.jsx
    └── app
        ├── (tabs)
        |   ├── _layout.jsx
        |   ├── home.jsx
        |   ├── profile.jsx
        |   ├── reservations.jsx
        |   └── search.jsx
        ├── admin
        |   ├── bookings.jsx
        |   ├── rates.jsx
        |   ├── subjects.jsx
        |   ├── teachers.jsx
        |   └── users.jsx
        ├── bookings
        |   ├── manage.jsx
        |   └── [id].jsx
        ├── teachers
        |   ├── [id].jsx
        |   ├── register.jsx
        |   └── rates
        |       └── [id].jsx
        ├── _layout.jsx
        ├── index.jsx
        ├── login.jsx
        └── register.jsx

```