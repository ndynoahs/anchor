import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/ui';

export default function SettingsScreen() {
  const navigation: any = useNavigation();

  const [notifyOnMessage, setNotifyOnMessage] = useState(true);
  const [notifyOnFriendRequest, setNotifyOnFriendRequest] = useState(true);
  const [notifyOnEmergencyAvailable, setNotifyOnEmergencyAvailable] = useState(true);
  const [notifyOnMilestone, setNotifyOnMilestone] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Settings</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Notification Preferences */}
        <Text className="text-deep-300 text-sm font-medium uppercase tracking-wider mb-3">Notifications</Text>
        <Card className="mb-6">
          <SettingRow label="New Messages" value={notifyOnMessage} onValueChange={setNotifyOnMessage} />
          <SettingRow label="Friend Requests" value={notifyOnFriendRequest} onValueChange={setNotifyOnFriendRequest} />
          <SettingRow label="Emergency Available" value={notifyOnEmergencyAvailable} onValueChange={setNotifyOnEmergencyAvailable} />
          <SettingRow label="Milestone Reminders" value={notifyOnMilestone} onValueChange={setNotifyOnMilestone} last />
        </Card>

        {/* Quiet Hours */}
        <Text className="text-deep-300 text-sm font-medium uppercase tracking-wider mb-3">Quiet Hours</Text>
        <Card className="mb-6">
          <SettingRow label="Enable Quiet Hours" value={quietHours} onValueChange={setQuietHours} last />
        </Card>

        {/* Privacy */}
        <Text className="text-deep-300 text-sm font-medium uppercase tracking-wider mb-3">Privacy</Text>
        <Card className="mb-6">
          <TouchableOpacity className="py-4 flex-row items-center justify-between border-b border-deep-700">
            <Text className="text-white">Privacy Policy</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-4 flex-row items-center justify-between border-b border-deep-700">
            <Text className="text-white">Terms of Service</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-4 flex-row items-center justify-between">
            <Text className="text-white">Data & Storage</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Text className="text-deep-300 text-sm font-medium uppercase tracking-wider mb-3">About</Text>
        <Card className="mb-6">
          <View className="py-4 border-b border-deep-700"><Text className="text-white">Version</Text><Text className="text-deep-400 text-sm mt-1">1.0.0</Text></View>
          <View className="py-4"><Text className="text-white">Made with 💚 by the Anchor team</Text></View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onValueChange, last = false }: { label: string; value: boolean; onValueChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between py-3 ${!last ? 'border-b border-deep-700' : ''}`}>
      <Text className="text-white text-base">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#334155', true: '#1d9d8e' }} thumbColor={value ? '#5eead4' : '#94a3b8'} />
    </View>
  );
}