// ============================================================
// Anchor — Emergency API Service
// ============================================================

import apiClient from './api';

export interface EmergencyRequestPayload {
  trigger?: string;
  priority?: 'normal' | 'high';
}

export interface EmergencyRequestResponse {
  sessionId: string;
  status: string;
  estimatedWaitSeconds: number;
  requestedAt: string;
}

export interface EmergencySessionResponse {
  sessionId: string;
  status: 'waiting' | 'active' | 'completed' | 'expired';
  responderId: string | null;
  responderUsername: string | null;
  conversationId: string | null;
  requestedAt: string;
  respondedAt: string | null;
  endedAt: string | null;
}

export interface EmergencyRespondResponse {
  sessionId: string;
  status: string;
  conversationId: string;
  requesterUsername: string;
}

/**
 * Request immediate peer support
 * POST /api/v1/emergency/request
 */
export async function requestEmergencySupport(
  data: EmergencyRequestPayload
): Promise<EmergencyRequestResponse> {
  const response = await apiClient.post<{ success: boolean; data: EmergencyRequestResponse }>(
    '/emergency/request',
    data
  );
  return response.data.data;
}

/**
 * Get emergency session status
 * GET /api/v1/emergency/session/:sessionId
 */
export async function getSessionStatus(
  sessionId: string
): Promise<EmergencySessionResponse> {
  const response = await apiClient.get<{ success: boolean; data: EmergencySessionResponse }>(
    `/emergency/session/${sessionId}`
  );
  return response.data.data;
}

/**
 * End an emergency session
 * POST /api/v1/emergency/session/:sessionId/end
 */
export async function endSession(
  sessionId: string
): Promise<{ durationSeconds: number }> {
  const response = await apiClient.post<{ success: boolean; data: { durationSeconds: number } }>(
    `/emergency/session/${sessionId}/end`
  );
  return response.data.data;
}