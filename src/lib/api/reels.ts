import apiClient from '../api';
import type { ApiResponse } from '../api';

// Type definitions
export interface ReelMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  machineModel: string;
  tooling: string;
  processStep: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  customerScope: string;
  currentVersion: number;
  permissions: ReelPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface ReelVersion {
  id: string;
  videoId: string;
  versionNumber: number;
  changeLog: string;
  createdAt: string;
  modifiedBy: string;
  metadata: Partial<ReelMetadata>;
}

export interface ReelPermissions {
  visibility: 'tenant' | 'public' | 'internal';
  accessLevel: 'view' | 'edit' | 'admin';
  userRoles: string[];
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number;
}

export interface Transcript {
  id: string;
  videoId: string;
  segments: TranscriptSegment[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReprocessStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

// API Functions
export const reelApi = {
  // Get reel by ID
  getReel: async (id: string): Promise<ReelMetadata> => {
    const response = await apiClient.get<ApiResponse<ReelMetadata>>(`/reels/${id}`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch reel');
    }
    return response.data.data;
  },

  // Update reel metadata
  updateMetadata: async (id: string, metadata: Partial<ReelMetadata>): Promise<ReelMetadata> => {
    const response = await apiClient.put<ApiResponse<ReelMetadata>>(`/reels/${id}/metadata`, metadata);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update metadata');
    }
    return response.data.data;
  },

  // Get version history
  getVersions: async (id: string): Promise<ReelVersion[]> => {
    const response = await apiClient.get<ApiResponse<ReelVersion[]>>(`/reels/${id}/versions`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch versions');
    }
    return response.data.data;
  },

  // Rollback to version
  rollbackVersion: async (id: string, versionId: string): Promise<ReelMetadata> => {
    const response = await apiClient.post<ApiResponse<ReelMetadata>>(`/reels/${id}/versions/${versionId}/rollback`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to rollback version');
    }
    return response.data.data;
  },

  // Get transcript
  getTranscript: async (id: string): Promise<Transcript> => {
    const response = await apiClient.get<ApiResponse<Transcript>>(`/reels/${id}/transcript`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch transcript');
    }
    return response.data.data;
  },

  // Update transcript
  updateTranscript: async (id: string, transcript: Transcript): Promise<Transcript> => {
    const response = await apiClient.put<ApiResponse<Transcript>>(`/reels/${id}/transcript`, transcript);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update transcript');
    }
    return response.data.data;
  },

  // Start reprocessing
  startReprocess: async (id: string): Promise<ReprocessStatus> => {
    const response = await apiClient.post<ApiResponse<ReprocessStatus>>(`/reels/${id}/reprocess`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to start reprocessing');
    }
    return response.data.data;
  },

  // Get reprocess status
  getReprocessStatus: async (id: string, jobId: string): Promise<ReprocessStatus> => {
    const response = await apiClient.get<ApiResponse<ReprocessStatus>>(`/reels/${id}/reprocess/${jobId}`);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch reprocess status');
    }
    return response.data.data;
  },

  // Cancel reprocessing
  cancelReprocess: async (id: string, jobId: string): Promise<void> => {
    await apiClient.delete(`/reels/${id}/reprocess/${jobId}`);
  },

  // Update permissions
  updatePermissions: async (id: string, permissions: ReelPermissions): Promise<ReelMetadata> => {
    const response = await apiClient.put<ApiResponse<ReelMetadata>>(`/reels/${id}/permissions`, permissions);
    if (response.data.error || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update permissions');
    }
    return response.data.data;
  },
};
