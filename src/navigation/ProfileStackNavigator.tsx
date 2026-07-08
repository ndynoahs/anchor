// ============================================================
// Anchor — Profile Stack Navigator (sub-screens for Profile tab)
// ============================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../modules/profile/ProfileScreen';
import EditProfileScreen from '../modules/profile/EditProfileScreen';
import SettingsScreen from '../modules/profile/SettingsScreen';
import PremiumScreen from '../modules/profile/PremiumScreen';
import JournalInsightsScreen from '../modules/journal/JournalInsightsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f1e2e' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="JournalInsights" component={JournalInsightsScreen} />
    </Stack.Navigator>
  );
}