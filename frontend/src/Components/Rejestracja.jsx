import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Rejestracja() {
  const [message, setMessage] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

    // Sprawdź, czy hasła są takie same
    if (password !== confirmPassword) {
      setMessage('Hasła nie są takie same');
      return;
    }

    try {
      const address = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${address}/register`, { email, username, password, confirmPassword });
      if (response.status === 200) {
        setMessage('Rejestracja zakończona sukcesem');
        location.href = '/logowanie';
      } else {
        setMessage('Błąd serwera');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('Użytkownik o podanym adresie email już istnieje');
      } else {
        setMessage('Błąd serwera');
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header">
              <h3 className="text-center">Rejestracja</h3>
            </div>
            <div className="card-body">
              {message}
              <form onSubmit={handleRegistration}>
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
                  <label htmlFor="username">Nazwa użytkownika:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder='example'
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
                <div className="form-group">
                  <label htmlFor="confirmPassword">Potwierdź hasło:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder='******'
                    required
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-primary btn-block">Zarejestruj się</button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p>Masz już konto? zaloguj się <Link to="/logowanie">Zaloguj się</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rejestracja;
