// ============================================================
// Anchor — Messaging API Service
// ============================================================

import apiClient from './api';

export interface Conversation {
  conversationId: string;
  participantIds: string[];
  participantUsernames: Record<string, string>;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isEmergencySession: boolean;
  createdAt: string;
}

export interface Message {
  messageId: string;
  senderId: string;
  content: string;
  messageType: string;
  createdAt: string;
  readAt: string | null;
}

export async function getConversations(page = 1): Promise<{ items: Conversation[]; total: number; hasMore: boolean }> {
  const res = await apiClient.get<{ success: boolean; data: { items: Conversation[]; total: number; hasMore: boolean } }>('/conversations', { params: { page, pageSize: 20 } });
  return res.data.data;
}

export async function createConversation(participantId: string): Promise<{ conversationId: string; isNew: boolean }> {
  const res = await apiClient.post<{ success: boolean; data: { conversationId: string; isNew: boolean } }>('/conversations', { participantId });
  return res.data.data;
}

export async function getMessages(conversationId: string, page = 1): Promise<{ items: Message[]; total: number; hasMore: boolean }> {
  const res = await apiClient.get<{ success: boolean; data: { items: Message[]; total: number; hasMore: boolean } }>(`/conversations/${conversationId}/messages`, { params: { page, pageSize: 50 } });
  return res.data.data;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const res = await apiClient.post<{ success: boolean; data: Message }>(`/conversations/${conversationId}/messages`, { content });
  return res.data.data;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await apiClient.post(`/conversations/${conversationId}/read`);
}