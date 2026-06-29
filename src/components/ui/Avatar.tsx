// ============================================================
// Anchor — Avatar Component
// ============================================================

import React from 'react';
import { View, Text } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  username: string;
  size?: AvatarSize;
  online?: boolean;
}

const sizeMap: Record<AvatarSize, { container: number; text: string }> = {
  sm: { container: 32, text: 'text-xs' },
  md: { container: 44, text: 'text-base' },
  lg: { container: 64, text: 'text-2xl' },
};

/**
 * Generate a deterministic background color from a username
 */
function getColorFromUsername(username: string): string {
  const colors = [
    '#1d9d8e', // teal
    '#368a8a', // anchor
    '#3f6488', // deep blue
    '#d78644', // warm
    '#63d3c4', // light teal
    '#5a7fa2', // steel blue
    '#35b9a8', // bright teal
    '#a65b30', // warm brown
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get initials from username (max 2 chars)
 */
function getInitials(username: string): string {
  const clean = username.replace(/[^a-zA-Z0-9]/g, '');
  if (clean.length === 0) return '?';
  // First letter of the first word and last word
  const parts = clean.match(/[A-Z]?[a-z0-9]+/g) || [clean];
  if (parts.length === 1) {
    return clean.slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ username, size = 'md', online = false }: AvatarProps) {
  const dims = sizeMap[size];
  const bgColor = getColorFromUsername(username);

  return (
    <View className="relative" accessibilityRole="image" accessibilityLabel={`Avatar for ${username}`}>
      <View
        style={{
          width: dims.container,
          height: dims.container,
          borderRadius: dims.container / 2,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          className={`${dims.text} font-bold text-white`}
          style={{ letterSpacing: 0.5 }}
        >
          {getInitials(username)}
        </Text>
      </View>

      {online && (
        <View
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-deep-800"
          accessibilityLabel="Online"
        />
      )}
    </View>
  );
}