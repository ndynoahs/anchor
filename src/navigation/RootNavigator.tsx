// ============================================================
// Anchor — Root Navigator
// ============================================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ConversationsListScreen from '../modules/messaging/ConversationsListScreen';
import ChatScreen from '../modules/messaging/ChatScreen';
import JournalEntryScreen from '../modules/journal/JournalEntryScreen';
import JournalEditScreen from '../modules/journal/JournalEditScreen';
import FriendsListScreen from '../modules/friends/FriendsListScreen';
import AddFriendScreen from '../modules/friends/AddFriendScreen';
import FriendRequestsScreen from '../modules/friends/FriendRequestsScreen';
import { LoadingSpinner } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { isAuthenticated as checkAuth } from '../services/auth';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ConversationsList: undefined;
  Chat: { conversationId: string };
  JournalEntry: { entryId: string };
  JournalEdit: { entry?: any };
  FriendsList: undefined;
  AddFriend: undefined;
  FriendRequests: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function init() {
      await initialize();
      const hasToken = await checkAuth();
      if (hasToken) {
        try {
          const { getCurrentUser } = await import('../services/auth');
          const user = await getCurrentUser();
          setUser(user);
        } catch {
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
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f1e2e' },
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="ConversationsList" component={ConversationsListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
            <Stack.Screen name="JournalEdit" component={JournalEditScreen} />
            <Stack.Screen name="FriendsList" component={FriendsListScreen} />
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
            <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}