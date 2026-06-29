// ============================================================
// Anchor — LoadingSpinner Component
// ============================================================

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingSpinner({
  message,
  fullScreen = false,
  size = 'large',
  color = '#5eead4',
}: LoadingSpinnerProps) {
  const container = fullScreen
    ? 'flex-1 items-center justify-center bg-deep-900'
    : 'items-center justify-center py-8';

  return (
    <View
      className={container}
      accessibilityRole="progressbar"
      accessibilityLabel={message || 'Loading'}
      style={{ minHeight: fullScreen ? undefined : 120 } as StyleProp<ViewStyle>}
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-deep-300 text-sm mt-4 text-center">
          {message}
        </Text>
      )}
    </View>
  );
}