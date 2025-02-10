// RenderStars.jsx
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RenderStars = ({ rating }) => {
  const maxStars = 5;
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= maxStars; i++) {
    if (i <= fullStars) {
      // Pełna gwiazdka
      stars.push(<Ionicons key={i} name="star" size={18} color="#000000" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      // Połówkowa gwiazdka
      stars.push(<Ionicons key={i} name="star-half" size={18} color="#000000" />);
    } else {
      // Pusta gwiazdka
      stars.push(<Ionicons key={i} name="star-outline" size={18} color="#000000" />);
    }
  }

  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

export default RenderStars;
