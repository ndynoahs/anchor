// ============================================================
// Anchor — Card Component
// ============================================================

import React from 'react';
import { View, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  highlighted?: boolean;
}

export default function Card({
  children,
  padded = true,
  highlighted = false,
  className = '',
  style,
  ...props
}: CardProps) {
  return (
    <View
      className={`
        bg-deep-800 rounded-2xl
        ${highlighted ? 'border-2 border-teal-500/30' : ''}
        ${padded ? 'p-4' : ''}
        ${className}
      `}
      style={[
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
        } as ViewStyle,
        style as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}