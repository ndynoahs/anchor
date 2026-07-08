import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Card, LoadingSpinner, ErrorState } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { getJournalEntries } from '../../services/journal';

export default function JournalInsightsScreen() {
  const streakDays = useAuthStore((s) => s.user?.streakDays) || 0;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['journal', 1],
    queryFn: () => getJournalEntries({ page: 1 }),
  });

  if (isLoading) return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner message="Loading insights..." /></SafeAreaView>;

  const entries = data?.items || [];
  const totalEntries = data?.total || 0;

  // Count mood distribution
  const moodCounts: Record<number, number> = {};
  entries.forEach((e) => { if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Tag frequency
  const tagCounts: Record<string, number> = {};
  entries.forEach((e) => e.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-white text-xl font-bold mb-4">Insights</Text>

        {/* Streak */}
        <Card className="mb-4"><View className="items-center py-3"><Text className="text-3xl mb-2">🔥</Text><Text className="text-white text-2xl font-bold">{streakDays}</Text><Text className="text-deep-300 text-sm">day streak</Text></View></Card>

        {/* Total entries */}
        <Card className="mb-4"><View className="items-center py-3"><Text className="text-3xl mb-2">📓</Text><Text className="text-white text-2xl font-bold">{totalEntries}</Text><Text className="text-deep-300 text-sm">total entries</Text></View></Card>

        {/* Dominant mood */}
        {dominantMood && (
          <Card className="mb-4">
            <View className="items-center py-3">
              <Text className="text-deep-300 text-sm mb-1">Most common mood</Text>
              <Text className="text-3xl mb-1">{['', '😞', '😐', '🙂', '😊', '🤗'][Number(dominantMood[0])]}</Text>
              <Text className="text-white font-semibold">{dominantMood[1]} entries</Text>
            </View>
          </Card>
        )}

        {/* Top tags */}
        {topTags.length > 0 && (
          <Card>
            <Text className="text-white font-semibold mb-3">Common tags</Text>
            {topTags.map(([tag, count]) => (
              <View key={tag} className="flex-row items-center justify-between py-2 border-b border-deep-700 last:border-0">
                <Text className="text-deep-200 text-sm">{tag}</Text>
                <Text className="text-teal-400 text-sm font-medium">{count}x</Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}