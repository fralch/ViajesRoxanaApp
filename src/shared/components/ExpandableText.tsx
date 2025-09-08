import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  inlineAction?: React.ReactNode;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 60, inlineAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const Row = ({ content }: { content: string }) => (
    <View style={styles.rowWrap}>
      <Text style={styles.text}>{content}</Text>
      {inlineAction ? <View style={styles.inlineActionWrap}>{inlineAction}</View> : null}
    </View>
  );

  if (text.length <= maxLength) {
    return <Row content={text} />;
  }

  const short = `${text.substring(0, maxLength)}...`;

  return (
    <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
      <View>
        <Row content={isExpanded ? text : short} />
        <Text style={styles.seeMore}>{isExpanded ? ' ver menos' : ' ver más'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
  },
  inlineActionWrap: {
    marginBottom: 4,
  },
  seeMore: {
    color: '#d62d28',
    fontWeight: 'bold',
  },
});

export default ExpandableText;
