import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Card, Badge, LoadingSpinner, EmptyState, ErrorState } from '../../components/ui';
import { getJournalEntries } from '../../services/journal';
import { formatRelativeTime } from '../../utils';

export default function JournalListScreen() {
  const navigation: any = useNavigation();
  const [page, setPage] = useState(1);
  const [filterMood, setFilterMood] = useState<number | undefined>();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['journal', page, filterMood],
    queryFn: () => getJournalEntries({ page, mood: filterMood }),
  });

  const entries = data?.items || [];
  const moods = [{ label: 'All', value: undefined }, { label: '😞', value: 1 }, { label: '😐', value: 2 }, { label: '🙂', value: 3 }, { label: '😊', value: 4 }, { label: '🤗', value: 5 }];

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Journal</Text>
        <TouchableOpacity onPress={() => navigation.navigate('JournalEdit', {})} className="bg-teal-500 px-4 py-2 rounded-lg"><Text className="text-white font-semibold">+ New</Text></TouchableOpacity>
      </View>

      {/* Mood filter */}
      <View className="flex-row px-4 py-2 space-x-2">
        {moods.map((m) => (
          <TouchableOpacity key={String(m.value)} onPress={() => setFilterMood(m.value)} className={`px-3 py-1 rounded-full ${filterMood === m.value ? 'bg-teal-500' : 'bg-deep-700'}`}>
            <Text className={`text-sm ${filterMood === m.value ? 'text-white' : 'text-deep-200'}`}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? <LoadingSpinner message="Loading entries..." /> :
       isError ? <ErrorState title="Couldn't load journal" onRetry={() => refetch()} /> :
       entries.length === 0 ? <EmptyState icon="📓" title="No entries yet" message="Start writing about your day" /> : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.entryId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => { setPage(1); refetch(); }} tintColor="#5eead4" />}
          renderItem={({ item }) => (
            <TouchableOpacity className="mb-3" onPress={() => navigation.navigate('JournalEntry', { entryId: item.entryId })}>
              <Card>
                <View className="flex-row items-center mb-2">
                  <Text className="text-lg mr-2">{item.mood ? ['', '😞', '😐', '🙂', '😊', '🤗'][item.mood] : '📝'}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{item.title || 'Journal Entry'}</Text>
                    <Text className="text-deep-400 text-xs">{formatRelativeTime(item.createdAt)}</Text>
                  </View>
                </View>
                <Text className="text-deep-200 text-sm" numberOfLines={3}>{item.content}</Text>
                {item.tags.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {item.tags.map((tag) => <Badge key={tag} label={tag} variant="default" size="sm" className="mr-1 mb-1" />)}
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          )}
          onEndReached={() => { if (data?.hasMore) setPage(p => p + 1); }}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}