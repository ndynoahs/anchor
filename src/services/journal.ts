// ============================================================
// Anchor — Journal API Service
// ============================================================

import apiClient from './api';

export interface JournalEntry {
  entryId: string;
  title: string | null;
  content: string;
  mood: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getJournalEntries(params?: { page?: number; tag?: string; mood?: number }): Promise<{ items: JournalEntry[]; total: number; hasMore: boolean }> {
  const res = await apiClient.get<{ success: boolean; data: { items: JournalEntry[]; total: number; hasMore: boolean } }>('/journal', { params: { page: params?.page || 1, pageSize: 20, tag: params?.tag, mood: params?.mood } });
  return res.data.data;
}

export async function getJournalEntry(entryId: string): Promise<JournalEntry> {
  const res = await apiClient.get<{ success: boolean; data: JournalEntry }>(`/journal/${entryId}`);
  return res.data.data;
}

export async function createJournalEntry(data: { title?: string; content: string; mood?: number; tags?: string[] }): Promise<JournalEntry> {
  const res = await apiClient.post<{ success: boolean; data: JournalEntry }>('/journal', data);
  return res.data.data;
}

export async function updateJournalEntry(entryId: string, data: { title?: string; content?: string; mood?: number; tags?: string[] }): Promise<JournalEntry> {
  const res = await apiClient.put<{ success: boolean; data: JournalEntry }>(`/journal/${entryId}`, data);
  return res.data.data;
}