import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#d62d28',
  backgroundColor = '#e0e0e0',
  height = 8,
  showPercentage = false
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const progressWidth = `${clampedProgress}%`;

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.track,
          { backgroundColor, height }
        ]}
      >
        <View 
          style={[
            styles.fill,
            { 
              backgroundColor: color, 
              width: progressWidth,
              height 
            }
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  percentage: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 32,
    textAlign: 'right',
  },
});

export default ProgressBar;