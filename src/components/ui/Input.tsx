// ============================================================
// Anchor — Input Component
// ============================================================

import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  style,
  editable = true,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? 'border-red-500'
    : isFocused
      ? 'border-teal-400'
      : 'border-deep-600';

  const bgColor = editable ? 'bg-deep-800' : 'bg-deep-800/50';

  return (
    <View className="mb-4" style={style as StyleProp<ViewStyle>}>
      {label && (
        <Text
          className="text-deep-200 text-sm font-medium mb-2"
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          ${bgColor}
          border-2 ${borderColor}
          rounded-xl px-4 py-3
          ${!editable ? 'opacity-60' : ''}
        `}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-white text-base"
          placeholderTextColor="#6b8aa8"
          editable={editable}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || props.placeholder || 'Input'}
          {...props}
        />

        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>

      {error && (
        <Text
          className="text-red-400 text-sm mt-1.5 ml-1"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text className="text-deep-300 text-sm mt-1.5 ml-1">{helperText}</Text>
      )}
    </View>
  );
}