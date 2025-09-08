import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 60 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (text.length <= maxLength) {
    return <Text style={styles.text}>{text}</Text>;
  }

  return (
    <TouchableOpacity onPress={toggleExpanded}>
      <Text style={styles.text}>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
        <Text style={styles.seeMore}>{isExpanded ? ' ver menos' : ' ver más'}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  seeMore: {
    color: '#d62d28',
    fontWeight: 'bold',
  },
});

export default ExpandableText;
