import React from 'react';
import { Star, StarFill, StarHalf } from 'react-bootstrap-icons';

const RenderStars = ({ rating }) => {
  const maxStars = 5; // Maksymalna liczba gwiazdek
  const stars = []; // Tablica gwiazdek
  const fullStars = Math.floor(rating); // Liczba pełnych gwiazdek
  const hasHalfStar = rating % 1 !== 0; // Sprawdzenie, czy jest połówkowa gwiazdka

  for (let i = 1; i <= maxStars; i++) {
    if (i <= fullStars) {
      // Pełna gwiazdka
      stars.push(<StarFill key={i} size={24} color="#000000" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      // Połówkowa gwiazdka
      stars.push(<StarHalf key={i}  size={24} color="#000000" />);
    } else {
      // Pusta gwiazdka
      stars.push(<Star key={i} size={24} color="#000000" />);
    }
  }

  return <div style={{ flexDirection: 'row' }}>{stars}</div>;
};

export default RenderStars;





