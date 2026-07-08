import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Card, Avatar, EmptyState, ErrorState, LoadingSpinner } from '../../components/ui';
import { getFriends } from '../../services/friends';

export default function FriendsListScreen() {
  const navigation: any = useNavigation();

  const { data: friends, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends(),
  });

  if (isLoading) return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner message="Loading friends..." /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Friends</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => navigation.navigate('FriendRequests')} className="mr-4"><Text className="text-teal-400">Requests</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddFriend')} className="bg-teal-500 px-3 py-1.5 rounded-lg"><Text className="text-white font-semibold">+ Add</Text></TouchableOpacity>
        </View>
      </View>

      {isError ? <ErrorState title="Couldn't load friends" onRetry={() => refetch()} /> :
       !friends || friends.length === 0 ? <EmptyState icon="👥" title="No friends yet" message="Connect with peers on your recovery journey" /> : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.friendshipId || item.userId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#5eead4" />}
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center">
                <Avatar username={item.friendUsername || 'F'} size="md" />
                <View className="flex-1 ml-3">
                  <Text className="text-white font-semibold">{item.friendUsername || 'Friend'}</Text>
                  <Text className="text-deep-400 text-xs">{item.status === 'accepted' ? 'Connected' : 'Pending'}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Chat', { conversationId: item.friendshipId })}>
                  <Text className="text-teal-400 text-sm">Message</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}