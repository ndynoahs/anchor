// ============================================================
// Anchor — EmptyState Component
// ============================================================

import React from 'react';
import { View, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = '📭',
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-8 py-12"
      accessibilityRole="text"
      accessibilityLabel={`Empty state: ${title}`}
      style={{ minHeight: 200 } as StyleProp<ViewStyle>}
    >
      <Text className="text-5xl mb-4" accessibilityRole="image">
        {icon}
      </Text>

      <Text className="text-white text-lg font-semibold text-center mb-2">
        {title}
      </Text>

      {message && (
        <Text className="text-deep-300 text-sm text-center leading-5 mb-6">
          {message}
        </Text>
      )}

      {action && <View>{action}</View>}
    </View>
  );
}