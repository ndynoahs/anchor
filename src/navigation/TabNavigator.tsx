// ============================================================
// Anchor — Bottom Tab Navigator
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder screens until feature modules are built
function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Home</Text>
      <Text className="text-deep-300 text-sm mt-2">Your recovery journey</Text>
    </View>
  );
}

function CommunityScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Community</Text>
      <Text className="text-deep-300 text-sm mt-2">Connect with peers</Text>
    </View>
  );
}

function EmergencyScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Emergency</Text>
      <Text className="text-deep-300 text-sm mt-2">Reach someone now</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-deep-900">
      <Text className="text-white text-lg">Profile</Text>
      <Text className="text-deep-300 text-sm mt-2">Your account</Text>
    </View>
  );
}

// Simple TabBar icon component
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Community: '💬',
    Emergency: '🆘',
    Profile: '👤',
  };

  return (
    <View className="items-center">
      <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>
        {icons[label] || '•'}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  const isEmergency = false; // Will be connected to emergency state later

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
        component={isEmergency ? EmergencyScreen : HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          title: 'Emergency',
          tabBarBadge: undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}