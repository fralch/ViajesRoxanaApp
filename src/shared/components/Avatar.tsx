import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface AvatarProps {
  source?: { uri: string } | number;
  size: number;
  name?: string; // For fallback initials
  backgroundColor?: string;
  textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  size,
  name,
  backgroundColor = '#e3f2fd',
  textColor = '#2196F3'
}) => {
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (
      names[0].charAt(0).toUpperCase() + 
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const containerStyle = [
    styles.container,
    avatarStyle,
    { backgroundColor }
  ];

  const textStyle = [
    styles.text,
    {
      color: textColor,
      fontSize: size * 0.4,
    }
  ];

  if (source) {
    return (
      <Image
        source={source}
        style={[avatarStyle, styles.image]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Image styles are applied dynamically
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;