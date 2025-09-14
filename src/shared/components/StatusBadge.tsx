import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
  size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  size = 'medium'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#e74c3c';
      case 'error':
        return '#f44336';
      case 'info':
        return '#d62d28';
      default:
        return '#757575';
    }
  };

  const badgeStyle = [
    styles.badge,
    styles[size],
    { backgroundColor: getStatusColor() }
  ];

  const textStyle = [
    styles.text,
    styles[`${size}Text`]
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});

export default StatusBadge;