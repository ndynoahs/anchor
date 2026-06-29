// ============================================================
// Anchor — Badge Component
// ============================================================

import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  default: { bg: 'bg-deep-700', text: 'text-deep-200', dot: 'bg-deep-400' },
  success: { bg: 'bg-green-900/50', text: 'text-green-300', dot: 'bg-green-400' },
  warning: { bg: 'bg-yellow-900/50', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  error: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  info: { bg: 'bg-teal-900/50', text: 'text-teal-300', dot: 'bg-teal-400' },
};

export default function Badge({
  label,
  variant = 'default',
  size = 'sm',
  dot = false,
}: BadgeProps) {
  const styles = variantStyles[variant];
  const isSmall = size === 'sm';

  return (
    <View
      className={`
        flex-row items-center self-start
        ${styles.bg}
        ${isSmall ? 'px-2 py-0.5 rounded-md' : 'px-3 py-1 rounded-lg'}
      `}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {dot && (
        <View
          className={`
            rounded-full mr-1.5
            ${styles.dot}
            ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'}
          `}
        />
      )}
      <Text
        className={`
          ${styles.text}
          ${isSmall ? 'text-xs' : 'text-sm'}
          font-medium
        `}
      >
        {label}
      </Text>
    </View>
  );
}