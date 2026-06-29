// ============================================================
// Anchor — Button Component
// ============================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-teal-500 active:bg-teal-600',
    text: 'text-white font-semibold',
  },
  secondary: {
    container: 'bg-deep-700 active:bg-deep-800',
    text: 'text-teal-200 font-semibold',
  },
  outline: {
    container: 'border-2 border-teal-500 bg-transparent active:bg-teal-500/10',
    text: 'text-teal-400 font-semibold',
  },
  ghost: {
    container: 'bg-transparent active:bg-deep-700/50',
    text: 'text-teal-300 font-medium',
  },
  danger: {
    container: 'bg-red-600 active:bg-red-700',
    text: 'text-white font-semibold',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string; icon: string }> = {
  sm: {
    container: 'px-3 py-1.5 rounded-lg',
    text: 'text-sm',
    icon: 'mr-1.5',
  },
  md: {
    container: 'px-5 py-3 rounded-xl',
    text: 'text-base',
    icon: 'mr-2',
  },
  lg: {
    container: 'px-7 py-4 rounded-xl',
    text: 'text-lg',
    icon: 'mr-2.5',
  },
};

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      className={`
        flex-row items-center justify-center
        ${variantStyle.container}
        ${sizeStyle.container}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      style={style as StyleProp<ViewStyle>}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#5eead4' : '#ffffff'}
          className="mr-2"
        />
      ) : icon ? (
        <>{icon}</>
      ) : null}
      <Text
        className={`
          ${variantStyle.text}
          ${sizeStyle.text}
          ${icon || loading ? 'ml-2' : ''}
        `}
        style={{ letterSpacing: 0.3 } as TextStyle}
      >
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}