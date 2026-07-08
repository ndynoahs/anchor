// ============================================================
// Anchor — Profile API Service
// ============================================================

import apiClient from './api';

export interface UserProfile {
  userId: string;
  anonymousUsername: string;
  avatarUrl: string | null;
  bio: string | null;
  soberSince: string | null;
  streakDays: number;
  isPremium: boolean;
  joinedAt: string;
}

export interface UpdateProfileData {
  bio?: string;
  timezone?: string;
  fcmToken?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await apiClient.get<{ success: boolean; data: UserProfile }>(`/users/${userId}`);
  return res.data.data;
}

export async function updateUserProfile(data: UpdateProfileData): Promise<UserProfile> {
  const res = await apiClient.put<{ success: boolean; data: UserProfile }>('/users/me', data);
  return res.data.data;
}

export async function updatePreferences(data: {
  notifyOnMessage?: boolean;
  notifyOnFriendRequest?: boolean;
  notifyOnEmergencyAvailable?: boolean;
  notifyOnMilestone?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}): Promise<void> {
  await apiClient.put('/users/me/preferences', data);
}