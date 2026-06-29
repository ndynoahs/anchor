// ============================================================
// Anchor — Root Navigator
// ============================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import TabNavigator from './TabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Placeholder auth screen
function AuthScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Auth Screen</Text>
    </View>
  );
}

// Placeholder onboarding screen
function OnboardingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Onboarding</Text>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f1e2e' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}