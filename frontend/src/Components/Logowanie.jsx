import React, { useState, } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';


function Logowanie() {
    const [error, setError] = useState('');
    const token = sessionStorage.getItem("jwtToken");

    if (token) {
        return <Navigate to="/" />
    }
    const handleLogin = async (e) => {
        e.preventDefault();

        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        try {
            const address = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${address}/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Dodaj nagłówek Authorization z tokenem JWT
                }
            });
            if (response.status === 200) {
                console.log(response)
                setError("Zalogowano poprawnie")
                sessionStorage.setItem("jwtToken", response.data.token);
                location.reload();
            }
            else {
                setError("Błąd serwera")
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Niepoprawne dane logowania');
            } else {
                setError('Błąd serwera');
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-header">
                            <h3 className="text-center">Logowanie</h3>
                        </div>
                        <div className="card-body">
                            {error}
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeholder='example@example.com'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Hasło:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder='******'
                                        required
                                    />
                                </div>
                                <br />
                                <button type="submit" className="btn btn-primary btn-block">Zaloguj się</button>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <p>Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logowanie;
