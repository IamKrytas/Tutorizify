import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup } from 'react-bootstrap';

function Reservation() {
    const [availability, setAvailability] = useState([]);
    const token = sessionStorage.getItem('jwtToken');
    // Dostępność danego nauczyciela

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const address = import.meta.env.VITE_BACKEND_URL;
        axios.get(`${address}/availability`, { headers })
            .then(response => {
                console.log(response.data.availability);
                setAvailability(response.data.availability);
            })
            .catch(error => {
                console.error('Błąd pobierania danych o profilu:', error);
            });
    }, []);

    // Pobieramy aktualną ścieżkę URL
    const location = useLocation();
    // Pobieramy wartość parametru "teacher" z adresu URL
    const teacherName = new URLSearchParams(location.search).get("teacher");

    return (
        <>
            <h1 className="text-center">Dostępność nauczyciela {teacherName} </h1>
            <Container>
                {availability.map((day, index) => (
                    <Card key={index} className="my-4">
                        <Card.Body>
                            <Card.Title>Dzień: {day.day}</Card.Title>
                            <ListGroup>
                                {day.hours.map((hour, hourIndex) => (
                                    <ListGroup.Item key={hourIndex}>{hour}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </>
    );
};

export default Reservation;