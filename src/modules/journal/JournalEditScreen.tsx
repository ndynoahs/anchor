import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui';
import { createJournalEntry, updateJournalEntry } from '../../services/journal';

const MOODS = [
  { emoji: '😞', value: 1, label: 'Low' },
  { emoji: '😐', value: 2, label: 'Neutral' },
  { emoji: '🙂', value: 3, label: 'Good' },
  { emoji: '😊', value: 4, label: 'Great' },
  { emoji: '🤗', value: 5, label: 'Amazing' },
];
const PRESET_TAGS = ['gratitude', 'struggle', 'milestone', 'reflection', 'goal'];

export default function JournalEditScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const existing = route.params?.entry;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [mood, setMood] = useState<number>(existing?.mood || 3);
  const [tags, setTags] = useState<string[]>(existing?.tags || []);

  const mutation = useMutation({
    mutationFn: () => isEdit
      ? updateJournalEntry(existing.entryId, { title, content, mood, tags })
      : createJournalEntry({ title, content, mood, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      navigation.goBack();
    },
  });

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-deep-700">
        <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-deep-300 text-base">Cancel</Text></TouchableOpacity>
        <Text className="text-white font-semibold text-base">{isEdit ? 'Edit Entry' : 'New Entry'}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Mood selector */}
        <Text className="text-deep-200 text-sm font-medium mb-2">How are you feeling?</Text>
        <View className="flex-row justify-between mb-6">
          {MOODS.map((m) => (
            <TouchableOpacity key={m.value} onPress={() => setMood(m.value)} className={`items-center p-3 rounded-xl ${mood === m.value ? 'bg-teal-500/20 border-2 border-teal-500' : 'bg-deep-800 border-2 border-deep-700'}`}>
              <Text className="text-2xl">{m.emoji}</Text>
              <Text className={`text-xs mt-1 ${mood === m.value ? 'text-teal-300' : 'text-deep-400'}`}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          className="bg-deep-800 text-white text-lg font-semibold rounded-xl px-4 py-3 mb-3 border border-deep-600"
          placeholder="Title (optional)"
          placeholderTextColor="#6b8aa8"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="bg-deep-800 text-white text-base rounded-xl px-4 py-3 mb-4 border border-deep-600 min-h-[150px]"
          placeholder="What's on your mind?"
          placeholderTextColor="#6b8aa8"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Tags */}
        <Text className="text-deep-200 text-sm font-medium mb-2">Tags</Text>
        <View className="flex-row flex-wrap mb-6">
          {PRESET_TAGS.map((tag) => (
            <TouchableOpacity key={tag} onPress={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${tags.includes(tag) ? 'bg-teal-500' : 'bg-deep-700'}`}>
              <Text className={`text-sm ${tags.includes(tag) ? 'text-white' : 'text-deep-200'}`}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mutation.isError && (
          <View className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-500/30">
            <Text className="text-red-300 text-sm text-center">{(mutation.error as any)?.message || 'Failed to save. Please try again.'}</Text>
          </View>
        )}

        <Button title={isEdit ? 'Update Entry' : 'Save Entry'} variant="primary" size="lg" className="w-full mb-8" loading={mutation.isPending} onPress={() => mutation.mutate()} />
      </ScrollView>
    </SafeAreaView>
  );
}