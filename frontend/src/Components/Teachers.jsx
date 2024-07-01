import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

function Teachers() {
    const [teachers, setTeachers] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [sortBy, setSortBy] = useState('price'); // 'price' or 'rating'
    const token = sessionStorage.getItem('jwtToken');

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const address = import.meta.env.VITE_BACKEND_URL;
        axios.get(`${address}/teachers`, { headers })
            .then(response => {
                console.log(response.data.teachers);
                setTeachers(response.data.teachers);
            })
            .catch(error => {
                console.error('Błąd pobierania danych o nauczycielach:', error);
            });
    }, []);

    const handleSubjectButtonClick = (subject) => {
        setSelectedSubject(subject === selectedSubject ? null : subject);
    };

    const handlePriceButtonClick = (price) => {
        setSelectedPrice(price === selectedPrice ? null : price);
    };

    const handleSortByButtonClick = (type) => {
        setSortBy(type);
    };

    const sortedTeachers = teachers && [...teachers]
        .filter(teacher => !selectedSubject || teacher.subject === selectedSubject)
        .filter(teacher => !selectedPrice || teacher.price <= selectedPrice)
        .sort((a, b) => {
            if (sortBy === 'price') {
                return a.price - b.price;
            } else if (sortBy === 'rating') {
                return b.rating - a.rating;
            }
            return 0; // default case
        });
        
    return (
        <div className="row margin-top">
            <div className="col-2 mx-auto">
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
                    <Button variant={sortBy === 'price' ? "primary" : "outline-primary"} onClick={() => handleSortByButtonClick('price')}>Cena</Button>
                    <Button variant={sortBy === 'rating' ? "primary" : "outline-primary"} onClick={() => handleSortByButtonClick('rating')}>Rating</Button>
                </ul>
            </div>

            <div className="col-md-9">
                <div className="row">
                    <h2 className="text-center">Nauczyciele</h2>
                    <br />
                    {sortedTeachers && sortedTeachers.map((teacher, index) => (
                        <div key={index} className="col-6 mb-2">
                            <Card>
                                <Card.Body>
                                    <Card.Title className="text-center">{teacher.name}
                                        <div className="text-center">
                                            {[...Array(5)].map((_, index) => (
                                                <span key={index}>
                                                    {index < teacher.rating ? <StarFill /> : <Star />}
                                                </span>
                                            ))}
                                        </div>
                                    </Card.Title>

                                    <Card.Text>
                                        <strong>Subject:</strong> {teacher.subject}
                                        <br />
                                        <strong>Price:</strong> {teacher.price}
                                        <br />
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div>
                                                <Link to={`/reservation?teacher=${teacher.id}`}>
                                                    <Button variant="outline-success">Zapisz się</Button>
                                                </Link>
                                                <Button variant="outline-info">Więcej</Button>
                                            </div>
                                            <div>
                                                <Star size={40} style={{ verticalAlign: 'bottom' }} />
                                            </div>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Teachers;