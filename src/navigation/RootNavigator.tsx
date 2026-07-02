// ============================================================
// Anchor — Root Navigator
// ============================================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { LoadingSpinner } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { isAuthenticated as checkAuth } from '../services/auth';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);
  const setUser = useAuthStore((state) => state.setUser);

  // Check auth state on mount
  useEffect(() => {
    async function init() {
      await initialize();
      const hasToken = await checkAuth();
      if (hasToken) {
        // Try to fetch the current user profile
        try {
          const { getCurrentUser } = await import('../services/auth');
          const user = await getCurrentUser();
          setUser(user);
        } catch {
          // Token is invalid — clear auth state
          useAuthStore.getState().logout();
        }
      }
    }
    init();
  }, []);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-deep-900 items-center justify-center">
        <Text className="text-3xl text-teal-400 font-bold mb-4">⚓</Text>
        <LoadingSpinner message="Loading..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}