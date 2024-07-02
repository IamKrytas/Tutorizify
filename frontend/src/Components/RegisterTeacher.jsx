import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

function RegisterTeacher() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    price: '',
    bio: '',
    description: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const address = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${address}/subjects`);
        setSubjects(response.data.subjects);
      } catch (err) {
        setError('Failed to fetch subjects');
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja danych wejściowych
    if (formData.bio.length > 50) {
      setError('Bio must be 50 characters or less');
      return;
    }

    if (formData.description.length > 100) {
      setError('Description must be 100 characters or less');
      return;
    }

    if (formData.price < 0) {
      setError('Price must be greater than or equal to 0');
      return;
    }

    const token = sessionStorage.getItem('jwtToken');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('subject', formData.subject);
    data.append('price', formData.price);
    data.append('bio', formData.bio);
    data.append('description', formData.description);
    if (file) {
      data.append('profilePicture', file);
    }

    try {
      const address = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${address}/register_teacher`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setSuccess('Successfully registered as a teacher');
      }
    } catch (err) {
      setError('Failed to register');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <Container className="my-5">
      <h1>Register as a Teacher</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            as="select"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>{subject.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price per hour</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="profilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <div {...getRootProps({ className: 'dropzone' })} className="border p-4">
            <input {...getInputProps()} />
            {file ? <p>{file.name}</p> : <p>Click here or drag a file to upload</p>}
          </div>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterTeacher;
