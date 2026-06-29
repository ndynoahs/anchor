// ============================================================
// Anchor — ErrorState Component
// ============================================================

import React from 'react';
import { View, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-8 py-12"
      accessibilityRole="alert"
      accessibilityLabel={title}
      style={{ minHeight: 200 } as StyleProp<ViewStyle>}
    >
      <Text className="text-5xl mb-4" accessibilityRole="image">
        ⚠️
      </Text>

      <Text className="text-white text-lg font-semibold text-center mb-2">
        {title}
      </Text>

      <Text className="text-deep-300 text-sm text-center leading-5 mb-6">
        {message}
      </Text>

      {onRetry && (
        <Button
          title={retryLabel}
          variant="outline"
          size="sm"
          onPress={onRetry}
        />
      )}
    </View>
  );
}