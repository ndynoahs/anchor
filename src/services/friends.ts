// ============================================================
// Anchor — Friends API Service
// ============================================================

import apiClient from './api';

export interface Friend {
  friendshipId: string;
  userId: string;
  friendId: string;
  friendUsername: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export async function getFriends(): Promise<Friend[]> {
  const res = await apiClient.get<{ success: boolean; data: Friend[] }>('/friends');
  return res.data.data;
}

export async function sendFriendRequest(username: string): Promise<Friend> {
  const res = await apiClient.post<{ success: boolean; data: Friend }>('/friends/request', { username });
  return res.data.data;
}

export async function acceptFriendRequest(friendshipId: string): Promise<Friend> {
  const res = await apiClient.put<{ success: boolean; data: Friend }>(`/friends/request/${friendshipId}/accept`);
  return res.data.data;
}

export async function declineFriendRequest(friendshipId: string): Promise<void> {
  await apiClient.delete(`/friends/request/${friendshipId}`);
}

export async function removeFriend(friendshipId: string): Promise<void> {
  await apiClient.delete(`/friends/${friendshipId}`);
}

export async function getFriendRequests(): Promise<{ incoming: Friend[]; outgoing: Friend[] }> {
  const res = await apiClient.get<{ success: boolean; data: { incoming: Friend[]; outgoing: Friend[] } }>('/friends/requests');
  return res.data.data;
}