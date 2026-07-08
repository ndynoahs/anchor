import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Badge, LoadingSpinner, EmptyState, ErrorState } from '../../components/ui';
import { getConversations } from '../../services/messaging';
import { formatRelativeTime } from '../../utils';

export default function ConversationsListScreen() {
  const navigation: any = useNavigation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['conversations', page],
    queryFn: () => getConversations(page),
  });

  const conversations = data?.items || [];

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Messages</Text>
      </View>

      {isLoading ? <LoadingSpinner message="Loading conversations..." /> :
       isError ? <ErrorState title="Couldn't load messages" onRetry={() => refetch()} /> :
       conversations.length === 0 ? (
         <EmptyState icon="💬" title="No messages yet" message="Start a conversation with a friend or community member" />
       ) : (
         <FlatList
           data={conversations}
           keyExtractor={(item) => item.conversationId}
           showsVerticalScrollIndicator={false}
           refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => { setPage(1); refetch(); }} tintColor="#5eead4" />}
           renderItem={({ item }) => {
             const otherUsername = Object.values(item.participantUsernames).join(', ');
             return (
               <TouchableOpacity onPress={() => navigation.navigate('Chat', { conversationId: item.conversationId })}>
                 <Card className="mx-4 my-1">
                   <View className="flex-row items-center">
                     <Avatar username={otherUsername || 'U'} size="md" />
                     <View className="flex-1 ml-3">
                       <View className="flex-row items-center">
                         <Text className="text-white font-semibold flex-1" numberOfLines={1}>{otherUsername}</Text>
                         {item.lastMessageAt && <Text className="text-deep-400 text-xs">{formatRelativeTime(item.lastMessageAt)}</Text>}
                       </View>
                       <View className="flex-row items-center mt-0.5">
                         <Text className="text-deep-300 text-sm flex-1" numberOfLines={1}>{item.lastMessagePreview || 'No messages yet'}</Text>
                         {item.unreadCount > 0 && <Badge label={String(item.unreadCount)} variant="error" size="sm" />}
                       </View>
                     </View>
                   </View>
                   {item.isEmergencySession && <Text className="text-red-400 text-xs mt-2">🚨 Emergency session</Text>}
                 </Card>
               </TouchableOpacity>
             );
           }}
           onEndReached={() => { if (data?.hasMore) setPage(p => p + 1); }}
           onEndReachedThreshold={0.5}
         />
       )}
    </SafeAreaView>
  );
}