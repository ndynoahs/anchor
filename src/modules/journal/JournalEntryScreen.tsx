import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, LoadingSpinner, ErrorState } from '../../components/ui';
import { getJournalEntry } from '../../services/journal';

export default function JournalEntryScreen() {
  const route: any = useRoute();
  const { entryId } = route.params as { entryId: string };

  const { data: entry, isLoading, isError, refetch } = useQuery({
    queryKey: ['journal-entry', entryId],
    queryFn: () => getJournalEntry(entryId),
  });

  if (isLoading) return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner fullScreen message="Loading entry..." /></SafeAreaView>;
  if (isError || !entry) return <SafeAreaView className="flex-1 bg-deep-900"><ErrorState title="Couldn't load entry" onRetry={() => refetch()} /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-3xl mb-2">{entry.mood ? ['', '😞', '😐', '🙂', '😊', '🤗'][entry.mood] : '📝'}</Text>
        <Text className="text-white text-xl font-bold mb-1">{entry.title || 'Journal Entry'}</Text>
        <Text className="text-deep-400 text-sm mb-4">{new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        <Text className="text-deep-200 text-base leading-7">{entry.content}</Text>
        {entry.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-4">
            {entry.tags.map((tag) => <Badge key={tag} label={tag} variant="info" size="sm" className="mr-1 mb-1" />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}