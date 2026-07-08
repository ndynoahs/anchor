// ============================================================
// Anchor — Bottom Tab Navigator
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import HomeScreen from '../modules/community/HomeScreen';
import CommunityScreen from '../modules/community/CommunityScreen';
import EmergencyScreen from '../modules/emergency/EmergencyScreen';
import JournalListScreen from '../modules/journal/JournalListScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

// TabBar icon component
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Community: '💬',
    Emergency: '🆘',
    Journal: '📓',
    Profile: '👤',
  };

  return (
    <View className="items-center" accessibilityLabel={label}>
      <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>
        {icons[label] || '•'}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#5eead4',
        tabBarInactiveTintColor: '#6b8aa8',
        tabBarStyle: {
          backgroundColor: '#1d2f43',
          borderTopColor: '#2f4f6e',
          borderTopWidth: 1,
          paddingTop: 4,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#1d2f43',
        },
        headerTintColor: '#f0f4f8',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: 'Community', headerShown: false }}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ title: 'Help', headerShown: false }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalListScreen}
        options={{ title: 'Journal', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
}