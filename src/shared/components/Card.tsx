import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  elevation?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 16,
  margin = 0,
  elevation = 2,
  borderRadius = 8,
  backgroundColor = '#fff'
}) => {
  const cardStyle = [
    styles.card,
    {
      padding,
      margin,
      borderRadius,
      backgroundColor,
      elevation,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    }
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card styles are applied dynamically
  },
});

export default Card;