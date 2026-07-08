import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Avatar, Badge, LoadingSpinner, EmptyState, ErrorState } from '../../components/ui';
import { getFriendRequests, acceptFriendRequest, declineFriendRequest } from '../../services/friends';

export default function FriendRequestsScreen() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['friend-requests'],
    queryFn: () => getFriendRequests(),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => acceptFriendRequest(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['friend-requests'] }); queryClient.invalidateQueries({ queryKey: ['friends'] }); },
  });
  const declineMutation = useMutation({
    mutationFn: (id: string) => declineFriendRequest(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['friend-requests'] }); },
  });

  if (isLoading) return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner message="Loading requests..." /></SafeAreaView>;

  const incoming = data?.incoming || [];
  const outgoing = data?.outgoing || [];

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 border-b border-deep-700"><Text className="text-white text-xl font-bold">Friend Requests</Text></View>

      {isError ? <ErrorState title="Couldn't load requests" onRetry={() => refetch()} /> :
       incoming.length === 0 && outgoing.length === 0 ? <EmptyState icon="📨" title="No pending requests" message="When someone sends you a request, it'll appear here" /> : (
        <FlatList
          data={[...incoming.map((r) => ({ ...r, type: 'incoming' as const })), ...outgoing.map((r) => ({ ...r, type: 'outgoing' as const }))]}
          keyExtractor={(item, i) => `${item.type}-${i}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center">
                <Avatar username={item.friendUsername || item.userId} size="md" />
                <View className="flex-1 ml-3">
                  <Text className="text-white font-semibold">{item.friendUsername || 'User'}</Text>
                  <Badge label={item.type === 'incoming' ? 'Incoming' : 'Sent'} variant={item.type === 'incoming' ? 'info' : 'warning'} size="sm" />
                </View>
                {item.type === 'incoming' && (
                  <View className="flex-row">
                    <TouchableOpacity onPress={() => acceptMutation.mutate(item.friendshipId || item.friendshipId)} className="bg-teal-500 px-4 py-2 rounded-lg mr-2">
                      <Text className="text-white font-semibold text-sm">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => declineMutation.mutate(item.friendshipId || item.friendshipId)} className="bg-deep-700 px-4 py-2 rounded-lg">
                      <Text className="text-deep-200 text-sm">Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {item.type === 'outgoing' && <Text className="text-deep-400 text-sm">Pending</Text>}
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}