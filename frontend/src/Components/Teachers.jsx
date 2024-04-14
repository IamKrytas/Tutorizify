import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ArrowRight  } from 'react-bootstrap-icons';

function Teachers() {
    const [teachers, setTeachers] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    // useState for if sorting is needed
    const [sorted, setSorted] = useState(false);
    const token = sessionStorage.getItem('jwtToken');

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        axios.get('http://localhost:5000/teachers', { headers })
            .then(response => {
                console.log(response.data.teachers);
                setTeachers(response.data.teachers);
            })
            .catch(error => {
                console.error('Błąd pobierania danych o nauczycielach:', error);
            });
    }, []);

    const handleSubjectButtonClick = (subject) => {
        if (selectedSubject === subject) {
            // Jeśli kliknięto już zaznaczony przycisk, odznacz go
            setSelectedSubject(null);
        } else {
            // W przeciwnym razie zaznacz przycisk dla wybranego przedmiotu
            setSelectedSubject(subject);
        }
    };

    const handlePriceButtonClick = (price) => {
        if (selectedPrice === price) {
            // Jeśli kliknięto już zaznaczoną cenę, odznacz ją
            setSelectedPrice(null);
        } else {
            // W przeciwnym razie zaznacz cenę dla wybranej wartości
            setSelectedPrice(price);
        }
    };


    return (
        <div className="row">
            <div className="col-3 mx-auto">
                <h2 className="text-center">Przedmioty</h2>
                <ul className="list-group">
                    <Button variant={selectedSubject === null ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick(null)}>Wszystkie</Button>
                    <Button variant={selectedSubject === 'Math' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Math')}>Math</Button>
                    <Button variant={selectedSubject === 'Phis' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Phis')}>Phis</Button>
                    <Button variant={selectedSubject === 'Chem' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Chem')}>Chem</Button>
                    <Button variant={selectedSubject === 'Biol' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Biol')}>Biol</Button>
                    <Button variant={selectedSubject === 'Geog' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Geog')}>Geog</Button>
                    <Button variant={selectedSubject === 'Engl' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Engl')}>Engl</Button>
                    <Button variant={selectedSubject === 'Germ' ? "primary" : "outline-primary"} onClick={() => handleSubjectButtonClick('Germ')}>Germ</Button>
                </ul>

                {/* price filtrs */}
                <h2 className="text-center">Cena</h2>
                <ul className="list-group">
                    <Button variant={selectedPrice === null ? "primary" : "outline-primary"} onClick={() => handlePriceButtonClick(null)}>Dowolna cena</Button>
                    <Button variant={selectedPrice === 50 ? "primary" : "outline-primary"} onClick={() => handlePriceButtonClick(50)}>Do 50</Button>
                    <Button variant={selectedPrice === 75 ? "primary" : "outline-primary"} onClick={() => handlePriceButtonClick(75)}>Do 75</Button>
                    <Button variant={selectedPrice === 100 ? "primary" : "outline-primary"} onClick={() => handlePriceButtonClick(100)}>Do 100</Button>
                    <Button variant={selectedPrice === 125 ? "primary" : "outline-primary"} onClick={() => handlePriceButtonClick(125)}>Do 125</Button>
                </ul>

                {/* sort by price */}
                <h2 className="text-center">Sortuj</h2>
                <ul className="list-group">
                    <Button variant={sorted ? "primary" : "outline-primary"} onClick={() => setSorted(!sorted)}><ArrowRight /></Button>
                </ul>
            </div>

            <div className="col-md-8">
                <div className="row">
                    <h2 className="text-center">Nauczyciele</h2>
                    <br />
                    {teachers && teachers
                        .filter(teacher => !selectedSubject || teacher.subject === selectedSubject)
                        .filter(teacher => !selectedPrice || teacher.price <= selectedPrice)
                        .sort((a, b) => sorted ? a.price - b.price : b.price - a.price)
                        .map((teacher, index) => (
                            <div key={index} className="col-6 mb-2">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{teacher.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Subject:</strong> {teacher.subject}
                                            <br />
                                            <strong>Price:</strong> {teacher.price}
                                            <br />
                                            <Button variant="outline-success">Zapisz się</Button>
                                            <Button variant="outline-info">Więcej</Button>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Teachers;
